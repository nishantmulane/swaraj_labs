function ModuleCard({ module, onSelect }) {
  const {
    number,
    eyebrow,
    title,
    description,
    topic,
    available,
  } = module;

  return (
    <button
      type="button"
      disabled={!available}
      onClick={onSelect}
      aria-label={
        available
          ? `Enter ${title} module`
          : `${title} module coming soon`
      }
      className={`
        group
        relative
        min-h-[340px]
        w-full
        overflow-hidden

        border
        p-7
        text-left

        transition-all
        duration-300

        sm:p-8

        ${
          available
            ? `
              cursor-pointer
              border-line
              bg-surface

              hover:border-accent/40
              hover:bg-surface-raised

              focus-visible:outline-none
              focus-visible:ring-1
              focus-visible:ring-accent
              focus-visible:ring-offset-0
            `
            : `
              cursor-default
              border-line-soft
              bg-surface-deep
            `
        }
      `}
    >
      {/* =====================================
          BACKGROUND GRID
      ===================================== */}

      <div
        aria-hidden="true"
        className={`
          network-grid
          pointer-events-none
          absolute
          inset-0

          transition-opacity
          duration-500

          ${
            available
              ? "opacity-20 group-hover:opacity-35"
              : "opacity-10"
          }
        `}
      />

      {/* =====================================
          MODULE NUMBER
      ===================================== */}

      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          -right-2
          -top-7

          select-none

          mono
          text-[150px]
          font-medium
          leading-none
          tracking-[-0.12em]

          transition-opacity
          duration-300

          ${
            available
              ? "text-ink/[0.025]"
              : "text-ink/[0.012]"
          }
        `}
      >
        {number}
      </div>

      {/* =====================================
          NETWORK MARK
      ===================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-8
          top-24

          h-20
          w-28

          opacity-40
        "
      >
        <div className="absolute left-0 top-1/2 h-px w-full bg-line-soft" />

        <div className="absolute left-1/2 top-0 h-full w-px bg-line-soft" />

        <span
          className="
            absolute
            left-0
            top-[calc(50%-3px)]

            h-1.5
            w-1.5

            rounded-full
            border
            border-line
            bg-surface
          "
        />

        <span
          className="
            absolute
            left-[calc(50%-3px)]
            top-0

            h-1.5
            w-1.5

            rounded-full
            border
            border-line
            bg-surface
          "
        />

        <span
          className={`
            absolute
            right-0
            top-[calc(50%-3px)]

            h-1.5
            w-1.5
            rounded-full

            ${
              available
                ? "bg-accent"
                : "border border-line bg-surface"
            }
          `}
        />

        <span
          className="
            absolute
            bottom-0
            left-[calc(50%-3px)]

            h-1.5
            w-1.5

            rounded-full
            border
            border-line
            bg-surface
          "
        />
      </div>

      {/* =====================================
          CONTENT
      ===================================== */}

      <div
        className="
          relative
          z-10

          flex
          min-h-[284px]
          flex-col
        "
      >
        {/* -------------------------------------
            HEADER
        ------------------------------------- */}

        <div className="flex items-center justify-between gap-4">
          <span
            className="
              mono
              text-[9px]
              tracking-[0.16em]
              text-muted-soft
            "
          >
            MODULE / {number}
          </span>

          <span
            className="
              flex
              items-center
              gap-2

              mono
              text-[8px]
              uppercase
              tracking-[0.12em]
            "
          >
            <span
              className={`
                h-1.5
                w-1.5
                shrink-0
                rounded-full

                ${
                  available
                    ? "bg-accent"
                    : "border border-line"
                }
              `}
            />

            <span
              className={
                available
                  ? "text-accent"
                  : "text-muted"
              }
            >
              {available
                ? "Available"
                : "Coming Soon"}
            </span>
          </span>
        </div>

        {/* -------------------------------------
            BODY
        ------------------------------------- */}

        <div className="my-auto max-w-xl py-10">
          <div
            className={`
              mono
              text-[8px]
              tracking-[0.18em]

              ${
                available
                  ? "text-accent/70"
                  : "text-muted"
              }
            `}
          >
            {eyebrow}
          </div>

          <h3
            className={`
              mt-3

              text-3xl
              font-medium
              leading-[1]
              tracking-[-0.05em]

              sm:text-4xl

              ${
                available
                  ? "text-ink"
                  : "text-muted-soft"
              }
            `}
          >
            {title}
          </h3>

          <p
            className="
              mt-5
              max-w-[430px]

              text-[13px]
              leading-7
              text-muted
            "
          >
            {description}
          </p>
        </div>

        {/* -------------------------------------
            FOOTER
        ------------------------------------- */}

        <div
          className="
            border-t
            border-line-soft
            pt-4
          "
        >
          <div className="flex items-center justify-between gap-4">
            <span
              className="
                min-w-0

                mono
                text-[8px]
                tracking-[0.1em]
                text-muted
              "
            >
              {topic}
            </span>

            {available && (
              <span
                className="
                  flex
                  shrink-0
                  items-center
                  gap-2

                  mono
                  text-[9px]
                  tracking-[0.12em]
                  text-accent

                  transition-[gap]
                  duration-200

                  group-hover:gap-3
                "
              >
                ENTER LAB

                <span
                  aria-hidden="true"
                  className="
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* =====================================
          ACTIVE EDGE
      ===================================== */}

      {available && (
        <div
          aria-hidden="true"
          className="
            absolute
            bottom-0
            left-0

            h-px
            w-0

            bg-accent

            transition-[width]
            duration-300

            group-hover:w-full
          "
        />
      )}
    </button>
  );
}

export default ModuleCard;