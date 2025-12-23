<?php

/**
 * Pretty Calendar Embeds Uninstall
 *
 * Fired when the plugin is uninstalled.
 * Cleans up transients and any stored data.
 *
 * @package pretty-calendar-embeds
 */

// If uninstall not called from WordPress, exit.
if (! defined('WP_UNINSTALL_PLUGIN')) {
  exit;
}

global $wpdb;

// Delete all ICS cache transients.
$wpdb->query(
  "DELETE FROM {$wpdb->options} 
	WHERE option_name LIKE '_transient_pcemb_ics_%' 
	OR option_name LIKE '_transient_timeout_pcemb_ics_%'"
);

// Delete all rate limit transients.
$wpdb->query(
  "DELETE FROM {$wpdb->options} 
	WHERE option_name LIKE '_transient_pcemb_rate_%' 
	OR option_name LIKE '_transient_timeout_pcemb_rate_%'"
);
