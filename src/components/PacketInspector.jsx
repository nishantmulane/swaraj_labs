function PacketInspector({
  packet,
  draftMessage,
  transmission,
  onClear,
}) {
  const status = transmission?.status || "READY";

  const hasPacket = Boolean(packet);

  const payload = packet?.payload || "";

  const previewPayload =
    payload ||
    draftMessage ||
    "No packet captured";

  const payloadSize = packet
    ? packet.size
    : new TextEncoder().encode(draftMessage || "").length;

  const statusLabel = {
    READY: "READY",
    TRANSMITTING: "IN TRANSIT",
    RECEIVING: "RECEIVING",
    DELIVERED: "DELIVERED",
  }[status] || "READY";

  const isActive =
    status === "TRANSMITTING" ||
    status === "RECEIVING" ||
    status === "DELIVERED";

  // =========================================
  // HEX
  // =========================================

  const rawHex = packet?.payload
    ? Array.from(new TextEncoder().encode(packet.payload))
        .map((byte) =>
          byte
            .toString(16)
            .padStart(2, "0")
            .toUpperCase()
        )
        .join(" ")
    : "—";

  // =========================================
  // ASCII
  // =========================================

  const ascii = packet?.payload || "—";

  // =========================================
  // LIFECYCLE
  // =========================================

  const lifecycle = [
    {
      label: "Created",
      time: transmission?.createdAt,
      active: Boolean(transmission?.createdAt),
    },
    {
      label: "In Transit",
      time:
        transmission?.sentAt ||
        transmission?.receivingAt,
      active:
        status === "TRANSMITTING" ||
        status === "RECEIVING" ||
        status === "DELIVERED",
    },
    {
      label: "Delivered",
      time: transmission?.deliveredAt,
      active: status === "DELIVERED",
    },
  ];

  // =========================================
  // EXPLANATION
  // =========================================

  let explanation = "No packet captured yet.";

  if (status === "TRANSMITTING") {
    explanation =
      "Packet is moving from Sender to Receiver.";
  }

  if (status === "RECEIVING") {
    explanation =
      "Receiver is processing the packet.";
  }

  if (status === "DELIVERED") {
    explanation =
      "Packet reached the Receiver successfully.";
  }

  return (
    <section className="w-full">
      <div
        className="
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
            w-full
            items-center
            justify-between

            border-b
            border-line-soft

            px-4
            py-2.5
          "
        >
          <div className="min-w-0">
            <div
              className="
                mono
                text-[8px]
                uppercase
                tracking-[0.2em]
                text-muted
              "
            >
              Packet Inspector
            </div>

            <div
              className="
                mono
                mt-0.5
                text-[7px]
                uppercase
                tracking-[0.14em]
                text-muted-soft
              "
            >
              {hasPacket
                ? "Last Packet"
                : "Waiting for Packet"}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClear}
              disabled={!hasPacket}
              className="
                mono
                text-[7px]
                uppercase
                tracking-[0.15em]

                text-muted-soft

                transition-colors
                duration-200

                hover:text-accent

                disabled:cursor-default
                disabled:opacity-40
                disabled:hover:text-muted-soft
              "
            >
              Clear
            </button>

            <div
              className={`
                mono
                text-[7px]
                uppercase
                tracking-[0.15em]

                ${
                  isActive
                    ? "text-accent"
                    : "text-muted-soft"
                }
              `}
            >
              {statusLabel}
            </div>
          </div>
        </div>

        {/* =====================================
            PACKET METADATA
        ===================================== */}

        <div
          className="
            grid
            grid-cols-2

            divide-x
            divide-y
            divide-line-soft
          "
        >
          <Field
            label="Packet ID"
            value={packet?.id || "—"}
          />

          <Field
            label="Type"
            value={packet ? "DATA" : "—"}
          />

          <Field
            label="Source"
            value={packet?.source || "Sender"}
          />

          <Field
            label="Destination"
            value={
              packet?.destination || "Receiver"
            }
          />

          <Field
            label="Size"
            value={
              packet
                ? `${payloadSize} B`
                : "—"
            }
          />

          <Field
            label="Encoding"
            value={packet ? "UTF-8" : "—"}
          />
        </div>

        {/* =====================================
            PAYLOAD
        ===================================== */}

        <InspectorSection
          label="Payload"
          meta={
            packet
              ? `${payloadSize} bytes · UTF-8`
              : null
          }
        >
          <div
            className={`
              mono
              min-h-5
              break-words
              text-[11px]
              leading-relaxed

              ${
                packet
                  ? "text-accent-soft"
                  : "text-muted-soft"
              }
            `}
          >
            {previewPayload}
          </div>
        </InspectorSection>

        {/* =====================================
            RAW / HEX
        ===================================== */}

        <InspectorSection
          label="Raw / Hex"
          meta={
            packet
              ? `${payloadSize} bytes`
              : null
          }
        >
          <div
            className="
              mono
              min-h-5
              break-all
              text-[9px]
              leading-relaxed
              text-muted
            "
          >
            {rawHex}
          </div>
        </InspectorSection>

        {/* =====================================
            ASCII
        ===================================== */}

        <InspectorSection label="ASCII">
          <div
            className="
              mono
              min-h-5
              break-all
              text-[10px]
              leading-relaxed
              text-ink
            "
          >
            {ascii}
          </div>
        </InspectorSection>

        {/* =====================================
            PACKET LIFECYCLE
        ===================================== */}

        <div
          className="
            border-t
            border-line-soft
            px-4
            py-2.5
          "
        >
          <div
            className="
              mono
              mb-2
              text-[7px]
              uppercase
              tracking-[0.18em]
              text-muted-soft
            "
          >
            Packet Lifecycle
          </div>

          <div className="space-y-1.5">
            {lifecycle.map((step, index) => (
              <LifecycleStep
                key={step.label}
                label={step.label}
                time={step.time}
                active={step.active}
                isLast={index === lifecycle.length - 1}
              />
            ))}
          </div>
        </div>

        {/* =====================================
            TRANSMISSION NOTE
        ===================================== */}

        <div
          className="
            border-t
            border-line-soft
            bg-surface-deep
            px-4
            py-2.5
          "
        >
          <div
            className="
              flex
              items-start
              gap-2
            "
          >
            <span
              className={`
                mt-1
                h-1.5
                w-1.5
                shrink-0
                rounded-full

                ${
                  isActive
                    ? "bg-accent"
                    : "bg-muted"
                }
              `}
            />

            <div
              className="
                min-w-0
                mono
                text-[8px]
                leading-relaxed
                text-muted
              "
            >
              {explanation}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================
   FIELD
========================================= */

function Field({ label, value }) {
  return (
    <div
      className="
        min-w-0
        px-3
        py-2.5
      "
    >
      <div
        className="
          mono
          truncate
          text-[7px]
          uppercase
          tracking-[0.16em]
          text-muted-soft
        "
      >
        {label}
      </div>

      <div
        className="
          mono
          mt-1
          break-words
          text-[9px]
          leading-tight
          text-ink
        "
      >
        {value}
      </div>
    </div>
  );
}

/* =========================================
   INSPECTOR SECTION
========================================= */

function InspectorSection({
  label,
  meta,
  children,
}) {
  return (
    <div
      className="
        border-t
        border-line-soft
        px-4
        py-2.5
      "
    >
      <div
        className="
          mb-1.5
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <div
          className="
            mono
            text-[7px]
            uppercase
            tracking-[0.18em]
            text-muted-soft
          "
        >
          {label}
        </div>

        {meta && (
          <div
            className="
              mono
              shrink-0
              text-[7px]
              text-muted-soft
            "
          >
            {meta}
          </div>
        )}
      </div>

      {children}
    </div>
  );
}

/* =========================================
   LIFECYCLE STEP
========================================= */

function LifecycleStep({
  label,
  time,
  active,
  isLast,
}) {
  return (
    <div className="relative">
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <span
          className={`
            relative
            z-10
            h-1.5
            w-1.5
            shrink-0
            rounded-full

            ${
              active
                ? "bg-accent"
                : "bg-muted"
            }
          `}
        />

        <span
          className={`
            mono
            text-[7px]
            uppercase
            tracking-[0.12em]

            ${
              active
                ? "text-accent"
                : "text-muted"
            }
          `}
        >
          {label}
        </span>

        <span
          className="
            ml-auto
            mono
            text-[7px]
            text-muted-soft
          "
        >
          {formatTime(time)}
        </span>
      </div>

      {!isLast && (
        <div
          className="
            absolute
            left-[2px]
            top-[7px]
            h-[calc(100%+6px)]
            w-px
            bg-line-soft
          "
        />
      )}
    </div>
  );
}

/* =========================================
   TIME
========================================= */

function formatTime(timestamp) {
  if (!timestamp) return "—";

  return new Date(timestamp).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  );
}

export default PacketInspector;