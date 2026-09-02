import { useEffect, useState } from "react";
import logo from "../../assets/swaraj-logo.svg";

const NODES = [
  { id: "sender", label: "SENDER", x: 8 },
  { id: "router01", label: "ROUTER 01", x: 30 },
  { id: "router02", label: "ROUTER 02", x: 50 },
  { id: "gateway", label: "GATEWAY", x: 70 },
  { id: "receiver", label: "RECEIVER", x: 92 },
];

const LINKS = [
  ["sender", "router01"],
  ["router01", "router02"],
  ["router02", "gateway"],
  ["gateway", "receiver"],
];

function EntryTransition({ onComplete }) {
  const [phase, setPhase] = useState("brand");
  const [builtNodes, setBuiltNodes] = useState(0);
  const [builtLinks, setBuiltLinks] = useState(0);
  const [packetProgress, setPacketProgress] = useState(0);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  useEffect(() => {
    const timers = [];

    // -----------------------------------------
    // BRAND → NETWORK
    // -----------------------------------------

    timers.push(
      setTimeout(() => {
        setPhase("construction");
      }, 2300)
    );

    // -----------------------------------------
    // BUILD NODES
    // -----------------------------------------

    NODES.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setBuiltNodes(index + 1);
        }, 2600 + index * 300)
      );
    });

    // -----------------------------------------
    // BUILD CONNECTIONS
    // -----------------------------------------

    LINKS.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setBuiltLinks(index + 1);
        }, 2850 + index * 300)
      );
    });

    // -----------------------------------------
    // ESTABLISH ROUTE
    // -----------------------------------------

    timers.push(
      setTimeout(() => {
        setPhase("route");
      }, 4300)
    );

    // -----------------------------------------
    // SEND PACKET
    // -----------------------------------------

    timers.push(
      setTimeout(() => {
        setPhase("packet");
      }, 4700)
    );

    // -----------------------------------------
    // PACKET MOVEMENT
    // -----------------------------------------

    const packetSteps = [8, 30, 50, 70, 92];

    packetSteps.forEach((progress, index) => {
      timers.push(
        setTimeout(() => {
          setPacketProgress(progress);
        }, 4850 + index * 700)
      );
    });

    // -----------------------------------------
    // ONLINE
    // -----------------------------------------

    timers.push(
      setTimeout(() => {
        setPhase("online");
      }, 8000)
    );

    // -----------------------------------------
    // ENTER HOME
    // -----------------------------------------

    timers.push(
      setTimeout(() => {
        onComplete();
      }, 9000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onComplete]);

  const showNetwork =
    phase === "construction" ||
    phase === "route" ||
    phase === "packet" ||
    phase === "online";

  return (
    <div
      className={`
        fixed
        inset-0
        z-[100]
        h-[100dvh]
        w-full
        overflow-hidden
        overscroll-none
        bg-base
        transition-opacity
        duration-700
        ${
          phase === "online"
            ? "opacity-100"
            : "opacity-100"
        }
      `}
    >
      {/* =========================================
          AMBIENT GRID
      ========================================= */}

      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          network-grid
          transition-opacity
          duration-1000
          ${showNetwork ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* =========================================
          CENTER GLOW
      ========================================= */}

      <div
        className={`
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[280px]
          w-[280px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[radial-gradient(circle,rgba(184,217,74,0.10),transparent_70%)]
          transition-all
          duration-1000
          ${
            showNetwork
              ? "scale-100 opacity-100"
              : "scale-50 opacity-0"
          }
        `}
      />

      {/* =========================================
          BRAND
      ========================================= */}

      <div
        className={`
          absolute
          inset-0
          flex
          items-center
          justify-center
          transition-all
          duration-1000
          ${
            phase === "brand"
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0"
          }
        `}
      >
        <div className="flex flex-col items-center text-center">
          <img
            src={logo}
            alt="Swaraj Labs"
            className="
              animate-entry-logo
              h-24
              w-24
              object-contain
              opacity-95
              sm:h-28
              sm:w-28
              md:h-32
              md:w-32
              lg:h-36
              lg:w-36
            "
          />

          <div
            className="
              animate-entry-title
              mt-5
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
              tracking-[0.08em]
              text-muted-soft
            "
          >
            By Nishant Mulane
          </div>
        </div>
      </div>

      {/* =========================================
          NETWORK CONSTRUCTION
      ========================================= */}

      <div
        className={`
          absolute
          inset-0
          flex
          items-center
          justify-center
          px-6
          transition-all
          duration-1000
          ${
            showNetwork
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }
        `}
      >
        <div className="w-full max-w-[1050px]">
          {/* HEADER */}

          <div className="mb-8 flex items-end justify-between sm:mb-10">
            <div>
              <div className="mono text-[8px] uppercase tracking-[0.2em] text-muted">
                SWARAJ LABS / NETWORK
              </div>

              <div className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-ink">
                Network Construction
              </div>
            </div>

            <div className="mono text-[8px] uppercase tracking-[0.18em] text-muted-soft">
              MODULE / 01
            </div>
          </div>

          {/* NETWORK */}

          <div className="relative h-[190px] w-full sm:h-[220px]">
            {/* CONNECTIONS */}

            {LINKS.map(([from, to], index) => {
              const fromNode = NODES.find(
                (node) => node.id === from
              );

              const toNode = NODES.find(
                (node) => node.id === to
              );

              const visible = builtLinks > index;

              return (
                <div
                  key={`${from}-${to}`}
                  className={`
                    absolute
                    top-1/2
                    h-px
                    -translate-y-1/2
                    bg-line
                    transition-all
                    duration-500
                    ${
                      visible
                        ? "opacity-100"
                        : "scale-x-0 opacity-0"
                    }
                  `}
                  style={{
                    left: `${fromNode.x}%`,
                    width: `${toNode.x - fromNode.x}%`,
                    transformOrigin: "left center",
                  }}
                >
                  <div
                    className={`
                      absolute
                      inset-0
                      bg-accent
                      transition-opacity
                      duration-300
                      ${
                        phase === "route" ||
                        phase === "packet" ||
                        phase === "online"
                          ? "opacity-40"
                          : "opacity-0"
                      }
                    `}
                  />
                </div>
              );
            })}

            {/* NODES */}

            {NODES.map((node, index) => {
              const visible = builtNodes > index;

              return (
                <div
                  key={node.id}
                  className={`
                    absolute
                    top-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                    transition-all
                    duration-500
                    ${
                      visible
                        ? "scale-100 opacity-100"
                        : "scale-50 opacity-0"
                    }
                  `}
                  style={{ left: `${node.x}%` }}
                >
                  {/* NODE */}

                  <div
                    className={`
                      relative
                      flex
                      h-3
                      w-3
                      items-center
                      justify-center
                      rounded-full
                      border
                      transition-all
                      duration-500
                      ${
                        phase === "packet" &&
                        node.x === packetProgress
                          ? "border-accent bg-accent shadow-[0_0_18px_rgba(184,217,74,0.6)]"
                          : "border-line bg-surface"
                      }
                    `}
                  >
                    <div
                      className={`
                        h-1
                        w-1
                        rounded-full
                        transition-all
                        duration-500
                        ${
                          phase === "route" ||
                          phase === "packet" ||
                          phase === "online"
                            ? "bg-accent"
                            : "bg-muted"
                        }
                      `}
                    />
                  </div>

                  {/* LABEL */}

                  <div
                    className="
                      absolute
                      left-1/2
                      top-7
                      -translate-x-1/2
                      whitespace-nowrap
                      mono
                      text-[10px]
                      uppercase
                      tracking-[0.14em]
                      text-muted-soft
                    "
                  >
                    {node.label}
                  </div>
                </div>
              );
            })}

            {/* PACKET */}

            {phase === "packet" && (
              <div
                className="
                  absolute
                  left-0
                  top-1/2
                  h-2
                  w-2
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-accent
                  shadow-[0_0_18px_rgba(184,217,74,0.7)]
                  transition-all
                  duration-[400ms]
                  ease-out
                "
                style={{
                  left: `${packetProgress}%`,
                }}
              />
            )}
          </div>

          {/* ROUTE STATUS */}

          <div
            className={`
              mt-6
              flex
              items-center
              justify-between
              border
              border-line-soft
              bg-surface
              px-4
              py-3
              transition-all
              duration-700
              ${
                phase === "route" ||
                phase === "packet" ||
                phase === "online"
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              }
            `}
          >
            <div className="mono text-[7px] uppercase tracking-[0.16em] text-muted">
              PACKET ROUTE
            </div>

            <div className="mono text-[7px] uppercase tracking-[0.14em] text-muted-soft">
              SENDER → ROUTER 01 → ROUTER 02 → GATEWAY → RECEIVER
            </div>
          </div>

          {/* SYSTEM MESSAGE */}

          <div className="mt-5 flex justify-center">
            <div
              className={`
                mono
                text-[8px]
                uppercase
                tracking-[0.2em]
                transition-all
                duration-700
                ${
                  phase === "online"
                    ? "scale-100 text-accent opacity-100"
                    : "scale-95 text-muted opacity-0"
                }
              `}
            >
              NETWORK ONLINE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntryTransition;