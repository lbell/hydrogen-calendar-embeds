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
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
$wpdb->query(
  $wpdb->prepare(
    "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
    $wpdb->esc_like('_transient_pcemb_ics_') . '%',
    $wpdb->esc_like('_transient_timeout_pcemb_ics_') . '%'
  )
);

// Delete all rate limit transients.
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
$wpdb->query(
  $wpdb->prepare(
    "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
    $wpdb->esc_like('_transient_pcemb_rate_') . '%',
    $wpdb->esc_like('_transient_timeout_pcemb_rate_') . '%'
  )
);
