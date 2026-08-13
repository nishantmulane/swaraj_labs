function NetworkWire({
  packet,
  transmission,
}) {
  const isTransmitting =
    transmission.status === "TRANSMITTING";

  const isReceiving =
    transmission.status === "RECEIVING";

  const isDelivered =
    transmission.status === "DELIVERED";

  const isActive =
    isTransmitting ||
    isReceiving ||
    isDelivered;

  return (
    <div
      className="
        relative

        flex
        items-center
        justify-center

        h-16
        w-0

        border-l-2
        border-dashed
        border-line

        lg:h-0
        lg:w-auto
        lg:flex-1

        lg:border-l-0
        lg:border-t-2
      "
    >
      {/* Idle signal */}

      {!isActive && (
        <span
          className="
            ambient-pulse

            pointer-events-none

            absolute
            left-0
            top-0

            h-1.5
            w-1.5

            rounded-full

            bg-muted

            blur-[1.5px]
          "
        />
      )}

      {/* Junction */}

      <span
        className={`
          absolute
          z-10

          h-2.5
          w-2.5

          rotate-45

          border
          bg-base

          transition-colors
          duration-300

          ${
            isActive
              ? "border-accent"
              : "border-line"
          }
        `}
      />

      {/* Travelling packet */}

      {isTransmitting && packet && (
        <div
          className="
            packet

            absolute
            left-0
            top-0

            z-20

            flex
            items-baseline
            gap-2

            whitespace-nowrap

            border
            border-accent

            bg-surface

            px-3
            py-1.5

            mono

            text-[10px]
            tracking-wide

            shadow-[0_0_14px_-2px_rgba(184,217,74,0.5)]
          "
        >
          <span className="text-accent-soft">
            {packet.payload}
          </span>

          <span className="text-muted-soft">
            {packet.size}B
          </span>
        </div>
      )}

      {/* Receiving */}

      {isReceiving && (
        <span
          className="
            mono

            absolute
            z-20

            whitespace-nowrap

            bg-surface

            px-2

            text-[8px]
            uppercase
            tracking-[0.18em]

            text-accent
          "
        >
          Receiving
        </span>
      )}

      {/* Successful delivery */}

      {isDelivered && (
        <span
          className="
            mono

            absolute
            z-20

            whitespace-nowrap

            bg-surface

            px-2

            text-[8px]
            uppercase
            tracking-[0.18em]

            text-accent
          "
        >
          Delivered
        </span>
      )}
    </div>
  );
}

export default NetworkWire;