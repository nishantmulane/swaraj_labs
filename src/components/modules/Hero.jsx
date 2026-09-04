import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <section
        className="
          relative
          min-h-[calc(100vh-116px)]
          overflow-hidden
        "
      >
        {/* =====================================
            BLUEPRINT BACKGROUND
        ===================================== */}

        <div
          aria-hidden="true"
          className="module-hero-background"
        />

        <div
          className="
            mx-auto
            grid
            min-h-[calc(100vh-116px)]
            w-full
            max-w-7xl
            items-center

            gap-8

            px-6
            py-12

            sm:px-10
            sm:py-14

            lg:grid-cols-[1.1fr_0.9fr]
            lg:gap-10
            lg:px-8
            lg:py-12
          "
        >
          {/* =====================================
              NETWORK PREVIEW — LEFT
          ===================================== */}

          <div
            className="
              module-hero-network
              relative
              h-[260px]
              w-full

              sm:h-[300px]

              lg:order-1
              lg:h-[340px]

              xl:h-[380px]
            "
          >
            <div
              className="
                absolute
                inset-0
                border
                border-line-soft
                bg-surface/[0.18]
              "
            />

            <div
              className="
                absolute
                left-5
                top-0
                z-20
                -translate-y-1/2
                bg-base
                px-2

                mono
                text-[8px]
                tracking-[0.16em]
                text-muted
              "
            >
              PACKET JOURNEY / PREVIEW
            </div>

            <div
              className="
                absolute
                bottom-0
                right-5
                z-20
                translate-y-1/2
                bg-base
                px-2

                mono
                text-[8px]
                tracking-[0.16em]
                text-accent
              "
            >
              TRANSMISSION READY
            </div>

            <div
              aria-hidden="true"
              className="
                module-hero-scan
                pointer-events-none
                absolute
                left-0
                top-0
                z-10

                h-px
                w-full

                bg-accent/20
              "
            />

            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 720 450"
              preserveAspectRatio="none"
              role="img"
              aria-label="Packet journey from sender through two routers to receiver"
            >
              {/* MAIN ROUTE */}

              <path
                className="module-hero-route text-line"
                d="M 42 225 L 205 145 L 360 225 L 665 225"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />

              {/* ROUTER CONNECTIONS */}

              <path
                d="M 205 145 V 225 M 360 225 V 145"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-line-soft"
              />

              {/* SENDER */}

              <g className="module-hero-node module-hero-node-1">
                <circle
                  cx="42"
                  cy="225"
                  r="7"
                  fill="var(--color-base)"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-line"
                />

                <circle
                  cx="42"
                  cy="225"
                  r="2.5"
                  fill="currentColor"
                  className="text-accent"
                />
              </g>

              {/* ROUTER 01 */}

              <g className="module-hero-node module-hero-node-2">
                <circle
                  cx="205"
                  cy="145"
                  r="10"
                  fill="var(--color-base)"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-line"
                />

                <circle
                  cx="205"
                  cy="145"
                  r="3"
                  fill="currentColor"
                  className="text-accent"
                />
              </g>

              {/* ROUTER 02 */}

              <g className="module-hero-node module-hero-node-3">
                <circle
                  cx="360"
                  cy="225"
                  r="10"
                  fill="var(--color-base)"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-line"
                />

                <circle
                  cx="360"
                  cy="225"
                  r="3"
                  fill="currentColor"
                  className="text-accent"
                />
              </g>

              <circle
                cx="360"
                cy="225"
                r="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="module-hero-ring text-accent/30"
              />

              {/* RECEIVER */}

              <g className="module-hero-node module-hero-node-4">
                <circle
                  cx="665"
                  cy="225"
                  r="7"
                  fill="var(--color-base)"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-line"
                />

                <circle
                  cx="665"
                  cy="225"
                  r="2.5"
                  fill="currentColor"
                  className="text-accent"
                />
              </g>

              {/* PACKET */}

              <g className="module-hero-packet">
                <circle
                  r="3"
                  fill="currentColor"
                  className="text-accent"
                />
              </g>
            </svg>

            {/* LABELS */}

            <span
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2

                mono
                text-[8px]
                tracking-[0.12em]
                text-muted
              "
            >
              SENDER
            </span>

            <span
              className="
                absolute
                left-[28%]
                top-[30%]

                mono
                text-[8px]
                tracking-[0.12em]
                text-muted
              "
            >
              ROUTER 01
            </span>

            <span
              className="
                absolute
                left-[50%]
                top-1/2
                mt-5

                mono
                text-[8px]
                tracking-[0.12em]
                text-muted
              "
            >
              ROUTER 02
            </span>

            <span
              className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2

                mono
                text-[8px]
                tracking-[0.12em]
                text-muted
              "
            >
              RECEIVER
            </span>

            {/* NETWORK META */}

            <div
              className="
                absolute
                bottom-4
                left-5

                flex
                flex-wrap
                items-center
                gap-x-5
                gap-y-2

                mono
                text-[7px]
                tracking-[0.1em]
                text-muted
              "
            >
              <span>
                SOURCE{" "}
                <strong className="ml-1 font-normal text-muted-soft">
                  SENDER
                </strong>
              </span>

              <span>
                HOPS{" "}
                <strong className="ml-1 font-normal text-muted-soft">
                  02
                </strong>
              </span>

              <span>
                STATUS{" "}
                <strong className="ml-1 font-normal text-accent">
                  ACTIVE
                </strong>
              </span>
            </div>
          </div>

          {/* =====================================
              HERO COPY — RIGHT
          ===================================== */}

          <div
            className="
              relative
              z-10
              max-w-3xl

              lg:order-2
              lg:justify-self-end
            "
          >
            <div
              className="
                module-hero-eyebrow

                mb-5
                flex
                items-center
                gap-3

                mono
                text-[9px]
                uppercase
                tracking-[0.2em]
                text-accent
              "
            >
              <span
                aria-hidden="true"
                className="h-px w-7 bg-accent"
              />

              Interactive Networking Laboratory
            </div>

            <h1
              className="
                text-[clamp(3.5rem,6.8vw,7rem)]
                font-medium
                leading-[0.86]
                tracking-[-0.07em]
              "
            >
              <span className="module-hero-title-line block">
                Understand
              </span>

              <span className="module-hero-title-line block text-muted">
                networks.
              </span>

              <span className="module-hero-title-line mt-2 block text-ink">
                See the system.
              </span>
            </h1>

            <p
              className="
                module-hero-description

                mt-7
                max-w-[470px]

                border-l
                border-line-soft
                pl-4

                text-[13px]
                leading-6
                text-muted

                sm:text-sm
                sm:leading-7
              "
            >
              Explore how data moves through a network — from the moment a
              message leaves its source to the moment it reaches its
              destination.
            </p>

            {/* CTA */}

            <div className="module-hero-actions mt-8">
              <button
                type="button"
                onClick={() => navigate("/modules")}
                className="
                  group
                  inline-flex
                  items-center
                  gap-4

                  border
                  border-accent
                  bg-accent

                  px-5
                  py-3

                  mono
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-accent-deep

                  transition-all
                  duration-200

                  hover:border-accent-hover
                  hover:bg-accent-hover

                  focus-visible:outline-none
                  focus-visible:ring-1
                  focus-visible:ring-accent
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-base
                "
              >
                Start Lab

                <span
                  aria-hidden="true"
                  className="
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </button>

              <div
                className="
                  mt-3
                  mono
                  text-[7px]
                  uppercase
                  tracking-[0.14em]
                  text-muted-soft
                "
              >
                Explore the network modules
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;