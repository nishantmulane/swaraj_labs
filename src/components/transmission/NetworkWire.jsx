import { useEffect, useState } from "react";

const ROUTE = [
  {
    id: "router01",
    label: "ROUTER 01",
    role: "EXAMINING DESTINATION",
    progress: 8,
  },
  {
    id: "router02",
    label: "ROUTER 02",
    role: "FORWARDING PACKET",
    progress: 50,
  },
  {
    id: "gateway",
    label: "GATEWAY",
    role: "FORWARDING TO DESTINATION",
    progress: 88,
  },
];

const NODE_POSITION = {
  router01: "left-[8%]",
  router02: "left-1/2",
  gateway: "left-[88%]",
};

const JOURNEY = [
  {
    id: "router01",
    progress: 8,
    caption: "Router 01 → examining destination",
  },
  {
    id: "router02",
    progress: 50,
    caption: "Router 02 → forwarding packet",
  },
  {
    id: "gateway",
    progress: 88,
    caption: "Gateway → forwarding to destination",
  },
  {
    id: "receiver",
    progress: 100,
    caption: "Receiver → packet received",
  },
];

const JOURNEY_STEP = 500;

function RouteNode({ node, active }) {
  return (
    <div
      className={`
        absolute
        top-1/2
        z-10

        flex
        -translate-x-1/2
        -translate-y-1/2
        flex-col
        items-center

        ${NODE_POSITION[node.id]}
      `}
    >
      <div
        className={`
          relative

          flex
          h-10
          w-10
          items-center
          justify-center

          border
          bg-surface

          transition-all
          duration-200

          ${
            active
              ? "scale-105 border-accent bg-accent-deep"
              : "border-line"
          }
        `}
      >
        {/* ACTIVE MARKER */}

        {active && (
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-[-5px]

              border
              border-accent/30
            "
          />
        )}

        {/* CORE */}

        <span
          className={`
            h-2
            w-2
            rounded-full

            transition-all
            duration-200

            ${
              active
                ? "scale-125 bg-accent"
                : "bg-muted"
            }
          `}
        />
      </div>

      {/* LABEL */}

      <div
        className={`
          mono
          mt-2
          text-center

          text-[7px]
          uppercase
          tracking-[0.12em]

          ${
            active
              ? "text-accent-soft"
              : "text-muted"
          }
        `}
      >
        {node.label}
      </div>

      {/* TYPE */}

      <div
        className="
          mono
          mt-0.5
          text-center

          text-[6px]
          uppercase
          tracking-[0.12em]

          text-muted-soft
        "
      >
        {active ? node.role : "ROUTER"}
      </div>
    </div>
  );
}

function Packet({
  packet,
  message,
  progress,
  onInspect,
}) {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        z-30
      "
    >
      <div
        className="
          absolute
          top-1/2

          transition-[left]
          duration-500
          ease-in-out
        "
        style={{ left: `${progress}%` }}
      >
        <button
          type="button"
          onClick={onInspect}
          aria-label="Inspect packet"
          className="
            pointer-events-auto
            relative

            flex
            h-[64px]
            w-[126px]
            -translate-x-1/2
            -translate-y-[92px]

            flex-col
            items-center
            justify-center

            border
            border-accent/50
            bg-surface

            px-3

            transition-all
            duration-200

            hover:border-accent
            hover:bg-accent-deep

            focus-visible:outline-none
            focus-visible:ring-1
            focus-visible:ring-accent

            sm:h-[72px]
            sm:w-[142px]
            sm:-translate-y-[108px]
          "
        >
          {/* TOP MARKER */}

          <span
            aria-hidden="true"
            className="
              absolute
              -top-[5px]
              left-1/2

              h-px
              w-[60%]

              -translate-x-1/2

              bg-accent/50
            "
          />

          {/* LEFT MARKER */}

          <span
            aria-hidden="true"
            className="
              absolute
              -left-[5px]
              top-1/2

              h-[60%]
              w-px

              -translate-y-1/2

              bg-accent/50
            "
          />

          {/* RIGHT MARKER */}

          <span
            aria-hidden="true"
            className="
              absolute
              -right-[5px]
              top-1/2

              h-[60%]
              w-px

              -translate-y-1/2

              bg-accent/50
            "
          />

          {/* PACKET ID */}

          <span
            className="
              mono

              text-[10px]
              font-medium
              uppercase
              tracking-[0.12em]

              text-accent-soft

              sm:text-[11px]
              sm:tracking-[0.14em]
            "
          >
            {packet?.id ||
              packet?.packetId ||
              "PKT-0001"}
          </span>

          {/* PAYLOAD */}

          <span
            className="
              mono
              mt-1

              max-w-[96px]
              truncate

              text-[8px]
              uppercase
              tracking-[0.08em]

              text-muted-soft

              sm:max-w-[110px]
              sm:text-[9px]
              sm:tracking-[0.1em]
            "
          >
            {message}
          </span>

          {/* PACKET → NETWORK CONNECTOR */}

          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-full

              h-[30px]
              w-px

              -translate-x-1/2

              bg-accent/50

              sm:h-[36px]
            "
          >
            <span
              className="
                absolute
                bottom-0
                left-1/2

                h-2
                w-2

                -translate-x-1/2
                translate-y-1/2

                rounded-full

                bg-accent
              "
            />
          </span>
        </button>
      </div>
    </div>
  );
}

function NetworkWire({
  packet,
  transmission,
  onInspect,
}) {
  const status =
    transmission?.status || "READY";

  const showPacket =
    Boolean(packet) &&
    status === "TRANSMITTING";

  const isActive = [
    "TRANSMITTING",
    "RECEIVING",
    "DELIVERED",
  ].includes(status);

  const packetMessage =
    packet?.message ||
    packet?.payload ||
    "HELLO!";

  const packetKey =
    packet?.id ||
    packet?.packetId ||
    null;

  const [journey, setJourney] = useState({
    packetKey: null,
    progress: 0,
    activeNode: null,
    caption: "",
  });

  /*
   * During TRANSMITTING, journey is updated only by
   * timer callbacks. READY / RECEIVING / DELIVERED
   * are derived directly below instead of synchronously
   * setting state inside an effect.
   */
  useEffect(() => {
    if (status !== "TRANSMITTING" || !packetKey) {
      return undefined;
    }

    let cancelled = false;
    const timers = [];

    const updateJourney = (state) => {
      if (!cancelled) {
        setJourney(state);
      }
    };

    timers.push(
      setTimeout(() => {
        updateJourney({
          packetKey,
          progress: 0,
          activeNode: null,
          caption:
            "Packet created → starting transmission",
        });
      }, 0)
    );

    JOURNEY.forEach((stage, index) => {
      timers.push(
        setTimeout(() => {
          updateJourney({
            packetKey,
            progress: stage.progress,
            activeNode:
              stage.id === "receiver"
                ? null
                : stage.id,
            caption: stage.caption,
          });
        }, JOURNEY_STEP * (index + 1))
      );
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [status, packetKey]);

  const displayedJourney =
    status === "READY" || !packet
      ? {
          progress: 0,
          activeNode: null,
          caption: "",
        }
      : status === "RECEIVING"
        ? {
            progress: 100,
            activeNode: null,
            caption: "Receiver → packet received",
          }
        : status === "DELIVERED"
          ? {
              progress: 100,
              activeNode: null,
              caption: "Receiver → packet delivered",
            }
          : journey.packetKey === packetKey
            ? journey
            : {
                progress: 0,
                activeNode: null,
                caption:
                  "Packet created → starting transmission",
              };

  return (
    <div
      className="
        relative
        h-[160px]
        w-full
        min-w-0

        sm:h-[170px]
      "
    >
      {/* NETWORK LINE */}

      <div
        className={`
          absolute
          left-0
          right-0
          top-1/2

          h-px

          -translate-y-1/2

          transition-colors
          duration-300

          ${
            isActive
              ? "bg-accent/40"
              : "bg-line"
          }
        `}
      />

      {/* ROUTE NODES */}

      {ROUTE.map((node) => (
        <RouteNode
          key={node.id}
          node={node}
          active={
            displayedJourney.activeNode === node.id
          }
        />
      ))}

      {/* PACKET */}

      {showPacket && (
        <Packet
          packet={packet}
          message={packetMessage}
          progress={displayedJourney.progress}
          onInspect={onInspect}
        />
      )}

      {/* JOURNEY CAPTION */}

      <div
        className={`
          absolute
          bottom-[-2px]
          left-1/2

          w-[calc(100%-16px)]
          max-w-[420px]

          -translate-x-1/2

          text-center

          mono
          text-[6px]
          uppercase
          leading-relaxed
          tracking-[0.1em]

          transition-opacity
          duration-200

          sm:whitespace-nowrap
          sm:text-[7px]
          sm:tracking-[0.12em]

          ${
            displayedJourney.caption
              ? "text-muted"
              : "pointer-events-none opacity-0"
          }
        `}
      >
        {displayedJourney.caption}
      </div>
    </div>
  );
}

export default NetworkWire;