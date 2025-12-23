<?php
/*
Plugin Name: Pretty Calendar Embeds
Plugin URI: https://github.com/lbell/pretty-calendar-embeds
Description: Embed iCalendar (ICS) feeds and Google Calendars with a beautiful, responsive calendar interface.
Version: 1.0.0
Author: LBell
Author URI: https://lorenbell.com
Text Domain: pretty-calendar-embeds
Domain Path: /languages
Requires at least: 5.8
Requires PHP: 7.4
Tested up to: 6.9
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

/*  Copyright 2020-2025 LBell

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License, version 2, as
published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

// Prevent direct file access.
if (! defined('ABSPATH')) {
  exit;
}

define('PCEMB_VER', '1.0.0');
define('PCEMB_DIR', plugin_dir_path(__FILE__)); // Trailing slash
define('PCEMB_URL', plugin_dir_url(__FILE__));

/**
 * Load plugin textdomain for translations.
 */
function pcemb_load_textdomain() {
  load_plugin_textdomain(
    'pretty-calendar-embeds',
    false,
    dirname(plugin_basename(__FILE__)) . '/languages'
  );
}
add_action('init', 'pcemb_load_textdomain');

require_once PCEMB_DIR . 'util/utils.php';
require_once PCEMB_DIR . 'init/shortcode.php';
require_once PCEMB_DIR . 'init/init.php';

// ICS Proxy for CORS-free calendar fetching (REST API)
require_once PCEMB_DIR . 'includes/class-pcemb-ics-proxy.php';
PCEMB_ICS_Proxy::init();

// Gutenberg Block Registration
require_once PCEMB_DIR . 'includes/class-pcemb-block.php';

/**
 * Fires after Pretty Calendar Embeds has fully loaded.
 *
 * Use this hook to initialize your extension after all plugin
 * files have been included and the plugin is ready.
 *
 * @since 1.0.0
 *
 * @param string PCEMB_VER The current plugin version.
 */
do_action('pcemb_loaded', PCEMB_VER);
