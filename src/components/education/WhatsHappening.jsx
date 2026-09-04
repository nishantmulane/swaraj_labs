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
      "Your message has been converted into a packet and is travelling from the sender through the network.";
  }

  if (status === "RECEIVING") {
    explanation =
      "The packet has reached the receiver and is being processed.";
  }

  if (status === "DELIVERED") {
    explanation =
      "The packet has successfully reached its destination.";
  }

  const stateLabel = {
    READY: "Ready",
    TRANSMITTING: "In Transit",
    RECEIVING: "Receiving",
    DELIVERED: "Delivered",
  }[status] || "Ready";

  const isActive =
    status === "TRANSMITTING" ||
    status === "RECEIVING";

  return (
    <section
      className="w-full"
      aria-label="Transmission status"
    >
      <div
        className="
          flex
          h-full
          flex-col
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
            className={`
              mono
              text-[7px]
              uppercase
              tracking-[0.14em]

              ${
                isActive || status === "DELIVERED"
                  ? "text-accent"
                  : "text-muted"
              }
            `}
          >
            {stateLabel}
          </span>
        </div>

        {/* =====================================
            CONTENT
        ===================================== */}

        <div
          className="
            flex
            flex-1
            flex-col

            px-4
            py-4
          "
        >
          <p
            className="
              max-w-[42ch]
              text-[11px]
              leading-[1.65]
              text-muted
            "
          >
            {explanation}
          </p>

          {/* ===================================
              LIFECYCLE
          =================================== */}

          <div
            className="
              mt-5
              border-t
              border-line-soft
              pt-3
            "
          >
            <div
              className="
                mb-2.5
                mono
                text-[7px]
                uppercase
                tracking-[0.16em]
                text-muted-soft
              "
            >
              Transmission Lifecycle
            </div>

            <div className="space-y-0.5">
              {steps.map((step, index) => {
                const isCurrent =
                  (status === "TRANSMITTING" && index === 1) ||
                  (status === "RECEIVING" && index === 2);

                return (
                  <div
                    key={step.label}
                    className="
                      flex
                      items-center
                      gap-3
                      py-1.5
                    "
                  >
                    <span
                      className={`
                        flex
                        h-4
                        w-4
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

                        ${
                          isCurrent
                            ? "bg-accent-deep"
                            : ""
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
                            ? "text-muted-soft"
                            : "text-muted"
                        }

                        ${
                          isCurrent
                            ? "text-accent"
                            : ""
                        }
                      `}
                    >
                      {step.label}
                    </span>

                    {isCurrent && (
                      <span
                        className="
                          ml-auto
                          mono
                          text-[7px]
                          uppercase
                          tracking-[0.12em]
                          text-accent
                        "
                      >
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatsHappening;