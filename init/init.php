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
function pcemb_register_shortcodes() {
  add_shortcode('pretty_calendar_embeds', 'pcemb_shortcode');
}


/**
 * Register front-end styles
 */
function pcemb_register_frontend_css() {
  // 3rd Party
  // wp_register_style('fullcalendar', 'https://cdn.jsdelivr.net/npm/fullcalendar@5/main.min.css', null, PCEMB_VER);
  // wp_register_style('fullcalendar', PCEMB_URL . 'public/lib/fullcalendar/main.min.css', null, PCEMB_VER);
  // wp_register_style('tippy_light', 'https://unpkg.com/tippy.js@6/themes/light.css', null, PCEMB_VER);
  wp_register_style('tippy_light', PCEMB_URL . 'public/lib/tippy/light.css', null, PCEMB_VER);

  // Local
  wp_register_style('pcemb_css', PCEMB_URL . 'public/css/pcemb.css', null, PCEMB_VER);
  wp_register_style('pcemb_tippy', PCEMB_URL . 'public/css/tippy.css', null, PCEMB_VER);
}


/**
 * Register front-end scripts
 */
function pcemb_register_frontend_js() {
  // 3rd Party
  // wp_register_script('fullcalendar', 'https://cdn.jsdelivr.net/npm/fullcalendar@5/main.js', null, PCEMB_VER, true); 
  // wp_register_script('popper', 'https://unpkg.com/@popperjs/core@2', null, PCEMB_VER, true);
  // wp_register_script('tippy', 'https://unpkg.com/tippy.js@6', null, PCEMB_VER, true);

  wp_register_script('fullcalendar', PCEMB_URL . 'public/lib/fullcalendar/index.global.min.js', null, PCEMB_VER, true);
  wp_register_script('fc_googlecalendar', PCEMB_URL . 'public/lib/fullcalendar/google-calendar/index.global.min.js', null, PCEMB_VER, true);
  wp_register_script('fc_icalendar', PCEMB_URL . 'public/lib/fullcalendar/icalendar/index.global.min.js', array('ical_js'), PCEMB_VER, true);
  wp_register_script('fc_locales', PCEMB_URL . 'public/lib/fullcalendar/locales/locales-all.global.min.js', null, PCEMB_VER, true);
  wp_register_script('ical_js', PCEMB_URL . 'public/lib/ical.js/ical.min.js', null, PCEMB_VER, true);

  wp_register_script('popper', PCEMB_URL . 'public/lib/popper/popper.min.js', null, PCEMB_VER, true);
  wp_register_script('tippy', PCEMB_URL . 'public/lib/tippy/tippy.min.js', null, PCEMB_VER, true);

  // Local scripts - hooks must load first as other scripts depend on pcembHooks
  wp_register_script('pcemb_hooks', PCEMB_URL . 'public/js/hooks.js', [], PCEMB_VER, true);
  wp_register_script('pcemb_helpers', PCEMB_URL . 'public/js/helpers.js', ['wp-i18n', 'pcemb_hooks'], PCEMB_VER, true);
  wp_register_script('pcemb_loader', PCEMB_URL . 'public/js/pcemb.js', ['wp-i18n', 'pcemb_hooks'], PCEMB_VER, true);
  wp_register_script('pcemb_tippy', PCEMB_URL . 'public/js/tippy.js', ['wp-i18n', 'pcemb_hooks'], PCEMB_VER, true);

  wp_set_script_translations('pcemb_helpers', 'pretty-calendar-embeds');
  wp_set_script_translations('pcemb_loader', 'pretty-calendar-embeds');
  wp_set_script_translations('pcemb_tippy', 'pretty-calendar-embeds');
}


/**
 * Register all the things on init
 *
 * @return void
 */
function pcemb_init() {
  pcemb_register_shortcodes();
  pcemb_register_frontend_css();
  pcemb_register_frontend_js();
}
add_action('init', 'pcemb_init', 0);
