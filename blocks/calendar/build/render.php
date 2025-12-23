<?php

/**
 * Pretty Calendar Embeds - Block Server-Side Render
 *
 * This file handles rendering the block on the frontend.
 * It converts the block attributes into the format expected
 * by the existing shortcode/calendar rendering logic.
 *
 * WordPress automatically calls this file when the block is
 * displayed on the frontend (as specified in block.json's "render" property).
 *
 * @package pretty-calendar-embeds
 *
 * Available variables from WordPress:
 * @var array    $attributes The block attributes (from block.json).
 * @var string   $content    The block inner content (empty for this block).
 * @var WP_Block $block      The block instance.
 */

// Prevent direct file access.
if (! defined('ABSPATH')) {
  exit;
}

/**
 * Convert block attributes to shortcode-style arguments.
 *
 * The block uses camelCase attribute names (JavaScript convention),
 * but the shortcode uses snake_case (PHP convention).
 * This mapping converts between the two formats.
 */
$pcemb_shortcode_args = array(
  // Calendar source.
  'ics'                        => $attributes['ics'] ?? '',
  'cal_ids'                    => $attributes['calIds'] ?? '',

  // Locale and language.
  'locale'                     => $attributes['locale'] ?? 'en',

  // View settings.
  'custom_list_button'         => $attributes['customListButton'] ?? 'list',
  'custom_days'                => $attributes['customDays'] ?? '28',
  'views'                      => $attributes['views'] ?? 'dayGridMonth, listMonth',
  'initial_view'               => $attributes['initialView'] ?? 'dayGridMonth',

  // Display toggles - convert boolean to string "true"/"false" for shortcode compatibility.
  'enforce_listview_on_mobile' => ($attributes['enforceListviewOnMobile'] ?? true) ? 'true' : 'false',
  'mobile_breakpoint'          => $attributes['mobileBreakpoint'] ?? '768',
  'show_today_button'          => ($attributes['showTodayButton'] ?? true) ? 'true' : 'false',
  'show_title'                 => ($attributes['showTitle'] ?? true) ? 'true' : 'false',
  'use_tooltip'                => ($attributes['useTooltip'] ?? true) ? 'true' : 'false',
  'hide_past'                  => ($attributes['hidePast'] ?? false) ? 'true' : 'false',

  // Advanced settings.
  // Encode square brackets so the shortcode's decoder handles them uniformly.
  // This allows block users to enter natural JSON with [] while shortcode users use %5B/%5D.
  'fc_args'                    => pcemb_encode_fc_args_brackets($attributes['fcArgs'] ?? '{}'),
);

/**
 * Generate the calendar output using the existing shortcode function.
 *
 * This reuses all the existing logic from pcemb_shortcode(), which handles:
 * - Script/style enqueuing
 * - Settings processing
 * - HTML output generation
 *
 * By reusing the shortcode function, we ensure the block and shortcode
 * behave identically and share the same codebase.
 */
$pcemb_calendar_output = pcemb_shortcode($pcemb_shortcode_args);

/**
 * Get the wrapper attributes for the block.
 *
 * get_block_wrapper_attributes() returns a string of HTML attributes
 * including the block's class names, alignment classes, and any
 * custom attributes. This ensures the block integrates properly
 * with WordPress's block system (spacing, alignment, etc.).
 */
$pcemb_wrapper_attributes = get_block_wrapper_attributes();

/**
 * Output the block HTML.
 *
 * We wrap the calendar output in a div with the block wrapper attributes.
 * This ensures proper block integration while keeping the calendar
 * output unchanged.
 */
?>
<div <?php echo $pcemb_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() returns escaped content. 
      ?>>
  <?php
  // Output the calendar HTML.
  // This is already escaped by pcemb_shortcode().
  echo $pcemb_calendar_output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output is escaped in pcemb_shortcode().
  ?>
</div>