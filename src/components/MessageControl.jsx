function MessageControl({
  message,
  setMessage,
  sendMessage,
  isSending,
}) {
  const isDisabled =
    isSending || !message.trim();

  return (
    <section className="px-6 sm:px-10 lg:px-16">
      <div
        className="
          border
          border-line-faint

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
          {/* =========================================
              MESSAGE INPUT
          ========================================= */}

          <div className="min-w-0 flex-1">
            <div
              className="
                mono

                px-5
                pt-3

                text-[9px]
                uppercase
                tracking-[0.2em]

                text-muted
              "
            >
              Message
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

                px-5
                pb-4
                pt-2

                mono
                text-sm

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

          {/* =========================================
              SEND BUTTON
          ========================================= */}

          <button
            type="button"
            onClick={sendMessage}
            disabled={isDisabled}
            className="
              group

              border-t
              border-line-faint

              bg-accent

              px-8
              py-4

              mono

              text-[10px]
              font-medium
              uppercase
              tracking-[0.15em]

              text-accent-deep

              transition-colors

              hover:bg-accent-hover

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-accent-soft

              disabled:cursor-not-allowed
              disabled:opacity-40

              sm:w-32

              sm:border-l
              sm:border-t-0
            "
          >
            {isSending ? (
              "Sending..."
            ) : (
              <>
                Send{" "}

                <span
                  className="
                    inline-block

                    transition-transform

                    group-hover:translate-x-0.5
                  "
                >
                  →
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default MessageControl;