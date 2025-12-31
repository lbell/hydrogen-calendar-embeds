/**
 * Pretty Calendar Embeds - Tooltip Renderer
 *
 * Renders event tooltips using Tippy.js. Handles event details display
 * including time, location, description, and action buttons.
 *
 * @package hydrogen-calendar-embeds
 * @since 1.0.0
 */

function hycal_tippyRender(info, currCal, hycalSettings) {
  // console.log(info.event); // DEBUG
  // console.table(info.event.extendedProps); // DEBUG
  // console.log(info.el.classList); // DEBUG

  // Extract calendar index from event element for styling
  let popupClass = "";
  for (let className of info.el.classList) {
    if (className.startsWith("hycal-event-")) {
      const calendarIndex = className.replace("hycal-event-", "");
      popupClass = `hycal-calendar-${calendarIndex}-popup`;
      break;
    }
  }

  const startTime = info.event.allDay
    ? "All Day"
    : new Date(info.event.startStr).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });

  // Check if displayEventEnd is disabled via fc_args
  let displayEventEnd = true;
  if (hycalSettings && hycalSettings["fc_args"]) {
    try {
      const fcArgs = JSON.parse(hycalSettings["fc_args"]);
      if (fcArgs.hasOwnProperty("displayEventEnd")) {
        displayEventEnd = fcArgs.displayEventEnd;
      }
    } catch (e) {
      // Invalid JSON, use default
    }
  }

  const endTime =
    !displayEventEnd || info.event.allDay
      ? ""
      : " - " +
        new Date(info.event.endStr).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });

  const location = info.event.extendedProps.location || "";

  const locString = location
    ? `<p class="hycal-event-location"><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location
      )}" target="_blank" rel="noopener noreferrer" class="hycal-event-location-link"><svg class="hycal-location-icon" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg><span>${location}</span></a></p>`
    : "";

  // Handle free/busy calendars with undefined titles
  // Google Calendar API returns the string "undefined" for free/busy events
  const eventTitle =
    !info.event.title || info.event.title === "undefined"
      ? wp.i18n.__("Busy", "hydrogen-calendar-embeds")
      : info.event.title;

  /**
   * Filter: hycal.tooltipHeader
   *
   * Filter the tooltip header HTML (close button, title, time, location).
   *
   * @since 1.0.0
   *
   * @param {string} headerHtml    The header HTML.
   * @param {object} info          FullCalendar event info object.
   * @param {object} hycalSettings The calendar settings.
   * @returns {string} Modified header HTML.
   */
  let headerHtml = hycalHooks.applyFilters(
    "hycal.tooltipHeader",
    `
    <button class="hycal-tooltip-close" aria-label="Close" type="button" style="position: absolute; top: 8px; right: 8px; background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; line-height: 1; color: inherit; opacity: 0.7;">
      <span aria-hidden="true">&times;</span>
    </button>
    <h2 class="hycal-event-title">${eventTitle} </h2>
    <p class="hycal-event-time"><span class="hycal-event-start-time">${startTime}</span><span class="hycal-event-end-time">${endTime}</span></p>
    ${locString}`,
    info,
    hycalSettings
  );

  let toolContent = headerHtml;

  const description = hycal_breakify(
    hycal_urlify(info.event.extendedProps.description)
  );

  /**
   * Filter: hycal.tooltipDescription
   *
   * Filter the tooltip description HTML.
   *
   * @since 1.0.0
   *
   * @param {string} descriptionHtml The description HTML.
   * @param {object} info            FullCalendar event info object.
   * @param {object} hycalSettings   The calendar settings.
   * @returns {string} Modified description HTML.
   */
  const descriptionHtml = hycalHooks.applyFilters(
    "hycal.tooltipDescription",
    description
      ? `<div class="hycal-event-description">${description}</div>`
      : "",
    info,
    hycalSettings
  );

  toolContent += descriptionHtml;

  const mapHtml = location ? hycal_mapify(location) : "";
  const addToGoogleHtml = info.event.url
    ? hycal_addToGoogle(info.event.url)
    : "";
  const openEventHtml = hycal_openEventLink(info.event);
  const downloadICSHtml = hycal_downloadEventICS(info.event);

  /**
   * Filter: hycal.tooltipActions
   *
   * Filter the array of action buttons in the tooltip.
   * Add, remove, or modify action buttons (Map, Add to Google, Open Event, Download ICS).
   *
   * @since 1.0.0
   *
   * @param {array}  actions        Array of HTML strings for action buttons.
   * @param {object} info           FullCalendar event info object.
   * @param {object} hycalSettings  The calendar settings.
   * @returns {array} Modified array of action HTML strings.
   */
  let actions = hycalHooks.applyFilters(
    "hycal.tooltipActions",
    [mapHtml, addToGoogleHtml, openEventHtml, downloadICSHtml],
    info,
    hycalSettings
  );

  const actionsHtml = actions.filter(Boolean).join(" ");

  if (actionsHtml) {
    toolContent += `<div class="toolloc hycal-event-actions">${actionsHtml}</div>`;
  }

  /**
   * Filter: hycal.tooltipContent
   *
   * Filter the complete tooltip content before rendering.
   * This is the final filter for tooltip HTML.
   *
   * @since 1.0.0
   *
   * @param {string} toolContent    The complete tooltip HTML.
   * @param {object} info           FullCalendar event info object.
   * @param {object} hycalSettings  The calendar settings.
   * @returns {string} Modified tooltip HTML.
   */
  toolContent = hycalHooks.applyFilters(
    "hycal.tooltipContent",
    toolContent,
    info,
    hycalSettings
  );

  /**
   * Filter: hycal.tippyOptions
   *
   * Filter the Tippy.js options before creating the tooltip.
   * Use this to customize tooltip behavior (placement, theme, etc.).
   *
   * @since 1.0.0
   *
   * @param {object} options        The Tippy.js options object.
   * @param {object} info           FullCalendar event info object.
   * @param {object} hycalSettings  The calendar settings.
   * @returns {object} Modified Tippy.js options.
   */
  const tippyOptions = hycalHooks.applyFilters(
    "hycal.tippyOptions",
    {
      trigger: "click",
      content: toolContent,
      theme: "light",
      allowHTML: true,
      placement: hycal_is_mobile() ? "bottom" : "auto",
      popperOptions: hycal_is_mobile()
        ? {
            modifiers: [
              {
                name: "flip",
                enabled: false,
                options: {},
              },
            ],
          }
        : "",
      interactive: "true",
      appendTo: document.getElementById(currCal),
      maxWidth: 600,
      boundary: "window",
      onShow(instance) {
        // Add popup class to tooltip for styling
        if (popupClass) {
          instance.popper.classList.add(popupClass);
        }
        // Attach close button handler when tooltip is shown
        const closeBtn = instance.popper.querySelector(".hycal-tooltip-close");
        if (closeBtn) {
          const handleCloseClick = (e) => {
            e.stopPropagation();
            instance.hide();
          };
          closeBtn.addEventListener("click", handleCloseClick);
          closeBtn._hycalCloseHandler = handleCloseClick;
        }

        /**
         * Action: hycal.tooltipShow
         *
         * Fires when a tooltip is shown.
         *
         * @since 1.0.0
         *
         * @param {object} instance       The Tippy.js instance.
         * @param {object} info           FullCalendar event info object.
         * @param {object} hycalSettings  The calendar settings.
         */
        hycalHooks.doAction("hycal.tooltipShow", instance, info, hycalSettings);
      },
      onHide(instance) {
        // Remove close button handler when tooltip is hidden
        const closeBtn = instance.popper.querySelector(".hycal-tooltip-close");
        if (closeBtn && closeBtn._hycalCloseHandler) {
          closeBtn.removeEventListener("click", closeBtn._hycalCloseHandler);
          delete closeBtn._hycalCloseHandler;
        }

        /**
         * Action: hycal.tooltipHide
         *
         * Fires when a tooltip is hidden.
         *
         * @since 1.0.0
         *
         * @param {object} instance       The Tippy.js instance.
         * @param {object} info           FullCalendar event info object.
         * @param {object} hycalSettings  The calendar settings.
         */
        hycalHooks.doAction("hycal.tooltipHide", instance, info, hycalSettings);
      },
    },
    info,
    hycalSettings
  );

  tippy(info.el, tippyOptions);
}
