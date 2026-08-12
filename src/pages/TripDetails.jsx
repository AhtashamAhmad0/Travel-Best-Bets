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

  // EDITOR / default — HTML string
  const cleanValue = String(value);

  if (/<[a-z][\s\S]*>/i.test(cleanValue)) {
    return (
      <div
        className="prose max-w-none prose-headings:text-[#111] prose-p:text-gray-700 prose-li:text-gray-700 prose-a:text-[#006f5d] prose-a:underline"
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
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            gap-7
            px-5
            py-7
            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:px-8
          "
        >
          {/* TITLE */}

          <div>
            <h1
              className="
                text-3xl
                font-bold
                leading-tight
                text-[#111]
              "
            >
              {title}
            </h1>

            <p className="mt-2 text-[#9a7c46]">
              {date}
            </p>
          </div>

          {/* PRICE */}

          <div className="flex items-center gap-7">
            <div>
              <p className="text-xs text-gray-500">
                From
              </p>

              <p className="text-4xl font-bold text-[#111]">
                ${price}
              </p>

              {tax && (
                <p className="text-sm text-gray-500">
                  +${tax} tax
                </p>
              )}
            </div>

            <button
              type="button"
              className="
                hidden
                bg-[#006f5d]
                px-5
                py-3
                text-sm
                font-medium
                text-white
                lg:block
              "
            >
              Book Now
            </button>
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
          <div
            className="
              mx-auto
              flex
              max-w-7xl
              items-center
              gap-8
              px-5
              py-6
              lg:px-8
            "
          >
            {icons
              .slice(0, 6)
              .map((item, index) => {
                const iconUrl =
                  getIconUrl(item?.icon);

                if (!iconUrl) return null;

                return (
                  <div
                    key={`${item.icon}-${index}`}
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                    "
                  >
                    <img
                      src={iconUrl}
                      alt=""
                      aria-hidden="true"
                      className="
                        h-10
                        w-10
                        object-contain
                      "
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
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
        <section
          className="
            sticky
            top-0
            z-30
            bg-[#9a7c46]
            shadow-sm
          "
        >
          <div
            className="
              mx-auto
              flex
              max-w-7xl
              justify-center
              overflow-x-auto
            "
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`
                  relative
                  whitespace-nowrap
                  px-6
                  py-4
                  text-sm
                  font-medium
                  text-white
                  transition
                  ${activeTab === tab.id
                    ? "bg-black/5"
                    : "hover:bg-black/5"
                  }
                `}
              >
                {tab.label}

                {activeTab === tab.id && (
                  <span
                    className="
                      absolute
                      bottom-0
                      left-1/2
                      h-0.5
                      w-8
                      -translate-x-1/2
                      bg-white
                    "
                  />
                )}
              </button>
            ))}
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

          {apiTabs.map(
            (tab) =>
              activeTab === tab.id && (
                <div key={tab.id}>
                  <h2 className="text-3xl font-bold text-[#111]">
                    {tab.label}
                  </h2>
                   {console.log("Tab content items:", tab.content.map(c => c.type))}

                  <div className="mt-8 space-y-8">
                    {tab.content.map(
                      (item, index) => (
                        <div
                          key={`${tab.id}-${index}`}
                        >
                          <ApiContent
                            type={item.type}
                            value={item.value}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )
          )}
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