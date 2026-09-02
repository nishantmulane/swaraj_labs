function Computer({
  name,
  packet,
  transmission,
  draftMessage,
  role,
  onInspect,
}) {
  const isSender = role === "sender";
  const status = transmission?.status || "READY";

  const isTransmitting = status === "TRANSMITTING";
  const isReceiving = status === "RECEIVING";
  const isDelivered = status === "DELIVERED";

  const hasDraft = Boolean(draftMessage?.trim());
  const hasPacket = Boolean(packet);

  // =========================================
  // DISPLAY STATE
  // =========================================

  let displayText = isSender
    ? hasDraft
      ? draftMessage
      : "Awaiting message"
    : "Awaiting packet";

  let screenLabel = isSender
    ? hasDraft
      ? "Message"
      : "Endpoint"
    : "Endpoint";

  let statusLabel = isSender ? "Ready" : "Online";

  if (isTransmitting) {
    displayText =
      packet?.message ||
      packet?.payload ||
      draftMessage ||
      "—";

    screenLabel = isSender
      ? "Transmitting"
      : "Receiving";

    statusLabel = isSender
      ? "Sending..."
      : "Receiving...";
  }

  if (isReceiving) {
    displayText =
      packet?.message ||
      packet?.payload ||
      draftMessage ||
      "—";

    screenLabel = isSender
      ? "Sent"
      : "Receiving";

    statusLabel = isSender
      ? "Sent"
      : "Receiving...";
  }

  if (isDelivered) {
    displayText =
      packet?.message ||
      packet?.payload ||
      draftMessage ||
      "—";

    screenLabel = "Successful";

    statusLabel = isSender
      ? "Sent"
      : "Successful";
  }

  const isActive =
    isTransmitting ||
    isReceiving ||
    isDelivered;

  const showPayload = isSender
    ? hasDraft || hasPacket
    : isActive;

  // =========================================
  // COMPUTER
  // =========================================

  return (
    <div
      className="
        flex
        w-full
        max-w-[280px]
        shrink-0
        flex-col
        items-center
        lg:w-[280px]
      "
    >
      {/* =====================================
          MONITOR
      ===================================== */}

      <div
        className="
          w-full
          border
          border-line
          bg-surface
          p-2
        "
      >
        <div
          className="
            group
            relative
            aspect-[16/10]
            w-full
            overflow-hidden
            border
            border-line-faint
            bg-surface-deep
          "
        >
          {/* ===================================
              SCREEN GRID
          =================================== */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-20
              bg-[linear-gradient(rgba(154,166,178,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(154,166,178,0.04)_1px,transparent_1px)]
              bg-[size:22px_22px]
            "
          />

          {/* ===================================
              NODE NAME
          =================================== */}

          <div
            className="
              mono
              absolute
              left-2.5
              top-2
              text-[8px]
              uppercase
              tracking-[0.18em]
              text-muted
            "
          >
            {name}
          </div>

          {/* ===================================
              NODE ID
          =================================== */}

          <div
            className="
              mono
              absolute
              right-2.5
              top-2
              text-[7px]
              uppercase
              tracking-[0.12em]
              text-muted-soft
            "
          >
            {isSender ? "NODE_001" : "NODE_002"}
          </div>

          {/* ===================================
              SCREEN CONTENT
          =================================== */}

          <div
            className="
              absolute
              inset-x-5
              top-1/2
              flex
              -translate-y-1/2
              flex-col
              items-center
              text-center
            "
          >
            {/* Screen label */}

            <div
              className={`
                mono
                mb-2
                text-[8px]
                uppercase
                tracking-[0.24em]
                ${
                  isActive
                    ? "text-accent-soft"
                    : "text-muted"
                }
              `}
            >
              {screenLabel}
            </div>

            {/* Message */}

            <div
              className={`
                mono
                max-w-full
                break-words
                text-center
                leading-relaxed
                ${
                  showPayload
                    ? "text-sm text-accent-soft sm:text-base"
                    : "text-sm text-ink sm:text-base"
                }
              `}
            >
              {displayText}
            </div>
          </div>

          {/* ===================================
              MONITOR FOOTER
          =================================== */}

          <div
            className="
              absolute
              bottom-2
              left-2.5
              right-2.5
              h-7
              border-t
              border-line-soft
              pt-1
            "
          >
            {hasPacket && (
              <button
                type="button"
                onClick={onInspect}
                className={`
                  flex
                  h-6
                  w-full
                  items-center
                  justify-center
                  gap-2

                  border
                  border-accent/25
                  bg-surface

                  px-3

                  mono
                  text-[7px]
                  uppercase
                  tracking-[0.16em]
                  text-accent-soft

                  opacity-50

                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "opacity-100"
                      : "group-hover:border-accent/70 group-hover:bg-accent-deep group-hover:opacity-100"
                  }

                  hover:border-accent
                  hover:bg-accent-deep
                  hover:text-accent
                `}
              >
                <span className="text-[8px]">
                  ⌕
                </span>

                Inspect Packet
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =====================================
          STAND
      ===================================== */}

      <div
        className="
          h-5
          w-7
          border-x
          border-line
          bg-surface
        "
      />

      {/* =====================================
          BASE
      ===================================== */}

      <div
        className="
          h-1.5
          w-24
          border
          border-line
          bg-surface
        "
      />

      {/* =====================================
          EXTERNAL STATUS
      ===================================== */}

      <div
        className="
          mt-2
          flex
          items-center
          gap-2
          mono
          text-[8px]
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