function NetworkWire({ packet, transmission }) {
  const status = transmission?.status || "READY";

  const isTransmitting = status === "TRANSMITTING";
  const isReceiving = status === "RECEIVING";
  const isDelivered = status === "DELIVERED";

  const isActive =
    isTransmitting ||
    isReceiving ||
    isDelivered;

  const packetVisible =
    Boolean(packet) &&
    (isTransmitting ||
      isReceiving ||
      isDelivered);

  return (
    <div
      className="
        flex
        w-full
        shrink-0
        items-center
        justify-center

        lg:w-[150px]
      "
    >
      <div
        className="
          relative
          flex
          w-full
          items-center
          justify-center

          py-3
        "
      >
        {/* =====================================
            CONNECTION LINE
        ===================================== */}

        <div
          className={`
            absolute
            left-0
            right-0
            top-1/2

            h-px
            -translate-y-1/2

            ${
              isActive
                ? "bg-accent/60"
                : "bg-line"
            }
          `}
        />

        {/* =====================================
            CONNECTION NODE — SENDER SIDE
        ===================================== */}

        <span
          className={`
            absolute
            left-0
            top-1/2

            h-1.5
            w-1.5
            -translate-y-1/2
            rounded-full

            ${
              isActive
                ? "bg-accent"
                : "bg-muted"
            }
          `}
        />

        {/* =====================================
            CONNECTION NODE — RECEIVER SIDE
        ===================================== */}

        <span
          className={`
            absolute
            right-0
            top-1/2

            h-1.5
            w-1.5
            -translate-y-1/2
            rounded-full

            ${
              isActive
                ? "bg-accent"
                : "bg-muted"
            }
          `}
        />

        {/* =====================================
            PACKET
        ===================================== */}

        {packetVisible && (
          <div
            className="
              relative
              z-10

              flex
              h-7
              min-w-7
              items-center
              justify-center

              border
              border-accent/50

              bg-surface-deep

              px-2

              mono
              text-[7px]
              uppercase
              tracking-[0.08em]

              text-accent
            "
          >
            {packet?.id || "PKT"}
          </div>
        )}

        {/* =====================================
            READY STATE
        ===================================== */}

        {!packetVisible && (
          <div
            className="
              relative
              z-10

              flex
              items-center

              border
              border-line-soft

              bg-surface-deep

              px-2.5
              py-1

              mono
              text-[7px]
              uppercase
              tracking-[0.14em]

              text-muted-soft
            "
          >
            Connection
          </div>
        )}
      </div>
    </div>
  );
}

export default NetworkWire;