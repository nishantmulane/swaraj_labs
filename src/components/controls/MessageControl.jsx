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
    <section
      className="w-full"
      aria-label="Message transmission controls"
    >
      <div
        className="
          overflow-hidden
          border
          border-line-soft
          bg-surface
          transition-colors
          duration-200
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
                gap-4
                px-4
                pt-2.5
              "
            >
              <label
                htmlFor="network-message"
                className="
                  mono
                  text-[8px]
                  uppercase
                  tracking-[0.2em]
                  text-muted
                "
              >
                Message
              </label>

              <div
                className="
                  flex
                  shrink-0
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
                    transition-colors
                    duration-200
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
                    shrink-0
                    rounded-full
                    bg-line
                  "
                />

                {/* Message size */}

                <span
                  className="
                    mono
                    text-[7px]
                    uppercase
                    tracking-[0.12em]
                    text-muted
                  "
                >
                  {messageSize} B
                </span>
              </div>
            </div>

            <input
              id="network-message"
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !isDisabled
                ) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              disabled={isSending}
              autoComplete="off"
              spellCheck="false"
              placeholder="Enter message..."
              aria-label="Message to transmit"
              className="
                w-full
                bg-transparent
                px-4
                pb-3
                pt-1.5

                mono
                text-xs
                leading-5
                text-ink

                outline-none

                placeholder:text-muted

                transition-opacity
                duration-200

                disabled:cursor-not-allowed
                disabled:opacity-40
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
            aria-label={
              isSending
                ? "Sending message"
                : isDelivered
                  ? "Message sent"
                  : "Send message"
            }
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

              transition-all
              duration-200

              hover:bg-accent-hover

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-accent-soft
              focus-visible:ring-offset-0

              disabled:cursor-not-allowed
              disabled:opacity-40

              sm:w-36
              sm:min-w-[144px]
              sm:border-l
              sm:border-t-0
            "
          >
            {isSending ? (
              <span
                className="
                  inline-flex
                  min-w-[72px]
                  items-center
                  justify-center
                  gap-1.5
                "
              >
                Sending
                <span className="inline-block w-4 text-left">
                  ...
                </span>
              </span>
            ) : isDelivered ? (
              <span
                className="
                  inline-flex
                  min-w-[72px]
                  items-center
                  justify-center
                  gap-1.5
                "
              >
                Sent
                <span aria-hidden="true">✓</span>
              </span>
            ) : (
              <span
                className="
                  inline-flex
                  min-w-[72px]
                  items-center
                  justify-center
                  gap-1.5
                "
              >
                Send

                <span
                  aria-hidden="true"
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