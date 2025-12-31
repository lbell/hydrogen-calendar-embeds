<?php

/**
 * ICS Proxy REST API for Pretty Calendar Embeds
 *
 * Provides a REST API endpoint to fetch ICS feeds server-side,
 * avoiding CORS restrictions that prevent direct browser access.
 * FullCalendar's iCalendar plugin handles all the parsing.
 *
 * @package Pretty_Calendar_Embeds
 * @since   1.0.0
 */

if (! defined('ABSPATH')) {
  exit;
}

/**
 * Class HYCAL_ICS_Proxy
 *
 * Handles REST API endpoint for ICS feed proxying.
 */
class HYCAL_ICS_Proxy {

  /**
   * REST API namespace.
   *
   * @var string
   */
  const REST_NAMESPACE = 'hycal/v1';

  /**
   * Cache duration in seconds (15 minutes).
   *
   * @var int
   */
  const CACHE_DURATION = 900;

  /**
   * Maximum URL length allowed.
   *
   * @var int
   */
  const MAX_URL_LENGTH = 2048;

  /**
   * Maximum ICS response size in bytes (5MB).
   *
   * @var int
   */
  const MAX_ICS_SIZE = 5242880;

  /**
   * Blocked URL patterns for security (SSRF protection).
   * Prevents access to localhost, internal networks, and cloud metadata endpoints.
   *
   * Can be modified using the 'hycal_blocked_url_patterns' filter.
   *
   * @var array
   */
  private static $blocked_url_patterns = array(
    '#^https?://(localhost|127\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)#i', // Local/private IPs
    '#^https?://\[?(::1|fe80:|fc00:|fd00:)#i', // IPv6 local/private
    '#^https?://169\.254\.#', // Link-local / AWS metadata
    '#^https?://metadata\.google#i', // GCP metadata
    '#^https?://100\.100\.100\.200#', // Alibaba metadata
  );

  /**
   * Initialize the ICS Proxy.
   */
  public static function init() {
    add_action('rest_api_init', array(__CLASS__, 'register_routes'));
    add_filter('rest_pre_serve_request', array(__CLASS__, 'serve_raw_ics'), 10, 4);
  }

  /**
   * Register REST API routes.
   */
  public static function register_routes() {
    register_rest_route(
      self::REST_NAMESPACE,
      '/ics-proxy',
      array(
        'methods'             => 'GET',
        'callback'            => array(__CLASS__, 'handle_ics_proxy'),
        'permission_callback' => '__return_true',
        'args'                => array(
          'url'      => array(
            'required'          => true,
            'type'              => 'string',
            'description'       => __('The ICS feed URL to fetch.', 'hydrogen-calendar-embeds'),
            'sanitize_callback' => 'esc_url_raw',
            'validate_callback' => array(__CLASS__, 'validate_ics_url'),
          ),
          'no_cache' => array(
            'required'          => false,
            'type'              => 'boolean',
            'description'       => __('Bypass cache and fetch fresh data.', 'hydrogen-calendar-embeds'),
            'default'           => false,
          ),
        ),
      )
    );
  }

  /**
   * Validate that the ICS URL is safe to fetch.
   *
   * Allows any HTTPS URL while blocking internal networks,
   * localhost, and cloud metadata endpoints for SSRF protection.
   *
   * @param string $url The URL to validate.
   * @return bool|WP_Error True if valid, WP_Error if not.
   */
  public static function validate_ics_url($url) {
    if (empty($url)) {
      return new WP_Error(
        'hycal_invalid_url',
        __('ICS URL is required.', 'hydrogen-calendar-embeds'),
        array('status' => 400)
      );
    }

    // Limit URL length to prevent abuse
    if (strlen($url) > self::MAX_URL_LENGTH) {
      return new WP_Error(
        'hycal_url_too_long',
        __('URL is too long.', 'hydrogen-calendar-embeds'),
        array('status' => 400)
      );
    }

    // Check URL scheme - HTTPS required
    $parsed = wp_parse_url($url);
    if (! isset($parsed['scheme']) || $parsed['scheme'] !== 'https') {
      return new WP_Error(
        'hycal_insecure_url',
        __('Only HTTPS URLs are allowed for security.', 'hydrogen-calendar-embeds'),
        array('status' => 400)
      );
    }

    // Block internal/private networks (SSRF protection)
    /**
     * Filters the blocked URL patterns for SSRF protection.
     *
     * SECURITY WARNING: Be extremely careful when modifying this filter.
     * Removing patterns can expose your server to SSRF attacks.
     *
     * @since 1.0.0
     *
     * @param array  $patterns Array of regex patterns to block.
     * @param string $url      The URL being validated.
     */
    $blocked_patterns = apply_filters('hycal_blocked_url_patterns', self::$blocked_url_patterns, $url);

    foreach ($blocked_patterns as $pattern) {
      if (preg_match($pattern, $url)) {
        return new WP_Error(
          'hycal_blocked_url',
          __('This URL is not allowed for security reasons.', 'hydrogen-calendar-embeds'),
          array('status' => 403)
        );
      }
    }

    // Resolve hostname to check for DNS rebinding to internal IPs
    if (isset($parsed['host'])) {
      $ip = gethostbyname($parsed['host']);
      if ($ip !== $parsed['host']) {
        if (self::is_private_ip($ip)) {
          return new WP_Error(
            'hycal_private_ip',
            __('This URL resolves to a private IP address and is not allowed.', 'hydrogen-calendar-embeds'),
            array('status' => 403)
          );
        }
      }
    }

    /**
     * Filters whether an ICS URL is valid.
     *
     * Use this hook to add custom validation logic for ICS URLs,
     * such as whitelisting specific domains.
     *
     * @since 1.0.0
     *
     * @param bool|WP_Error $valid Whether the URL is valid. Return true to allow,
     *                             or WP_Error to reject with a custom message.
     * @param string        $url   The URL being validated.
     */
    return apply_filters('hycal_validate_ics_url', true, $url);
  }

  /**
   * Check if an IP address is private/internal.
   *
   * @param string $ip The IP address to check.
   * @return bool True if the IP is private/internal.
   */
  private static function is_private_ip($ip) {
    return filter_var(
      $ip,
      FILTER_VALIDATE_IP,
      FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
    ) === false;
  }

  /**
   * Handle ICS proxy request - returns raw ICS content.
   *
   * FullCalendar's iCalendar plugin handles all parsing client-side.
   *
   * @param WP_REST_Request $request The REST request.
   * @return WP_REST_Response|WP_Error The REST response with raw ICS content.
   */
  public static function handle_ics_proxy($request) {
    // Rate limiting check
    if (! self::check_rate_limit()) {
      return new WP_Error(
        'hycal_rate_limited',
        __('Too many requests. Please try again later.', 'hydrogen-calendar-embeds'),
        array('status' => 429)
      );
    }

    $url      = $request->get_param('url');
    $no_cache = $request->get_param('no_cache');

    // Generate cache key (just URL, no date range needed)
    $cache_key = 'hycal_ics_' . md5($url);

    // Check cache first (unless bypassed)
    if (! $no_cache) {
      $cached = get_transient($cache_key);
      if (false !== $cached) {
        // Return cached ICS content with proper headers
        return self::create_ics_response($cached, true);
      }
    }

    // Fetch the ICS feed
    $response = wp_remote_get(
      $url,
      array(
        'timeout'    => 30,
        'user-agent' => 'hydrogen-calendar-embeds/' . HYCAL_VER . ' (WordPress Plugin)',
        'headers'    => array(
          'Accept' => 'text/calendar, application/calendar+json, */*',
        ),
      )
    );

    if (is_wp_error($response)) {
      return new WP_Error(
        'hycal_fetch_failed',
        sprintf(
          /* translators: %s: error message */
          __('Failed to fetch ICS feed: %s', 'hydrogen-calendar-embeds'),
          $response->get_error_message()
        ),
        array('status' => 502)
      );
    }

    $status_code = wp_remote_retrieve_response_code($response);
    if ($status_code !== 200) {
      return new WP_Error(
        'hycal_fetch_error',
        sprintf(
          /* translators: %d: HTTP status code */
          __('ICS feed returned HTTP status %d.', 'hydrogen-calendar-embeds'),
          $status_code
        ),
        array('status' => 502)
      );
    }

    $ics_content = wp_remote_retrieve_body($response);

    if (empty($ics_content)) {
      return new WP_Error(
        'hycal_empty_response',
        __('ICS feed returned empty content.', 'hydrogen-calendar-embeds'),
        array('status' => 502)
      );
    }

    // Check content size to prevent memory exhaustion
    if (strlen($ics_content) > self::MAX_ICS_SIZE) {
      return new WP_Error(
        'hycal_content_too_large',
        __('ICS feed is too large to process.', 'hydrogen-calendar-embeds'),
        array('status' => 502)
      );
    }

    // Basic validation - check if it looks like ICS content
    if (strpos($ics_content, 'BEGIN:VCALENDAR') === false) {
      return new WP_Error(
        'hycal_invalid_ics',
        __('The URL did not return valid iCalendar data.', 'hydrogen-calendar-embeds'),
        array('status' => 502)
      );
    }

    /**
     * Filters the ICS content before caching and returning.
     *
     * Use this hook to modify or transform the ICS data before
     * it's sent to the browser.
     *
     * @since 1.0.0
     *
     * @param string $ics_content The raw ICS content.
     * @param string $url         The source URL of the ICS feed.
     */
    $ics_content = apply_filters('hycal_ics_content', $ics_content, $url);

    // Cache the raw ICS content
    set_transient($cache_key, $ics_content, self::CACHE_DURATION);

    return self::create_ics_response($ics_content, false);
  }

  /**
   * Output raw ICS content directly (bypasses JSON encoding).
   *
   * @param string $ics_content The raw ICS content.
   * @param bool   $from_cache  Whether the content came from cache.
   */
  private static function create_ics_response($ics_content, $from_cache = false) {
    $allowed_origin = home_url();

    $response = new WP_REST_Response($ics_content, 200);
    $response->set_headers(
      array(
        'Content-Type'               => 'text/calendar; charset=utf-8',
        'X-PCEMB-Cached'             => ($from_cache ? 'true' : 'false'),
        'Access-Control-Allow-Origin' => esc_url_raw($allowed_origin),
        'Cache-Control'              => 'max-age=900',
      )
    );

    return $response;
  }

  /**
   * Serve raw ICS content for the REST response to avoid JSON encoding.
   *
   * @param bool             $served  Whether the request has already been served.
   * @param WP_HTTP_Response $result  Result to send to the client.
   * @param WP_REST_Request  $request Request used to generate the response.
   * @param WP_REST_Server   $server  Server instance.
   * @return bool True if served, otherwise original $served value.
   */
  public static function serve_raw_ics($served, $result, $request, $server) {
    // Only handle this plugin's ICS endpoint
    if ($request->get_route() !== '/' . self::REST_NAMESPACE . '/ics-proxy') {
      return $served;
    }

    $data = $result->get_data();
    if (! is_string($data)) {
      return $served;
    }

    // Output headers from the response object
    foreach ($result->get_headers() as $name => $value) {
      header(sprintf('%s: %s', $name, $value));
    }

    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Raw ICS content intentionally unescaped
    echo $data;

    return true;
  }

  /**
   * Simple rate limiting check using transients.
   *
   * @return bool True if request is allowed, false if rate limited.
   */
  private static function check_rate_limit() {
    $ip = self::get_client_ip();

    // If we can't determine the IP, apply a conservative global rate limit
    if (empty($ip)) {
      $ip = 'global_unknown';
    }

    $rate_key   = 'hycal_rate_' . md5($ip);
    $rate_limit = ($ip === 'global_unknown') ? 30 : 60; // Lower limit for unknown IPs
    $current    = get_transient($rate_key);

    if (false === $current) {
      set_transient($rate_key, 1, 60);
      return true;
    }

    if ($current >= $rate_limit) {
      return false;
    }

    set_transient($rate_key, $current + 1, 60);
    return true;
  }

  /**
   * Get client IP address.
   *
   * @return string|null Client IP or null if not determinable.
   */
  private static function get_client_ip() {
    $ip_keys = array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR');

    foreach ($ip_keys as $key) {
      if (! empty($_SERVER[$key])) {
        $ip = sanitize_text_field(wp_unslash($_SERVER[$key]));
        if (strpos($ip, ',') !== false) {
          $ip = trim(explode(',', $ip)[0]);
        }
        if (filter_var($ip, FILTER_VALIDATE_IP)) {
          return $ip;
        }
      }
    }

    return null;
  }

  /**
   * Clear cached ICS data.
   *
   * @param string|null $url Optional. Clear cache for specific URL, or all if null.
   * @return bool True on success.
   */
  public static function clear_cache($url = null) {
    global $wpdb;

    if ($url) {
      delete_transient('hycal_ics_' . md5($url));
    } else {
      // Clear all ICS cache transients.
      // Using $wpdb->prepare() with LIKE requires escaping % wildcards.
      // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
      $wpdb->query(
        $wpdb->prepare(
          "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
          $wpdb->esc_like('_transient_hycal_ics_') . '%',
          $wpdb->esc_like('_transient_timeout_hycal_ics_') . '%'
        )
      );
    }

    return true;
  }
}
