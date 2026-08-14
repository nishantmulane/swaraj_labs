function WhatsHappening({ transmission, packet }) {
  const status = transmission?.status || "READY";

  const steps = [
    {
      label: "Packet created",
      active: Boolean(packet),
    },
    {
      label: "Packet transmitted",
      active:
        status === "TRANSMITTING" ||
        status === "RECEIVING" ||
        status === "DELIVERED",
    },
    {
      label: "Packet delivered",
      active: status === "DELIVERED",
    },
  ];

  let explanation =
    "Your message is ready to be converted into a packet and transmitted.";

  if (status === "TRANSMITTING") {
    explanation =
      "Your message has been converted into a packet and is travelling through the local connection.";
  }

  if (status === "RECEIVING") {
    explanation =
      "The packet has reached the receiver and is being processed.";
  }

  if (status === "DELIVERED") {
    explanation =
      "The packet was successfully delivered to the receiver.";
  }

  return (
    <section className="w-full">
      <div
        className="
          h-full
          overflow-hidden

          border
          border-line-soft
          bg-surface
        "
      >
        {/* =====================================
            HEADER
        ===================================== */}

        <div
          className="
            flex
            items-center
            justify-between

            border-b
            border-line-soft

            px-4
            py-2.5
          "
        >
          <span
            className="
              mono
              text-[8px]
              uppercase
              tracking-[0.2em]
              text-muted
            "
          >
            What's Happening?
          </span>

          <span
            className="
              mono
              text-[7px]
              uppercase
              tracking-[0.14em]
              text-muted-soft
            "
          >
            Live
          </span>
        </div>

        {/* =====================================
            CONTENT
        ===================================== */}

        <div className="px-4 py-3.5">
          <p
            className="
              text-[11px]
              leading-relaxed
              text-muted
            "
          >
            {explanation}
          </p>

          {/* ===================================
              LIFECYCLE
          =================================== */}

          <div className="mt-3 space-y-1.5">
            {steps.map((step, index) => (
              <div
                key={step.label}
                className="
                  flex
                  min-h-8
                  items-center
                  gap-2.5

                  border
                  border-line-soft

                  px-2.5
                  py-1.5
                "
              >
                <span
                  className={`
                    flex
                    h-4.5
                    w-4.5
                    shrink-0
                    items-center
                    justify-center

                    border

                    mono
                    text-[7px]

                    ${
                      step.active
                        ? "border-accent text-accent"
                        : "border-line text-muted"
                    }
                  `}
                >
                  {step.active ? "✓" : index + 1}
                </span>

                <span
                  className={`
                    min-w-0

                    mono
                    text-[8px]
                    uppercase
                    tracking-[0.1em]

                    ${
                      step.active
                        ? "text-accent"
                        : "text-muted-soft"
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatsHappening;