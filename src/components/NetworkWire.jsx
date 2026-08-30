import { useEffect, useState } from "react";

function NetworkWire({ packet, transmission, onInspect }) {
  const status = transmission?.status || "READY";

  const isTransmitting = status === "TRANSMITTING";
  const isReceiving = status === "RECEIVING";
  const isDelivered = status === "DELIVERED";

  const isActive =
    isTransmitting ||
    isReceiving ||
    isDelivered;

  const packetVisible =
    Boolean(packet) && isActive;

  /*
   * -------------------------------------------------
   * PACKET POSITION
   *
   * The packet starts at the sender.
   * Once transmission begins, it travels all the
   * way across the wire.
   * -------------------------------------------------
   */

  const [packetPosition, setPacketPosition] = useState(0);

  useEffect(() => {
    if (!packet) {
      setPacketPosition(0);
      return;
    }

    if (isTransmitting) {
      // Always begin from the sender.
      setPacketPosition(0);

      // Start movement on the next paint frame.
      const frame = requestAnimationFrame(() => {
        setPacketPosition(100);
      });

      return () => cancelAnimationFrame(frame);
    }

    if (isReceiving || isDelivered) {
      setPacketPosition(100);
    }
  }, [packet?.id, isTransmitting, isReceiving, isDelivered]);

  /*
   * -------------------------------------------------
   * NETWORK STATES
   * -------------------------------------------------
   */

  const senderLit =
    isTransmitting ||
    isReceiving ||
    isDelivered;

  const receiverLit =
    isReceiving ||
    isDelivered;

  /*
   * -------------------------------------------------
   * CONNECTION PROGRESS
   * -------------------------------------------------
   */

  const connectionProgress =
    packetVisible
      ? packetPosition
      : 0;

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

        {/* =========================================
            BASE CONNECTION
        ========================================= */}

        <div
          className="
            absolute
            left-0
            right-0
            top-1/2

            h-px
            -translate-y-1/2

            bg-line
          "
        />

        {/* =========================================
            ACTIVE CONNECTION
        ========================================= */}

        <div
          className="
            absolute
            left-0
            top-1/2

            h-px
            -translate-y-1/2

            bg-accent

            transition-[width]
            duration-[1800ms]
            ease-[cubic-bezier(0.4,0,0.2,1)]
          "
          style={{
            width: `${connectionProgress}%`,
          }}
        />

        {/* =========================================
            SENDER NODE
        ========================================= */}

        <span
          className={`
            absolute
            left-0
            top-1/2

            h-1.5
            w-1.5

            -translate-y-1/2
            rounded-full

            transition-all
            duration-300

            ${
              senderLit
                ? `
                  scale-125
                  bg-accent
                  shadow-[0_0_10px_rgba(184,217,74,0.65)]
                `
                : "bg-muted"
            }
          `}
        />

        {/* =========================================
            RECEIVER NODE
        ========================================= */}

        <span
          className={`
            absolute
            right-0
            top-1/2

            h-1.5
            w-1.5

            -translate-y-1/2
            rounded-full

            transition-all
            duration-300

            ${
              receiverLit
                ? `
                  scale-125
                  bg-accent
                  shadow-[0_0_10px_rgba(184,217,74,0.65)]
                `
                : "bg-muted"
            }
          `}
        />

        {/* =========================================
            PACKET
        ========================================= */}

        {packetVisible && (
          <div
            className="
              group

              absolute
              z-10

              transition-[left]
              duration-[1800ms]

              ease-[cubic-bezier(0.4,0,0.2,1)]
            "
            style={{
              left: `${packetPosition}%`,
              transform: "translateX(-50%)",
            }}
          >

            {/* -------------------------------------
                SUBTLE PACKET TRAIL
            ------------------------------------- */}

            {isTransmitting && (
              <span
                className="
                  pointer-events-none

                  absolute
                  right-full
                  top-1/2

                  h-px
                  w-5

                  -translate-y-1/2

                  bg-accent/30

                  blur-[1px]
                "
              />
            )}

            {/* -------------------------------------
                INSPECTION HINT
            ------------------------------------- */}

            {isTransmitting && (
              <div
                className="
                  pointer-events-none

                  absolute
                  left-1/2
                  top-full

                  mt-3

                  -translate-x-1/2

                  whitespace-nowrap

                  opacity-0

                  transition-opacity
                  duration-300

                  group-hover:opacity-100
                "
              >
                <span
                  className="
                    mono

                    text-[6px]
                    uppercase
                    tracking-[0.18em]

                    text-accent-soft
                  "
                >
                  ↓ Click to inspect
                </span>
              </div>
            )}

            {/* -------------------------------------
                PACKET BODY
            ------------------------------------- */}

            <button
              type="button"
              onClick={onInspect}
              className="
                relative

                flex
                min-h-10
                min-w-10

                flex-col
                items-center
                justify-center

                border
                border-accent/70

                bg-surface-deep

                px-3
                py-1.5

                mono

                transition-all
                duration-300

                hover:border-accent
                hover:bg-accent-deep

                hover:shadow-[0_0_20px_rgba(184,217,74,0.18)]

                focus:outline-none
                focus:ring-1
                focus:ring-accent/70
              "
              aria-haspopup="dialog"
              aria-label={`Inspect packet ${packet?.id || ""}`}
            >

              {/* subtle internal glow */}

              <span
                className="
                  pointer-events-none

                  absolute
                  inset-0

                  bg-[radial-gradient(circle_at_center,rgba(184,217,74,0.10),transparent_70%)]

                  opacity-0

                  transition-opacity
                  duration-300

                  group-hover:opacity-100
                "
              />

              {/* packet ID */}

              <span
                className="
                  relative

                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.12em]

                  text-accent
                "
              >
                {packet?.id || "PKT"}
              </span>

              {/* payload */}

              {packet?.payload && (
                <span
                  className="
                    relative

                    mt-0.5

                    max-w-[70px]

                    truncate

                    text-[6px]
                    uppercase
                    tracking-[0.08em]

                    text-accent-soft
                  "
                >
                  {packet.payload}
                </span>
              )}

            </button>
          </div>
        )}

        {/* =========================================
            READY STATE
        ========================================= */}

        {!packetVisible && (
          <div
            className="
              relative
              z-10

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
            Network Ready
          </div>
        )}

      </div>
    </div>
  );
}

export default NetworkWire;