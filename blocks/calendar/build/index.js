(() => {
  "use strict";
  const e = window.wp.blocks,
    l = JSON.parse('{"UU":"hycal/calendar"}'),
    a = window.wp.i18n,
    i = window.wp.element,
    n = window.wp.blockEditor,
    s = window.wp.components,
    t = window.ReactJSXRuntime;
  (0, e.registerBlockType)(l.UU, {
    edit: function ({ attributes: e, setAttributes: l }) {
      const {
          ics: r,
          calIds: c,
          locale: o,
          customListButton: d,
          customDays: u,
          views: b,
          initialView: m,
          enforceListviewOnMobile: h,
          mobileBreakpoint: p,
          showTodayButton: v,
          showTitle: _,
          useTooltip: x,
          hidePast: y,
          fcArgs: g,
        } = e,
        [j, k] = (0, i.useState)(!1),
        [C, w] = (0, i.useState)(""),
        [f, N] = (0, i.useState)(!1),
        [S, L] = (0, i.useState)(""),
        [T, B] = (0, i.useState)(!1),
        [M, z] = (0, i.useState)(!1),
        [A, G] = (0, i.useState)(!1),
        [D, E] = (0, i.useState)(!1),
        U = (0, n.useBlockProps)(),
        W = (e) => {
          if (!e || "{}" === e) return "";
          try {
            return JSON.stringify(JSON.parse(e), null, 2);
          } catch (l) {
            return e;
          }
        },
        I = (e) => {
          if (!e || "" === e.trim()) return "{}";
          try {
            return JSON.stringify(JSON.parse(e));
          } catch (l) {
            return e;
          }
        },
        O = [
          { value: "en", label: "English (en)" },
          { value: "en-gb", label: "English (UK) (en-gb)" },
          { value: "en-au", label: "English (Australia) (en-au)" },
          { value: "en-nz", label: "English (New Zealand) (en-nz)" },
          { value: "af", label: "Afrikaans (af)" },
          { value: "ar", label: "Arabic (ar)" },
          { value: "ar-ae", label: "Arabic (UAE) (ar-ae)" },
          { value: "ar-dz", label: "Arabic (Algeria) (ar-dz)" },
          { value: "ar-eg", label: "Arabic (Egypt) (ar-eg)" },
          { value: "ar-kw", label: "Arabic (Kuwait) (ar-kw)" },
          { value: "ar-ly", label: "Arabic (Libya) (ar-ly)" },
          { value: "ar-ma", label: "Arabic (Morocco) (ar-ma)" },
          { value: "ar-sa", label: "Arabic (Saudi Arabia) (ar-sa)" },
          { value: "ar-tn", label: "Arabic (Tunisia) (ar-tn)" },
          { value: "bg", label: "Bulgarian (bg)" },
          { value: "bn", label: "Bengali (bn)" },
          { value: "bo", label: "Tibetan (bo)" },
          { value: "br", label: "Breton (br)" },
          { value: "bs", label: "Bosnian (bs)" },
          { value: "ca", label: "Catalan (ca)" },
          { value: "cs", label: "Czech (cs)" },
          { value: "cy", label: "Welsh (cy)" },
          { value: "da", label: "Danish (da)" },
          { value: "de", label: "German (de)" },
          { value: "de-at", label: "German (Austria) (de-at)" },
          { value: "de-ch", label: "German (Switzerland) (de-ch)" },
          { value: "dv", label: "Dhivehi (dv)" },
          { value: "el", label: "Greek (el)" },
          { value: "eo", label: "Esperanto (eo)" },
          { value: "es", label: "Spanish (es)" },
          { value: "es-do", label: "Spanish (Dominican Republic) (es-do)" },
          { value: "es-mx", label: "Spanish (Mexico) (es-mx)" },
          { value: "es-us", label: "Spanish (US) (es-us)" },
          { value: "et", label: "Estonian (et)" },
          { value: "eu", label: "Basque (eu)" },
          { value: "fa", label: "Persian (fa)" },
          { value: "fi", label: "Finnish (fi)" },
          { value: "fil", label: "Filipino (fil)" },
          { value: "fo", label: "Faroese (fo)" },
          { value: "fr", label: "French (fr)" },
          { value: "fr-ca", label: "French (Canada) (fr-ca)" },
          { value: "fr-ch", label: "French (Switzerland) (fr-ch)" },
          { value: "ga", label: "Irish (ga)" },
          { value: "gd", label: "Scottish Gaelic (gd)" },
          { value: "gl", label: "Galician (gl)" },
          { value: "gu", label: "Gujarati (gu)" },
          { value: "he", label: "Hebrew (he)" },
          { value: "hi", label: "Hindi (hi)" },
          { value: "hr", label: "Croatian (hr)" },
          { value: "hu", label: "Hungarian (hu)" },
          { value: "hy", label: "Armenian (hy)" },
          { value: "id", label: "Indonesian (id)" },
          { value: "is", label: "Icelandic (is)" },
          { value: "it", label: "Italian (it)" },
          { value: "it-ch", label: "Italian (Switzerland) (it-ch)" },
          { value: "ja", label: "Japanese (ja)" },
          { value: "ka", label: "Georgian (ka)" },
          { value: "kk", label: "Kazakh (kk)" },
          { value: "km", label: "Khmer (km)" },
          { value: "kn", label: "Kannada (kn)" },
          { value: "ko", label: "Korean (ko)" },
          { value: "ku", label: "Kurdish (ku)" },
          { value: "ky", label: "Kyrgyz (ky)" },
          { value: "lb", label: "Luxembourgish (lb)" },
          { value: "lo", label: "Lao (lo)" },
          { value: "lt", label: "Lithuanian (lt)" },
          { value: "lv", label: "Latvian (lv)" },
          { value: "mk", label: "Macedonian (mk)" },
          { value: "ml", label: "Malayalam (ml)" },
          { value: "mr", label: "Marathi (mr)" },
          { value: "ms", label: "Malay (ms)" },
          { value: "ms-my", label: "Malay (Malaysia) (ms-my)" },
          { value: "mt", label: "Maltese (mt)" },
          { value: "my", label: "Burmese (my)" },
          { value: "nb", label: "Norwegian Bokmål (nb)" },
          { value: "ne", label: "Nepali (ne)" },
          { value: "nl", label: "Dutch (nl)" },
          { value: "nl-be", label: "Dutch (Belgium) (nl-be)" },
          { value: "nn", label: "Norwegian Nynorsk (nn)" },
          { value: "pa-in", label: "Punjabi (India) (pa-in)" },
          { value: "pl", label: "Polish (pl)" },
          { value: "pt", label: "Portuguese (pt)" },
          { value: "pt-br", label: "Portuguese (Brazil) (pt-br)" },
          { value: "ro", label: "Romanian (ro)" },
          { value: "ru", label: "Russian (ru)" },
          { value: "rw", label: "Kinyarwanda (rw)" },
          { value: "se", label: "Northern Sami (se)" },
          { value: "si", label: "Sinhala (si)" },
          { value: "sk", label: "Slovak (sk)" },
          { value: "sl", label: "Slovenian (sl)" },
          { value: "so", label: "Somali (so)" },
          { value: "sq", label: "Albanian (sq)" },
          { value: "sr", label: "Serbian (sr)" },
          { value: "sr-cyrl", label: "Serbian (Cyrillic) (sr-cyrl)" },
          { value: "sv", label: "Swedish (sv)" },
          { value: "sw", label: "Swahili (sw)" },
          { value: "ta", label: "Tamil (ta)" },
          { value: "te", label: "Telugu (te)" },
          { value: "tg", label: "Tajik (tg)" },
          { value: "th", label: "Thai (th)" },
          { value: "tk", label: "Turkmen (tk)" },
          { value: "tr", label: "Turkish (tr)" },
          { value: "ug", label: "Uyghur (ug)" },
          { value: "uk", label: "Ukrainian (uk)" },
          { value: "ur", label: "Urdu (ur)" },
          { value: "uz", label: "Uzbek (uz)" },
          { value: "uz-latn", label: "Uzbek (Latin) (uz-latn)" },
          { value: "vi", label: "Vietnamese (vi)" },
          { value: "zh-cn", label: "Chinese (Simplified) (zh-cn)" },
          { value: "zh-hk", label: "Chinese (Hong Kong) (zh-hk)" },
          { value: "zh-mo", label: "Chinese (Macau) (zh-mo)" },
          { value: "zh-sg", label: "Chinese (Singapore) (zh-sg)" },
          { value: "zh-tw", label: "Chinese (Traditional) (zh-tw)" },
        ],
        F = [
          { value: "dayGridMonth", label: "Month Grid" },
          { value: "dayGridWeek", label: "Week Grid" },
          { value: "dayGridDay", label: "Day Grid" },
          { value: "listDay", label: "List Day" },
          { value: "listWeek", label: "List Week" },
          { value: "listMonth", label: "List Month" },
          { value: "listYear", label: "List Year" },
          { value: "listCustom", label: "Custom List" },
          { value: "timeGridWeek", label: "Time Grid Week" },
          { value: "timeGridDay", label: "Time Grid Day" },
        ],
        J = b
          ? b
              .split(",")
              .map((e) => e.trim())
              .filter((e) => e)
          : [],
        P = J.some((e) => e.includes("list")),
        R = r,
        K = r
          ? r
              .split(",")
              .map((e) => e.trim())
              .filter((e) => e).length
          : 0;
      return (0, t.jsxs)("div", {
        ...U,
        children: [
          (0, t.jsxs)("div", {
            className: "hycal-inline-editor",
            children: [
              (0, t.jsxs)("div", {
                className: "hycal-inline-editor__header",
                children: [
                  (0, t.jsxs)("svg", {
                    className: "hycal-inline-editor__header-icon",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "1.5",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    width: "28",
                    height: "28",
                    children: [
                      (0, t.jsx)("rect", {
                        x: "3",
                        y: "4",
                        width: "18",
                        height: "18",
                        rx: "2",
                        ry: "2",
                      }),
                      (0, t.jsx)("line", {
                        x1: "16",
                        y1: "2",
                        x2: "16",
                        y2: "6",
                      }),
                      (0, t.jsx)("line", {
                        x1: "8",
                        y1: "2",
                        x2: "8",
                        y2: "6",
                      }),
                      (0, t.jsx)("line", {
                        x1: "3",
                        y1: "10",
                        x2: "21",
                        y2: "10",
                      }),
                      (0, t.jsx)("rect", {
                        x: "6",
                        y: "14",
                        width: "2",
                        height: "2",
                        rx: "0.5",
                        fill: "currentColor",
                      }),
                      (0, t.jsx)("rect", {
                        x: "11",
                        y: "14",
                        width: "2",
                        height: "2",
                        rx: "0.5",
                        fill: "currentColor",
                      }),
                      (0, t.jsx)("rect", {
                        x: "16",
                        y: "14",
                        width: "2",
                        height: "2",
                        rx: "0.5",
                        fill: "currentColor",
                      }),
                      (0, t.jsx)("rect", {
                        x: "6",
                        y: "18",
                        width: "2",
                        height: "2",
                        rx: "0.5",
                        fill: "currentColor",
                      }),
                      (0, t.jsx)("rect", {
                        x: "11",
                        y: "18",
                        width: "2",
                        height: "2",
                        rx: "0.5",
                        fill: "currentColor",
                      }),
                    ],
                  }),
                  (0, t.jsx)("span", {
                    className: "hycal-inline-editor__title",
                    children: (0, a.__)(
                      "Hydrogen Calendar Embeds",
                      "hydrogen-calendar-embeds"
                    ),
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className:
                  "hycal-inline-editor__section hycal-inline-editor__section--primary",
                children: [
                  (0, t.jsxs)("div", {
                    className: "hycal-inline-editor__section-header",
                    children: [
                      (0, t.jsxs)("svg", {
                        className: "hycal-inline-editor__section-icon",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          (0, t.jsx)("rect", {
                            x: "3",
                            y: "4",
                            width: "18",
                            height: "18",
                            rx: "2",
                          }),
                          (0, t.jsx)("path", { d: "M16 2v4M8 2v4M3 10h18" }),
                        ],
                      }),
                      (0, t.jsx)("span", {
                        className: "hycal-inline-editor__section-title",
                        children: (0, a.__)(
                          "Calendar Source",
                          "hydrogen-calendar-embeds"
                        ),
                      }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className: "hycal-inline-editor__calendars",
                    children: [
                      R
                        ? (0, t.jsxs)(t.Fragment, {
                            children: [
                              (0, t.jsx)("div", {
                                className:
                                  "hycal-inline-editor__calendar-count",
                                children:
                                  1 === K
                                    ? (0, a.__)(
                                        "1 calendar configured",
                                        "hydrogen-calendar-embeds"
                                      )
                                    : K +
                                      (0, a.__)(
                                        " calendars configured",
                                        "hydrogen-calendar-embeds"
                                      ),
                              }),
                              (0, t.jsx)("div", {
                                className: "hycal-inline-editor__calendar-urls",
                                children: r
                                  .split(",")
                                  .map((e) => e.trim())
                                  .filter((e) => e)
                                  .map((e, l) =>
                                    (0, t.jsx)(
                                      "div",
                                      {
                                        className:
                                          "hycal-inline-editor__calendar-url",
                                        children:
                                          e.length > 60
                                            ? e.substring(0, 30) +
                                              "…" +
                                              e.substring(e.length - 25)
                                            : e,
                                      },
                                      l
                                    )
                                  ),
                              }),
                            ],
                          })
                        : (0, t.jsx)("div", {
                            className: "hycal-inline-editor__no-source",
                            children: (0, a.__)(
                              "No calendar source configured yet.",
                              "hydrogen-calendar-embeds"
                            ),
                          }),
                      (0, t.jsx)(s.Button, {
                        variant: R ? "secondary" : "primary",
                        onClick: () => {
                          var e;
                          w(
                            (e = r)
                              ? e
                                  .split(",")
                                  .map((e) => e.trim())
                                  .filter((e) => e)
                                  .join("\n")
                              : ""
                          ),
                            k(!0);
                        },
                        className: "hycal-inline-editor__add-btn",
                        children: R
                          ? (0, a.__)(
                              "Edit Calendar URLs",
                              "hydrogen-calendar-embeds"
                            )
                          : (0, a.__)(
                              "Add Calendar URLs",
                              "hydrogen-calendar-embeds"
                            ),
                      }),
                    ],
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "hycal-inline-editor__section",
                children: [
                  (0, t.jsxs)("button", {
                    className: "hycal-inline-editor__section-toggle",
                    onClick: () => B(!T),
                    type: "button",
                    children: [
                      (0, t.jsxs)("svg", {
                        className: "hycal-inline-editor__section-icon",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          (0, t.jsx)("path", {
                            d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
                          }),
                          (0, t.jsx)("circle", { cx: "12", cy: "12", r: "3" }),
                        ],
                      }),
                      (0, t.jsx)("span", {
                        className: "hycal-inline-editor__section-title",
                        children: (0, a.__)(
                          "Views",
                          "hydrogen-calendar-embeds"
                        ),
                      }),
                      (0, t.jsx)("span", {
                        className: "hycal-inline-editor__section-summary",
                        children:
                          J.length > 0
                            ? J.length + (1 === J.length ? " view" : " views")
                            : "Default",
                      }),
                      (0, t.jsx)("span", {
                        className:
                          "hycal-inline-editor__chevron " +
                          (T ? "hycal-inline-editor__chevron--open" : ""),
                        children: "▶",
                      }),
                    ],
                  }),
                  T &&
                    (0, t.jsxs)("div", {
                      className: "hycal-inline-editor__section-content",
                      children: [
                        (0, t.jsx)("div", {
                          className: "hycal-inline-editor__views-grid",
                          children: F.map((e) =>
                            (0, t.jsx)(
                              s.CheckboxControl,
                              {
                                label: e.label,
                                checked: J.includes(e.value),
                                onChange: (a) =>
                                  ((e, a) => {
                                    let i;
                                    if (a) {
                                      if (((i = [...J, e]), 0 === J.length))
                                        return void l({
                                          views: i.join(", "),
                                          initialView: e,
                                        });
                                    } else if (
                                      ((i = J.filter((l) => l !== e)),
                                      m === e && i.length > 0)
                                    )
                                      return void l({
                                        views: i.join(", "),
                                        initialView: i[0],
                                      });
                                    l({ views: i.join(", ") });
                                  })(e.value, a),
                              },
                              e.value
                            )
                          ),
                        }),
                        J.length > 0 &&
                          (0, t.jsx)(s.SelectControl, {
                            label: (0, a.__)(
                              "Initial View",
                              "hydrogen-calendar-embeds"
                            ),
                            value: m,
                            options: F.filter((e) => J.includes(e.value)),
                            onChange: (e) => l({ initialView: e }),
                          }),
                        (0, t.jsx)(s.ToggleControl, {
                          label: (0, a.__)(
                            "Force List View on Mobile",
                            "hydrogen-calendar-embeds"
                          ),
                          help: P
                            ? (0, a.__)(
                                "Automatically switch to list view on mobile devices.",
                                "hydrogen-calendar-embeds"
                              )
                            : (0, a.__)(
                                "Enable a list view above to use this feature.",
                                "hydrogen-calendar-embeds"
                              ),
                          checked: h,
                          onChange: (e) => l({ enforceListviewOnMobile: e }),
                          disabled: !P,
                        }),
                        h &&
                          P &&
                          (0, t.jsx)(s.TextControl, {
                            label: (0, a.__)(
                              "Mobile Breakpoint (px)",
                              "hydrogen-calendar-embeds"
                            ),
                            help: (0, a.__)(
                              "Screen width at which list view is enforced.",
                              "hydrogen-calendar-embeds"
                            ),
                            value: p,
                            onChange: (e) => l({ mobileBreakpoint: e }),
                            type: "number",
                            min: "320",
                            max: "1280",
                          }),
                        J.includes("listCustom") &&
                          (0, t.jsxs)("div", {
                            className: "hycal-inline-editor__custom-list",
                            children: [
                              (0, t.jsx)(s.TextControl, {
                                label: (0, a.__)(
                                  "Custom List Days",
                                  "hydrogen-calendar-embeds"
                                ),
                                value: u,
                                onChange: (e) => l({ customDays: e }),
                                type: "number",
                              }),
                              (0, t.jsx)(s.TextControl, {
                                label: (0, a.__)(
                                  "Custom List Button Label",
                                  "hydrogen-calendar-embeds"
                                ),
                                value: d,
                                onChange: (e) => l({ customListButton: e }),
                              }),
                            ],
                          }),
                      ],
                    }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "hycal-inline-editor__section",
                children: [
                  (0, t.jsxs)("button", {
                    className: "hycal-inline-editor__section-toggle",
                    onClick: () => z(!M),
                    type: "button",
                    children: [
                      (0, t.jsxs)("svg", {
                        className: "hycal-inline-editor__section-icon",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          (0, t.jsx)("rect", {
                            x: "2",
                            y: "3",
                            width: "20",
                            height: "14",
                            rx: "2",
                          }),
                          (0, t.jsx)("path", { d: "M2 17h20M6 21h12" }),
                        ],
                      }),
                      (0, t.jsx)("span", {
                        className: "hycal-inline-editor__section-title",
                        children: (0, a.__)(
                          "Display",
                          "hydrogen-calendar-embeds"
                        ),
                      }),
                      (0, t.jsx)("span", {
                        className: "hycal-inline-editor__section-summary",
                        children: O.find((e) => e.value === o)?.label || o,
                      }),
                      (0, t.jsx)("span", {
                        className:
                          "hycal-inline-editor__chevron " +
                          (M ? "hycal-inline-editor__chevron--open" : ""),
                        children: "▶",
                      }),
                    ],
                  }),
                  M &&
                    (0, t.jsxs)("div", {
                      className: "hycal-inline-editor__section-content",
                      children: [
                        (0, t.jsx)(s.SelectControl, {
                          label: (0, a.__)(
                            "Locale",
                            "hydrogen-calendar-embeds"
                          ),
                          value: o,
                          options: O,
                          onChange: (e) => l({ locale: e }),
                        }),
                        (0, t.jsx)(s.ToggleControl, {
                          label: (0, a.__)(
                            "Show Title",
                            "hydrogen-calendar-embeds"
                          ),
                          checked: _,
                          onChange: (e) => l({ showTitle: e }),
                        }),
                        (0, t.jsx)(s.ToggleControl, {
                          label: (0, a.__)(
                            "Show Today Button",
                            "hydrogen-calendar-embeds"
                          ),
                          checked: v,
                          onChange: (e) => l({ showTodayButton: e }),
                        }),
                        (0, t.jsx)(s.ToggleControl, {
                          label: (0, a.__)(
                            "Show Tooltips",
                            "hydrogen-calendar-embeds"
                          ),
                          checked: x,
                          onChange: (e) => l({ useTooltip: e }),
                        }),
                        (0, t.jsx)(s.ToggleControl, {
                          label: (0, a.__)(
                            "Hide Past Events",
                            "hydrogen-calendar-embeds"
                          ),
                          checked: y,
                          onChange: (e) => l({ hidePast: e }),
                        }),
                      ],
                    }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "hycal-inline-editor__section",
                children: [
                  (0, t.jsxs)("button", {
                    className: "hycal-inline-editor__section-toggle",
                    onClick: () => G(!A),
                    type: "button",
                    children: [
                      (0, t.jsx)("svg", {
                        className: "hycal-inline-editor__section-icon",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: (0, t.jsx)("path", {
                          d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
                        }),
                      }),
                      (0, t.jsx)("span", {
                        className: "hycal-inline-editor__section-title",
                        children: (0, a.__)(
                          "Advanced",
                          "hydrogen-calendar-embeds"
                        ),
                      }),
                      (0, t.jsx)("span", {
                        className: "hycal-inline-editor__section-summary",
                        children: g && "{}" !== g ? "Custom JSON" : "",
                      }),
                      (0, t.jsx)("span", {
                        className:
                          "hycal-inline-editor__chevron " +
                          (A ? "hycal-inline-editor__chevron--open" : ""),
                        children: "▶",
                      }),
                    ],
                  }),
                  A &&
                    (0, t.jsxs)("div", {
                      className: "hycal-inline-editor__section-content",
                      children: [
                        (0, t.jsx)(s.TextControl, {
                          label: (0, a.__)(
                            "Calendar Identifiers",
                            "hydrogen-calendar-embeds"
                          ),
                          help: (0, a.__)(
                            "Comma-separated names for CSS styling (e.g., soccer, tennis)",
                            "hydrogen-calendar-embeds"
                          ),
                          value: c,
                          onChange: (e) => l({ calIds: e }),
                          placeholder: "soccer, tennis, holidays",
                        }),
                        R &&
                          (0, t.jsxs)("div", {
                            className: "hycal-inline-editor__cal-ids-mapping",
                            children: [
                              (0, t.jsx)("p", {
                                className: "components-base-control__label",
                                children: (0, a.__)(
                                  "Calendar Prefix Mapping",
                                  "hydrogen-calendar-embeds"
                                ),
                              }),
                              (0, t.jsx)("div", {
                                className: "hycal-inline-editor__cal-ids-list",
                                children: r
                                  .split(",")
                                  .map((e) => e.trim())
                                  .filter((e) => e)
                                  .map((e, l) => {
                                    const a =
                                      (c
                                        ? c
                                            .split(",")
                                            .map((e) => e.trim())
                                            .filter((e) => e)
                                        : [])[l] || l;
                                    return (0, t.jsxs)(
                                      "div",
                                      {
                                        className:
                                          "hycal-inline-editor__cal-id-item",
                                        children: [
                                          (0, t.jsx)("span", {
                                            className:
                                              "hycal-inline-editor__cal-id-prefix",
                                            children: a,
                                          }),
                                          (0, t.jsx)("span", {
                                            className:
                                              "hycal-inline-editor__cal-id-url",
                                            children:
                                              e.length > 50
                                                ? e.substring(0, 25) +
                                                  "…" +
                                                  e.substring(e.length - 20)
                                                : e,
                                          }),
                                        ],
                                      },
                                      l
                                    );
                                  }),
                              }),
                            ],
                          }),
                        (0, t.jsxs)("div", {
                          className: "hycal-inline-editor__fc-args",
                          children: [
                            (0, t.jsx)("p", {
                              className: "components-base-control__label",
                              children: (0, a.__)(
                                "Custom FullCalendar Settings",
                                "hydrogen-calendar-embeds"
                              ),
                            }),
                            g &&
                              "{}" !== g &&
                              (0, t.jsx)("pre", {
                                className:
                                  "hycal-inline-editor__fc-args-preview",
                                children: W(g),
                              }),
                            (0, t.jsx)(s.Button, {
                              variant: "secondary",
                              onClick: () => {
                                L(W(g)), N(!0);
                              },
                              children:
                                g && "{}" !== g
                                  ? (0, a.__)(
                                      "Edit JSON Settings",
                                      "hydrogen-calendar-embeds"
                                    )
                                  : (0, a.__)(
                                      "Add JSON Settings",
                                      "hydrogen-calendar-embeds"
                                    ),
                            }),
                          ],
                        }),
                        (0, t.jsxs)("div", {
                          className: "hycal-inline-editor__copy-shortcode",
                          children: [
                            (0, t.jsx)("p", {
                              className: "components-base-control__label",
                              children: (0, a.__)(
                                "Shortcode",
                                "hydrogen-calendar-embeds"
                              ),
                            }),
                            (0, t.jsx)("p", {
                              className: "components-base-control__help",
                              children: (0, a.__)(
                                "Copy shortcode to use in Classic Editor or other contexts.",
                                "hydrogen-calendar-embeds"
                              ),
                            }),
                            (0, t.jsx)(s.Button, {
                              variant: "secondary",
                              onClick: () => {
                                const e = (() => {
                                  const e = ["[hydrogen_calendar_embeds"];
                                  if (
                                    (r && e.push(`ics="${r}"`),
                                    c && e.push(`cal_ids="${c}"`),
                                    "en" !== o && e.push(`locale="${o}"`),
                                    "dayGridMonth, listMonth" !== b &&
                                      e.push(`views="${b}"`),
                                    "dayGridMonth" !== m &&
                                      e.push(`initial_view="${m}"`),
                                    h ||
                                      e.push(
                                        'enforce_listview_on_mobile="false"'
                                      ),
                                    "768" !== p &&
                                      e.push(`mobile_breakpoint="${p}"`),
                                    v || e.push('show_today_button="false"'),
                                    _ || e.push('show_title="false"'),
                                    x || e.push('use_tooltip="false"'),
                                    y && e.push('hide_past="true"'),
                                    J.includes("listCustom") &&
                                      ("list" !== d &&
                                        e.push(`custom_list_button="${d}"`),
                                      "28" !== u &&
                                        e.push(`custom_days="${u}"`)),
                                    g && "{}" !== g)
                                  ) {
                                    const l = g
                                      .replace(/\[/g, "%5B")
                                      .replace(/\]/g, "%5D");
                                    e.push(`fc_args='${l}'`);
                                  }
                                  return e.push("]"), e.join(" ");
                                })();
                                navigator.clipboard.writeText(e).then(() => {
                                  E(!0), setTimeout(() => E(!1), 2e3);
                                });
                              },
                              disabled: !r,
                              children: D
                                ? (0, a.__)(
                                    "Copied!",
                                    "hydrogen-calendar-embeds"
                                  )
                                : (0, a.__)(
                                    "Copy Shortcode",
                                    "hydrogen-calendar-embeds"
                                  ),
                            }),
                          ],
                        }),
                      ],
                    }),
                ],
              }),
              R &&
                (0, t.jsx)("div", {
                  className: "hycal-inline-editor__footer",
                  children: (0, a.__)(
                    "Calendar will render on the frontend",
                    "hydrogen-calendar-embeds"
                  ),
                }),
            ],
          }),
          j &&
            (0, t.jsx)(s.Modal, {
              title: (0, a.__)("ICS Calendar URLs", "hydrogen-calendar-embeds"),
              onRequestClose: () => k(!1),
              className: "hycal-modal",
              children: (0, t.jsxs)("div", {
                className: "hycal-modal__content",
                children: [
                  (0, t.jsx)("p", {
                    children: (0, a.__)(
                      "Enter one ICS calendar URL per line.",
                      "hydrogen-calendar-embeds"
                    ),
                  }),
                  (0, t.jsx)("textarea", {
                    className: "hycal-modal__textarea",
                    value: C,
                    onChange: (e) => w(e.target.value),
                    placeholder:
                      "https://calendar.google.com/calendar/ical/example/public/basic.ics\nhttps://example.com/events.ics",
                    rows: 8,
                    spellCheck: !1,
                  }),
                  (0, t.jsxs)("div", {
                    className: "hycal-modal__actions",
                    children: [
                      (0, t.jsx)(s.Button, {
                        variant: "secondary",
                        onClick: () => k(!1),
                        children: (0, a.__)(
                          "Cancel",
                          "hydrogen-calendar-embeds"
                        ),
                      }),
                      (0, t.jsx)(s.Button, {
                        variant: "primary",
                        onClick: () => {
                          var e;
                          l({
                            ics:
                              ((e = C),
                              e && "" !== e.trim()
                                ? e
                                    .split("\n")
                                    .map((e) => e.trim())
                                    .filter((e) => e)
                                    .join(", ")
                                : ""),
                          }),
                            k(!1);
                        },
                        children: (0, a.__)("Save", "hydrogen-calendar-embeds"),
                      }),
                    ],
                  }),
                ],
              }),
            }),
          f &&
            (0, t.jsx)(s.Modal, {
              title: (0, a.__)(
                "Custom FullCalendar Settings",
                "hydrogen-calendar-embeds"
              ),
              onRequestClose: () => N(!1),
              className: "hycal-modal hycal-modal--large",
              children: (0, t.jsxs)("div", {
                className: "hycal-modal__content",
                children: [
                  (0, t.jsx)("p", {
                    children: (0, a.__)(
                      "Enter valid JSON to pass directly to FullCalendar.",
                      "hydrogen-calendar-embeds"
                    ),
                  }),
                  (0, t.jsx)("textarea", {
                    className:
                      "hycal-modal__textarea hycal-modal__textarea--code",
                    value: S,
                    onChange: (e) => L(e.target.value),
                    placeholder:
                      '{\n  "weekends": false,\n  "hiddenDays": [0, 6],\n  "businessHours": {\n    "daysOfWeek": [1, 2, 3, 4, 5],\n    "startTime": "09:00",\n    "endTime": "17:00"\n  }\n}',
                    rows: 15,
                    spellCheck: !1,
                  }),
                  (0, t.jsxs)("div", {
                    className: "hycal-modal__actions",
                    children: [
                      (0, t.jsx)(s.Button, {
                        variant: "secondary",
                        onClick: () => N(!1),
                        children: (0, a.__)(
                          "Cancel",
                          "hydrogen-calendar-embeds"
                        ),
                      }),
                      (0, t.jsx)(s.Button, {
                        variant: "primary",
                        onClick: () => {
                          l({ fcArgs: I(S) }), N(!1);
                        },
                        children: (0, a.__)("Save", "hydrogen-calendar-embeds"),
                      }),
                    ],
                  }),
                ],
              }),
            }),
        ],
      });
    },
    save: function () {
      return null;
    },
  });
})();
