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
          flex
          h-full
          flex-col
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
              h-1.5
              w-1.5
              rounded-full
              bg-accent
              opacity-70
            "
            aria-hidden="true"
          />
        </div>

        {/* =====================================
            CONTENT
        ===================================== */}

        <div
          className="
            flex
            flex-1
            flex-col

            px-4
            py-4
          "
        >
          <p
            className="
              max-w-[42ch]
              text-[11px]
              leading-[1.65]
              text-muted
            "
          >
            Experiment with the transmission and
            observe what changes inside the packet.
          </p>

          <div className="mt-4">
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
        group
        flex
        items-start
        gap-3

        border-t
        border-line-soft

        py-2.5

        transition-colors
        duration-200
        first:border-t-0
      "
    >
      <span
        className="
          mono
          w-5
          shrink-0
          pt-0.5

          text-[7px]
          tracking-[0.08em]
          text-accent
        "
      >
        {String(number).padStart(2, "0")}
      </span>

      <span
        className="
          min-w-0
          text-[10px]
          leading-[1.5]
          text-muted
          transition-colors
          duration-200
          group-hover:text-muted-soft
        "
      >
        {children}
      </span>
    </div>
  );
}

export default TryThis;