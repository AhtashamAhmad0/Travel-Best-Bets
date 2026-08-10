import {
    CalendarDays,
} from "lucide-react";

const trips = [
    {
        id: 1,
        title: "Alaska Inside Passage",
        location: "Alaska",
        image: "/img1.png",
        icon: "/card1-icon.png",
        price: "$699",
        priceNote: "from",
        description: "7-night cruise aboard,fully guided vacation Serenade of the Seas",
        date: "May 4, 2025 – Sep 7, 2025",
        badges: ["USA USD", "Onboard Credit"],
        action: "Book Now",
        featured: true,


    },

    {
        id: 2,
        title: "Puerto Vallarta, Mexico",
        location: "Mexico",
        image: "/img2.png",
        icon: "/card2-icon.png",
        price: "$1,929",
        priceNote: "from",
        description: "7-night, 14 nights all-inclusive fully guided vacation hotel and transfer",
        date: "Dec 1, 2024 – Apr 27, 2024",
        badges: ["USA USD", "Onboard Credit"],
        action: "Book Now",


    },

    {
        id: 3,
        title: "Portugal: Coastal Cities & Cultural Treasures",
        location: "Portugal",
        image: "/img3.png",
        icon: "/card3-icon.png",
        price: "$699",
        priceNote: "from",
        description: "7-night, 10-day all-inclusive fully guided vacation experience",
        date: "Jan 14 – Dec 10, 2025",
        badges: ["USA USD", "Onboard Credit"],
        action: "Book Now",


    },

    {
        id: 4,
        title: "14 Nights Greece Tour & Mediterranean Cruise",
        location: "Greece",
        image: "/img4.png",
        icon: "/card4-icon.png",
        price: "$3,699",
        priceNote: "from",
        description: "14-night fully guided vacation, accommodation included",
        date: "May 4, 2025 – Sep 7, 2025",
        badges: ["USA USD", "Onboard Credit"],
        action: "Book Now",


    },

    {
        id: 5,
        title: "Alaska Inside Passage",
        location: "Alaska",
        image: "/img5.png",
        icon: "/card5-icon.png",
        price: "$499",
        priceNote: "from",
        description: "7-night cruise aboard Serenade and fully guided vacation of the Seas",
        date: "Jan 10, 2025 – Oct 15, 2025",
        badges: ["USA USD", "Onboard Credit"],
        action: "Book Now",


    },

    {
        id: 6,
        title: "Riviera Maya, Mexico",
        location: "Mexico",
        image: "/img6.png",
        icon: "/card6-icon.png",
        price: "$299",
        priceNote: "from",
        description: "7-night all-inclusive fully guided vacation resort experience",
        date: "Dec 1, 2024 – Apr 27, 2024",
        badges: ["USA USD", "Onboard Credit"],
        action: "Book Now",


    },
];

const TripCard = ({ trip }) => {
    return (
        <article
            className="
    group
    flex
    h-[650px]
    flex-col
    overflow-hidden
    bg-white
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-xl
  "
        >
            {/* ================= IMAGE ================= */}
            <div className="relative h-[240px] overflow-hidden">
                <img
                    src={trip.image}
                    alt={trip.title}
                    className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
                />

                {/* Price */}
                <div
                    className="
            absolute
            right-0
            top-0
            bg-[#725b32]
            px-4
            py-3
            text-right
            text-white
          "
                >
                    <p className="text-[12px] leading-none opacity-90">
                        {trip.priceNote}
                    </p>

                    <p className="mt-1 text-[22px] font-bold leading-none">
                        {trip.price}
                    </p>

                    <p className="mt-1 text-[11px] opacity-90">
                        + taxes
                    </p>
                </div>
            </div>

           {/* ================= CONTENT ================= */}
<div className="flex h-[410px] flex-col p-5">

  {/* Title + Description */}
  <div>
    <h3 className="h-[70px] text-[28px] font-bold leading-tight text-[#006f5d]">
      {trip.title}
    </h3>

    <p className="mt-3 h-[48px] text-[16px] leading-6 text-gray-500">
      {trip.description}
    </p>
  </div>

  {/* ================= TRAVEL ICON ================= */}
  {trip.icon && (
    <div className="mt-5 flex h-[40px] items-center">
      <img
        src={trip.icon}
        alt={`${trip.title} travel features`}
        className="
          h-[32px]
          w-auto
          max-w-[180px]
          object-contain
          object-left
        "
      />
    </div>
  )}

  {/* ================= DETAILS ================= */}
  <div className="mt-5 space-y-3">

    {/* Date */}
    <div className="flex items-center gap-2 text-[18px] text-gray-500">
      <CalendarDays
        size={19}
        strokeWidth={1.8}
        className="shrink-0"
      />

      <span>{trip.date}</span>
    </div>

  </div>

  {/* ================= BADGES ================= */}
  <div className="mt-4 flex min-h-[34px] flex-wrap gap-2">
    {trip.badges.map((badge) => (
      <span
        key={badge}
        className="
          rounded-sm
          border
          border-[#ddd]
          bg-[#f8f8f8]
          px-2
          py-1
          text-[12px]
          text-gray-500
        "
      >
        {badge}
      </span>
    ))}
  </div>

  {/* ================= BUTTONS ================= */}
  <div className="mt-auto flex gap-2 pt-6">

    <button
      type="button"
      className="
        flex-1
        bg-[#006f5d]
        py-3
        text-[16px]
        font-medium
        text-white
        transition
        duration-200
        hover:bg-[#005c4e]
      "
    >
      Explore
    </button>

    <button
      type="button"
      className="
        flex-1
        bg-[#006f5d]
        py-3
        text-[16px]
        font-medium
        text-white
        transition
        duration-200
        hover:bg-[#005c4e]
      "
    >
      {trip.action}
    </button>

  </div>

</div>
        </article>
    );
};

const Trip = () => {
    return (
        <section
            id="destinations"
            className="w-full bg-white py-8 px-0"
        >
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ================= HEADING ================= */}
                <div className="mb-10 text-center">
                    <h2 className="text-4xl font-bold leading-tight text-[#222]">
                        Our Top Best Bets
                    </h2>
                </div>

                {/* ================= TRIP GRID ================= */}
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
            </div>

            {/* ================= CUSTOMIZED PLAN ================= */}
            <div
                className="
          mt-8
          bg-[#9a7c46]
          px-4
          py-8
          text-center
          text-white
        "
            >
                <p className="text-[18px] font-medium">
                    Need a Customized Plan?
                </p>

                <button
                    type="button"
                    className="
            mt-4
            border
            border-white/70
            px-5
            py-2.5
            text-[16px]
            font-medium
            uppercase
            tracking-wide
            transition
            duration-200
            hover:bg-white
            hover:text-[#9a7c46]
          "
                >
                    Request a Quote →
                </button>
            </div>
        </section>
    );
};

export default Trip;