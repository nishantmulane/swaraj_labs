function NetworkNode({ label, type = "ROUTER", active = false }) {
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
              ? "border-accent bg-accent-deep shadow-[0_0_18px_rgba(184,217,74,0.18)]"
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
                ? "bg-accent shadow-[0_0_8px_rgba(184,217,74,0.8)]"
                : "bg-muted"
            }
          `}
        />

        {/* SCAN LINE */}
        {active && (
          <span
            className="
              pointer-events-none
              absolute
              inset-0
              border
              border-accent/20
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
          ${active ? "text-accent-soft" : "text-muted"}
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