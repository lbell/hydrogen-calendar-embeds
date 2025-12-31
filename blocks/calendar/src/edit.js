/**
 * Pretty Calendar Embeds - Block Editor Component (Edit)
 *
 * All settings are inline in the block preview for a streamlined experience.
 * No sidebar required - everything is front and center!
 *
 * @package hydrogen-calendar-embeds
 */

import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { useBlockProps } from "@wordpress/block-editor";
import {
  TextControl,
  SelectControl,
  ToggleControl,
  CheckboxControl,
  Button,
  Modal,
} from "@wordpress/components";

/**
 * Edit Component - Inline editing interface
 */
export default function Edit({ attributes, setAttributes }) {
  const {
    ics,
    calIds,
    locale,
    customListButton,
    customDays,
    views,
    initialView,
    enforceListviewOnMobile,
    mobileBreakpoint,
    showTodayButton,
    showTitle,
    useTooltip,
    hidePast,
    fcArgs,
  } = attributes;

  // Modal states
  const [isIcsModalOpen, setIsIcsModalOpen] = useState(false);
  const [icsEditorValue, setIcsEditorValue] = useState("");
  const [isFcArgsModalOpen, setIsFcArgsModalOpen] = useState(false);
  const [fcArgsEditorValue, setFcArgsEditorValue] = useState("");

  // Collapsible section states
  const [showViews, setShowViews] = useState(false);
  const [showDisplay, setShowDisplay] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [shortcodeCopied, setShortcodeCopied] = useState(false);

  const blockProps = useBlockProps();

  // ICS URL helpers
  const formatIcsForDisplay = (icsString) => {
    if (!icsString) return "";
    return icsString
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url)
      .join("\n");
  };

  const formatIcsForSave = (icsString) => {
    if (!icsString || icsString.trim() === "") return "";
    return icsString
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url)
      .join(", ");
  };

  const openIcsModal = () => {
    setIcsEditorValue(formatIcsForDisplay(ics));
    setIsIcsModalOpen(true);
  };

  const saveIcsModal = () => {
    setAttributes({ ics: formatIcsForSave(icsEditorValue) });
    setIsIcsModalOpen(false);
  };

  // JSON helpers
  const formatJsonForDisplay = (jsonString) => {
    if (!jsonString || jsonString === "{}") return "";
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch (e) {
      return jsonString;
    }
  };

  const minifyJson = (jsonString) => {
    if (!jsonString || jsonString.trim() === "") return "{}";
    try {
      return JSON.stringify(JSON.parse(jsonString));
    } catch (e) {
      return jsonString;
    }
  };

  const openFcArgsModal = () => {
    setFcArgsEditorValue(formatJsonForDisplay(fcArgs));
    setIsFcArgsModalOpen(true);
  };

  const saveFcArgsModal = () => {
    setAttributes({ fcArgs: minifyJson(fcArgsEditorValue) });
    setIsFcArgsModalOpen(false);
  };

  /**
   * Generate shortcode from current block attributes.
   * Only includes non-default values to keep shortcode concise.
   */
  const generateShortcode = () => {
    const parts = ["[pretty_calendar_embeds"];

    // Required: ICS URLs
    if (ics) {
      parts.push(`ics="${ics}"`);
    }

    // Optional attributes - only include if different from defaults
    if (calIds) parts.push(`cal_ids="${calIds}"`);
    if (locale !== "en") parts.push(`locale="${locale}"`);
    if (views !== "dayGridMonth, listMonth") parts.push(`views="${views}"`);
    if (initialView !== "dayGridMonth")
      parts.push(`initial_view="${initialView}"`);
    if (!enforceListviewOnMobile)
      parts.push(`enforce_listview_on_mobile="false"`);
    if (mobileBreakpoint !== "768")
      parts.push(`mobile_breakpoint="${mobileBreakpoint}"`);
    if (!showTodayButton) parts.push(`show_today_button="false"`);
    if (!showTitle) parts.push(`show_title="false"`);
    if (!useTooltip) parts.push(`use_tooltip="false"`);
    if (hidePast) parts.push(`hide_past="true"`);

    // Only include custom list button if listCustom view is selected
    if (selectedViews.includes("listCustom")) {
      if (customListButton !== "list")
        parts.push(`custom_list_button="${customListButton}"`);
      if (customDays !== "28") parts.push(`custom_days="${customDays}"`);
    }

    // fc_args needs bracket encoding for shortcode compatibility
    if (fcArgs && fcArgs !== "{}") {
      const encodedFcArgs = fcArgs.replace(/\[/g, "%5B").replace(/\]/g, "%5D");
      parts.push(`fc_args='${encodedFcArgs}'`);
    }

    parts.push("]");
    return parts.join(" ");
  };

  /**
   * Copy shortcode to clipboard with visual feedback.
   */
  const copyShortcode = () => {
    const shortcode = generateShortcode();
    navigator.clipboard.writeText(shortcode).then(() => {
      setShortcodeCopied(true);
      setTimeout(() => setShortcodeCopied(false), 2000);
    });
  };

  // Locale options - FullCalendar supports 100+ locales for date/week formatting
  const localeOptions = [
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
  ];

  // View options
  const allViewOptions = [
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
  ];

  const selectedViews = views
    ? views
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v)
    : [];

  // Check if any of the selected views is a list view
  const hasListView = selectedViews.some((view) => view.includes("list"));

  const handleViewToggle = (viewValue, isChecked) => {
    let newViews;
    if (isChecked) {
      newViews = [...selectedViews, viewValue];
      if (selectedViews.length === 0) {
        setAttributes({ views: newViews.join(", "), initialView: viewValue });
        return;
      }
    } else {
      newViews = selectedViews.filter((v) => v !== viewValue);
      if (initialView === viewValue && newViews.length > 0) {
        setAttributes({ views: newViews.join(", "), initialView: newViews[0] });
        return;
      }
    }
    setAttributes({ views: newViews.join(", ") });
  };

  const hasSource = ics;

  // Get calendar count for display
  const calendarCount = ics
    ? ics
        .split(",")
        .map((u) => u.trim())
        .filter((u) => u).length
    : 0;

  return (
    <div {...blockProps}>
      <div className="pcemb-inline-editor">
        {/* Header */}
        <div className="pcemb-inline-editor__header">
          <svg
            className="pcemb-inline-editor__header-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="28"
            height="28"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <rect
              x="6"
              y="14"
              width="2"
              height="2"
              rx="0.5"
              fill="currentColor"
            />
            <rect
              x="11"
              y="14"
              width="2"
              height="2"
              rx="0.5"
              fill="currentColor"
            />
            <rect
              x="16"
              y="14"
              width="2"
              height="2"
              rx="0.5"
              fill="currentColor"
            />
            <rect
              x="6"
              y="18"
              width="2"
              height="2"
              rx="0.5"
              fill="currentColor"
            />
            <rect
              x="11"
              y="18"
              width="2"
              height="2"
              rx="0.5"
              fill="currentColor"
            />
          </svg>
          <span className="pcemb-inline-editor__title">
            {__("Pretty Calendar Embeds", "hydrogen-calendar-embeds")}
          </span>
        </div>

        {/* Calendar Source - Always visible and prominent */}
        <div className="pcemb-inline-editor__section pcemb-inline-editor__section--primary">
          <div className="pcemb-inline-editor__section-header">
            <svg
              className="pcemb-inline-editor__section-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span className="pcemb-inline-editor__section-title">
              {__("Calendar Source", "hydrogen-calendar-embeds")}
            </span>
          </div>

          <div className="pcemb-inline-editor__calendars">
            {hasSource ? (
              <>
                <div className="pcemb-inline-editor__calendar-count">
                  {calendarCount === 1
                    ? __("1 calendar configured", "hydrogen-calendar-embeds")
                    : calendarCount +
                      __(" calendars configured", "hydrogen-calendar-embeds")}
                </div>
                <div className="pcemb-inline-editor__calendar-urls">
                  {ics
                    .split(",")
                    .map((url) => url.trim())
                    .filter((url) => url)
                    .map((url, index) => (
                      <div
                        key={index}
                        className="pcemb-inline-editor__calendar-url"
                      >
                        {url.length > 60
                          ? url.substring(0, 30) +
                            "…" +
                            url.substring(url.length - 25)
                          : url}
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className="pcemb-inline-editor__no-source">
                {__(
                  "No calendar source configured yet.",
                  "hydrogen-calendar-embeds"
                )}
              </div>
            )}
            <Button
              variant={hasSource ? "secondary" : "primary"}
              onClick={openIcsModal}
              className="pcemb-inline-editor__add-btn"
            >
              {hasSource
                ? __("Edit Calendar URLs", "hydrogen-calendar-embeds")
                : __("Add Calendar URLs", "hydrogen-calendar-embeds")}
            </Button>
          </div>
        </div>

        {/* Views Section - Collapsible */}
        <div className="pcemb-inline-editor__section">
          <button
            className="pcemb-inline-editor__section-toggle"
            onClick={() => setShowViews(!showViews)}
            type="button"
          >
            <svg
              className="pcemb-inline-editor__section-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="pcemb-inline-editor__section-title">
              {__("Views", "hydrogen-calendar-embeds")}
            </span>
            <span className="pcemb-inline-editor__section-summary">
              {selectedViews.length > 0
                ? selectedViews.length +
                  (selectedViews.length === 1 ? " view" : " views")
                : "Default"}
            </span>
            <span
              className={`pcemb-inline-editor__chevron ${
                showViews ? "pcemb-inline-editor__chevron--open" : ""
              }`}
            >
              ▶
            </span>
          </button>

          {showViews && (
            <div className="pcemb-inline-editor__section-content">
              <div className="pcemb-inline-editor__views-grid">
                {allViewOptions.map((option) => (
                  <CheckboxControl
                    key={option.value}
                    label={option.label}
                    checked={selectedViews.includes(option.value)}
                    onChange={(isChecked) =>
                      handleViewToggle(option.value, isChecked)
                    }
                  />
                ))}
              </div>

              {selectedViews.length > 0 && (
                <SelectControl
                  label={__("Initial View", "hydrogen-calendar-embeds")}
                  value={initialView}
                  options={allViewOptions.filter((o) =>
                    selectedViews.includes(o.value)
                  )}
                  onChange={(value) => setAttributes({ initialView: value })}
                />
              )}

              <ToggleControl
                label={__(
                  "Force List View on Mobile",
                  "hydrogen-calendar-embeds"
                )}
                help={
                  !hasListView
                    ? __(
                        "Enable a list view above to use this feature.",
                        "hydrogen-calendar-embeds"
                      )
                    : __(
                        "Automatically switch to list view on mobile devices.",
                        "hydrogen-calendar-embeds"
                      )
                }
                checked={enforceListviewOnMobile}
                onChange={(value) =>
                  setAttributes({ enforceListviewOnMobile: value })
                }
                disabled={!hasListView}
              />

              {enforceListviewOnMobile && hasListView && (
                <TextControl
                  label={__(
                    "Mobile Breakpoint (px)",
                    "hydrogen-calendar-embeds"
                  )}
                  help={__(
                    "Screen width at which list view is enforced.",
                    "hydrogen-calendar-embeds"
                  )}
                  value={mobileBreakpoint}
                  onChange={(value) =>
                    setAttributes({ mobileBreakpoint: value })
                  }
                  type="number"
                  min="320"
                  max="1280"
                />
              )}

              {selectedViews.includes("listCustom") && (
                <div className="pcemb-inline-editor__custom-list">
                  <TextControl
                    label={__("Custom List Days", "hydrogen-calendar-embeds")}
                    value={customDays}
                    onChange={(value) => setAttributes({ customDays: value })}
                    type="number"
                  />
                  <TextControl
                    label={__(
                      "Custom List Button Label",
                      "hydrogen-calendar-embeds"
                    )}
                    value={customListButton}
                    onChange={(value) =>
                      setAttributes({ customListButton: value })
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Display Settings - Collapsible */}
        <div className="pcemb-inline-editor__section">
          <button
            className="pcemb-inline-editor__section-toggle"
            onClick={() => setShowDisplay(!showDisplay)}
            type="button"
          >
            <svg
              className="pcemb-inline-editor__section-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M2 17h20M6 21h12" />
            </svg>
            <span className="pcemb-inline-editor__section-title">
              {__("Display", "hydrogen-calendar-embeds")}
            </span>
            <span className="pcemb-inline-editor__section-summary">
              {localeOptions.find((l) => l.value === locale)?.label || locale}
            </span>
            <span
              className={`pcemb-inline-editor__chevron ${
                showDisplay ? "pcemb-inline-editor__chevron--open" : ""
              }`}
            >
              ▶
            </span>
          </button>

          {showDisplay && (
            <div className="pcemb-inline-editor__section-content">
              <SelectControl
                label={__("Locale", "hydrogen-calendar-embeds")}
                value={locale}
                options={localeOptions}
                onChange={(value) => setAttributes({ locale: value })}
              />
              <ToggleControl
                label={__("Show Title", "hydrogen-calendar-embeds")}
                checked={showTitle}
                onChange={(value) => setAttributes({ showTitle: value })}
              />
              <ToggleControl
                label={__("Show Today Button", "hydrogen-calendar-embeds")}
                checked={showTodayButton}
                onChange={(value) => setAttributes({ showTodayButton: value })}
              />
              <ToggleControl
                label={__("Show Tooltips", "hydrogen-calendar-embeds")}
                checked={useTooltip}
                onChange={(value) => setAttributes({ useTooltip: value })}
              />
              <ToggleControl
                label={__("Hide Past Events", "hydrogen-calendar-embeds")}
                checked={hidePast}
                onChange={(value) => setAttributes({ hidePast: value })}
              />
            </div>
          )}
        </div>

        {/* Advanced / Developer - Collapsible */}
        <div className="pcemb-inline-editor__section">
          <button
            className="pcemb-inline-editor__section-toggle"
            onClick={() => setShowAdvanced(!showAdvanced)}
            type="button"
          >
            <svg
              className="pcemb-inline-editor__section-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span className="pcemb-inline-editor__section-title">
              {__("Advanced", "hydrogen-calendar-embeds")}
            </span>
            <span className="pcemb-inline-editor__section-summary">
              {fcArgs && fcArgs !== "{}" ? "Custom JSON" : ""}
            </span>
            <span
              className={`pcemb-inline-editor__chevron ${
                showAdvanced ? "pcemb-inline-editor__chevron--open" : ""
              }`}
            >
              ▶
            </span>
          </button>

          {showAdvanced && (
            <div className="pcemb-inline-editor__section-content">
              <TextControl
                label={__("Calendar Identifiers", "hydrogen-calendar-embeds")}
                help={__(
                  "Comma-separated names for CSS styling (e.g., soccer, tennis)",
                  "hydrogen-calendar-embeds"
                )}
                value={calIds}
                onChange={(value) => setAttributes({ calIds: value })}
                placeholder="soccer, tennis, holidays"
              />

              {/* Display cal_id mappings */}
              {hasSource && (
                <div className="pcemb-inline-editor__cal-ids-mapping">
                  <p className="components-base-control__label">
                    {__("Calendar Prefix Mapping", "hydrogen-calendar-embeds")}
                  </p>
                  <div className="pcemb-inline-editor__cal-ids-list">
                    {ics
                      .split(",")
                      .map((url) => url.trim())
                      .filter((url) => url)
                      .map((url, index) => {
                        const ids = calIds
                          ? calIds
                              .split(",")
                              .map((id) => id.trim())
                              .filter((id) => id)
                          : [];
                        const calId = ids[index] || index;
                        return (
                          <div
                            key={index}
                            className="pcemb-inline-editor__cal-id-item"
                          >
                            <span className="pcemb-inline-editor__cal-id-prefix">
                              {calId}
                            </span>
                            <span className="pcemb-inline-editor__cal-id-url">
                              {url.length > 50
                                ? url.substring(0, 25) +
                                  "…" +
                                  url.substring(url.length - 20)
                                : url}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              <div className="pcemb-inline-editor__fc-args">
                <p className="components-base-control__label">
                  {__(
                    "Custom FullCalendar Settings",
                    "hydrogen-calendar-embeds"
                  )}
                </p>
                {fcArgs && fcArgs !== "{}" && (
                  <pre className="pcemb-inline-editor__fc-args-preview">
                    {formatJsonForDisplay(fcArgs)}
                  </pre>
                )}
                <Button variant="secondary" onClick={openFcArgsModal}>
                  {fcArgs && fcArgs !== "{}"
                    ? __("Edit JSON Settings", "hydrogen-calendar-embeds")
                    : __("Add JSON Settings", "hydrogen-calendar-embeds")}
                </Button>
              </div>

              {/* Copy Shortcode */}
              <div className="pcemb-inline-editor__copy-shortcode">
                <p className="components-base-control__label">
                  {__("Shortcode", "hydrogen-calendar-embeds")}
                </p>
                <p className="components-base-control__help">
                  {__(
                    "Copy shortcode to use in Classic Editor or other contexts.",
                    "hydrogen-calendar-embeds"
                  )}
                </p>
                <Button
                  variant="secondary"
                  onClick={copyShortcode}
                  disabled={!ics}
                >
                  {shortcodeCopied
                    ? __("Copied!", "hydrogen-calendar-embeds")
                    : __("Copy Shortcode", "hydrogen-calendar-embeds")}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        {hasSource && (
          <div className="pcemb-inline-editor__footer">
            {__(
              "Calendar will render on the frontend",
              "hydrogen-calendar-embeds"
            )}
          </div>
        )}
      </div>

      {/* ICS Modal */}
      {isIcsModalOpen && (
        <Modal
          title={__("ICS Calendar URLs", "hydrogen-calendar-embeds")}
          onRequestClose={() => setIsIcsModalOpen(false)}
          className="pcemb-modal"
        >
          <div className="pcemb-modal__content">
            <p>
              {__(
                "Enter one ICS calendar URL per line.",
                "hydrogen-calendar-embeds"
              )}
            </p>
            <textarea
              className="pcemb-modal__textarea"
              value={icsEditorValue}
              onChange={(e) => setIcsEditorValue(e.target.value)}
              placeholder={`https://calendar.google.com/calendar/ical/example/public/basic.ics
https://example.com/events.ics`}
              rows={8}
              spellCheck={false}
            />
            <div className="pcemb-modal__actions">
              <Button
                variant="secondary"
                onClick={() => setIsIcsModalOpen(false)}
              >
                {__("Cancel", "hydrogen-calendar-embeds")}
              </Button>
              <Button variant="primary" onClick={saveIcsModal}>
                {__("Save", "hydrogen-calendar-embeds")}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* FC Args Modal */}
      {isFcArgsModalOpen && (
        <Modal
          title={__("Custom FullCalendar Settings", "hydrogen-calendar-embeds")}
          onRequestClose={() => setIsFcArgsModalOpen(false)}
          className="pcemb-modal pcemb-modal--large"
        >
          <div className="pcemb-modal__content">
            <p>
              {__(
                "Enter valid JSON to pass directly to FullCalendar.",
                "hydrogen-calendar-embeds"
              )}
            </p>
            <textarea
              className="pcemb-modal__textarea pcemb-modal__textarea--code"
              value={fcArgsEditorValue}
              onChange={(e) => setFcArgsEditorValue(e.target.value)}
              placeholder={`{
  "weekends": false,
  "hiddenDays": [0, 6],
  "businessHours": {
    "daysOfWeek": [1, 2, 3, 4, 5],
    "startTime": "09:00",
    "endTime": "17:00"
  }
}`}
              rows={15}
              spellCheck={false}
            />
            <div className="pcemb-modal__actions">
              <Button
                variant="secondary"
                onClick={() => setIsFcArgsModalOpen(false)}
              >
                {__("Cancel", "hydrogen-calendar-embeds")}
              </Button>
              <Button variant="primary" onClick={saveFcArgsModal}>
                {__("Save", "hydrogen-calendar-embeds")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
