function NetworkWire({ packet, isSending }) {
  const isActive = isSending && Boolean(packet);

  return (
    <div
      className="
        relative
        flex items-center justify-center

        h-16 w-0
        border-l-2 border-dashed border-line

        lg:h-0 lg:w-auto lg:flex-1
        lg:border-l-0 lg:border-t-2
      "
    >
      {/* Ambient signal drift — idle heartbeat */}
      {!isActive && (
        <span
          className="
            ambient-pulse
            pointer-events-none
            absolute left-0 top-0
            h-1.5 w-1.5 rounded-full
            bg-muted blur-[1.5px]
          "
        />
      )}

      {/* Junction node — deliberate midpoint marker */}
      <span
        className={`
          absolute z-10
          h-2.5 w-2.5 rotate-45
          border bg-base
          transition-colors duration-300
          ${isActive ? "border-accent" : "border-line"}
        `}
      />

      {/* Travelling packet */}
      {isActive && (
        <div
          className="
            packet
            absolute left-0 top-0 z-20

            flex items-baseline gap-2
            whitespace-nowrap
            border border-accent
            bg-surface

            px-3 py-1.5

            mono text-[10px] tracking-wide

            shadow-[0_0_14px_-2px_rgba(184,217,74,0.5)]
          "
        >
          <span className="text-accent-soft">{packet.payload}</span>
          <span className="text-muted-soft">{packet.size}B</span>
        </div>
      )}
    </div>
  );
}

export default NetworkWire;