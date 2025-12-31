/**
 * Hydrogen Calendar Embeds - Block Entry Point
 *
 * This is the main entry point for the block's JavaScript.
 * It registers the block with WordPress using the metadata from block.json.
 *
 * @package hydrogen-calendar-embeds
 */

/**
 * WordPress dependencies
 *
 * registerBlockType - Function to register a new block type with WordPress.
 */
import { registerBlockType } from "@wordpress/blocks";

/**
 * Internal dependencies
 *
 * block.json - Block metadata (name, attributes, etc.)
 * Edit - The editor component for the block
 * editor.css - Editor-specific styles (imported so webpack processes it)
 */
import metadata from "../block.json";
import Edit from "./edit";
import "./editor.css";

/**
 * Register the block.
 *
 * registerBlockType takes two arguments:
 * 1. Block metadata object (from block.json) - contains name, attributes, etc.
 * 2. Settings object - contains edit component, save function, etc.
 *
 * Since we use server-side rendering (render.php), the save function
 * returns null. WordPress will use the PHP render callback instead.
 */
registerBlockType(metadata.name, {
  /**
   * The edit function describes the structure of the block in the editor.
   * This is the component from edit.js that provides the sidebar controls
   * and editor preview.
   *
   * @see ./edit.js
   */
  edit: Edit,

  /**
   * The save function defines the way the block's attributes are saved.
   *
   * Since this block uses server-side rendering (the render.php file),
   * the save function returns null. This tells WordPress:
   * "Don't save any HTML, just save the attributes and let PHP render it."
   *
   * This is the recommended approach for dynamic blocks that need PHP
   * to generate their output (like calendar embeds that need server-side
   * script enqueuing).
   *
   * @return {null} Null because server-side rendering handles output.
   */
  save: function () {
    return null;
  },
});
