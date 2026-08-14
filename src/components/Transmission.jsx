import Computer from "./Computer";
import NetworkWire from "./NetworkWire";

function Transmission({
  packet,
  transmission,
  draftMessage,
}) {
  const status = transmission?.status || "READY";

  const isActive =
    status === "TRANSMITTING" ||
    status === "RECEIVING" ||
    status === "DELIVERED";

  const statusLabel = {
    READY: "READY",
    TRANSMITTING: "IN TRANSIT",
    RECEIVING: "RECEIVING",
    DELIVERED: "DELIVERED",
  }[status] || "READY";

  return (
    <section className="flex h-full w-full flex-col">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="mb-2 flex items-end justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.08em]
                text-ink
              "
            >
              Live Transmission
            </h1>

            <span
              className={`
                h-1.5
                w-1.5
                shrink-0
                rounded-full
                ${isActive ? "bg-accent" : "bg-muted"}
              `}
            />
          </div>

          <div
            className="
              mono
              mt-1
              text-[8px]
              uppercase
              tracking-[0.18em]
              text-muted-soft
            "
          >
            Sender → Packet → Receiver
          </div>
        </div>

        <div
          className={`
            mono
            shrink-0
            text-[8px]
            uppercase
            tracking-[0.15em]
            ${isActive ? "text-accent" : "text-muted"}
          `}
        >
          {statusLabel}
        </div>
      </div>

      {/* =========================================
          TRANSMISSION STAGE
      ========================================= */}

      <div
        className="
          flex
          flex-1
          flex-col

          border
          border-line-soft
          bg-surface

          px-3
          py-4

          sm:px-4
          sm:py-5

          lg:px-5
          lg:py-5
        "
      >
        {/* =====================================
            NETWORK STAGE
        ===================================== */}

        <div
          className="
            flex
            flex-1
            items-center
            justify-center
          "
        >
          <div
            className="
              flex
              w-full
              flex-col
              items-center
              justify-center
              gap-4

              lg:flex-row
              lg:gap-3
            "
          >
            {/* SENDER */}

            <Computer
              name="Sender"
              role="sender"
              packet={packet}
              transmission={transmission}
              draftMessage={draftMessage}
            />

            {/* CONNECTION */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-center

                lg:min-w-[150px]
              "
            >
              <NetworkWire
                packet={packet}
                transmission={transmission}
              />
            </div>

            {/* RECEIVER */}

            <Computer
              name="Receiver"
              role="receiver"
              packet={packet}
              transmission={transmission}
              draftMessage={draftMessage}
            />
          </div>
        </div>

        {/* =========================================
            CONNECTION LABEL
        ========================================= */}

        <div className="mt-3 flex shrink-0 justify-center">
          <div
            className="
              inline-flex
              items-center

              border
              border-line-soft
              bg-surface-deep

              px-3
              py-1

              mono
              text-[8px]
              uppercase
              tracking-[0.16em]

              text-muted
            "
          >
            <span className="text-accent-soft">
              LOCAL
            </span>

            <span className="mx-2 text-muted-soft">
              •
            </span>

            <span>
              DIRECT CONNECTION
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Transmission;