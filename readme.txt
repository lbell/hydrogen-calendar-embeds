== Pretty Calendar Embeds ==

Contributors: LBell
Donate link: https://github.com/sponsors/lbell
Tags: calendar, ics, embed, google-calendar, events
Requires at least: 5.8
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Embedded calendars that don't suck.

== Description ==

Dead simple, extremely light-weight, FREE way to embed **ANY** iCal (.ics) formatted calendar into your WordPress site.

Just pop in the address, and BAM! You now have a pretty calendar. Want to combine two calendars in one? No problem. Need two calendars on one page? Easy peasy. Prefer a different color? Go nuts. We got you.

**Highlights:**

- Manage events using any external calendar of your choice
- Works with any public ICS/iCal feed:
  - Google Calendar
  - iCloud
  - Outlook
  - Airbnb
  - Pretty much anything that can output an ICS feed
- Combine multiple ICS feeds into one calendar
- Embed multiple calendars on one page
- Lots of view options (Grid, Month List, Day List, Year List)
- Locale support
- Hide past events
- Lightweight and fast
- Responsive design
- Easy setup using WordPress Block or Shortcodes
- **NO API KEYS REQUIRED**

== Installation ==

1. Upload the `hydrogen-calendar-embeds` folder to the `/wp-content/plugins/` directory.
2. Activate `Pretty Calendar Embeds` through the 'Plugins' menu in WordPress dashboard.
3. Add the Pretty Calendar Embeds block to your page or post, or use the shortcode directly.

= Shortcode Options =

Shortcode format is:

`[pretty_calendar_embeds ics="ICS_URL, ICS_URL, ..." other_option="value" ... ]`

Where the options are:

`ics="https://example.com/calendar.ics"`
Public ICS/iCal feed URL(s). Works with any standard ICS feed: Google Calendar, iCloud, Outlook, Nextcloud, Teamup, corporate Exchange servers, and more. Multiple ICS feeds can be comma-separated. The plugin fetches the ICS data server-side to avoid CORS issues.

Examples:
- Google Calendar: `[pretty_calendar_embeds ics="https://calendar.google.com/calendar/ical/YOUR_ID/public/basic.ics"]`
- iCloud: `[pretty_calendar_embeds ics="https://p123-caldav.icloud.com/published/2/YOUR_ID"]`
- Outlook: `[pretty_calendar_embeds ics="https://outlook.live.com/owa/calendar/YOUR_ID/calendar.ics"]`
- Any ICS: `[pretty_calendar_embeds ics="https://example.com/events.ics"]`

`cal_ids="identifier,identifier"`
Optional custom CSS identifiers for each calendar. Allows using meaningful names instead of numeric indexes for styling. Example: `cal_ids="soccer,baseball"` generates classes like `.pcemb-calendar-soccer` and `.pcemb-calendar-baseball`. Identifiers should be lowercase alphanumeric with hyphens.
Defaults to numeric indexes (0, 1, 2, etc.)

`locale="en"`
Sets the locale for calendar. Defaults to "en".

`views="dayGridMonth, listMonth"`
Sets the view types available. If only one view is provided, no view switch buttons will be shown. Defaults to "dayGridMonth, listMonth".

Available views: `dayGridMonth` (monthly grid), `listDay`, `listWeek`, `listMonth`, `listYear` (list views), and `listCustom` (custom duration list).

Tip: `listCustom` allows you to set the number of days you want to display from the current date. Whereas listMonth shows all events from this month (including past events), using `views="dayGridMonth, listCustom" custom_days="28"` will show the next 28 days across months.

`custom_days="28"`
Sets the number of days to show when using `listCustom` view. Defaults to "28".

`custom_list_button="list"`
Sets the button label for the `listCustom` view. Defaults to "list".

`initial_view="dayGridMonth"`
Sets the default view to be displayed when opening the page. Defaults to "dayGridMonth". Note: If only one view is specified in "views", "initial_view" will automatically be set to that view and does not need to be specified.

`enforce_listview_on_mobile="true"`
Sets the change to the list view behavior on small screens. Options: "true" and "false". Defaults to "true". This option has no effect if there is no list view declared in the "views" option.

`mobile_breakpoint="768"`
Sets the screen width (in pixels) at which the calendar switches to list view on mobile. Defaults to "768". Only used when `enforce_listview_on_mobile` is enabled.

`show_today_button="true"`
Sets the visibility of the "Today" button. Options: "true" and "false". Defaults to "true".

`show_title="true"`
Sets the visibility of the calendar title. Options: "true" and "false". Defaults to "true".

`hide_past="false"`
Hides past events from the calendar completely. Options: `true` and `false`. Defaults to `false`. When set to `true`, events before today will not be displayed in any view.

`instance_id=random`
Sets the ID hash for a calendar. If you have multiple calendars on a page and need to style them, you can set this to a permanent code. Otherwise, it'll randomly generate each load. (Note: this can only be alphanumeric.)

`use_tooltip="true"`
Migrating from global setting for individual calendar styling. Whether the floating tooltip for event pops up on click.

`no_link="true"`
Migrating from global setting for individual calendar styling. Whether to disable link to calendar.google.com on click.

`fc_args` = JSON string ((EXPERIMENTAL))
Allows you to override or implement just about any FullCalendar argument (with some exception). For example: `fc_args='{"weekNumbers":"true", "eventTextColor":"red"}'`

**Workaround for square brackets:** WordPress shortcode parsing breaks with square brackets `[]`. To use square brackets in your JSON, use URL-encoded brackets:
- `[` becomes `%5B`
- `]` becomes `%5D`

Example: `fc_args='{"eventSources":%5B"url"%5D}'` will be converted to `{"eventSources":["url"]}`

Note: this is experimental - things may break.

== Contributing ==

Contributions are welcome! Please feel free to submit a Pull Request to the [GitHub repository](https://github.com/lbell/hydrogen-calendar-embeds).

== Support ==

For support, feature requests, or bug reports, please visit the [GitHub repository](https://github.com/lbell/hydrogen-calendar-embeds).

You can also sponsor development at [GitHub Sponsors](https://github.com/sponsors/lbell).

== Frequently Asked Questions ==

= What sorcery is this?! =

Pretty Calendar Embeds implements the excellent [Full Calendar](https://fullcalendar.io/) for you, and tosses in a little [Tippy.js](https://atomiks.github.io/tippyjs/) and [Popper](https://popper.js.org/) to make things... well... pop.

= Can I use this to manage a calendar? =

No. All calendar events are maintained via your calendar source (Google Calendar, iCloud, Outlook, Airbnb, Clickup, etc.). This plugin just displays them beautifully.

= How do I style multiple calendars? =

Each calendar gets its own CSS selector: `pcemb-event-#` where the # is the order of the listed calendar (starting with 0). So if you have two calendars in one, you can use `pcemb-event-0` to style the first, and `pcemb-event-1` to style the second calendar.

If you use the `cal_ids` argument to set custom identifiers, those will be used instead of numeric indexes.

For example, if you set `cal_ids="soccer,baseball"`, you can use `.pcemb-calendar-soccer-event` and `.pcemb-calendar-baseball-event` to style each calendar's events specifically.

Event pop-up tooltips also have calendar-specific classes: `pcemb-calendar-0-event-popup` for easier styling of event pop-ups per calendar.

= How do I theme the calendar? =

Add custom CSS to your theme to tweak to your desire.

= Can this plugin do X, Y or Z? =

Probably!

With the `fc_args` parameter, you can pass in any FullCalendar argument to customize your calendar. See the FullCalendar documentation for a full list of options: https://fullcalendar.io/docs

Contact me for requests for additional functionality, and let's see what we can create together!

== Screenshots ==

1. Pretty Calendar Embeds
2. List View
3. Optional Event Popover
4. Block Editor - It's that simple

== Changelog ==
= 1.0.0 =
* Initial release.

= 0.0.0 =
* This plugin is an improved fork of the Pretty Google Calendar, which has been battle-tested for years. All Google Calendar API nonsense has been removed, and replaced with ICS feed fetching/parsing, making this plugin much more versatile!