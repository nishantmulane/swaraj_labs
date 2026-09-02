import React, { useEffect, useState } from "react";

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
    caption: "Gateway → forwarding to destination",
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
              ? "scale-105 border-accent shadow-[0_0_18px_rgba(184,217,74,0.18)]"
              : "border-line"
          }
        `}
      >
        {active && (
          <span
            className="
              pointer-events-none
              absolute
              inset-[-5px]
              rounded-full
              border
              border-accent/50
              animate-ping
            "
          />
        )}

        <span
          className={`
            h-2
            w-2
            rounded-full
            transition-all
            duration-200
            ${
              active
                ? "scale-150 bg-accent shadow-[0_0_14px_rgba(184,217,74,0.85)]"
                : "bg-muted"
            }
          `}
        />
      </div>

      <div
        className={`
          mono
          mt-2
          text-center
          text-[7px]
          uppercase
          tracking-[0.12em]
          ${active ? "text-accent" : "text-muted"}
        `}
      >
        {node.label}
      </div>

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

function Packet({ packet, message, progress, onInspect }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
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
            border-accent/60
            bg-surface/95
            shadow-[0_0_30px_rgba(184,217,74,0.16)]
            transition-all
            duration-200
            hover:border-accent
            hover:shadow-[0_0_38px_rgba(184,217,74,0.24)]
            sm:h-[72px]
            sm:w-[142px]
            sm:-translate-y-[108px]
          "
        >
          {/* Top accent */}
          <span
            className="
              absolute
              -top-[7px]
              left-1/2
              h-px
              w-[70%]
              -translate-x-1/2
              bg-accent/50
            "
          />

          {/* Left accent */}
          <span
            className="
              absolute
              -left-[7px]
              top-1/2
              h-[70%]
              w-px
              -translate-y-1/2
              bg-accent/50
            "
          />

          {/* Right accent */}
          <span
            className="
              absolute
              -right-[7px]
              top-1/2
              h-[70%]
              w-px
              -translate-y-1/2
              bg-accent/50
            "
          />

          {/* Packet ID */}
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
            {packet?.id || packet?.packetId || "PKT-0001"}
          </span>

          {/* Payload */}
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

          {/* Packet → Network connector */}
          <span
            className="
              pointer-events-none
              absolute
              left-1/2
              top-full
              h-[30px]
              w-px
              -translate-x-1/2
              bg-accent/60
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
                shadow-[0_0_12px_rgba(184,217,74,0.75)]
              "
            />
          </span>
        </button>
      </div>
    </div>
  );
}

function NetworkWire({ packet, transmission, onInspect }) {
  const status = transmission?.status || "READY";

  const showPacket =
    Boolean(packet) &&
    status === "TRANSMITTING";

  const isActive =
    ["TRANSMITTING", "RECEIVING", "DELIVERED"].includes(status);

  const packetMessage =
    packet?.message ||
    packet?.payload ||
    "HELLO!";

  const [journey, setJourney] = useState({
    progress: 0,
    activeNode: null,
    caption: "",
  });

  useEffect(() => {
    if (status === "READY" || !packet) {
      setJourney({
        progress: 0,
        activeNode: null,
        caption: "",
      });

      return;
    }

    if (status !== "TRANSMITTING") {
      return;
    }

    let cancelled = false;
    const timers = [];

    const updateJourney = (state) => {
      if (!cancelled) {
        setJourney(state);
      }
    };

    updateJourney({
      progress: 0,
      activeNode: null,
      caption: "Packet created → starting transmission",
    });

    JOURNEY.forEach((stage, index) => {
      timers.push(
        setTimeout(() => {
          updateJourney({
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
  }, [status, packet?.id]);

  useEffect(() => {
    if (status === "RECEIVING") {
      setJourney({
        progress: 100,
        activeNode: null,
        caption: "Receiver → packet received",
      });
    }

    if (status === "DELIVERED") {
      setJourney({
        progress: 100,
        activeNode: null,
        caption: "Receiver → packet delivered",
      });
    }
  }, [status]);

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
      {/* Network line */}
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
          ${isActive ? "bg-accent/40" : "bg-line"}
        `}
      />

      {/* Route nodes */}
      {ROUTE.map((node) => (
        <RouteNode
          key={node.id}
          node={node}
          active={journey.activeNode === node.id}
        />
      ))}

      {/* Packet */}
      {showPacket && (
        <Packet
          packet={packet}
          message={packetMessage}
          progress={journey.progress}
          onInspect={onInspect}
        />
      )}

      {/* Journey caption */}
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
            journey.caption
              ? "text-muted"
              : "pointer-events-none opacity-0"
          }
        `}
      >
        {journey.caption}
      </div>
    </div>
  );
}

export default NetworkWire;