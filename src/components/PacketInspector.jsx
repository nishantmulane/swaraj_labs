import { useState } from "react";

function PacketInspector({ packet }) {
  const [isOpen, setIsOpen] = useState(true);

  const hasPacket = Boolean(packet);

  const status = packet?.status ?? "READY";
  const payload = packet?.payload ?? "—";
  const payloadSize = packet?.size ?? 0;

  const isActive = status === "TRANSMITTING";
  const isDelivered = status === "DELIVERED";

  return (
    <section className="px-6 sm:px-10 lg:px-16">
      <div className="overflow-hidden border border-line-soft bg-surface">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="
            flex
            w-full
            items-center
            justify-between
            border-b
            border-line-soft
            px-5
            py-3
            text-left
            transition-colors
            hover:bg-surface-raised
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-accent/50
          "
        >
          <div className="flex items-center gap-3">
            <span className="mono text-[9px] uppercase tracking-[0.2em] text-muted">
              Packet
            </span>

            <span className="mono text-[8px] uppercase tracking-[0.16em] text-muted-soft">
              Inspector
            </span>
          </div>

          <span className="mono text-[11px] text-muted">
            {isOpen ? "−" : "+"}
          </span>
        </button>

        {isOpen && (
          <div>
            <div className="grid grid-cols-2 divide-x divide-line-soft sm:grid-cols-4">
              <PacketField label="Source" value={packet?.source ?? "—"} />
              <PacketField
                label="Destination"
                value={packet?.destination ?? "—"}
              />
              <PacketField
                label="Size"
                value={hasPacket ? `${payloadSize} B` : "—"}
              />
              <PacketField
                label="Status"
                value={status}
                accent={isActive || isDelivered}
              />
            </div>

            <div className="border-t border-line-soft px-5 py-4">
              <div className="mono text-[8px] uppercase tracking-[0.18em] text-muted-soft">
                Payload
              </div>

              <div className="mono mt-2 min-h-6 break-all text-sm text-accent">
                {payload}
              </div>
            </div>

            {packet && (
              <div className="border-t border-line-soft px-5 py-3">
                <div className="mono text-[8px] uppercase tracking-[0.18em] text-muted-soft">
                  Packet ID
                </div>

                <div className="mono mt-1.5 break-all text-[10px] text-muted">
                  {packet.id}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function PacketField({ label, value, accent = false }) {
  return (
    <div className="px-4 py-3 sm:px-5">
      <div className="mono text-[8px] uppercase tracking-[0.18em] text-muted-soft">
        {label}
      </div>

      <div
        className={`mono mt-1.5 text-[11px] sm:text-xs ${
          accent ? "text-accent" : "text-ink"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default PacketInspector;