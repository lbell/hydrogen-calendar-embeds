<?php

// Prevent direct file access.
if (! defined('ABSPATH')) {
  exit;
}

/**
 * Generate a guaranteed unique ID hash for calendar instances on a page.
 *
 * Uses a static counter combined with a timestamp to guarantee uniqueness
 * across multiple calendar shortcodes on the same page load. This ensures
 * that even 200+ calendars on one page will never have ID collisions.
 *
 * @return string Unique hex ID hash
 */
function hycal_generate_unique_instance_id() {
  static $instance_counter = 0;
  $instance_counter++;

  // Combine timestamp (microseconds) + instance counter + random for good measure
  // timestamp (8 bytes) + counter (4 bytes) = 12 bytes, highly unlikely to collide
  $unique_data = microtime(true) . '-' . $instance_counter . '-' . wp_rand(1000, 9999);

  return bin2hex(hash('sha256', $unique_data, true));
}

/**
 * Decode URL-encoded brackets in fc_args to allow square brackets.
 *
 * WordPress shortcode parsing breaks with square brackets `[]`. This function
 * allows users to use URL-encoded brackets that gets decoded:
 * - `%5B` becomes `[`
 * - `%5D` becomes `]`
 *
 * Example:
 *   fc_args='{"eventSources":%5B"url"%5D}'
 *   becomes:
 *   fc_args='{"eventSources":["url"]}'
 *
 * @param string $fc_args The fc_args JSON string with URL-encoded brackets
 * @return string The decoded fc_args JSON string with actual brackets
 */
function hycal_decode_fc_args_brackets($fc_args) {
  if (empty($fc_args)) {
    return $fc_args;
  }

  return str_replace(
    array('%5B', '%5D'),
    array('[', ']'),
    $fc_args
  );
}

/**
 * Encode square brackets in fc_args to URL-encoded format.
 *
 * This is the inverse of hycal_decode_fc_args_brackets(). Used by the block
 * renderer to convert natural JSON (with []) to the encoded format (%5B/%5D)
 * before passing to the shortcode, which will then decode it.
 *
 * This allows block users to enter natural JSON syntax while maintaining
 * compatibility with the shortcode's decoding logic.
 *
 * Example:
 *   fc_args='{"hiddenDays": [0, 6]}'
 *   becomes:
 *   fc_args='{"hiddenDays": %5B0, 6%5D}'
 *
 * @param string $fc_args The fc_args JSON string with actual brackets
 * @return string The encoded fc_args JSON string with URL-encoded brackets
 */
function hycal_encode_fc_args_brackets($fc_args) {
  if (empty($fc_args)) {
    return $fc_args;
  }

  return str_replace(
    array('[', ']'),
    array('%5B', '%5D'),
    $fc_args
  );
}

/**
 * Automatically resolve the initial_view based on the provided views.
 *
 * Intelligently handles initial_view configuration:
 * - If initial_view is in the views list: use it (valid choice, either user-specified or default)
 * - If only one view is specified: use that view
 * - If multiple views and default view (dayGridMonth) is in the list: use the default
 * - If multiple views but default is NOT in the list: use the first view they provided
 *
 * @param string $views        The resolved views string (comma-separated)
 * @param string $initial_view The currently set initial_view value (default or user-provided)
 * @return string The resolved initial_view
 */
function hycal_resolve_initial_view($views, $initial_view) {
  // Parse views into individual view names
  $view_list = array_map('trim', explode(',', $views));

  // If there's only one view, use it as the initial view
  if (count($view_list) === 1) {
    return $view_list[0];
  }

  // For multiple views, check if the current initial_view is in the list
  $initial_view_trimmed = trim($initial_view);
  if (in_array($initial_view_trimmed, $view_list, true)) {
    // It's valid, use it
    return $initial_view_trimmed;
  }

  // initial_view is not in the views list, pick one intelligently
  $default_view = 'dayGridMonth';
  $has_default_in_views = in_array($default_view, $view_list, true);

  // If default view is in their list, use it
  if ($has_default_in_views) {
    return $default_view;
  }

  // If default view is NOT in their list, use their first view
  return $view_list[0];
}
