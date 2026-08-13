function Computer({
  name,
  packet,
  transmission,
  draftMessage,
  role,
}) {
  const isSender = role === "sender";
  const isReceiver = role === "receiver";

  const status = transmission.status;

  const isTransmitting = status === "TRANSMITTING";
  const isReceiving = status === "RECEIVING";
  const isDelivered = status === "DELIVERED";

  const hasDraft = Boolean(draftMessage?.trim());
  const hasPacket = Boolean(packet);

  // =========================================
  // SENDER STATE
  // =========================================

  let senderText = hasDraft ? draftMessage : "Awaiting message";
  let senderScreenLabel = hasDraft ? "Message" : "Endpoint";
  let senderStatus = "Ready";

  if (isTransmitting) {
    senderText = packet?.payload || draftMessage;
    senderScreenLabel = "Transmitting";
    senderStatus = "Sending...";
  }

  if (isReceiving) {
    senderText = packet?.payload || draftMessage;
    senderScreenLabel = "Sent";
    senderStatus = "Sent";
  }

  if (isDelivered) {
    senderText = packet?.payload || draftMessage;
    senderScreenLabel = "Successful";
    senderStatus = "Sent";
  }

  // =========================================
  // RECEIVER STATE
  // =========================================

  let receiverText = name;
  let receiverScreenLabel = "Endpoint";
  let receiverStatus = "Online";

  if (isTransmitting) {
    receiverText = packet?.payload || "Receiving...";
    receiverScreenLabel = "Receiving";
    receiverStatus = "Receiving...";
  }

  if (isReceiving) {
    receiverText = packet?.payload || "Receiving...";
    receiverScreenLabel = "Receiving";
    receiverStatus = "Receiving...";
  }

  if (isDelivered) {
    receiverText = packet?.payload || "—";
    receiverScreenLabel = "Successful";
    receiverStatus = "Successful";
  }

  // =========================================
  // FINAL DISPLAY
  // =========================================

  const displayText = isSender
    ? senderText
    : receiverText;

  const screenLabel = isSender
    ? senderScreenLabel
    : receiverScreenLabel;

  const statusLabel = isSender
    ? senderStatus
    : receiverStatus;

  const isActive =
    isTransmitting ||
    isReceiving ||
    isDelivered;

  const showPayload =
    isSender
      ? hasDraft || hasPacket
      : isTransmitting ||
        isReceiving ||
        isDelivered;

  // =========================================
  // COLORS
  // =========================================

  const screenTextColor =
    isActive
      ? "var(--color-accent-soft)"
      : isSender && hasDraft
        ? "var(--color-ink)"
        : "var(--color-ink)";

  return (
    <div className="flex shrink-0 flex-col items-center">
      {/* =========================================
          MONITOR
      ========================================= */}

      <div
        className="
          h-36
          w-56

          border
          border-line

          bg-surface

          p-2.5

          sm:h-40
          sm:w-60

          lg:h-44
          lg:w-64
        "
      >
        {/* =========================================
            SCREEN
        ========================================= */}

        <div
          className="
            relative

            flex
            h-full
            w-full

            items-center
            justify-center

            overflow-hidden

            border
            border-line-faint

            bg-surface-deep
          "
        >
          {/* Screen grid */}

          <div
            className="
              pointer-events-none

              absolute
              inset-0

              opacity-25

              bg-[linear-gradient(rgba(154,166,178,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(154,166,178,0.04)_1px,transparent_1px)]

              bg-[size:24px_24px]
            "
          />

          {/* Endpoint label */}

          <div
            className="
              mono

              absolute
              left-2
              top-2

              text-[8px]
              uppercase
              tracking-[0.16em]

              text-muted
            "
          >
            {name}
          </div>

          {/* =========================================
              SCREEN CONTENT
          ========================================= */}

          <div
            className="
              relative

              flex
              max-w-[85%]
              flex-col
              items-center

              px-3

              text-center
            "
          >
            <div
              className={`
                mono
                mb-2

                text-[9px]
                uppercase
                tracking-[0.28em]

                ${
                  isActive
                    ? "text-accent-soft"
                    : "text-muted"
                }
              `}
            >
              {screenLabel}
            </div>

            {showPayload ? (
              <div
                className="
                  mono

                  break-all

                  text-sm
                  leading-relaxed

                  sm:text-base
                "
                style={{
                  color: screenTextColor,
                }}
              >
                {displayText}
              </div>
            ) : (
              <div
                className="
                  mono

                  text-base
                  leading-relaxed

                  text-ink

                  sm:text-lg
                "
              >
                {displayText}
              </div>
            )}
          </div>

          {/* =========================================
              SCREEN STATUS
          ========================================= */}

          <div
            className="
              absolute
              bottom-2
              right-2.5

              flex
              items-center
              gap-1.5
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

            <span
              className="
                mono

                text-[8px]
                uppercase
                tracking-wider

                text-muted
              "
            >
              {isActive
                ? "Active"
                : isReceiver
                  ? "Online"
                  : "Ready"}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================
          MONITOR STAND
      ========================================= */}

      <div
        className="
          h-6
          w-8

          border-x
          border-line

          bg-surface
        "
      />

      {/* =========================================
          MONITOR BASE
      ========================================= */}

      <div
        className="
          h-2
          w-24

          border
          border-line

          bg-surface

          sm:w-28
        "
      />

      {/* =========================================
          EXTERNAL STATUS
      ========================================= */}

      <div
        className="
          mt-3

          flex
          items-center
          gap-2

          mono

          text-[9px]
          uppercase
          tracking-[0.16em]

          text-muted-soft
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

        {statusLabel}
      </div>
    </div>
  );
}

export default Computer;