<?php

// Prevent direct file access.
if (! defined('ABSPATH')) {
  exit;
}

/**
 * Register shortcode(s)
 *
 * @return void
 */
function hycal_register_shortcodes() {
  add_shortcode('hydrogen_calendar_embeds', 'hycal_shortcode');
}


/**
 * Register front-end styles
 */
function hycal_register_frontend_css() {
  // 3rd Party CDN alternatives (for reference):
  // wp_register_style('fullcalendar', 'https://cdn.jsdelivr.net/npm/fullcalendar@6/index.global.min.css', null, HYCAL_VER);
  // wp_register_style('tippy_light', 'https://unpkg.com/tippy.js@6/themes/light.css', null, HYCAL_VER);
  wp_register_style('tippy_light', HYCAL_URL . 'public/lib/tippy/light.css', null, HYCAL_VER);

  // Local
  wp_register_style('hycal_css', HYCAL_URL . 'public/css/hycal.css', null, HYCAL_VER);
  wp_register_style('hycal_tippy', HYCAL_URL . 'public/css/tippy.css', null, HYCAL_VER);
}


/**
 * Register front-end scripts
 */
function hycal_register_frontend_js() {
  // 3rd Party CDN alternatives (for reference):
  // wp_register_script('fullcalendar', 'https://cdn.jsdelivr.net/npm/fullcalendar@6/index.global.min.js', null, HYCAL_VER, true);
  // wp_register_script('popper', 'https://unpkg.com/@popperjs/core@2', null, HYCAL_VER, true);
  // wp_register_script('tippy', 'https://unpkg.com/tippy.js@6', null, HYCAL_VER, true);

  // Third-party libraries (bundled)
  wp_register_script('fullcalendar', HYCAL_URL . 'public/lib/fullcalendar/index.global.min.js', null, HYCAL_VER, true);
  wp_register_script('fc_icalendar', HYCAL_URL . 'public/lib/fullcalendar/icalendar/index.global.min.js', array('ical_js'), HYCAL_VER, true);
  wp_register_script('fc_locales', HYCAL_URL . 'public/lib/fullcalendar/locales/locales-all.global.min.js', null, HYCAL_VER, true);
  wp_register_script('ical_js', HYCAL_URL . 'public/lib/ical.js/ical.min.js', null, HYCAL_VER, true);
  wp_register_script('popper', HYCAL_URL . 'public/lib/popper/popper.min.js', null, HYCAL_VER, true);
  wp_register_script('tippy', HYCAL_URL . 'public/lib/tippy/tippy.min.js', null, HYCAL_VER, true);

  // Plugin scripts - hooks must load first as other scripts depend on hycalHooks
  wp_register_script('hycal_hooks', HYCAL_URL . 'public/js/hooks.js', [], HYCAL_VER, true);
  wp_register_script('hycal_helpers', HYCAL_URL . 'public/js/helpers.js', ['wp-i18n', 'hycal_hooks'], HYCAL_VER, true);
  wp_register_script('hycal_loader', HYCAL_URL . 'public/js/hycal.js', ['wp-i18n', 'hycal_hooks'], HYCAL_VER, true);
  wp_register_script('hycal_tippy', HYCAL_URL . 'public/js/tippy.js', ['wp-i18n', 'hycal_hooks'], HYCAL_VER, true);

  wp_set_script_translations('hycal_helpers', 'hydrogen-calendar-embeds');
  wp_set_script_translations('hycal_loader', 'hydrogen-calendar-embeds');
  wp_set_script_translations('hycal_tippy', 'hydrogen-calendar-embeds');
}


/**
 * Register all the things on init
 *
 * @return void
 */
function hycal_init() {
  hycal_register_shortcodes();
  hycal_register_frontend_css();
  hycal_register_frontend_js();
}
add_action('init', 'hycal_init', 0);
