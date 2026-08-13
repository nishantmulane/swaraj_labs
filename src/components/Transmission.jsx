import Computer from "./Computer";
import NetworkWire from "./NetworkWire";

function Transmission({
  packet,
  transmission,
  draftMessage,
}) {
  const status = transmission.status;

  const isTransmitting =
    status === "TRANSMITTING";

  const isReceiving =
    status === "RECEIVING";

  const isDelivered =
    status === "DELIVERED";

  const isActive =
    isTransmitting ||
    isReceiving ||
    isDelivered;

  let networkStatus = "Ready";

  if (isTransmitting) {
    networkStatus = "Transmitting";
  } else if (isReceiving) {
    networkStatus = "Receiving";
  } else if (isDelivered) {
    networkStatus = "Successful";
  }

  return (
    <section
      className="
        px-6
        pb-12
        pt-10

        sm:px-10

        lg:px-16
        lg:pb-14
        lg:pt-12
      "
    >
      <div
        className="
          mb-7

          flex
          items-center
          justify-between

          border-b
          border-line-soft

          pb-3
        "
      >
        <div
          className="
            mono

            text-[9px]
            uppercase
            tracking-[0.2em]

            text-muted
          "
        >
          Transmission
        </div>

        <div
          className="
            mono

            flex
            items-center
            gap-2

            text-[9px]
            uppercase
            tracking-[0.15em]

            text-muted
          "
        >
          <span
            className={`
              h-1.5
              w-1.5
              rounded-full

              ${
                isActive
                  ? "bg-accent"
                  : "bg-muted"
              }
            `}
          />

          {networkStatus}
        </div>
      </div>

      <div
        className="
          flex
          flex-col
          items-center
          gap-8

          lg:flex-row
          lg:gap-7
        "
      >
        <Computer
          name="Sender"
          role="sender"
          packet={packet}
          transmission={transmission}
          draftMessage={draftMessage}
        />

        <NetworkWire
          packet={packet}
          transmission={transmission}
        />

        <Computer
          name="Receiver"
          role="receiver"
          packet={packet}
          transmission={transmission}
          draftMessage={draftMessage}
        />
      </div>
    </section>
  );
}

export default Transmission;