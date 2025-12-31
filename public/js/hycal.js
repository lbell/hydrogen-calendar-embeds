/**
 * Pretty Calendar Embeds - Main Calendar Renderer
 *
 * Initializes and renders FullCalendar instances with the plugin's
 * configuration. Handles view resolution, event sources, and toolbar setup.
 *
 * @package hydrogen-calendar-embeds
 * @since 1.0.0
 */

function hycal_render_calendar(hycalSettings) {
  /**
   * Action: hycal.beforeRender
   *
   * Fires before the calendar starts rendering.
   * Use this to perform setup tasks or modify the DOM.
   *
   * @since 1.0.0
   *
   * @param {object} hycalSettings The calendar settings.
   */
  hycalHooks.doAction("hycal.beforeRender", hycalSettings);

  /**
   * Filter: hycal.settings
   *
   * Filter the calendar settings before processing.
   * Use this to modify or add custom settings.
   *
   * @since 1.0.0
   *
   * @param {object} hycalSettings The calendar settings.
   * @returns {object} Modified settings.
   */
  hycalSettings = hycalHooks.applyFilters("hycal.settings", hycalSettings);

  const currCal = `hycal-${hycalSettings["instance_id"]}`;
  const calendarEl = document.getElementById(currCal);
  calendarEl.innerHTML = "";
  let width = window.innerWidth;

  const views = hycal_resolve_views(hycalSettings);
  const calData = hycal_resolve_cals(hycalSettings);
  const cals = calData.eventSources;

  // console.table(cals); // DEBUG
  // console.table(hycalSettings); // DEBUG
  // console.table(views); // DEBUG

  const toolbarLeft = hycal_is_truthy(hycalSettings["show_today_button"])
    ? "prev,next today"
    : "prev,next";
  const toolbarCenter = hycal_is_truthy(hycalSettings["show_title"])
    ? "title"
    : "";
  const toolbarRight = views.length > 1 ? views.all.join(",") : "";

  let selectedView = views.initial;

  const hycalDefaults = {
    locale: hycalSettings["locale"],

    eventSources: cals,

    views: {
      // Options apply to dayGridMonth, dayGridWeek, and dayGridDay views
      dayGrid: {
        eventTimeFormat: {
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        },
      },
      // Custom List View - only custom one needs definition
      listCustom: {
        type: "list",
        duration: { days: parseInt(hycalSettings["custom_days"]) },
        buttonText: hycalSettings["custom_list_button"],
      },
    },

    // Day grid options
    eventDisplay: "block", // Adds border and bocks to events instead of bulleted list (default)
    height: "auto",
    fixedWeekCount: false, // True: 6 weeks, false: flex for month

    // List options
    listDayFormat: { weekday: "long", month: "long", day: "numeric" },

    initialView: views.initial,

    headerToolbar: {
      left: toolbarLeft,
      center: toolbarCenter,
      right: toolbarRight,
    },

    eventDidMount: function (info) {
      // Handle free/busy calendars with undefined titles
      // Google Calendar API returns the string "undefined" for free/busy events
      if (!info.event.title || info.event.title === "undefined") {
        info.event.setProp(
          "title",
          wp.i18n.__("Busy", "hydrogen-calendar-embeds")
        );
      }

      if (hycalSettings["use_tooltip"] === "true") {
        hycal_tippyRender(info, currCal, hycalSettings);
      }

      /**
       * Action: hycal.eventDidMount
       *
       * Fires after each event element is added to the DOM.
       * Use this to add custom attributes, styles, or behaviors to events.
       *
       * @since 1.0.0
       *
       * @param {object} info          FullCalendar event info object.
       * @param {object} hycalSettings The calendar settings.
       * @param {string} currCal       The calendar container ID.
       */
      hycalHooks.doAction("hycal.eventDidMount", info, hycalSettings, currCal);
    },

    eventClick: function (info) {
      if (
        hycalSettings["use_tooltip"] === "true" ||
        hycalSettings["no_link"] === "true"
      ) {
        info.jsEvent.preventDefault(); // Prevent following link
      }
    },

    // Handle calendar source loading errors (ICS fetch failures, etc.)
    eventSourceFailure: function (error) {
      console.error(
        "Pretty Calendar Embeds: Failed to load event source",
        error
      );
      // Display user-friendly message in calendar container
      const errorMsg = document.createElement("div");
      errorMsg.className = "hycal-error";
      errorMsg.style.cssText =
        "color: #721c24; background: #f8d7da; padding: 12px; border-radius: 4px; margin: 8px 0;";
      errorMsg.textContent = wp.i18n.__(
        "Unable to load calendar data. Please try again later.",
        "hydrogen-calendar-embeds"
      );
      // Only show one error message
      if (!calendarEl.querySelector(".hycal-error")) {
        calendarEl.insertBefore(errorMsg, calendarEl.firstChild);
      }
    },

    // Change view on window resize
    windowResize: function (view) {
      // Catch mobile chrome, which changes window size as nav bar appears
      // so only fire if width has changed.
      if (
        window.innerWidth !== width &&
        views.hasList &&
        views.wantsToEnforceListviewOnMobile
      ) {
        const currentView = calendar.view.type;
        const isCurrentlyListView = currentView.toLowerCase().includes("list");

        if (hycal_is_mobile(views.mobileBreakpoint)) {
          // Only switch to list view if not already on one
          if (!isCurrentlyListView) {
            calendar.changeView(views.listView);
          }
        } else {
          // Only switch away from list view if we enforced it
          if (
            isCurrentlyListView &&
            !selectedView.toLowerCase().includes("list")
          ) {
            calendar.changeView(selectedView);
          }
        }
      }
    },
  };

  // Hide past events if requested
  if (hycal_is_truthy(hycalSettings["hide_past"])) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayString = `${year}-${month}-${day}`;

    hycalDefaults.validRange = {
      start: todayString,
    };
  }

  let hycalOverrides = {};
  try {
    hycalOverrides = JSON.parse(hycalSettings["fc_args"]);
  } catch (e) {
    console.error("Pretty Calendar Embeds: Invalid JSON in fc_args", e);
  }
  let hycalArgs = hycal_argmerge(hycalDefaults, hycalOverrides);

  /**
   * Filter: hycal.fullcalendarOptions
   *
   * Filter the FullCalendar options before initialization.
   * Use this to modify any FullCalendar configuration.
   *
   * @since 1.0.0
   *
   * @param {object} hycalArgs      The merged FullCalendar options.
   * @param {object} hycalSettings  The calendar settings.
   * @param {object} hycalDefaults  The default options.
   * @returns {object} Modified FullCalendar options.
   */
  hycalArgs = hycalHooks.applyFilters(
    "hycal.fullcalendarOptions",
    hycalArgs,
    hycalSettings,
    hycalDefaults
  );

  // console.log(hycalSettings["fc_args"]); // DEBUG
  // console.log(JSON.stringify(hycalDefaults, null, 2)); // DEBUG
  // console.log(JSON.stringify(hycalArgs, null, 2)); // DEBUG

  const calendar = new FullCalendar.Calendar(calendarEl, hycalArgs);
  calendar.render();

  /**
   * Action: hycal.afterRender
   *
   * Fires after the calendar has rendered.
   * Use this to access the FullCalendar instance or modify the rendered calendar.
   *
   * @since 1.0.0
   *
   * @param {object} calendar       The FullCalendar instance.
   * @param {object} hycalSettings  The calendar settings.
   * @param {Element} calendarEl    The calendar DOM element.
   */
  hycalHooks.doAction("hycal.afterRender", calendar, hycalSettings, calendarEl);
}
