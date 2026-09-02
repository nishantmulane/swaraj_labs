import Computer from "./Computer";
import NetworkWire from "./NetworkWire";

function Transmission({
  packet,
  transmission,
  draftMessage,
  onInspect,
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

  const journeyMessage = {
    READY: "Ready to send your message",
    TRANSMITTING: "Packet moving through the routed network",
    RECEIVING: "Packet has reached the receiver",
    DELIVERED: "Message successfully delivered",
  }[status];

  return (
    <section className="flex h-full w-full flex-col">

      {/* =========================================
          HEADER
      ========================================= */}

      <div
        className="
          mb-2
          flex
          items-end
          justify-between
          gap-4
        "
      >
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
            Sender → Network → Receiver
          </div>

        </div>

        {/* STATUS */}

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
          px-4
          py-5
          sm:px-6
          sm:py-6
          lg:px-8
          lg:py-7
        "
      >

        {/* =====================================
            NETWORK STAGE
        ===================================== */}

        <div
          className="
            flex
            min-h-[340px]
            flex-1
            items-center
            justify-center
            sm:min-h-[370px]
            lg:min-h-[400px]
          "
        >

          <div
            className="
              flex
              w-full
              max-w-[1100px]
              flex-col
              items-center
              justify-center
              gap-8
              sm:gap-10
              lg:flex-row
              lg:gap-8
            "
          >

            {/* =================================
                SENDER
            ================================= */}

            <div
              className="
                flex
                w-full
                justify-center
                lg:w-[280px]
                lg:shrink-0
              "
            >
              <Computer
                name="Sender"
                role="sender"
                packet={packet}
                transmission={transmission}
                draftMessage={draftMessage}
                onInspect={onInspect}
              />
            </div>


            {/* =================================
                NETWORK
            ================================= */}

            <div
              className="
                flex
                w-full
                min-w-0
                flex-1
                items-center
                justify-center
                lg:min-w-[260px]
              "
            >
              <NetworkWire
                packet={packet}
                transmission={transmission}
                onInspect={onInspect}
              />
            </div>


            {/* =================================
                RECEIVER
            ================================= */}

            <div
              className="
                flex
                w-full
                justify-center
                lg:w-[280px]
                lg:shrink-0
              "
            >
              <Computer
                name="Receiver"
                role="receiver"
                packet={packet}
                transmission={transmission}
                draftMessage={draftMessage}
                onInspect={onInspect}
              />
            </div>

          </div>

        </div>


        {/* =========================================
            ROUTE LABEL
        ========================================= */}

        <div
          className="
            mt-3
            flex
            shrink-0
            justify-center
          "
        >
          <div
            className="
              inline-flex
              max-w-full
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
              PACKET ROUTE
            </span>

            <span className="mx-2 text-muted-soft">
              •
            </span>

            <span>
              3 NODES • 4 HOPS
            </span>
          </div>
        </div>

      </div>


      {/* =========================================
          TRANSMISSION MESSAGE
      ========================================= */}

      <div
        className="
          mt-2
          flex
          min-h-[18px]
          items-center
          justify-center
        "
      >
        <p
          key={status}
          className="
            mono
            text-center
            text-[8px]
            uppercase
            tracking-[0.15em]
            text-muted-soft
            transition-opacity
            duration-300
          "
        >
          {journeyMessage}
        </p>
      </div>

    </section>
  );
}

export default Transmission;