import logo from "../assets/swaraj-logo.svg";

function Header() {
  return (
    <header className="px-6 pt-7 sm:px-10 lg:px-16 lg:pt-8">
      <div className="flex items-center justify-between border-b border-line-soft pb-5">

        {/* Brand */}
        <div className="flex items-center gap-4">

          {/* Logo */}
          <img
            src={logo}
            alt="Swaraj Labs"
            className="
              h-10
              w-10
              shrink-0
              object-contain
              opacity-90

              sm:h-11
              sm:w-11
            "
          />

          {/* Wordmark */}
          <div>
            <div className="flex items-baseline gap-3">
              <span
                className="
                  text-xl
                  font-semibold
                  tracking-tight
                  text-ink

                  sm:text-2xl
                "
              >
                Swaraj Labs
              </span>

              <span
                className="
                  mono
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-muted
                "
              >
                / Network
              </span>
            </div>

            <div
              className="
                mono
                mt-1.5
                text-[9px]
                uppercase
                tracking-[0.18em]
                text-muted-soft
              "
            >
              by Nishant Mulane
            </div>
          </div>

        </div>

        {/* Module */}
        <div
          className="
            mono
            hidden
            text-[10px]
            tracking-[0.18em]
            text-muted

            sm:block
          "
        >
          MODULE / 01
        </div>

      </div>
    </header>
  );
}

export default Header;