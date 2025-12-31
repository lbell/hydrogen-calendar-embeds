# Pretty Calendar Embeds - Developer Hooks Reference

This document describes all available hooks (actions and filters) for extending Pretty Calendar Embeds. Use these hooks to customize behavior, add features, or build add-on plugins.

**Version:** 1.1.0+

---

## Table of Contents

- [PHP Hooks](#php-hooks)
  - [Actions](#php-actions)
  - [Filters](#php-filters)
- [JavaScript Hooks](#javascript-hooks)
  - [Actions](#js-actions)
  - [Filters](#js-filters)
- [Examples](#examples)
  - [Adding Photos to Event Popups](#example-adding-photos-to-event-popups)
  - [Adding Custom "Add to Calendar" Options](#example-adding-custom-add-to-calendar-options)
  - [Creating a Complete Extension Plugin](#example-creating-a-complete-extension-plugin)

---

## PHP Hooks

### PHP Actions

#### `hycal_loaded`

Fires after Pretty Calendar Embeds has fully loaded. Use this to initialize your extension.

**Parameters:**

- `$version` (string) - The current plugin version.

**Example:**

```php
add_action( 'hycal_loaded', function( $version ) {
    // Initialize your extension
    if ( version_compare( $version, '1.0.0', '>=' ) ) {
        // Your extension code here
    }
});
```

---

#### `hycal_before_enqueue_scripts`

Fires before calendar scripts are enqueued. Use to enqueue your own dependencies.

**Parameters:**

- `$pcembSettings` (array) - The calendar settings array.

**Example:**

```php
add_action( 'hycal_before_enqueue_scripts', function( $settings ) {
    wp_enqueue_script( 'my-extension-js', plugin_dir_url( __FILE__ ) . 'js/extension.js' );
});
```

---

#### `hycal_enqueue_scripts`

Fires after core calendar scripts and styles are enqueued.

**Parameters:**

- `$pcembSettings` (array) - The calendar settings array.

**Example:**

```php
add_action( 'hycal_enqueue_scripts', function( $settings ) {
    wp_enqueue_style( 'my-extension-css', plugin_dir_url( __FILE__ ) . 'css/extension.css' );
});
```

---

#### `hycal_before_render`

Fires before the calendar HTML output is generated.

**Parameters:**

- `$pcembSettings` (array) - The calendar settings array.

---

#### `hycal_after_render`

Fires after the calendar HTML output is generated.

**Parameters:**

- `$shortcode_output` (string) - The HTML output.
- `$pcembSettings` (array) - The calendar settings array.

---

### PHP Filters

#### `hycal_shortcode_defaults`

Filter the default shortcode attributes. Add your own custom attributes here.

**Parameters:**

- `$defaults` (array) - The default shortcode attributes.

**Returns:** (array) Modified defaults.

**Example:**

```php
add_filter( 'hycal_shortcode_defaults', function( $defaults ) {
    $defaults['show_photos'] = 'false';
    $defaults['photo_size'] = 'thumbnail';
    return $defaults;
});
```

---

#### `hycal_shortcode_attributes`

Filter shortcode attributes after WordPress processing.

**Parameters:**

- `$args` (array) - The processed shortcode attributes.
- `$atts` (array) - The raw shortcode attributes from the user.
- `$defaults` (array) - The default attribute values.

**Returns:** (array) Modified attributes.

**Example:**

```php
add_filter( 'hycal_shortcode_attributes', function( $args, $atts, $defaults ) {
    // Force a specific locale for all calendars
    $args['locale'] = 'en';
    return $args;
}, 10, 3 );
```

---

#### `hycal_settings`

Filter the calendar settings before rendering. This is the final opportunity to modify settings before they're passed to JavaScript.

**Parameters:**

- `$pcembSettings` (array) - The calendar settings array.
- `$args` (array) - The processed shortcode attributes.

**Returns:** (array) Modified settings.

**Example:**

```php
add_filter( 'hycal_settings', function( $settings, $args ) {
    // Add custom data for JavaScript
    $settings['my_extension_data'] = array(
        'api_endpoint' => rest_url( 'my-extension/v1/photos' ),
    );
    return $settings;
}, 10, 2 );
```

---

#### `hycal_shortcode_output`

Filter the calendar HTML output.

**Parameters:**

- `$shortcode_output` (string) - The HTML output.
- `$pcembSettings` (array) - The calendar settings array.

**Returns:** (string) Modified HTML output.

**Example:**

```php
add_filter( 'hycal_shortcode_output', function( $output, $settings ) {
    // Add a custom wrapper
    return '<div class="my-calendar-wrapper">' . $output . '</div>';
}, 10, 2 );
```

---

#### `hycal_block_shortcode_args`

Filter block shortcode arguments before rendering.

**Parameters:**

- `$hycal_shortcode_args` (array) - The shortcode arguments.
- `$attributes` (array) - The raw block attributes.

**Returns:** (array) Modified shortcode arguments.

---

#### `hycal_blocked_url_patterns`

Filter the blocked URL patterns for SSRF protection.

⚠️ **Security Warning:** Be extremely careful when modifying this filter. Removing patterns can expose your server to SSRF attacks.

**Parameters:**

- `$patterns` (array) - Array of regex patterns to block.
- `$url` (string) - The URL being validated.

**Returns:** (array) Modified patterns array.

---

#### `hycal_validate_ics_url`

Custom validation for ICS URLs. Use to whitelist specific domains.

**Parameters:**

- `$valid` (bool|WP_Error) - Whether the URL is valid.
- `$url` (string) - The URL being validated.

**Returns:** (bool|WP_Error) True to allow, WP_Error to reject.

**Example:**

```php
add_filter( 'hycal_validate_ics_url', function( $valid, $url ) {
    // Only allow URLs from specific domains
    $allowed_domains = array( 'calendar.google.com', 'outlook.office365.com' );
    $host = wp_parse_url( $url, PHP_URL_HOST );

    foreach ( $allowed_domains as $domain ) {
        if ( str_ends_with( $host, $domain ) ) {
            return true;
        }
    }

    return new WP_Error( 'hycal_domain_not_allowed', 'This calendar domain is not allowed.' );
}, 10, 2 );
```

---

#### `hycal_ics_content`

Filter ICS content before caching and returning.

**Parameters:**

- `$ics_content` (string) - The raw ICS content.
- `$url` (string) - The source URL of the ICS feed.

**Returns:** (string) Modified ICS content.

---

## JavaScript Hooks

The JavaScript hooks system is available via the global `pcembHooks` object.

### JS Actions

#### `pcemb.beforeRender`

Fires before the calendar starts rendering.

**Parameters:**

- `pcembSettings` (object) - The calendar settings.

**Example:**

```javascript
pcembHooks.addAction("pcemb.beforeRender", function (settings) {
  console.log("Calendar about to render:", settings.instance_id);
});
```

---

#### `pcemb.afterRender`

Fires after the calendar has rendered. Use to access the FullCalendar instance.

**Parameters:**

- `calendar` (object) - The FullCalendar instance.
- `pcembSettings` (object) - The calendar settings.
- `calendarEl` (Element) - The calendar DOM element.

**Example:**

```javascript
pcembHooks.addAction("pcemb.afterRender", function (calendar, settings, el) {
  // Store reference for later use
  window.myCalendar = calendar;

  // Add custom event listeners
  el.addEventListener("click", function (e) {
    // Custom click handling
  });
});
```

---

#### `pcemb.eventDidMount`

Fires after each event element is added to the DOM.

**Parameters:**

- `info` (object) - FullCalendar event info object.
- `pcembSettings` (object) - The calendar settings.
- `currCal` (string) - The calendar container ID.

**Example:**

```javascript
pcembHooks.addAction("pcemb.eventDidMount", function (info, settings, calId) {
  // Add custom data attribute
  info.el.dataset.eventId = info.event.id;

  // Add custom class based on event properties
  if (info.event.extendedProps.priority === "high") {
    info.el.classList.add("high-priority-event");
  }
});
```

---

#### `pcemb.tooltipShow`

Fires when a tooltip is shown.

**Parameters:**

- `instance` (object) - The Tippy.js instance.
- `info` (object) - FullCalendar event info object.
- `pcembSettings` (object) - The calendar settings.

**Example:**

```javascript
pcembHooks.addAction("pcemb.tooltipShow", function (instance, info, settings) {
  // Track tooltip views
  console.log("Tooltip shown for event:", info.event.title);
});
```

---

#### `pcemb.tooltipHide`

Fires when a tooltip is hidden.

**Parameters:**

- `instance` (object) - The Tippy.js instance.
- `info` (object) - FullCalendar event info object.
- `pcembSettings` (object) - The calendar settings.

---

### JS Filters

#### `pcemb.settings`

Filter the calendar settings before processing.

**Parameters:**

- `pcembSettings` (object) - The calendar settings.

**Returns:** (object) Modified settings.

**Example:**

```javascript
pcembHooks.addFilter("pcemb.settings", function (settings) {
  // Modify settings
  settings.customOption = "value";
  return settings;
});
```

---

#### `pcemb.fullcalendarOptions`

Filter the FullCalendar options before initialization.

**Parameters:**

- `pcembArgs` (object) - The merged FullCalendar options.
- `pcembSettings` (object) - The calendar settings.
- `pcembDefaults` (object) - The default options.

**Returns:** (object) Modified FullCalendar options.

**Example:**

```javascript
pcembHooks.addFilter(
  "pcemb.fullcalendarOptions",
  function (options, settings, defaults) {
    // Add custom event rendering
    options.eventContent = function (arg) {
      return { html: "<b>" + arg.event.title + "</b>" };
    };
    return options;
  }
);
```

---

#### `pcemb.tooltipHeader`

Filter the tooltip header HTML (title, time, location).

**Parameters:**

- `headerHtml` (string) - The header HTML.
- `info` (object) - FullCalendar event info object.
- `pcembSettings` (object) - The calendar settings.

**Returns:** (string) Modified header HTML.

---

#### `pcemb.tooltipDescription`

Filter the tooltip description HTML.

**Parameters:**

- `descriptionHtml` (string) - The description HTML.
- `info` (object) - FullCalendar event info object.
- `pcembSettings` (object) - The calendar settings.

**Returns:** (string) Modified description HTML.

---

#### `pcemb.tooltipActions`

Filter the array of action buttons in the tooltip.

**Parameters:**

- `actions` (array) - Array of HTML strings for action buttons.
- `info` (object) - FullCalendar event info object.
- `pcembSettings` (object) - The calendar settings.

**Returns:** (array) Modified array of action HTML strings.

**Example:**

```javascript
pcembHooks.addFilter(
  "pcemb.tooltipActions",
  function (actions, info, settings) {
    // Add a custom button
    actions.push(
      '<a class="button" href="#" onclick="shareEvent(\'' +
        info.event.id +
        "')\">Share</a>"
    );
    return actions;
  }
);
```

---

#### `pcemb.tooltipContent`

Filter the complete tooltip content before rendering. This is the final filter for tooltip HTML.

**Parameters:**

- `toolContent` (string) - The complete tooltip HTML.
- `info` (object) - FullCalendar event info object.
- `pcembSettings` (object) - The calendar settings.

**Returns:** (string) Modified tooltip HTML.

**Example:**

```javascript
pcembHooks.addFilter(
  "pcemb.tooltipContent",
  function (content, info, settings) {
    // Add a photo section
    const photoUrl = info.event.extendedProps.photoUrl;
    if (photoUrl) {
      content = '<img src="' + photoUrl + '" class="event-photo" />' + content;
    }
    return content;
  }
);
```

---

#### `pcemb.tippyOptions`

Filter the Tippy.js options before creating the tooltip.

**Parameters:**

- `options` (object) - The Tippy.js options object.
- `info` (object) - FullCalendar event info object.
- `pcembSettings` (object) - The calendar settings.

**Returns:** (object) Modified Tippy.js options.

**Example:**

```javascript
pcembHooks.addFilter("pcemb.tippyOptions", function (options, info, settings) {
  // Change tooltip theme based on event type
  if (info.event.extendedProps.type === "holiday") {
    options.theme = "holiday";
  }
  return options;
});
```

---

## Examples

### Example: Adding Photos to Event Popups

This example shows how to add photos to event tooltips using the description field for a photo URL.

**PHP (enqueue extension script):**

```php
<?php
/**
 * Plugin Name: PCEMB Photo Extension
 * Description: Adds photos to Pretty Calendar Embeds event popups
 */

add_action( 'hycal_enqueue_scripts', function( $settings ) {
    wp_enqueue_script(
        'pcemb-photos',
        plugin_dir_url( __FILE__ ) . 'pcemb-photos.js',
        array( 'hycal_loader' ),
        '1.0.0',
        true
    );

    wp_enqueue_style(
        'pcemb-photos',
        plugin_dir_url( __FILE__ ) . 'pcemb-photos.css',
        array(),
        '1.0.0'
    );
});
```

**JavaScript (pcemb-photos.js):**

```javascript
// Add photo to tooltip content
pcembHooks.addFilter(
  "pcemb.tooltipContent",
  function (content, info, settings) {
    // Look for image URL in description (format: [photo:URL])
    const desc = info.event.extendedProps.description || "";
    const photoMatch = desc.match(/\[photo:(https?:\/\/[^\]]+)\]/);

    if (photoMatch) {
      const photoUrl = photoMatch[1];
      const photoHtml =
        '<div class="pcemb-event-photo"><img src="' +
        photoUrl +
        '" alt="Event photo" /></div>';

      // Insert photo after the header
      content = content.replace("</h2>", "</h2>" + photoHtml);
    }

    return content;
  },
  10
);
```

**CSS (pcemb-photos.css):**

```css
.pcemb-event-photo {
  margin: 10px 0;
}
.pcemb-event-photo img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}
```

---

### Example: Adding Custom "Add to Calendar" Options

This example adds Apple Calendar and Outlook download options.

```javascript
pcembHooks.addFilter(
  "pcemb.tooltipActions",
  function (actions, info, settings) {
    const event = info.event;

    // Create Apple Calendar link (uses same ICS format)
    const appleCalHtml =
      '<a class="button pcemb-apple-cal" href="' +
      createICSDataUrl(event) +
      '" download="' +
      event.title +
      '.ics">Apple Calendar</a>';

    // Create Outlook Web link
    const outlookUrl =
      "https://outlook.office.com/calendar/0/deeplink/compose?" +
      "subject=" +
      encodeURIComponent(event.title) +
      "&startdt=" +
      event.startStr +
      "&enddt=" +
      (event.endStr || event.startStr);

    const outlookHtml =
      '<a class="button pcemb-outlook" href="' +
      outlookUrl +
      '" target="_blank">Outlook</a>';

    // Add to existing actions
    actions.push(appleCalHtml);
    actions.push(outlookHtml);

    return actions;
  }
);

function createICSDataUrl(event) {
  // Similar to hycal_downloadEventICS but returns data URL
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDate(event.startStr)}
DTEND:${formatDate(event.endStr || event.startStr)}
SUMMARY:${event.title}
END:VEVENT
END:VCALENDAR`;

  return "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
}
```

---

### Example: Creating a Complete Extension Plugin

Here's a skeleton for a complete extension plugin:

```php
<?php
/**
 * Plugin Name: My PCEMB Extension
 * Description: Extends Pretty Calendar Embeds with custom features
 * Version: 1.0.0
 * Requires Plugins: hydrogen-calendar-embeds
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class My_HYCAL_Extension {

    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Wait for PCEMB to load
        add_action( 'hycal_loaded', array( $this, 'init' ) );
    }

    public function init( $version ) {
        // Check minimum version
        if ( version_compare( $version, '1.0.0', '<' ) ) {
            add_action( 'admin_notices', array( $this, 'version_notice' ) );
            return;
        }

        // Register hooks
        add_filter( 'hycal_shortcode_defaults', array( $this, 'add_defaults' ) );
        add_filter( 'hycal_settings', array( $this, 'add_settings' ), 10, 2 );
        add_action( 'hycal_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
    }

    public function version_notice() {
        echo '<div class="notice notice-error"><p>';
        echo esc_html__( 'My PCEMB Extension requires Pretty Calendar Embeds 1.0.0 or higher.', 'my-pcemb-ext' );
        echo '</p></div>';
    }

    public function add_defaults( $defaults ) {
        $defaults['my_custom_option'] = 'default_value';
        return $defaults;
    }

    public function add_settings( $settings, $args ) {
        $settings['my_extension'] = array(
            'enabled' => true,
            'option'  => $settings['my_custom_option'] ?? 'default_value',
        );
        return $settings;
    }

    public function enqueue_scripts( $settings ) {
        wp_enqueue_script(
            'my-pcemb-ext',
            plugin_dir_url( __FILE__ ) . 'assets/js/extension.js',
            array( 'hycal_helpers', 'hycal_loader' ),
            '1.0.0',
            true
        );
    }
}

// Initialize
My_HYCAL_Extension::get_instance();
```

**JavaScript (assets/js/extension.js):**

```javascript
(function () {
  "use strict";

  // Check if hooks system is available
  if (typeof pcembHooks === "undefined") {
    console.error("PCEMB hooks system not available");
    return;
  }

  // Your extension code
  pcembHooks.addAction("pcemb.afterRender", function (calendar, settings, el) {
    if (settings.my_extension && settings.my_extension.enabled) {
      // Extension functionality here
      console.log("My extension is active!");
    }
  });
})();
```

---

## Hook Priority

Both PHP and JavaScript hooks support priority (default: 10). Lower numbers run first.

**PHP:**

```php
add_filter( 'hycal_settings', 'my_function', 5 ); // Runs early
add_filter( 'hycal_settings', 'my_other_function', 20 ); // Runs late
```

**JavaScript:**

```javascript
pcembHooks.addFilter("pcemb.settings", myFunction, 5); // Runs early
pcembHooks.addFilter("pcemb.settings", myOtherFunction, 20); // Runs late
```

---

## Removing Hooks

**PHP:**

```php
remove_filter( 'hycal_settings', 'function_to_remove' );
remove_action( 'hycal_after_render', 'function_to_remove' );
```

**JavaScript:**

```javascript
pcembHooks.removeFilter("pcemb.settings", functionToRemove);
pcembHooks.removeAction("pcemb.afterRender", functionToRemove);
```

---

## Questions or Issues?

- GitHub: https://github.com/lbell/hydrogen-calendar-embeds
- Submit issues for bugs or feature requests
