<?php
/*
Plugin Name: Hydrogen Calendar Embeds
Plugin URI: https://github.com/lbell/hydrogen-calendar-embeds
Description: Embed any existing iCalendar (ICS) source into your WordPress site using Gutenberg blocks or shortcodes.
Version: 1.0.0
Author: LBell
Author URI: https://lorenbell.com
Text Domain: hydrogen-calendar-embeds
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

define('HYCAL_VER', '1.0.0');
define('HYCAL_DIR', plugin_dir_path(__FILE__)); // Trailing slash
define('HYCAL_URL', plugin_dir_url(__FILE__));

require_once HYCAL_DIR . 'util/utils.php';
require_once HYCAL_DIR . 'init/shortcode.php';
require_once HYCAL_DIR . 'init/init.php';

// ICS Proxy for CORS-free calendar fetching (REST API)
require_once HYCAL_DIR . 'includes/class-hycal-ics-proxy.php';
HYCAL_ICS_Proxy::init();

// Gutenberg Block Registration
require_once HYCAL_DIR . 'includes/class-hycal-block.php';

/**
 * Fires after Hydrogen Calendar Embeds has fully loaded.
 *
 * Use this hook to initialize your extension after all plugin
 * files have been included and the plugin is ready.
 *
 * @since 1.0.0
 *
 * @param string HYCAL_VER The current plugin version.
 */
do_action('hycal_loaded', HYCAL_VER);
