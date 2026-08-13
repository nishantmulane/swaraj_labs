import Computer from "./Computer";
import NetworkWire from "./NetworkWire";

function Transmission({ packet, isSending, isDelivered }) {
  return (
    <section className="px-6 pb-12 pt-10 sm:px-10 lg:px-16 lg:pb-14 lg:pt-12">
      <div className="mb-7 flex items-center justify-between border-b border-line-soft pb-3">
        <div className="mono text-[9px] uppercase tracking-[0.2em] text-muted">
          Transmission
        </div>

        <div className="mono flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-muted">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isSending ? "bg-accent" : "bg-muted"
            }`}
          />
          {isSending ? "Active" : isDelivered ? "Delivered" : "Ready"}
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-7">
        <Computer name="Sender" role="sender" packet={packet} />
        <NetworkWire packet={packet} isSending={isSending} />
        <Computer name="Receiver" role="receiver" packet={packet} />
      </div>
    </section>
  );
}

export default Transmission;