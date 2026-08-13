import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Loader2,
} from "lucide-react";

import {
  getPackageBySlug,
  getRelatedPackages,
} from "../services/api";
import TermsAndConditions from "../component/TermsAndConditions";
/* =========================================================
   CONSTANTS
========================================================= */

const ICON_BASE_URL =
  "https://www.travelbestbets.com/assets/images/packages/packageIcons/";


/* =========================================================
   HELPERS
========================================================= */

const stripHtml = (html = "") => {
  if (!html) return "";

  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(
    `${date}T00:00:00`
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
};

const formatDateRange = (
  dateRanges = []
) => {
  if (
    !Array.isArray(dateRanges) ||
    dateRanges.length === 0
  ) {
    return "Dates available on request";
  }

  const range = dateRanges[0];

  const start = formatDate(range?.start);
  const end = formatDate(range?.end);

  if (!start) {
    return "Dates available on request";
  }

  if (!end || start === end) {
    return start;
  }

  return `${start} – ${end}`;
};

/* =========================================================
   LOCAL ICON
========================================================= */

const getIconUrl = (icon) => {
  if (!icon) return "";

  if (
    icon.startsWith("http://") ||
    icon.startsWith("https://")
  ) {
    return icon;
  }

  return `${ICON_BASE_URL}${icon}`;
};

/* =========================================================
   TAB CONTENT
========================================================= */

const getTabContent = (tab) => {
  const content = [];

  const sections =
    Array.isArray(tab?.data)
      ? tab.data
      : [];

  sections.forEach((section) => {
    const items =
      Array.isArray(section?.content)
        ? section.content
        : [];

    items.forEach((item) => {
      if (
        item?.value !== undefined &&
        item?.value !== null &&
        item?.value !== ""
      ) {
        content.push({
          type: item.type,
          value: item.value,
        });
      }
    });
  });

  return content;
};

/* =========================================================
   NORMALIZE RELATED PACKAGE
========================================================= */

const normalizeRelatedPackage = (
  item
) => {
  const packageData =
    item?.packageData || item;

  if (!packageData) {
    return null;
  }

  return {
    id:
      item?.id ||
      packageData?.id,

    packageId:
      item?.packageId ||
      packageData?.packageId ||
      packageData?.id,

    slug:
      packageData?.packageUrl,

    title:
      packageData?.title?.trim() ||
      packageData?.packageName ||
      "Travel Package",

    description:
      stripHtml(
        packageData?.description || ""
      ),

    image:
      packageData?.bannerImage,

    price:
      packageData?.price,

    tax:
      packageData?.tax,

    date:
      formatDateRange(
        packageData?.dateRanges
      ),

    icons:
      packageData?.iconsData || [],
  };
};

/* =========================================================
   API CONTENT RENDERER
========================================================= */

/* =========================================================
   API CONTENT RENDERER
========================================================= */

const ApiContent = ({ type, value }) => {
  if (value === undefined || value === null || value === "") return null;

  // TABLE — value is an object: { headers: [...], rows: [[...]] }
  if (type === "table" && typeof value === "object") {
    const headers = Array.isArray(value.headers) ? value.headers : [];
    const rows = Array.isArray(value.rows) ? value.rows : [];
    const hasRealHeaders = headers.some((h) => stripHtml(h).trim() !== "");

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[15px] text-gray-700">
          {hasRealHeaders && (
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="border border-gray-200 bg-[#faf8f3] p-3 text-left font-semibold text-[#111]"
                    dangerouslySetInnerHTML={{ __html: h }}
                  />
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="border border-gray-200 p-3 align-top"
                    dangerouslySetInnerHTML={{ __html: cell }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // TITLE — plain sub-heading string, e.g. "Inclusions"
  if (type === "title") {
    return (
      <h3 className="text-xl font-semibold text-[#111]">
        {stripHtml(String(value))}
      </h3>
    );
  }

  // EDITOR / default — raw HTML string from the CMS (paragraphs, h5s,
  // <ul>/<li> inclusion lists, and inline-styled <table>s with their
  // own border-color / background-color per cell).
  const cleanValue = String(value);

  if (/<[a-z][\s\S]*>/i.test(cleanValue)) {
    return (
      <div
        className="
          anchor editor-output space-y-4 max-w-none
          text-xl text-black

          /* headings */
          [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black
          [&_h4]:text-black [&_h5]:text-black [&_h5]:mt-4 [&_h5]:font-semibold
          [&_h6]:text-black

          /* paragraphs */
          [&_p]:text-xl [&_p]:text-black

          /* lists — force bullets/numbers since Tailwind preflight
             strips list-style by default */
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:my-2
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_ol]:my-2
          [&_li]:text-xl [&_li]:text-black [&_li]:list-item

          /* nested lists inside li */
          [&_li_ul]:list-[circle] [&_li_ul]:mt-1
          [&_li_ol]:list-[lower-alpha] [&_li_ol]:mt-1

          /* links */
          [&_a]:text-primary-500 [&_a]:underline

          /* tables — inline border-color/background-color from the
             CMS wins per-cell, we just supply border-style/width */
          [&_table]:border-collapse [&_table]:w-full [&_table]:my-4
          [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_td]:align-top
          [&_th]:border [&_th]:border-gray-300 [&_th]:p-2 [&_th]:text-left
        "
        dangerouslySetInnerHTML={{ __html: cleanValue }}
      />
    );
  }

  return (
    <div className="whitespace-pre-line text-[15px] leading-7 text-gray-700">
      {cleanValue}
    </div>
  );
};

/* =========================================================
   RELATED CARD
========================================================= */

const RelatedCard = ({ trip }) => {
  return (
    <article
      className="
        overflow-hidden
        border
        border-gray-100
        bg-white
        shadow-sm
        transition
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      {/* IMAGE */}

      <div className="relative h-52 overflow-hidden">
        <img
          src={trip.image}
          alt={trip.title}
          className="
            h-full
            w-full
            object-cover
            transition
            duration-500
            hover:scale-105
          "
          onError={(event) => {
            event.currentTarget.style.display =
              "none";
          }}
        />

        {/* PRICE */}

        <div
          className="
            absolute
            right-0
            top-0
            bg-[#9a7c46]
            px-4
            py-3
            text-white
          "
        >
          <span className="block text-[11px]">
            From
          </span>

          <span className="text-xl font-bold">
            ${trip.price || "N/A"}
          </span>
        </div>
      </div>

      {/* CONTENT */}

      <div className="p-5">
        <h3 className="text-xl font-bold text-[#006f5d]">
          {trip.title}
        </h3>

        {trip.description && (
          <p
            className="
              mt-2
              line-clamp-2
              text-sm
              leading-6
              text-gray-500
            "
          >
            {trip.description}
          </p>
        )}

        {/* ICONS ONLY */}

        {trip.icons?.length > 0 && (
          <div className="mt-4 flex items-center gap-4">
            {trip.icons
              .slice(0, 5)
              .map((item, index) => {
                const iconUrl =
                  getIconUrl(item?.icon);

                if (!iconUrl) return null;

                return (
                  <img
                    key={`${item.icon}-${index}`}
                    src={iconUrl}
                    alt=""
                    aria-hidden="true"
                    className="
                      h-7
                      w-7
                      object-contain
                    "
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                );
              })}
          </div>
        )}

        {trip.date && (
          <p className="mt-4 text-sm text-gray-500">
            {trip.date}
          </p>
        )}

        <Link
          to={`/details/${trip.slug}`}
          className="
            mt-5
            block
            bg-[#006f5d]
            py-3
            text-center
            text-sm
            font-medium
            text-white
            transition
            hover:bg-[#005c4e]
          "
        >
          Explore
        </Link>
      </div>
    </article>
  );
};

/* =========================================================
   TRIP DETAILS
========================================================= */

const TripDetails = () => {
  const { slug } = useParams();

  const [trip, setTrip] =
    useState(null);

  const [relatedTrips, setRelatedTrips] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [relatedLoading, setRelatedLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [activeTab, setActiveTab] = useState("");

  /* =======================================================
     FETCH PACKAGE
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const fetchPackage = async () => {
      try {
        setLoading(true);
        setError("");
        setTrip(null);
        setRelatedTrips([]);

        if (!slug) {
          throw new Error(
            "Package slug is missing."
          );
        }

        /* ===============================================
           MAIN PACKAGE API

           Example:
           /packages/puerto-vallarta-mexico
        =============================================== */

        const response =
          await getPackageBySlug(slug);

        if (!response?.success) {
          throw new Error(
            response?.message ||
            "Failed to fetch package."
          );
        }

        if (cancelled) return;

        const packageData =
          response?.data;

        if (!packageData) {
          throw new Error(
            "Package data was not returned."
          );
        }
        // 👇 add this line here
        console.log("tabsData:", JSON.stringify(packageData.tabsData, null, 2));

        setTrip(packageData);

        /* ===============================================
           RELATED PACKAGES API

           Uses:
           packageData.id
           +
           packageData.travelStyles

           Example:
           /packages/421/related
           ?travelStyleIds=[...]
        =============================================== */

        if (
          packageData.id &&
          Array.isArray(
            packageData.travelStyles
          )
        ) {
          try {
            setRelatedLoading(true);

            const relatedResponse =
              await getRelatedPackages(
                packageData.id,
                packageData.travelStyles
              );

            if (
              !cancelled &&
              relatedResponse?.success
            ) {
              const related =
                Array.isArray(
                  relatedResponse.data
                )
                  ? relatedResponse.data
                  : [];

              const normalized =
                related
                  .map(
                    normalizeRelatedPackage
                  )
                  .filter(Boolean)
                  .filter(
                    (item) =>
                      item.slug !==
                      packageData.packageUrl
                  )
                  .slice(0, 3);

              setRelatedTrips(
                normalized
              );
            }
          } catch (relatedError) {
            console.error(
              "Related Packages API Error:",
              relatedError
            );
          } finally {
            if (!cancelled) {
              setRelatedLoading(false);
            }
          }
        }
      } catch (err) {
        console.error(
          "Package Details API Error:",
          err
        );

        if (!cancelled) {
          setError(
            err?.response?.data
              ?.message ||
            err?.message ||
            "Unable to load this travel package."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPackage();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  /* =======================================================
     API TABS
  ======================================================= */

  const apiTabs = useMemo(() => {
    if (!trip?.tabsData) {
      return [];
    }

    return trip.tabsData
      .map((tab, index) => ({
        id: `api-tab-${tab.tabId || index
          }`,

        tabId: tab.tabId,

        label:
          tab.label ||
          `Section ${index + 1}`,

        content:
          getTabContent(tab),
      }))
      .filter(
        (tab) =>
          tab.content.length > 0
      );
  }, [trip]);
  // 👇 add here, now that apiTabs exists
  useEffect(() => {
    if (apiTabs.length > 0 && !activeTab) {
      setActiveTab(apiTabs[0].id);
    }
  }, [apiTabs, activeTab]);

  /* =======================================================
     TABS
  ======================================================= */

  const tabs = apiTabs
    .filter((tab) => tab.label !== "Agent Section")
    .map((tab) => ({
      id: tab.id,
      label: tab.label,
    }));

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2
              size={44}
              className="
                mx-auto
                animate-spin
                text-[#006f5d]
              "
            />

            <p className="mt-4 text-gray-500">
              Loading travel package...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !trip) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-5 py-32 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Trip Not Found
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-gray-500">
            {error ||
              "The travel package could not be found."}
          </p>

          <Link
            to="/"
            className="
              mt-8
              inline-flex
              items-center
              gap-2
              bg-[#006f5d]
              px-6
              py-3
              font-medium
              text-white
              transition
              hover:bg-[#005c4e]
            "
          >
            <ArrowLeft size={17} />
            Back to Trips
          </Link>
        </div>
      </main>
    );
  }

  /* =======================================================
     VALUES
  ======================================================= */

  const title =
    trip.packageName ||
    trip.title ||
    "Travel Package";

  const date =
    formatDateRange(
      trip.dateRanges
    );

  const price =
    trip.price || "N/A";

  const tax =
    trip.tax;

  const icons =
    Array.isArray(
      trip.iconsData
    )
      ? trip.iconsData
      : [];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="bg-white">
      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="
          relative
          h-[300px]
          w-full
          overflow-hidden
          sm:h-[400px]
          lg:h-[500px]
        "
      >
        <img
          src={trip.bannerImage}
          alt={title}
          className="
            h-full
            w-full
            object-cover
          "
        />

        {/* OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-black/20
          "
        />

        {/* BACK */}

        <div className="absolute left-5 top-5 z-10 lg:left-10">
          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              bg-white/95
              px-4
              py-2
              text-sm
              font-medium
              text-gray-800
              shadow-lg
              transition
              hover:bg-white
            "
          >
            <ArrowLeft size={17} />
            Back
          </Link>
        </div>
      </section>

      {/* =================================================
          PACKAGE HEADER
      ================================================= */}

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1193px] flex-col items-start justify-between gap-2 py-5 px-4 md:flex-row md:items-center">
          {/* TITLE + DATE */}
          <div className="flex flex-col gap-2">
            <h1 className="flex max-w-3xl items-start gap-2 text-4xl font-bold text-black">
              {title}
            </h1>
            <span className="text-xl text-secondary-500">{date}</span>
          </div>

          {/* PRICE + CTA */}
          <div className="flex flex-col">
            <p className="text-sm text-black">From</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-black">${price}</span>
              {tax && <span className="text-2xl text-black">+${tax} tax</span>}
            </div>

            <div className="mt-4 md:mt-0">
              <button
                type="button"
                class="contained-button mt-2 bg-primary-500 px-6 py-2 font-medium text-white hover:bg-primary-600"
              >
                Request a Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          ICONS

          ONLY ICONS
          NO TEXT
      ================================================= */}

      {icons.length > 0 && (
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-[1193px] flex-nowrap justify-start gap-12 overflow-auto py-9 px-4">
            {icons.slice(0, 6).map((item, index) => {
              const iconUrl = getIconUrl(item?.icon);
              if (!iconUrl) return null;

              return (
                <div
                  key={`${item.icon}-${index}`}
                  className="flex flex-col items-center"
                >
                  <img
                    src={iconUrl}
                    alt=""
                    aria-hidden="true"
                    className="h-12 w-12 object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="mt-1 text-base text-black">
                    {[item.text1, item.text2].filter(Boolean).join(" ")}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =================================================
          TABS
      ================================================= */}

      {tabs.length > 0 && (
        <section className="sticky top-0 z-30 bg-secondary-500 shadow-sm">
          <div className="mx-auto flex w-full max-w-[1193px] items-center gap-4 px-3">
            <div className="hide-scrollbar mx-auto flex flex-nowrap gap-8 overflow-x-auto px-4 py-5 text-base">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`
              relative min-w-max cursor-pointer text-lg font-bold capitalize transition
              ${activeTab === tab.id ? "text-white" : "text-white/70 hover:text-white"}
            `}
                >
                  {tab.label}

                  {activeTab === tab.id && (
                    <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="bg-white">
        <div
          className="
            mx-auto
            max-w-6xl
            px-5
            py-14
            lg:px-8
          "
        >
          {/* =============================================
              OVERVIEW
          ============================================= */}



          {/* =============================================
              API TAB CONTENT
          ============================================= */}

          <section className="pt-12">
            <div className="mx-auto max-w-[1193px] space-y-6 overflow-x-auto px-4 pt-6">
              {apiTabs.map(
                (tab) =>
                  activeTab === tab.id && (
                    <div key={tab.id}>
                      <h2 className="mx-auto mt-5 max-w-[1193px] px-4 text-[32px] font-semibold capitalize text-black">
                        {tab.label}
                      </h2>

                      <div className="mt-8 space-y-8">
                        {tab.content.map((item, index) => (
                          <div key={`${tab.id}-${index}`}>
                            <ApiContent type={item.type} value={item.value} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}


            </div>
          </section>
          {/* 👇 add this, always visible regardless of active tab */}
          <div className="mt-14">
            <TermsAndConditions />
          </div>
        </div>
      </section>

      {/* =================================================
          RELATED PACKAGES
      ================================================= */}

      <section className="border-t border-gray-100 bg-[#f8f8f6]">
        <div
          className="
            mx-auto
            max-w-7xl
            px-5
            py-16
            lg:px-8
          "
        >
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a7c46]">
              More Travel
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#111]">
              You May Also Like
            </h2>
          </div>

          {/* LOADING */}

          {relatedLoading && (
            <div className="flex justify-center py-12">
              <Loader2
                size={34}
                className="
                  animate-spin
                  text-[#006f5d]
                "
              />
            </div>
          )}

          {/* RELATED CARDS */}

          {!relatedLoading &&
            relatedTrips.length > 0 && (
              <div
                className="
                  mt-10
                  grid
                  grid-cols-1
                  gap-6
                  md:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {relatedTrips.map(
                  (relatedTrip) => (
                    <RelatedCard
                      key={
                        relatedTrip.id ||
                        relatedTrip.slug
                      }
                      trip={
                        relatedTrip
                      }
                    />
                  )
                )}
              </div>
            )}

          {/* EMPTY */}

          {!relatedLoading &&
            relatedTrips.length === 0 && (
              <p className="mt-10 text-center text-sm text-gray-500">
                No related packages available.
              </p>
            )}
        </div>
      </section>
    </main>
  );
};

export default TripDetails;