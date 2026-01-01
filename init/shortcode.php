<?php

// Prevent direct file access.
if (! defined('ABSPATH')) {
  exit;
}

function hycal_shortcode($atts) {
  /**
   * Filters the default shortcode attributes before processing.
   *
   * Allows extensions to add or modify default attribute values.
   *
   * @since 1.0.0
   *
   * @param array $defaults The default shortcode attributes.
   */
  $defaults = apply_filters('hycal_shortcode_defaults', array(
    'ics'                        => "",
    'cal_ids'                    => "",
    'locale'                     => "en",
    'custom_list_button'         => "list",
    'custom_days'                => "28",
    'views'                      => "dayGridMonth, listMonth",
    'initial_view'               => "dayGridMonth",
    'enforce_listview_on_mobile' => "true",
    'mobile_breakpoint'          => "768",
    'show_today_button'          => "true",
    'show_title'                 => "true",
    'instance_id'                => hycal_generate_unique_instance_id(),
    'use_tooltip'                => "true",
    'no_link'                    => "false",
    'hide_past'                  => "false",
    'fc_args'                    => '{}',
    // Show us some love: display branding (default false)
    'show_love'                  => "false",
  ));

  $args = shortcode_atts($defaults, $atts);

  /**
   * Filters the shortcode attributes after WordPress processing.
   *
   * Use this to modify attribute values after shortcode_atts() has merged
   * user values with defaults.
   *
   * @since 1.0.0
   *
   * @param array $args The processed shortcode attributes.
   * @param array $atts The raw shortcode attributes from the user.
   * @param array $defaults The default attribute values.
   */
  $args = apply_filters('hycal_shortcode_attributes', $args, $atts, $defaults);

  // Prepare settings from shortcode attributes
  $hycalSettings = $args;
  $hycalSettings["instance_id"] = preg_replace('/[\W]/', '', $hycalSettings["instance_id"]);

  // Auto-resolve initial_view based on views (validate it's in the list, or pick smartly)
  $hycalSettings['initial_view'] = hycal_resolve_initial_view($hycalSettings['views'], $hycalSettings['initial_view']);

  // Sanitize ICS URLs if provided (basic cleanup, server validates fully)
  if (!empty($hycalSettings['ics'])) {
    // Remove any leading/trailing whitespace and extra commas
    $hycalSettings['ics'] = preg_replace('/,\s*,/', ',', trim($hycalSettings['ics'], ", \t\n\r"));
  }

  // Decode fc_args bracket placeholders to allow square brackets in JSON
  if (!empty($hycalSettings['fc_args']) && $hycalSettings['fc_args'] !== '{}') {
    $hycalSettings['fc_args'] = hycal_decode_fc_args_brackets($hycalSettings['fc_args']);
  }

  // Provide REST API URL for ICS proxy
  $hycalSettings['rest_url'] = esc_url_raw(rest_url('hycal/v1/ics-proxy'));

  /**
   * Filters the calendar settings before rendering.
   *
   * This is the final opportunity to modify settings before they are
   * passed to JavaScript. Use this to add custom settings for your
   * extension that will be available in JS hooks.
   *
   * @since 1.0.0
   *
   * @param array $hycalSettings The calendar settings array.
   * @param array $args          The processed shortcode attributes.
   */
  $hycalSettings = apply_filters('hycal_settings', $hycalSettings, $args);

  /**
   * Fires before calendar scripts are enqueued.
   *
   * Use this hook to enqueue your own scripts/styles that depend on
   * the calendar settings.
   *
   * @since 1.0.0
   *
   * @param array $hycalSettings The calendar settings array.
   */
  do_action('hycal_before_enqueue_scripts', $hycalSettings);

  // Load hooks system first (required by other scripts)
  wp_enqueue_script('hycal_hooks');

  wp_enqueue_script('fullcalendar');

  // Load iCalendar plugin if using ics attribute
  if (!empty($hycalSettings['ics'])) {
    wp_enqueue_script('ical_js');
    wp_enqueue_script('fc_icalendar');
  }

  if ($hycalSettings['locale'] !== "en") {
    wp_enqueue_script('fc_locales');
  }

  if ($hycalSettings['use_tooltip'] === "true") {
    wp_enqueue_script('popper');
    wp_enqueue_script('tippy');
    wp_enqueue_script('hycal_tippy');

    wp_enqueue_style('hycal_tippy');
    wp_enqueue_style('tippy_light');
  }

  // Load Local Scripts
  wp_enqueue_script('hycal_helpers');
  wp_enqueue_script('hycal_loader');

  // Load Styles. FullCalendar CSS is intentionally NOT enqueued here to allow
  // the active theme to control calendar styling for better visual integration.
  // Themes can enqueue a stylesheet on the 'hycal_enqueue_scripts' action or
  // by registering the 'fullcalendar' handle themselves if desired.
  wp_enqueue_style('hycal_css');

  /**
   * Fires after core calendar scripts and styles are enqueued.
   *
   * Use this hook to enqueue additional scripts or styles for your extension.
   *
   * @since 1.0.0
   *
   * @param array $hycalSettings The calendar settings array.
   */
  do_action('hycal_enqueue_scripts', $hycalSettings);

  $script = "document.addEventListener('DOMContentLoaded', function() { hycal_render_calendar(" . wp_json_encode($hycalSettings) . "); });";
  wp_add_inline_script('hycal_loader', $script);

  /**
   * Fires before the calendar HTML output is generated.
   *
   * @since 1.0.0
   *
   * @param array $hycalSettings The calendar settings array.
   */
  do_action('hycal_before_render', $hycalSettings);

  $shortcode_output = "
  <div id='hycal-" . esc_attr($hycalSettings["instance_id"]) . "' class='hydrogen-calendar-embeds hycal-container'>" . esc_html__("loading...", "hydrogen-calendar-embeds") . "</div>
  ";

  // Optionally show branding if 'show_love' is true
  if (isset($hycalSettings['show_love']) && $hycalSettings['show_love'] === 'true') {
    $shortcode_output .= "<div class='hycal-branding'>" . esc_html__("Powered by", "hydrogen-calendar-embeds") . " <a href='https://wordpress.org/plugins/hydrogen-calendar-embeds/'>Hydrogen Calendar Embeds</a></div>";
  }

  /**
   * Filters the calendar HTML output.
   *
   * Use this to modify or append to the calendar container HTML.
   *
   * @since 1.0.0
   *
   * @param string $shortcode_output The HTML output.
   * @param array  $hycalSettings    The calendar settings array.
   */
  $shortcode_output = apply_filters('hycal_shortcode_output', $shortcode_output, $hycalSettings);

  /**
   * Fires after the calendar HTML output is generated.
   *
   * @since 1.0.0
   *
   * @param string $shortcode_output The HTML output.
   * @param array  $hycalSettings    The calendar settings array.
   */
  do_action('hycal_after_render', $shortcode_output, $hycalSettings);

  return $shortcode_output;
}
