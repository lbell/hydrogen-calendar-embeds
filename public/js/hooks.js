/**
 * Hydrogen Calendar Embeds - Hooks System
 *
 * A lightweight WordPress-style hooks system for JavaScript.
 * Allows extensions to modify behavior via filters and actions.
 *
 * @since 1.0.0
 *
 * Usage:
 *   // Add a filter
 *   hycalHooks.addFilter('hycal.tooltipContent', function(content, event) {
 *     return content + '<p>Custom content</p>';
 *   });
 *
 *   // Add an action
 *   hycalHooks.addAction('hycal.afterRender', function(calendar, settings) {
 *     console.log('Calendar rendered!');
 *   });
 */
const hycalHooks = (function () {
  // Storage for registered hooks
  const filters = {};
  const actions = {};

  /**
   * Add a filter callback.
   *
   * Filters modify and return a value. Multiple callbacks can be added
   * to the same filter name; they run in order of priority.
   *
   * @param {string}   name     The filter name.
   * @param {function} callback The callback function.
   * @param {number}   priority Priority (default 10, lower runs first).
   */
  function addFilter(name, callback, priority = 10) {
    if (!filters[name]) {
      filters[name] = [];
    }
    filters[name].push({ callback, priority });
    filters[name].sort((a, b) => a.priority - b.priority);
  }

  /**
   * Apply filters to a value.
   *
   * Runs all registered filter callbacks for the given name,
   * passing the value through each one.
   *
   * @param {string} name  The filter name.
   * @param {*}      value The value to filter.
   * @param {...*}   args  Additional arguments passed to callbacks.
   * @returns {*} The filtered value.
   */
  function applyFilters(name, value, ...args) {
    if (!filters[name]) {
      return value;
    }
    return filters[name].reduce((val, hook) => {
      return hook.callback(val, ...args);
    }, value);
  }

  /**
   * Add an action callback.
   *
   * Actions perform side effects and don't return a value.
   * Multiple callbacks can be added to the same action name.
   *
   * @param {string}   name     The action name.
   * @param {function} callback The callback function.
   * @param {number}   priority Priority (default 10, lower runs first).
   */
  function addAction(name, callback, priority = 10) {
    if (!actions[name]) {
      actions[name] = [];
    }
    actions[name].push({ callback, priority });
    actions[name].sort((a, b) => a.priority - b.priority);
  }

  /**
   * Execute all callbacks for an action.
   *
   * @param {string} name The action name.
   * @param {...*}   args Arguments passed to callbacks.
   */
  function doAction(name, ...args) {
    if (!actions[name]) {
      return;
    }
    actions[name].forEach((hook) => {
      hook.callback(...args);
    });
  }

  /**
   * Remove a filter callback.
   *
   * @param {string}   name     The filter name.
   * @param {function} callback The callback to remove.
   */
  function removeFilter(name, callback) {
    if (!filters[name]) {
      return;
    }
    filters[name] = filters[name].filter((hook) => hook.callback !== callback);
  }

  /**
   * Remove an action callback.
   *
   * @param {string}   name     The action name.
   * @param {function} callback The callback to remove.
   */
  function removeAction(name, callback) {
    if (!actions[name]) {
      return;
    }
    actions[name] = actions[name].filter((hook) => hook.callback !== callback);
  }

  /**
   * Check if a filter has any callbacks registered.
   *
   * @param {string} name The filter name.
   * @returns {boolean} True if callbacks exist.
   */
  function hasFilter(name) {
    return filters[name] && filters[name].length > 0;
  }

  /**
   * Check if an action has any callbacks registered.
   *
   * @param {string} name The action name.
   * @returns {boolean} True if callbacks exist.
   */
  function hasAction(name) {
    return actions[name] && actions[name].length > 0;
  }

  // Public API
  return {
    addFilter,
    applyFilters,
    addAction,
    doAction,
    removeFilter,
    removeAction,
    hasFilter,
    hasAction,
  };
})();

// Make hooks available globally for extensions
window.hycalHooks = hycalHooks;
