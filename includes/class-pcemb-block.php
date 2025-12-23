<?php

/**
 * Pretty Calendar Embeds - Block Registration
 *
 * This file handles registering the Gutenberg block with WordPress.
 * It's the PHP counterpart to the JavaScript block registration.
 *
 * @package pretty-calendar-embeds
 */

// Prevent direct file access.
if (! defined('ABSPATH')) {
  exit;
}

/**
 * Register the Pretty Calendar block.
 *
 * This function registers our custom block with WordPress using
 * the block.json metadata file. WordPress reads block.json to understand:
 * - Block name and attributes
 * - Which scripts/styles to load
 * - Where to find the render callback (render.php)
 *
 * @return void
 */
function pcemb_register_block() {
  /**
   * register_block_type() registers a block type with WordPress.
   *
   * When you pass a directory path (not a block name), WordPress looks
   * for a block.json file in that directory. This is the recommended
   * approach as of WordPress 5.8+.
   *
   * The block.json file tells WordPress:
   * - "editorScript": Which JS file to load in the editor
   * - "editorStyle": Which CSS file to load in the editor
   * - "render": Which PHP file renders the block on the frontend
   *
   * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/
   */
  register_block_type(PCEMB_DIR . 'blocks/calendar/build');
}

/**
 * Hook block registration to the 'init' action.
 *
 * The 'init' action is the standard WordPress hook for registering
 * custom post types, taxonomies, and blocks. It fires after WordPress
 * has finished loading but before any headers are sent.
 *
 * Priority 10 (default) is fine here since we don't depend on other
 * plugins or need to run before/after anything specific.
 */
add_action('init', 'pcemb_register_block');
