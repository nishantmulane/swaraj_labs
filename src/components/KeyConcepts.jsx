function KeyConcepts() {
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
        </div>

        {/* =====================================
            CONTENT
        ===================================== */}

        <div
          className="
            flex
            h-[calc(100%-33px)]
            flex-col
            justify-between

            gap-4

            px-4
            py-3.5
          "
        >
          <div>
            <div
              className="
                mono
                mb-2
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
                tracking-tight
                text-ink
              "
            >
              What is a Packet?
            </h2>

            <p
              className="
                mt-2
                text-[11px]
                leading-relaxed
                text-muted
              "
            >
              A packet is a small unit of data used
              to carry information from a source to a
              destination across a network.
            </p>
          </div>

          {/* <button
            type="button"
            className="
              self-start

              border
              border-line

              px-3
              py-2

              mono
              text-[8px]
              uppercase
              tracking-[0.15em]

              text-muted

              transition-colors

              hover:border-accent
              hover:text-accent

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-accent/50
            "
          >
            Learn more →
          </button> */}
        </div>
      </div>
    </section>
  );
}

export default KeyConcepts;