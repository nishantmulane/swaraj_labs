import { useEffect, useState } from "react";

function EntryTransition({ onComplete }) {
  const [introVisible, setIntroVisible] = useState(true);
  const [shellReady, setShellReady] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [open, setOpen] = useState(false);

  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const introTimer = setTimeout(() => {
      setIntroVisible(false);
    }, 3200);

    const shellTimer = setTimeout(() => {
      setShellReady(true);
    }, 3600);

    const handleMouseMove = (event) => {
      setCursor({
        x: event.clientX,
        y: event.clientY,
        active: true,
      });
    };

    const handleMouseLeave = () => {
      setCursor((previous) => ({
        ...previous,
        active: false,
      }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(shellTimer);

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, []);

  const breakShell = () => {
    if (breaking) return;

    setBreaking(true);

    // Impact / crack phase
    setTimeout(() => {
      setOpen(true);
    }, 750);

    // Reveal Home after page movement begins
    setTimeout(() => {
      onComplete();
    }, 1550);
  };

  return (
    <>
      {/* =========================================
          BRAND INTRO
      ========================================= */}

      <div
        className={`
          fixed
          inset-0
          z-[100]

          flex
          items-center
          justify-center

          bg-base

          transition-all
          duration-700

          ${
            !introVisible
              ? "pointer-events-none invisible opacity-0"
              : "opacity-100"
          }
        `}
      >
        <div className="text-center">

          <div
            className="
              animate-entry-title

              text-[clamp(25px,4vw,36px)]
              font-semibold
              uppercase
              tracking-[0.18em]

              text-ink
            "
          >
            Swaraj Labs
          </div>

          <div
            className="
              animate-entry-author

              mono
              mt-4

              text-[clamp(9px,1.2vw,11px)]
              font-medium
              uppercase

              text-muted-soft
            "
          >
            By Nishant Mulane
          </div>

        </div>
      </div>


      {/* =========================================
          SHELL
      ========================================= */}

      <div
        className={`
          fixed
          inset-0
          z-[90]

          overflow-hidden

          bg-base

          [perspective:1800px]

          transition-opacity
          duration-500

          ${
            shellReady
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      >

        {/* Cursor ambient light */}

        <div
          className={`
            cursor-glow

            ${
              cursor.active
                ? "opacity-100"
                : "opacity-0"
            }
          `}
          style={{
            left: cursor.x,
            top: cursor.y,
          }}
        />


        {/* =====================================
            LEFT PAGE
        ===================================== */}

        <div
          className={`
            absolute
            left-0
            top-0

            h-full
            w-1/2

            bg-base

            border-r
            border-line-soft

            origin-right

            [transform-style:preserve-3d]
            [backface-visibility:hidden]

            transition-transform
            duration-[1500ms]
            ease-[cubic-bezier(0.76,0,0.18,1)]

            ${
              open
                ? "-translate-x-full -rotate-y-[18deg]"
                : ""
            }
          `}
        >
          <div
            className="
              absolute
              right-0
              top-0

              h-full
              w-px

              bg-gradient-to-b
              from-transparent
              via-line
              to-transparent

              opacity-20
            "
          />
        </div>


        {/* =====================================
            RIGHT PAGE
        ===================================== */}

        <div
          className={`
            absolute
            right-0
            top-0

            h-full
            w-1/2

            bg-base

            border-l
            border-line-soft

            origin-left

            [transform-style:preserve-3d]
            [backface-visibility:hidden]

            transition-transform
            duration-[1500ms]
            ease-[cubic-bezier(0.76,0,0.18,1)]

            ${
              open
                ? "translate-x-full rotate-y-[18deg]"
                : ""
            }
          `}
        >
          <div
            className="
              absolute
              left-0
              top-0

              h-full
              w-px

              bg-gradient-to-b
              from-transparent
              via-line
              to-transparent

              opacity-20
            "
          />
        </div>


        {/* =====================================
            CENTER LIGHT
        ===================================== */}

        <div
          className={`
            pointer-events-none

            absolute
            left-1/2
            top-1/2

            h-[100px]
            w-[100px]

            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            bg-[radial-gradient(circle,rgba(184,217,74,0.13),transparent_70%)]

            transition-all
            duration-700

            ${
              shellReady
                ? "animate-shell-pulse opacity-100"
                : "opacity-0"
            }

            ${
              breaking
                ? "scale-[1.8]"
                : ""
            }
          `}
        />


        {/* =====================================
            CENTER CRACK
        ===================================== */}

        <div
          className={`
            pointer-events-none

            absolute
            left-1/2
            top-1/2

            w-px

            -translate-x-1/2
            -translate-y-1/2

            bg-accent

            transition-all
            duration-700

            ${
              shellReady
                ? "h-[52%] opacity-20"
                : "h-0 opacity-0"
            }

            ${
              breaking
                ? `
                  h-[84%]
                  opacity-80
                  shadow-[0_0_32px_rgba(184,217,74,0.32)]
                `
                : ""
            }
          `}
        />


        {/* =====================================
            BREAK BUTTON
        ===================================== */}

        <button
          type="button"
          onClick={breakShell}
          disabled={breaking}
          aria-label="Break the shell and enter Swaraj Labs"
          className={`
            group

            absolute
            left-1/2
            top-1/2

            h-[68px]
            w-[68px]

            -translate-x-1/2
            -translate-y-1/2

            border
            border-line

            bg-transparent

            transition-all
            duration-300

            ${
              breaking
                ? `
                  scale-[1.18]
                  border-accent-soft
                  shadow-[0_0_45px_rgba(184,217,74,0.28)]
                `
                : `
                  hover:scale-[1.08]
                  hover:border-accent
                  hover:shadow-[0_0_30px_rgba(184,217,74,0.16)]
                `
            }

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-accent/30
          `}
        >
          <span
            className={`
              absolute
              inset-[17px]

              rotate-45

              border
              border-muted-soft

              transition-all
              duration-500

              ${
                breaking
                  ? "rotate-90 scale-75 border-accent"
                  : "group-hover:scale-110 group-hover:border-accent-soft"
              }
            `}
          />
        </button>


        {/* =====================================
            INSTRUCTION
        ===================================== */}

        <div
          className={`
            absolute
            left-1/2
            top-[calc(50%+60px)]

            -translate-x-1/2

            whitespace-nowrap

            mono
            text-[8px]
            uppercase
            tracking-[0.22em]

            text-muted-soft

            transition-all
            duration-500

            ${
              shellReady && !breaking
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            }
          `}
        >
          Click to break
        </div>

      </div>
    </>
  );
}

export default EntryTransition;