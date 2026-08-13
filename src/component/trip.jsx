import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Loader2 } from "lucide-react";

import { getTopBestBets } from "../services/api";

/* =========================================================
   CONSTANTS
========================================================= */

const ICON_BASE_URL =
  "https://www.travelbestbets.com/assets/images/packages/packageIcons/";


/* =========================================================
   HELPERS
========================================================= */

const stripHtml = (value = "") => {
  if (!value) return "";

  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<\/li>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
};

/* =========================================================
   DATE FORMAT
========================================================= */

const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateRange = (dateRanges = []) => {
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
   ICON URL

   IMPORTANT:
   Do NOT use:
   https://www.travelbestbets.com/assets/...

   Local icons are used instead.
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
   LOCATION
========================================================= */

const getLocation = (title = "") => {
  if (!title) return "";

  const parts = title.split(",");

  if (parts.length > 1) {
    return parts[parts.length - 1].trim();
  }

  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("alaska")) {
    return "Alaska";
  }

  if (lowerTitle.includes("bali")) {
    return "Indonesia";
  }

  if (lowerTitle.includes("peru")) {
    return "Peru";
  }

  if (lowerTitle.includes("greece")) {
    return "Greece";
  }

  if (lowerTitle.includes("italy")) {
    return "Italy";
  }

  if (lowerTitle.includes("malta")) {
    return "Malta";
  }

  if (lowerTitle.includes("mexico")) {
    return "Mexico";
  }

  return "";
};

/* =========================================================
   PROMOTION BADGES
========================================================= */

const getBadges = (packageData = {}) => {
  const badges = [];

  if (
    packageData.promotionOne?.isActive &&
    packageData.promotionOne?.value
  ) {
    badges.push(
      stripHtml(packageData.promotionOne.value)
    );
  }

  if (
    packageData.promotionTwo?.isActive &&
    packageData.promotionTwo?.value
  ) {
    badges.push(
      stripHtml(packageData.promotionTwo.value)
    );
  }

  return [...new Set(badges)]
    .filter(Boolean)
    .slice(0, 2);
};

/* =========================================================
   TRIP CARD
========================================================= */

const TripCard = ({ trip }) => {
  return (
    <article
      className="
        group
        flex
        min-h-[620px]
        flex-col
        overflow-hidden
        border
        border-gray-100
        bg-[#F5F8F5]
        p-3
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* IMAGE */}
      <div className="relative aspect-[10/7] overflow-hidden">
        <img
          src={trip.image}
          alt={trip.title}
          className="
            h-full
            w-full
            bg-primary-100/20
            object-cover
            text-transparent
            transition-transform
            duration-500
            group-hover:scale-105
            w-[480]
            h-[336]
          "
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

        {/* PRICE BADGE */}
        <div className="absolute right-0 top-0 bg-secondary-500 px-4 py-2.5 text-white">
          <p className="text-sm">From</p>
          <h4 className="text-3xl font-bold">${trip.price || "N/A"}</h4>
          {trip.tax && (
            <h5 className="text-right text-sm">+${trip.tax} tax</h5>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-5 h-full flex flex-1 flex-col justify-between gap-5">
        <div className="w-[480px] h-[77.59px]">
          <h3 className="mb-3 text-[28px] font-bold leading-[1.2] text-primary-500 hover:text-primary-600">
            {trip.title}
          </h3>

          {trip.description && (
            <p className="mb-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-base text-black">
              {trip.description}
            </p>
          )}
        </div>
        {/* BADGES — unchanged, not covered in your screenshots */}

        {trip.badges?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {trip.badges.map((badge) => (
              <span
                key={badge}
                className="border border-secondary-500/40 bg-[#faf8f3] px-2.5 py-1 text-[11px] text-secondary-500"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-col justify-beween">
          {/* ICONS */}
        {trip.icons?.length > 0 && (
          <div className=" flex  gap-4">
            {trip.icons.slice(0, 5).map((item, index) => {
              const iconUrl = getIconUrl(item?.icon);
              if (!iconUrl) return null;
              return (
                <div
                  key={`${item.icon}-${index}`}

                >
                  <img
                    src={iconUrl}
                    alt=""
                    aria-hidden="true"
                    className=" object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />

                </div>
              );
            })}
          </div>
        )}

        {/* DATE */}

        <div className="mb-2.5 mt-3 flex flex-wrap items-center gap-x-3">
          <span className="text-lg text-[#8C7343] font-18px ">{trip.date}</span>
        </div>
        {/* BUTTONS */}
        <div className=" flex gap-2">
          <Link
            to={`/details/${trip.slug}`}
            className="flex-1 bg-primary-500 py-2 text-center text-[14px] font-medium text-white transition hover:bg-primary-600"
          >
            Explore
          </Link>

          <button
            type="button"
            className="flex-1 bg-primary-500 py-2 text-ceter text-[14px] font-medium text-white transition hover:bg-primary-600"
          >
            Book Now
          </button>
        </div>
        </div>
      </div>
    </article>
  );
};

/* =========================================================
   TRIP
========================================================= */

const Trip = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     FETCH TOP BEST BETS
  ======================================================= */

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTopBestBets();

      if (!response?.success) {
        throw new Error(
          response?.message ||
          "Failed to fetch trips."
        );
      }

      const formattedTrips = (
        response.data || []
      )
        .map((item) => {
          const packageData =
            item?.packageData;

          if (!packageData) {
            return null;
          }

          return {
            id: item.id,

            packageId:
              item.packageId ||
              packageData.packageId ||
              packageData.id,

            slug:
              packageData.packageUrl,

            title:
              packageData.title?.trim() ||
              "Travel Package",

            location:
              getLocation(
                packageData.title
              ),

            image:
              packageData.bannerImage,

            price:
              packageData.price,

            tax:
              packageData.tax,

            description:
              stripHtml(
                packageData.description ||
                ""
              ),

            date:
              formatDateRange(
                packageData.dateRanges
              ),

            badges:
              getBadges(packageData),

            icons:
              packageData.iconsData || [],

            company:
              packageData.company,

            isActive:
              packageData.isActive,

            promotionOne:
              packageData.promotionOne,

            promotionTwo:
              packageData.promotionTwo,

            travelStyles:
              packageData.travelStyles || [],

            departureCities:
              packageData.departureCities ||
              [],

            destinationCountries:
              packageData.destinationCountries ||
              [],
          };
        })
        .filter(Boolean);

      setTrips(formattedTrips);
    } catch (err) {
      console.error(
        "Top Best Bets API Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load travel packages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section className="bg-[#f8f8f6] py-20">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2
              size={42}
              className="mx-auto animate-spin text-[#006f5d]"
            />

            <p className="mt-4 text-gray-500">
              Loading travel packages...
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <section className="bg-[#f8f8f6] py-20">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Unable to Load Packages
          </h2>

          <p className="mt-3 text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchTrips}
            className="
              mt-6
              bg-[#006f5d]
              px-6
              py-3
              text-white
              transition
              hover:bg-[#005c4e]
            "
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      id="top-best-bets"
      className="
        bg-[#f8f8f6]
        py-16
        sm:py-20
        lg:py-24
      "
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* HEADING */}

        <div className="mb-10 text-center ">


          <h1 className="mb-10 text-4xl font-bold text-[#000] sm:text-4xl">
            Our Top Best Bets
          </h1>
        </div>

        {/* =================================================
            GRID
        ================================================= */}

        {trips.length > 0 ? (
          <div
            className="
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
              
            "
          >
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-500">
              No travel packages available.
            </p>
          </div>
        )}

        {/* =================================================
            CUSTOM PLAN
        ================================================= */}

        <div
          className="
            mt-10
            bg-[#9a7c46]
            px-5
            py-8
            text-center
            text-white
          "
        >
          <p className="text-lg font-medium">
            Need a Customized Plan?
          </p>

          <button
            type="button"
            className="
              mt-4
              border
              border-white/70
              px-6
              py-2.5
              text-sm
              font-medium
              uppercase
              tracking-wide
              transition
              hover:bg-white
              hover:text-[#9a7c46]
            "
          >
            Request a Quote →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Trip;