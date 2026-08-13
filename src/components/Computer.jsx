function Computer({ name, packet, role }) {
  const isSender = role === "sender";
  const isReceiver = role === "receiver";

  const isTransmitting = packet?.status === "TRANSMITTING";
  const isDelivered = packet?.status === "DELIVERED";

  const isActive = (isSender && isTransmitting) || (isReceiver && isDelivered);

  let statusLabel = "Online";
  if (isSender && isTransmitting) statusLabel = "Sending...";
  if (isReceiver && isDelivered) statusLabel = "Received";

  const showPayload = isReceiver && isDelivered;
  const payload = packet?.payload;

  return (
    <div className="flex shrink-0 flex-col items-center">
      {/* Monitor */}
      <div
        className="
          h-36 w-56
          border border-line
          bg-surface
          p-2.5

          sm:h-40 sm:w-60
          lg:h-44 lg:w-64
        "
      >
        {/* Screen */}
        <div
          className="
            relative
            flex h-full w-full
            items-center justify-center
            overflow-hidden

            border border-line-faint
            bg-surface-deep
          "
        >
          {/* Subtle screen grid */}
          <div
            className="
              absolute inset-0
              opacity-25

              bg-[linear-gradient(rgba(154,166,178,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(154,166,178,0.04)_1px,transparent_1px)]
              bg-[size:24px_24px]
            "
          />

          {/* Corner tag once payload replaces the default readout */}
          {showPayload && (
            <div className="mono absolute left-2 top-2 text-[8px] uppercase tracking-wider text-muted">
              {name}
            </div>
          )}

          {/* Screen content */}
          <div className="relative px-3 text-center">
            {showPayload ? (
              <>
                <div className="mono mb-2 text-[9px] uppercase tracking-[0.28em] text-accent-soft">
                  Received
                </div>
                <div className="mono break-all text-base text-accent-soft sm:text-lg">
                  {payload}
                </div>
              </>
            ) : (
              <>
                <div className="mono mb-2 text-[9px] uppercase tracking-[0.28em] text-muted">
                  Endpoint
                </div>
                <div className="text-lg font-medium tracking-tight text-ink sm:text-xl">
                  {name}
                </div>
              </>
            )}
          </div>

          {/* Screen status */}
          <div className="absolute bottom-2 right-2.5 flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-accent" : "bg-muted"
              }`}
            />
            <span className="mono text-[8px] uppercase tracking-wider text-muted">
              {isActive ? "Active" : "Ready"}
            </span>
          </div>
        </div>
      </div>

      {/* Monitor stand */}
      <div className="h-6 w-8 border-x border-line bg-surface" />

      {/* Monitor base */}
      <div className="h-2 w-24 border border-line bg-surface sm:w-28" />

      {/* External status */}
      <div className="mt-3 flex items-center gap-2 mono text-[9px] uppercase tracking-[0.16em] text-muted-soft">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isActive ? "bg-accent" : "bg-muted"
          }`}
        />
        {statusLabel}
      </div>
    </div>
  );
}

export default Computer;