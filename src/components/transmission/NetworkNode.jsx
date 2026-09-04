function NetworkNode({
  label,
  type = "ROUTER",
  active = false,
}) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* NODE */}

      <div
        className={`
          relative
          flex
          h-8
          min-w-8
          items-center
          justify-center

          border

          bg-surface-deep

          transition-all
          duration-300

          ${
            active
              ? "border-accent bg-accent-deep"
              : "border-line-soft"
          }
        `}
      >
        {/* CORE */}

        <span
          className={`
            h-1.5
            w-1.5
            rounded-full

            transition-all
            duration-300

            ${
              active
                ? "bg-accent"
                : "bg-muted"
            }
          `}
        />

        {/* ACTIVE MARKER */}

        {active && (
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-[-4px]

              border
              border-accent/20

              transition-opacity
              duration-300
            "
          />
        )}
      </div>

      {/* LABEL */}

      <div
        className={`
          mono
          mt-2
          whitespace-nowrap

          text-[6px]
          uppercase
          tracking-[0.16em]

          transition-colors
          duration-300

          ${
            active
              ? "text-accent-soft"
              : "text-muted"
          }
        `}
      >
        {label}
      </div>

      {/* TYPE */}

      <div
        className="
          mono
          mt-0.5

          text-[5px]
          uppercase
          tracking-[0.12em]

          text-muted-soft
        "
      >
        {type}
      </div>
    </div>
  );
}

export default NetworkNode;