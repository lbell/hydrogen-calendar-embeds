<?php

// Prevent direct file access.
if (! defined('ABSPATH')) {
  exit;
}

function pcemb_shortcode($atts) {
  /**
   * Filters the default shortcode attributes before processing.
   *
   * Allows extensions to add or modify default attribute values.
   *
   * @since 1.0.0
   *
   * @param array $defaults The default shortcode attributes.
   */
  $defaults = apply_filters('pcemb_shortcode_defaults', array(
    'ics'                        => "",
    'cal_ids'                    => "",
    'locale'                     => "en",
    'list_type'                  => "listMonth",
    'custom_list_button'         => "list",
    'custom_days'                => "28",
    'views'                      => "dayGridMonth, listMonth",
    'initial_view'               => "dayGridMonth",
    'enforce_listview_on_mobile' => "true",
    'mobile_breakpoint'          => "768",
    'show_today_button'          => "true",
    'show_title'                 => "true",
    'instance_id'                => pcemb_generate_unique_instance_id(),
    'use_tooltip'                => "true",
    'hide_past'                  => "false",
    'fc_args'                    => '{}',
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
  $args = apply_filters('pcemb_shortcode_attributes', $args, $atts, $defaults);

  // Prepare settings from shortcode attributes
  $pcembSettings = $args;
  $pcembSettings["instance_id"] = preg_replace('/[\W]/', '', $pcembSettings["instance_id"]);

  // Auto-resolve views based on user-provided attributes
  $pcembSettings['views'] = pcemb_resolve_views($atts, $args);

  // Auto-resolve initial_view based on views (validate it's in the list, or pick smartly)
  $pcembSettings['initial_view'] = pcemb_resolve_initial_view($pcembSettings['views'], $pcembSettings['initial_view']);

  // Sanitize ICS URLs if provided (basic cleanup, server validates fully)
  if (!empty($pcembSettings['ics'])) {
    // Remove any leading/trailing whitespace and extra commas
    $pcembSettings['ics'] = preg_replace('/,\s*,/', ',', trim($pcembSettings['ics'], ", \t\n\r"));
  }

  // Decode fc_args bracket placeholders to allow square brackets in JSON
  if (!empty($pcembSettings['fc_args']) && $pcembSettings['fc_args'] !== '{}') {
    $pcembSettings['fc_args'] = pcemb_decode_fc_args_brackets($pcembSettings['fc_args']);
  }

  // Provide REST API URL for ICS proxy
  $pcembSettings['rest_url'] = esc_url_raw(rest_url('pcemb/v1/ics-proxy'));

  /**
   * Filters the calendar settings before rendering.
   *
   * This is the final opportunity to modify settings before they are
   * passed to JavaScript. Use this to add custom settings for your
   * extension that will be available in JS hooks.
   *
   * @since 1.0.0
   *
   * @param array $pcembSettings The calendar settings array.
   * @param array $args          The processed shortcode attributes.
   */
  $pcembSettings = apply_filters('pcemb_settings', $pcembSettings, $args);

  /**
   * Fires before calendar scripts are enqueued.
   *
   * Use this hook to enqueue your own scripts/styles that depend on
   * the calendar settings.
   *
   * @since 1.0.0
   *
   * @param array $pcembSettings The calendar settings array.
   */
  do_action('pcemb_before_enqueue_scripts', $pcembSettings);

  // Load hooks system first (required by other scripts)
  wp_enqueue_script('pcemb_hooks');

  wp_enqueue_script('fullcalendar');

  // Load iCalendar plugin if using ics attribute
  if (!empty($pcembSettings['ics'])) {
    wp_enqueue_script('ical_js');
    wp_enqueue_script('fc_icalendar');
  }

  if ($pcembSettings['locale'] !== "en") {
    wp_enqueue_script('fc_locales');
  }

  if ($pcembSettings['use_tooltip'] === "true") {
    wp_enqueue_script('popper');
    wp_enqueue_script('tippy');
    wp_enqueue_script('pcemb_tippy');

    wp_enqueue_style('pcemb_tippy');
    wp_enqueue_style('tippy_light');
  }

  // Load Local Scripts
  wp_enqueue_script('pcemb_helpers');
  wp_enqueue_script('pcemb_loader');

  // Load Styles. FullCalendar CSS is intentionally NOT enqueued here to allow
  // the active theme to control calendar styling for better visual integration.
  // Themes can enqueue a stylesheet on the 'pcemb_enqueue_scripts' action or
  // by registering the 'fullcalendar' handle themselves if desired.
  wp_enqueue_style('pcemb_css');

  /**
   * Fires after core calendar scripts and styles are enqueued.
   *
   * Use this hook to enqueue additional scripts or styles for your extension.
   *
   * @since 1.0.0
   *
   * @param array $pcembSettings The calendar settings array.
   */
  do_action('pcemb_enqueue_scripts', $pcembSettings);

  $script = "
    document.addEventListener('DOMContentLoaded', function() {
      function pcemb_inlineScript(settings) {
        pcemb_render_calendar(settings);
      }

      pcemb_inlineScript(" . wp_json_encode($pcembSettings) . ");
    });
  ";
  wp_add_inline_script('pcemb_loader', $script);

  /**
   * Fires before the calendar HTML output is generated.
   *
   * @since 1.0.0
   *
   * @param array $pcembSettings The calendar settings array.
   */
  do_action('pcemb_before_render', $pcembSettings);

  $shortcode_output = "
  <div id='pcemb-" . esc_attr($pcembSettings["instance_id"]) . "' class='pcemb-container'>" . esc_html__("loading...", "pretty-calendar-embeds") . "</div>
  <div class='pcemb-branding'>" . esc_html__("Powered by", "pretty-calendar-embeds") . " <a href='https://wordpress.org/plugins/pretty-calendar-embeds/'>Pretty Calendar Embeds</a></div>
  ";

  /**
   * Filters the calendar HTML output.
   *
   * Use this to modify or append to the calendar container HTML.
   *
   * @since 1.0.0
   *
   * @param string $shortcode_output The HTML output.
   * @param array  $pcembSettings    The calendar settings array.
   */
  $shortcode_output = apply_filters('pcemb_shortcode_output', $shortcode_output, $pcembSettings);

  /**
   * Fires after the calendar HTML output is generated.
   *
   * @since 1.0.0
   *
   * @param string $shortcode_output The HTML output.
   * @param array  $pcembSettings    The calendar settings array.
   */
  do_action('pcemb_after_render', $shortcode_output, $pcembSettings);

  return $shortcode_output;
}
