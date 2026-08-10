import { useState } from "react";
import { Search, Phone, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Destinations", href: "#destinations" },
    { name: "Travel Style", href: "#travel-style" },
    { name: "Search & Book", href: "#search-book" },
    { name: "Connected Agents", href: "#agents" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e1e6e6] bg-[#f4f9fb]">
      <div className="mx-auto max-w-[1220px] px-5 lg:px-8">

        {/* ================= MAIN NAVBAR ================= */}
        <div className="relative flex h-[72px] items-center justify-between">

          {/* ================= LOGO ================= */}
<a
  href="/"
  className="flex shrink-0 items-center"
>
  <div className="flex items-center">

    {/* Logo Mark */}
    <img
      src="/logo.png"
      alt=""
      className="
        h-[48px]
        w-[38px]
        object-contain
        object-center
        sm:h-[52px]
        sm:w-[42px]
      "
    />

    {/* Logo Text */}
    <div className="ml-1 flex flex-col justify-center leading-none">
      
      {/* TRAVEL */}
      <span
        className="
          text-[24px]
          font-bold
          tracking-[-0.5px]
          text-[#006f5d]
          sm:text-[25px]
        "
      >
        TRAVEL
      </span>

      {/* BEST BETS */}
      <span
        className="
          mt-[2px]
          text-[18px]
          font-normal
          tracking-[-0.2px]
          text-[#006f5d]
          sm:text-[19px]
        "
      >
        BEST BETS
      </span>

    </div>

  </div>
</a>

          {/* ================= DESKTOP NAV ================= */}
          <nav
            className="
              absolute
              left-1/2
              hidden
              -translate-x-1/2
              items-center
              lg:flex
            "
          >
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                className={`
                  flex
                  h-[34px]
                  items-center
                  whitespace-nowrap
                  px-[20px]
                  text-[14px]
                  font-normal
                  text-[#111111]
                  transition-colors
                  hover:text-[#007a67]

                  ${
                    index !== 0
                      ? "border-l border-[#d8dddd]"
                      : ""
                  }
                `}
              >
                {link.name}
              </a>
            ))}

            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              className="
                flex
                h-[34px]
                w-[52px]
                items-center
                justify-center
                border-l
                border-[#d8dddd]
                text-[#111111]
                transition
                hover:text-[#007a67]
              "
            >
              <Search
                size={19}
                strokeWidth={1.8}
              />
            </button>

            {/* Phone */}
            <button
              type="button"
              aria-label="Phone"
              className="
                flex
                h-[34px]
                w-[52px]
                items-center
                justify-center
                border-l
                border-[#d8dddd]
                text-[#111111]
                transition
                hover:text-[#007a67]
              "
            >
              <Phone
                size={18}
                strokeWidth={1.8}
              />
            </button>
          </nav>

          {/* ================= DESKTOP CTA ================= */}
          <div className="hidden shrink-0 lg:block">
            <a
              href="#become-agent"
              className="
                inline-flex
                h-[42px]
                min-w-[177px]
                items-center
                justify-center
                border
                border-[#007a67]
                px-5
                text-[14px]
                font-normal
                text-[#007a67]
                transition-all
                duration-200
                hover:bg-[#007a67]
                hover:text-white
              "
            >
              Become an Agent
            </a>
          </div>

          {/* ================= MOBILE BUTTON ================= */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="
              ml-auto
              rounded-md
              p-2
              text-[#007a67]
              lg:hidden
            "
            aria-label="Toggle navigation"
          >
            {isOpen ? (
              <X
                size={27}
                strokeWidth={1.8}
              />
            ) : (
              <Menu
                size={27}
                strokeWidth={1.8}
              />
            )}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <div
          className={`
            overflow-hidden
            transition-all
            duration-300
            lg:hidden

            ${
              isOpen
                ? "max-h-[500px] border-t border-[#dfe5e5] pb-5"
                : "max-h-0"
            }
          `}
        >
          <nav className="flex flex-col pt-3">

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="
                  border-b
                  border-[#e5e9e9]
                  py-4
                  text-sm
                  text-[#111111]
                  transition
                  hover:text-[#007a67]
                "
              >
                {link.name}
              </a>
            ))}

            {/* Mobile Actions */}
            <div className="flex items-center gap-6 py-5">

              <button
                type="button"
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-[#111111]
                  hover:text-[#007a67]
                "
              >
                <Search size={18} />
                Search
              </button>

              <button
                type="button"
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-[#111111]
                  hover:text-[#007a67]
                "
              >
                <Phone size={18} />
                Contact
              </button>

            </div>

            {/* Mobile CTA */}
            <a
              href="#become-agent"
              onClick={() => setIsOpen(false)}
              className="
                w-full
                border
                border-[#007a67]
                py-3
                text-center
                text-sm
                text-[#007a67]
                transition
                hover:bg-[#007a67]
                hover:text-white
              "
            >
              Become an Agent
            </a>

          </nav>
        </div>

      </div>
    </header>
  );
};

export default Navbar;