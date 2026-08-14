function SessionStats({
  packetsSent,
  packetsDelivered,
  dataTransferred,
  failedPackets,
}) {
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
              mono
              text-[7px]
              uppercase
              tracking-[0.15em]
              text-muted-soft
            "
          >
            Statistics
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
            value={packetsSent}
          />

          <Stat
            label="Delivered"
            value={packetsDelivered}
          />

          <Stat
            label="Data Transferred"
            value={`${dataTransferred} B`}
          />

          <Stat
            label="Failed"
            value={failedPackets}
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
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
        className="
          mono
          mt-1.5
          text-base
          leading-none
          text-ink
        "
      >
        {value}
      </div>
    </div>
  );
}

export default SessionStats;