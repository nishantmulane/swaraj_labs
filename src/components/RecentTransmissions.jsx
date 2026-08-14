function RecentTransmissions({ history }) {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <section>
      <div
        className="
          overflow-hidden
          border
          border-line-soft
          bg-surface
        "
      >
        {/* HEADER */}

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
            Recent Transmissions
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
            {history.length} packets
          </span>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            {/* TABLE HEADER */}

            <div
              className="
                grid
                grid-cols-[1.15fr_0.8fr_2fr_0.7fr_0.9fr]

                border-b
                border-line-faint

                px-4
                py-2

                mono
                text-[7px]
                uppercase
                tracking-[0.15em]

                text-muted-soft
              "
            >
              <span>ID</span>
              <span>Time</span>
              <span>Message</span>
              <span>Size</span>
              <span>Status</span>
            </div>

            {/* ROWS */}

            {history.slice(0, 5).map((item, index) => (
              <div
                key={item.id || index}
                className="
                  grid
                  grid-cols-[1.15fr_0.8fr_2fr_0.7fr_0.9fr]

                  border-b
                  border-line-faint

                  px-4
                  py-2

                  last:border-b-0

                  mono
                  text-[8px]
                  text-muted
                "
              >
                {/* ID */}

                <span
                  className="
                    truncate
                    pr-2
                    text-accent-soft
                  "
                >
                  {item.id || "—"}
                </span>

                {/* TIME */}

                <span className="truncate pr-2">
                  {item.time || "—"}
                </span>

                {/* MESSAGE */}

                <span
                  className="
                    truncate
                    pr-4
                    text-ink
                  "
                >
                  {item.payload || "—"}
                </span>

                {/* SIZE */}

                <span>
                  {item.size ?? 0} B
                </span>

                {/* STATUS */}

                <span
                  className={`
                    truncate

                    ${
                      item.status === "DELIVERED"
                        ? "text-accent"
                        : "text-muted"
                    }
                  `}
                >
                  {item.status || "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default RecentTransmissions;