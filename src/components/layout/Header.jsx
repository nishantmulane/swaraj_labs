import logo from "../../assets/swaraj-logo.svg";

function Header({ version = "V1.2", module }) {
  return (
    <header className="px-6 pt-7 sm:px-10 lg:px-16 lg:pt-8">
      <div
        className="
          flex
          items-center
          justify-between

          border-b
          border-line-soft
          pb-5
        "
      >
        {/* =====================================
            BRAND
        ===================================== */}

        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="Swaraj Labs"
            className="
              h-11
              w-11
              shrink-0
              object-contain
              opacity-95

              sm:h-12
              sm:w-12
            "
          />

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

        {/* =====================================
            VERSION / MODULE
        ===================================== */}

        <div className="hidden items-center gap-4 sm:flex">
          <span
            className="
              mono
              text-[9px]
              uppercase
              tracking-[0.18em]
              text-muted-soft
            "
          >
            {version}
          </span>

          {module && (
            <>
              <span
                className="
                  h-1
                  w-1
                  rounded-full
                  bg-muted
                "
              />

              <span
                className="
                  mono
                  text-[10px]
                  tracking-[0.18em]
                  text-muted
                "
              >
                MODULE / {module}
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;