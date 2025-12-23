/**
 * Pretty Calendar Embeds - Helper Functions
 *
 * Utility functions for calendar rendering including view resolution,
 * ICS URL parsing, event source building, and tooltip content helpers.
 *
 * @package pretty-calendar-embeds
 * @since 1.0.0
 */

/**
 * Splits comma separated list of ICS feeds into array and builds eventSources
 * object via server-side proxy for CORS handling.
 *
 * @param {array} settings Settings received from shortcode parameters
 * @returns object with eventSources array and identifiers array
 */
function pcemb_resolve_cals(settings) {
  let calArgs = [];
  let identifiers = [];

  // Parse custom calendar identifiers if provided
  let customIds = [];
  if (settings["cal_ids"]) {
    customIds = settings["cal_ids"]
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  }

  let calIndex = 0;

  // Handle ICS feeds (using REST API proxy)
  if (settings["ics"] && settings["rest_url"]) {
    // Split ICS URLs - be careful with URLs that might contain encoded commas (%2C)
    const icsCals = pcemb_split_ics_urls(settings["ics"]);

    for (var j = 0; j < icsCals.length; j++) {
      const identifier = customIds[calIndex] || calIndex;
      identifiers.push(identifier);

      // Build proxy URL - FullCalendar's iCalendar plugin will fetch from our proxy
      const proxyUrl = `${settings["rest_url"]}?url=${encodeURIComponent(
        icsCals[j]
      )}`;

      // Use FullCalendar's native iCalendar format
      calArgs.push({
        url: proxyUrl,
        format: "ics",
        className: `pcemb-event-${identifier} pcemb-calendar-${identifier}-event pcemb-ics-event`,
      });
      calIndex++;
    }
  }

  return { eventSources: calArgs, identifiers: identifiers };
}

/**
 * Splits ICS URLs intelligently, handling URLs that might contain encoded commas.
 * Splits on ", http" or ",http" patterns to avoid breaking URLs with %2C in them.
 *
 * @param {string} icsString The comma-separated ICS URL string
 * @returns {array} Array of ICS URLs
 */
function pcemb_split_ics_urls(icsString) {
  if (!icsString) return [];

  // If there's only one URL (no comma followed by http), return it as-is
  if (!/,\s*https?:\/\//.test(icsString)) {
    return [icsString.trim()].filter((url) => url.length > 0);
  }

  // Split on comma followed by http(s), keeping the http part
  return icsString
    .split(/,\s*(?=https?:\/\/)/)
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
}

/**
 * Computes all variables related to views
 *
 * @param {array} settings Settings received from the shortcode parameters
 * @returns object
 */
const pcemb_resolve_views = (settings) => {
  const wantsToEnforceListviewOnMobile = pcemb_is_truthy(
    settings["enforce_listview_on_mobile"]
  );

  let initialView = settings["initial_view"];

  const viewsArray = pcemb_csv_to_array(settings["views"]);
  // Find the first list view in the user's configured views
  const listView = pcemb_get_item_by_fuzzy_value(viewsArray, "list");

  const mobileBreakpoint = settings["mobile_breakpoint"] || 768;

  if (
    pcemb_is_mobile(mobileBreakpoint) &&
    wantsToEnforceListviewOnMobile &&
    listView
  ) {
    initialView = listView;
  }

  const views = {
    all: viewsArray,
    length: viewsArray.length,
    hasList: !!listView,
    listView,
    initial: initialView,
    wantsToEnforceListviewOnMobile,
    mobileBreakpoint,
  };

  return views;
};

/**
 * Tests if the given array has the value in any part of each item
 *
 * @param {string} csv Array to be tested
 * @returns array
 */
const pcemb_csv_to_array = (csv) => csv.split(",").map((view) => view.trim());

/**
 * Tests if the given array has the value in any part of each item
 *
 * @param {array} array Array to be tested
 * @param {string} value String to be checked
 * @returns boolean
 */
const pcemb_get_item_by_fuzzy_value = (array, value) => {
  if (!value) return undefined;
  return array.find((item) => item.toLowerCase().includes(value.toLowerCase()));
};

/**
 * Tests if a value is truthy
 *
 * @param {string} value String to be tested
 * @returns boolean
 */
function pcemb_is_truthy(value) {
  const lowercaseValue =
    typeof value === "string" ? value.toLowerCase() : value;
  return ["true", "1", true, 1].includes(lowercaseValue);
}

/**
 * Tests whether the window size is equal to or less than 768... an arbitrary
 * standard for what is mobile...
 *
 * @returns boolean
 */
function pcemb_is_mobile(width = 768) {
  return window.innerWidth <= parseInt(width, 10);
}

/**
 * Escape a string for safe use in HTML attributes.
 * Prevents XSS attacks from malicious content in ICS feeds.
 *
 * @param {string} str String to escape
 * @returns {string} Escaped string safe for HTML attributes
 */
function pcemb_escapeAttr(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/**
 * Detect URLs and encase them in <a>. Ignores existing <a> tags.
 * URLs are properly escaped to prevent XSS attacks.
 *
 * @param {*} text
 * @returns
 */
function pcemb_urlify(text) {
  const urlRegex = /<a[\s>].*?<\/a>|https?:\/\/[^\s]+[?!.]*\/?\b/g;
  if (text) {
    return text.replace(urlRegex, function (m) {
      if (m.startsWith("<a")) {
        // If it's an existing <a> tag, return it as is
        return m;
      } else {
        // Extract the URL part from the matched string
        const urlMatch = m.match(/https?:\/\/[^\s]+[?!.]*\/?\b/);

        if (urlMatch) {
          const url = urlMatch[0];
          const punctuation = url.match(/[?!.]*$/);

          if (punctuation) {
            const cleanedURL = url.replace(/[?!.]*$/, "");
            const safeURL = pcemb_escapeAttr(cleanedURL);
            const safeLinkText = pcemb_escapeAttr(cleanedURL);
            return (
              '<a target="_blank" rel="noopener noreferrer" href="' +
              safeURL +
              '">' +
              safeLinkText +
              "</a>" +
              punctuation[0]
            );
          } else {
            // If no punctuation found, treat the whole URL as the link text
            const safeURL = pcemb_escapeAttr(url);
            return (
              '<a target="_blank" rel="noopener noreferrer" href="' +
              safeURL +
              '">' +
              safeURL +
              "</a>"
            );
          }
        }
        // If no URL found, return the original match
        return m;
      }
    });
  }
  return "";
}

/**
 * Find breaks, and add <br />
 *
 * @param {string} text
 * @returns
 */
function pcemb_breakify(text) {
  if (text) {
    return text.replace(/(?:\r\n|\r|\n)/g, "<br />");
  }
  return "";
}

/**
 * Create map button
 *
 * @param {string} text Text of map link
 * @returns Formatted map button
 */
function pcemb_mapify(text) {
  const buttonLabel = wp.i18n.__("Map", "pretty-calendar-embeds");
  let footer = "";
  if (text) {
    footer += `<br /><a class="button pcemb-map-button" target="_blank" href="https://www.google.com/maps/search/?api=1&query=${encodeURI(
      text
    )}">${buttonLabel}</a>`;
  }
  return footer;
}

/**
 * Converts url to a formatted <a href=... link
 *
 * @param {string} url
 * @returns formatted HTML url
 */
function pcemb_addToGoogle(url) {
  const buttonLabel = wp.i18n.__("Add to Google", "pretty-calendar-embeds");
  if (url) {
    return `<a class="button pcemb-add-to-google-button" href="${url}" target="_blank">${buttonLabel}</a>`;
  }
}

/**
 * Create "Open Event" button for events with a URL.
 * Works with ICS events that have a URL property.
 *
 * @param {object} event FullCalendar event object
 * @returns {string} HTML with open event link, or empty string if no URL
 */
function pcemb_openEventLink(event) {
  // Check for URL in event properties
  // ICS events may have URL in extendedProps or as event.url
  const eventUrl = event.extendedProps?.url || event.url;

  // Skip Google Calendar URLs (those are handled by Add to Google button)
  if (!eventUrl || eventUrl.includes("calendar.google.com")) {
    return "";
  }

  const buttonLabel = wp.i18n.__("Open Event", "pretty-calendar-embeds");
  const safeUrl = pcemb_escapeAttr(eventUrl);
  return `<a class="button pcemb-open-event-button" href="${safeUrl}" target="_blank" rel="noopener noreferrer">${buttonLabel}</a>`;
}

/**
 * Create .ics download link for event
 *
 * @param {object} event FullCalendar event object
 * @returns {string} HTML with download link
 */
function pcemb_downloadEventICS(event) {
  // Sanitize text for iCalendar format
  const sanitize = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  };

  // Format dates for iCalendar
  const formatICSDate = (dateStr, allDay) => {
    const date = new Date(dateStr);
    if (allDay) {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      return `${year}${month}${day}`;
    } else {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      const seconds = String(date.getUTCSeconds()).padStart(2, "0");
      return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    }
  };

  const startDate = formatICSDate(event.startStr, event.allDay);
  const endDate = event.endStr
    ? formatICSDate(event.endStr, event.allDay)
    : startDate;
  const uid = `${event.id || "event"}@pretty-calendar-embeds`;

  let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Pretty Calendar Embeds//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nBEGIN:VEVENT\nUID:${uid}\nDTSTAMP:${formatICSDate(
    new Date().toISOString(),
    false
  )}\nDTSTART${event.allDay ? ";VALUE=DATE" : ""}:${startDate}\nDTEND${
    event.allDay ? ";VALUE=DATE" : ""
  }:${endDate}\nSUMMARY:${sanitize(event.title)}`;

  if (event.extendedProps && event.extendedProps.location) {
    ics += `\nLOCATION:${sanitize(event.extendedProps.location)}`;
  }

  if (event.extendedProps && event.extendedProps.description) {
    ics += `\nDESCRIPTION:${sanitize(event.extendedProps.description)}`;
  }

  ics += `\nEND:VEVENT\nEND:VCALENDAR`;

  const encodedICS = encodeURIComponent(ics);
  const filename = `${event.title || "event"}.ics`;
  const downloadLink = `data:text/calendar;charset=utf-8,${encodedICS}`;

  const label = wp.i18n.__("Download (.ics)", "pretty-calendar-embeds");
  return `<a class="button pcemb-download-ics-button" href="${downloadLink}" download="${filename}">${label}</a>`;
}

/**
 * Merge arrays overriding arguments
 *
 */
function pcemb_argmerge(defaults, override) {
  // override = Array.isArray(atts) ? override : Object.assign({}, override);
  const out = {};

  for (const [name, defaultVal] of Object.entries(defaults)) {
    if (override.hasOwnProperty(name)) {
      out[name] = override[name];
    } else {
      out[name] = defaultVal;
    }
  }

  for (const name in override) {
    if (!out.hasOwnProperty(name)) {
      out[name] = override[name];
    }
  }

  return out;
}
