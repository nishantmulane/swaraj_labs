function KeyConcepts() {
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
            Key Concept
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
            justify-between

            gap-5

            px-4
            py-4
          "
        >
          <div>
            <div
              className="
                mono
                mb-2.5
                text-[7px]
                uppercase
                tracking-[0.16em]
                text-muted-soft
              "
            >
              Network Fundamentals
            </div>

            <h2
              className="
                text-base
                font-medium
                leading-tight
                tracking-tight
                text-ink
              "
            >
              What is a Packet?
            </h2>

            <p
              className="
                mt-2.5
                max-w-[42ch]
                text-[11px]
                leading-[1.65]
                text-muted
              "
            >
              A packet is a small unit of data used
              to carry information from a source to a
              destination across a network.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default KeyConcepts;