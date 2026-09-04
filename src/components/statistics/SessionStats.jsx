function SessionStats({
  packetsSent,
  packetsDelivered,
  dataTransferred,
  failedPackets,
}) {
  const sent = packetsSent ?? 0;
  const delivered = packetsDelivered ?? 0;
  const failed = failedPackets ?? 0;
  const transferred = dataTransferred ?? 0;

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
            This Session
          </span>

          <span
            className="
              flex
              items-center
              gap-2

              mono
              text-[7px]
              uppercase
              tracking-[0.15em]
              text-muted-soft
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-accent
              "
            />

            Live
          </span>
        </div>

        {/* =====================================
            STATS
        ===================================== */}

        <div
          className="
            grid
            grid-cols-2

            divide-x
            divide-y
            divide-line-soft
          "
        >
          <Stat
            label="Packets Sent"
            value={sent}
            emphasis
          />

          <Stat
            label="Delivered"
            value={delivered}
            emphasis
          />

          <Stat
            label="Data Transferred"
            value={`${transferred} B`}
          />

          <Stat
            label="Failed"
            value={failed}
            warning={failed > 0}
          />
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  emphasis = false,
  warning = false,
}) {
  return (
    <div
      className="
        min-w-0
        px-3.5
        py-3
      "
    >
      <div
        className="
          mono
          truncate

          text-[7px]
          uppercase
          tracking-[0.15em]

          text-muted-soft
        "
      >
        {label}
      </div>

      <div
        className={`
          mono
          mt-1.5
          leading-none

          ${
            emphasis
              ? "text-lg"
              : "text-base"
          }

          ${
            warning
              ? "text-accent"
              : "text-ink"
          }
        `}
      >
        {value}
      </div>
    </div>
  );
}

export default SessionStats;