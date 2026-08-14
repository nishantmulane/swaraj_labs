function MessageControl({
  message,
  setMessage,
  sendMessage,
  isSending,
  transmission,
}) {
  const status = transmission?.status || "READY";

  const isDisabled =
    isSending || !message.trim();

  const messageSize = new TextEncoder()
    .encode(message || "")
    .length;

  const statusLabel = {
    READY: "Ready",
    TRANSMITTING: "Sending...",
    RECEIVING: "Receiving...",
    DELIVERED: "Sent",
  }[status] || "Ready";

  const isActive =
    status === "TRANSMITTING" ||
    status === "RECEIVING";

  const isDelivered =
    status === "DELIVERED";

  return (
    <section className="w-full">
      <div
        className="
          overflow-hidden
          border
          border-line-soft
          bg-surface
        "
      >
        <div
          className="
            flex
            flex-col

            sm:flex-row
            sm:items-stretch
          "
        >
          {/* =====================================
              MESSAGE INPUT
          ===================================== */}

          <div className="min-w-0 flex-1">
            <div
              className="
                flex
                items-center
                justify-between

                px-4
                pt-2.5
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
                Message
              </span>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                {/* Status */}

                <span
                  className={`
                    mono
                    text-[7px]
                    uppercase
                    tracking-[0.14em]

                    ${
                      isActive || isDelivered
                        ? "text-accent"
                        : "text-muted-soft"
                    }
                  `}
                >
                  {statusLabel}
                </span>

                <span
                  className="
                    h-1
                    w-1
                    rounded-full
                    bg-line
                  "
                />

                {/* Size */}

                <span
                  className="
                    mono
                    text-[7px]
                    uppercase
                    tracking-[0.15em]
                    text-muted-soft
                  "
                >
                  {messageSize} B
                </span>
              </div>
            </div>

            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !isDisabled
                ) {
                  sendMessage();
                }
              }}
              disabled={isSending}
              placeholder="Enter message..."
              className="
                w-full

                bg-transparent

                px-4
                pb-3
                pt-1.5

                mono
                text-xs

                text-ink

                outline-none

                placeholder:text-muted

                focus-visible:ring-2
                focus-visible:ring-accent/50

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            />
          </div>

          {/* =====================================
              SEND
          ===================================== */}

          <button
            type="button"
            onClick={sendMessage}
            disabled={isDisabled}
            className="
              group
              flex
              w-full
              shrink-0
              items-center
              justify-center

              border-t
              border-line-soft

              bg-accent

              px-8
              py-3

              mono
              text-[9px]
              font-medium
              uppercase
              tracking-[0.15em]

              text-accent-deep

              transition-colors
              duration-200

              hover:bg-accent-hover

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-accent-soft

              disabled:cursor-not-allowed
              disabled:opacity-40

              sm:w-36
              sm:min-w-[144px]
              sm:border-l
              sm:border-t-0
            "
          >
            {isSending ? (
              <span className="inline-flex min-w-[72px] items-center justify-center gap-1.5">
                Sending
                <span className="inline-block w-4 text-left">
                  ...
                </span>
              </span>
            ) : isDelivered ? (
              <span className="inline-flex min-w-[72px] items-center justify-center gap-1.5">
                Sent
                <span>✓</span>
              </span>
            ) : (
              <span className="inline-flex min-w-[72px] items-center justify-center gap-1.5">
                Send
                <span
                  className="
                    inline-block
                    transition-transform
                    duration-200
                    group-hover:translate-x-0.5
                  "
                >
                  →
                </span>
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default MessageControl;