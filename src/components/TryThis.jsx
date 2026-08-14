function TryThis() {
  const experiments = [
    "Change the message and send again.",
    "Compare the Packet ID after each transmission.",
    "Try messages with different sizes.",
    "Watch the packet move to the receiver.",
  ];

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
            Try This
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
            Experiment
          </span>
        </div>

        {/* =====================================
            CONTENT
        ===================================== */}

        <div className="px-4 py-3.5">
          <p
            className="
              text-[11px]
              leading-relaxed
              text-muted
            "
          >
            Experiment with the transmission and
            observe what changes inside the packet.
          </p>

          <div className="mt-3 space-y-1.5">
            {experiments.map((experiment, index) => (
              <TryItem
                key={experiment}
                number={index + 1}
              >
                {experiment}
              </TryItem>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TryItem({ children, number }) {
  return (
    <div
      className="
        flex
        min-h-8
        items-center
        gap-2.5

        border
        border-line-soft

        px-2.5
        py-1.5

        transition-colors
        hover:border-accent/30
      "
    >
      <span
        className="
          mono
          w-4
          shrink-0
          text-[7px]
          text-accent
        "
      >
        {String(number).padStart(2, "0")}
      </span>

      <span
        className="
          min-w-0

          text-[10px]
          leading-tight

          text-muted
        "
      >
        {children}
      </span>
    </div>
  );
}

export default TryThis;