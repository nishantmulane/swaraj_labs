import { useEffect, useMemo, useRef, useState } from "react";

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/* =====================================================
   LAYER BUTTON
===================================================== */

function LayerButton({
  layer,
  size,
  active,
  onToggle,
  children,
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(layer)}
      aria-expanded={active}
      className={`
        group
        flex
        min-h-9
        flex-1
        cursor-pointer
        items-center
        justify-center
        border
        px-2
        transition-colors
        duration-200

        ${
          active
            ? "border-accent bg-accent-deep"
            : "border-line-soft bg-surface-deep hover:border-line hover:bg-surface-raised"
        }
      `}
    >
      <span
        className={`
          mono
          text-[9px]
          tracking-[0.06em]

          ${
            active
              ? "text-accent-soft"
              : "text-muted-soft group-hover:text-ink"
          }
        `}
      >
        {children} · {size}B
      </span>
    </button>
  );
}

function PacketInspector({
  packet,
  draftMessage,
  transmission,
  onClear,
  onClose,
}) {
  const message = draftMessage || packet?.payload || "Hello, network!";
  const packetId = packet?.id || packet?.packetId || "PKT-0042";

  const initialCreatedDisplay = packet?.createdAt
    ? typeof packet.createdAt === "string" &&
      Number.isNaN(Date.parse(packet.createdAt))
      ? packet.createdAt
      : formatTime(new Date(packet.createdAt))
    : "—";

  const [activeTab, setActiveTab] = useState("journey");

  const [guideText, setGuideText] = useState(
    'This packet was just created. Nothing has been sent yet — click "Layers" to see how it gets wrapped for delivery.'
  );

  const [openInfo, setOpenInfo] = useState(null);
  const [wrapStage, setWrapStage] = useState(3);

  const [status, setStatus] = useState(() => ({
    created: true,
    transmitting:
      transmission?.status === "TRANSMITTING" ||
      transmission?.status === "RECEIVING" ||
      transmission?.status === "DELIVERED",
    final: transmission?.status === "DELIVERED",
    failed: transmission?.status === "FAILED",
  }));

  const [timestamps, setTimestamps] = useState(() => ({
    created: initialCreatedDisplay,
    transmitting: "—",
    final: "—",
  }));

  const timersRef = useRef([]);

  const messageBytes = useMemo(
    () => new TextEncoder().encode(message).length,
    [message]
  );

  const headers = {
    ethernet: 14,
    ip: 20,
    tcp: 20,
  };

  const totalHeaders =
    headers.ethernet +
    headers.ip +
    headers.tcp;

  const totalBytes = totalHeaders + messageBytes;

  const displayCreatedTime = timestamps.created;

  /* =====================================================
     TIMER CLEANUP
  ===================================================== */

  const clearTimers = () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  };

  const addTimer = (callback, delay) => {
    const timer = setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  /* =====================================================
     ESCAPE
  ===================================================== */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  /* =====================================================
     LOCK PAGE SCROLL
  ===================================================== */

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  /* =====================================================
     RESET MODAL SCROLL
  ===================================================== */

  useEffect(() => {
    const scrollContainer = document.querySelector(
      '[role="dialog"] [data-packet-inspector-scroll]'
    );

    if (!scrollContainer) return;

    scrollContainer.scrollTop = 0;
    scrollContainer.scrollLeft = 0;

    const frame = requestAnimationFrame(() => {
      scrollContainer.scrollTop = 0;
      scrollContainer.scrollLeft = 0;
    });

    return () => cancelAnimationFrame(frame);
  }, [packetId]);

  /* =====================================================
     TAB GUIDANCE
  ===================================================== */

  const tabGuides = {
    journey:
      "This packet was just created. Run a scenario below to see how a network confirms delivery — or handles loss.",

    layers:
      'Click "Play" to watch the payload get wrapped, or inspect any layer to see its technical fields.',

    bits:
      "This is what actually travels down the wire — no headers, no layers, just bits.",
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setOpenInfo(null);
    setGuideText(tabGuides[tab]);
  };

  /* =====================================================
     LAYER INFO
  ===================================================== */

  const toggleInfo = (layer) => {
    const next = openInfo === layer ? null : layer;

    setOpenInfo(next);

    if (!next) {
      setGuideText(tabGuides.layers);
      return;
    }

    const guides = {
      eth: "Ethernet only has to get this as far as the next switch or router — one hop.",

      ip: "IP is the layer that carries the source and destination addresses used to move across networks.",

      tcp: "TCP helps applications share a connection and keeps track of data so it can be delivered in order.",

      payload:
        "This is the part of the packet your application actually asked to send.",
    };

    setGuideText(guides[layer]);
  };

  /* =====================================================
     SCENARIOS
  ===================================================== */

  const runScenario = (type) => {
    clearTimers();

    setStatus({
      created: true,
      transmitting: false,
      final: false,
      failed: false,
    });

    setTimestamps({
      created:
        displayCreatedTime !== "—"
          ? displayCreatedTime
          : formatTime(new Date()),
      transmitting: "—",
      final: "—",
    });

    setGuideText("Transmitting…");

    addTimer(() => {
      setStatus((current) => ({
        ...current,
        transmitting: true,
      }));

      setTimestamps((current) => ({
        ...current,
        transmitting: formatTime(new Date()),
      }));
    }, 500);

    addTimer(() => {
      if (type === "success") {
        setStatus({
          created: true,
          transmitting: true,
          final: true,
          failed: false,
        });

        setTimestamps((current) => ({
          ...current,
          final: formatTime(new Date()),
        }));

        setGuideText(
          "Delivered. The receiver got every byte in order — this is the outcome TCP is built to guarantee."
        );
      } else {
        setStatus({
          created: true,
          transmitting: true,
          final: true,
          failed: true,
        });

        setTimestamps((current) => ({
          ...current,
          final: formatTime(new Date()),
        }));

        setGuideText(
          "Lost in transit. In a real network, TCP would notice the missing acknowledgment and retransmit this packet."
        );
      }
    }, 1300);
  };

  /* =====================================================
     LAYER WRAPPING
  ===================================================== */

  const playWrap = () => {
    clearTimers();

    setWrapStage(0);

    setGuideText(
      "Starting with just the payload — your raw message, unwrapped."
    );

    const messages = [
      "TCP wraps it into a segment, adding ports and sequence information.",

      "IP wraps that into a packet, adding source and destination addresses.",

      "Ethernet wraps that into a frame — ready for the local link.",
    ];

    [1, 2, 3].forEach((stage, index) => {
      addTimer(() => {
        setWrapStage(stage);
        setGuideText(messages[index]);
      }, (index + 1) * 700);
    });
  };

  /* =====================================================
     LAYER DATA
  ===================================================== */

  const layerData = {
    eth: [
      ["Source MAC", "AA:BB:CC:11:22:33"],
      ["Destination", "AA:BB:CC:44:55:66"],
      ["Type", "IPv4"],
    ],

    ip: [
      ["Source IP", "192.168.1.10"],
      ["Destination", "192.168.1.20"],
      ["Protocol", "TCP"],
    ],

    tcp: [
      ["Source port", "49152"],
      ["Destination port", "80"],
      ["Sequence #", "1024"],
    ],
  };

  const renderLayerInfo = (layer) => {
    if (openInfo !== layer) return null;

    if (layer === "payload") {
      return (
        <div className="mt-3 border-t border-line-soft pt-3">
          <div className="mono break-words text-[12px] text-ink">
            "{message}"
          </div>
        </div>
      );
    }

    return (
      <div className="mt-3 border-t border-line-soft pt-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {layerData[layer].map(([label, value]) => (
            <div key={label} className="min-w-0">
              <div className="mono text-[9px] uppercase tracking-[0.08em] text-muted">
                {label}
              </div>

              <div className="mono mt-1 break-all text-[10.5px] text-ink">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[200]

        flex
        items-center
        justify-center

        overflow-hidden

        bg-base/80
        p-3

        backdrop-blur-[3px]

        sm:p-5
      "
      role="dialog"
      aria-modal="true"
      aria-label="Packet inspector"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <section
        className="
          flex
          h-[calc(100svh-24px)]
          max-h-[calc(100svh-24px)]
          w-full
          max-w-5xl
          flex-col
          overflow-hidden

          border
          border-line

          bg-surface

          shadow-[0_30px_100px_rgba(0,0,0,0.55)]

          sm:h-[calc(100svh-40px)]
          sm:max-h-[calc(100svh-40px)]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className="
            flex
            shrink-0
            flex-wrap
            items-start
            justify-between
            gap-3

            border-b
            border-line-soft

            px-4
            py-3

            sm:px-6
            sm:py-4
          "
        >
          <div className="min-w-0">
            <div
              className="
                mono
                text-[10px]
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
                mt-1
                truncate
                text-[12px]
                tracking-[0.1em]
                text-accent-soft
              "
            >
              {packetId}

              <span className="text-muted">
                {" · created "}
              </span>

              <span className="text-ink">
                {displayCreatedTime}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {packet && (
              <button
                type="button"
                onClick={() => {
                  clearTimers();
                  onClear?.();
                  onClose?.();
                }}
                className="
                  mono
                  border
                  border-line-soft

                  px-2.5
                  py-1.5

                  text-[9.5px]
                  uppercase
                  tracking-[0.1em]
                  text-muted

                  transition-colors
                  duration-200

                  hover:border-line
                  hover:text-ink

                  focus-visible:outline-none
                  focus-visible:ring-1
                  focus-visible:ring-accent
                "
              >
                Clear packet
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                clearTimers();
                onClose?.();
              }}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center

                border
                border-line-soft

                text-lg
                leading-none
                text-muted

                transition-colors
                duration-200

                hover:border-line
                hover:text-ink

                focus-visible:outline-none
                focus-visible:ring-1
                focus-visible:ring-accent
              "
              aria-label="Close packet inspector"
            >
              ×
            </button>
          </div>
        </header>

        {/* =================================================
            TABS
        ================================================= */}

        <div
          role="tablist"
          aria-label="Packet inspection views"
          className="
            flex
            shrink-0
            gap-5
            overflow-x-auto
            overscroll-x-contain

            border-b
            border-line-soft

            px-4

            sm:px-6
          "
        >
          {[
            ["journey", "01 · Journey"],
            ["layers", "02 · Layers"],
            ["bits", "03 · Raw Bits"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              tabIndex={activeTab === key ? 0 : -1}
              onClick={() => changeTab(key)}
              className={`
                mono
                shrink-0

                border-b-2
                border-transparent

                py-2.5

                text-[11px]
                uppercase
                tracking-[0.08em]

                transition-colors
                duration-200

                focus-visible:outline-none
                focus-visible:ring-1
                focus-visible:ring-accent

                ${
                  activeTab === key
                    ? "border-accent text-accent-soft"
                    : "text-muted hover:text-ink"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* =================================================
            GUIDE
        ================================================= */}

        <div
          className="
            mono
            flex
            shrink-0
            items-start
            gap-2

            border-b
            border-line-faint

            bg-surface-raised

            px-5
            py-2

            text-[10.5px]
            leading-relaxed
            text-muted-soft

            sm:px-6
          "
        >
          <span className="shrink-0 text-accent">
            →
          </span>

          <span>{guideText}</span>
        </div>

        {/* =================================================
            SCROLLABLE CONTENT
        ================================================= */}

        <div
          className="
            min-h-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            overscroll-contain
            [overflow-anchor:none]
          "
          data-packet-inspector-scroll
        >
          <div
            className="
              mx-auto
              w-full
              min-w-0
              max-w-3xl

              p-4

              sm:p-6
              lg:p-8
            "
          >
            {/* =================================================
                JOURNEY
            ================================================= */}

            {activeTab === "journey" && (
              <div
                role="tabpanel"
                aria-label="Packet journey"
              >
                <div
                  className="
                    mono
                    text-[10px]
                    uppercase
                    tracking-[0.2em]
                    text-muted
                  "
                >
                  Packet status
                </div>

                {/* STEPPER */}

                <div className="mt-5 flex min-w-0 items-center">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center

                      rounded-full
                      border
                      border-accent
                      bg-accent-deep

                      text-accent
                    "
                  >
                    ✓
                  </div>

                  <div
                    className={`
                      h-px
                      flex-1

                      ${
                        status.transmitting
                          ? "bg-accent"
                          : "bg-line-soft"
                      }
                    `}
                  />

                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center

                      rounded-full
                      border

                      ${
                        status.transmitting
                          ? "border-accent bg-accent-deep text-accent"
                          : "border-line-soft text-muted"
                      }
                    `}
                  >
                    {status.transmitting ? "→" : "○"}
                  </div>

                  <div
                    className={`
                      h-px
                      flex-1

                      ${
                        status.final
                          ? "bg-accent"
                          : "bg-line-soft"
                      }
                    `}
                  />

                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center

                      rounded-full
                      border

                      ${
                        status.final
                          ? "border-accent bg-accent-deep text-accent"
                          : "border-line-soft text-muted"
                      }
                    `}
                  >
                    {status.final
                      ? status.failed
                        ? "×"
                        : "✓"
                      : "○"}
                  </div>
                </div>

                {/* STEPPER LABELS */}

                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="mono text-[10px] uppercase text-ink">
                      Created
                    </div>

                    <div className="mono mt-1 text-[9.5px] text-muted">
                      {timestamps.created}
                    </div>
                  </div>

                  <div>
                    <div
                      className={`
                        mono
                        text-[10px]
                        uppercase

                        ${
                          status.transmitting
                            ? "text-accent-soft"
                            : "text-muted-soft"
                        }
                      `}
                    >
                      Transmitting
                    </div>

                    <div className="mono mt-1 text-[9.5px] text-muted">
                      {timestamps.transmitting}
                    </div>
                  </div>

                  <div>
                    <div
                      className={`
                        mono
                        text-[10px]
                        uppercase

                        ${
                          status.final
                            ? "text-accent-soft"
                            : "text-muted-soft"
                        }
                      `}
                    >
                      {status.failed ? "Failed" : "Delivered"}
                    </div>

                    <div className="mono mt-1 text-[9.5px] text-muted">
                      {timestamps.final}
                    </div>
                  </div>
                </div>

                {/* SCENARIOS */}

                <div
                  className="
                    mt-5

                    border
                    border-line-faint

                    bg-surface-deep

                    px-4
                    py-3
                  "
                >
                  <div
                    className="
                      mono
                      text-[9.5px]
                      uppercase
                      tracking-[0.15em]
                      text-muted
                    "
                  >
                    Run a scenario
                  </div>

                  <p className="mt-1 text-[10.5px] leading-relaxed text-muted-soft">
                    Change the outcome and observe the packet lifecycle.
                  </p>

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => runScenario("success")}
                      className="
                        border
                        border-line-soft

                        px-3
                        py-2

                        mono
                        text-[10px]
                        uppercase
                        tracking-[0.08em]
                        text-accent-soft

                        transition-colors
                        duration-200

                        hover:border-accent/50
                        hover:bg-surface-raised

                        focus-visible:outline-none
                        focus-visible:ring-1
                        focus-visible:ring-accent
                      "
                    >
                      ▶ Deliver successfully
                    </button>

                    <button
                      type="button"
                      onClick={() => runScenario("fail")}
                      className="
                        border
                        border-line-soft

                        px-3
                        py-2

                        mono
                        text-[10px]
                        uppercase
                        tracking-[0.08em]
                        text-muted

                        transition-colors
                        duration-200

                        hover:border-line
                        hover:bg-surface-raised
                        hover:text-ink

                        focus-visible:outline-none
                        focus-visible:ring-1
                        focus-visible:ring-accent
                      "
                    >
                      ▶ Simulate packet loss
                    </button>
                  </div>
                </div>

                {/* WHAT TO NOTICE */}

                <div
                  className="
                    mt-6

                    border-l-2
                    border-accent

                    bg-accent/[0.035]

                    px-4
                    py-3
                  "
                >
                  <div
                    className="
                      mono
                      text-[9px]
                      uppercase
                      tracking-[0.15em]
                      text-muted
                    "
                  >
                    What to notice
                  </div>

                  <p className="mt-1 text-[11.5px] leading-relaxed text-ink">
                    A packet doesn't just "arrive" — it has a lifecycle,
                    and networks are built to detect and recover from
                    failed delivery.
                  </p>
                </div>

                {/* MESSAGE */}

                <section className="mt-7">
                  <div
                    className="
                      mono
                      text-[10px]
                      uppercase
                      tracking-[0.2em]
                      text-muted
                    "
                  >
                    Your message
                  </div>

                  <div
                    className="
                      mt-3

                      border
                      border-line-soft

                      bg-surface-deep

                      px-4
                      py-4
                    "
                  >
                    <div className="mono break-words text-[13px] text-ink">
                      "{message}"
                    </div>

                    <div className="mono mt-2 text-[10px] text-muted">
                      {message.length} characters · {messageBytes} bytes
                      as UTF-8
                    </div>
                  </div>
                </section>

                {/* NAVIGATION */}

                <section className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => changeTab("layers")}
                    className="
                      border
                      border-line-soft

                      bg-surface-deep

                      px-4
                      py-4

                      text-left

                      transition-colors
                      duration-200

                      hover:border-line
                      hover:bg-surface-raised

                      focus-visible:outline-none
                      focus-visible:ring-1
                      focus-visible:ring-accent
                    "
                  >
                    <div className="mono text-[10px] uppercase text-muted">
                      Next
                    </div>

                    <div className="mt-1 text-[13px] font-medium text-ink">
                      See what it's wrapped in →
                    </div>

                    <p className="mt-1 text-[11px] leading-relaxed text-muted-soft">
                      Watch three layers wrap around your message.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => changeTab("bits")}
                    className="
                      border
                      border-line-soft

                      bg-surface-deep

                      px-4
                      py-4

                      text-left

                      transition-colors
                      duration-200

                      hover:border-line
                      hover:bg-surface-raised

                      focus-visible:outline-none
                      focus-visible:ring-1
                      focus-visible:ring-accent
                    "
                  >
                    <div className="mono text-[10px] uppercase text-muted">
                      Also
                    </div>

                    <div className="mt-1 text-[13px] font-medium text-ink">
                      See the actual bits →
                    </div>

                    <p className="mt-1 text-[11px] leading-relaxed text-muted-soft">
                      It all ends up as 1s and 0s on the wire.
                    </p>
                  </button>
                </section>

                {/* REALISM */}

                <section className="mt-7 border-t border-line-soft pt-5">
                  <details className="group">
                    <summary
                      className="
                        mono
                        cursor-pointer

                        text-[10px]
                        uppercase
                        tracking-[0.15em]
                        text-muted

                        hover:text-ink
                      "
                    >
                      ⓘ How realistic is this simulation?
                    </summary>

                    <p className="mt-2 text-[11.5px] leading-relaxed text-muted-soft">
                      This is a simplified model for learning. Real
                      transmission adds more protocol fields,
                      physical-layer signalling, and error-checking
                      than shown here.
                    </p>
                  </details>
                </section>
              </div>
            )}

            {/* =================================================
                LAYERS
            ================================================= */}

            {activeTab === "layers" && (
              <div
                role="tabpanel"
                aria-label="Packet layers"
              >
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  Inside the packet
                </div>

                <div className="mt-2 text-[15px] font-medium text-ink">
                  Each layer wraps the one before it
                </div>

                <div
                  className="
                    mt-3

                    border-l-2
                    border-accent

                    bg-accent/[0.035]

                    px-4
                    py-3
                  "
                >
                  <div className="mono text-[9px] uppercase tracking-[0.15em] text-muted">
                    What to notice
                  </div>

                  <p className="mt-1 text-[11.5px] leading-relaxed text-ink">
                    Everything outside the payload is overhead — added
                    so the network can deliver your data.
                  </p>
                </div>

                {/* SIZE BAR */}

                <div className="mt-6">
                  <div className="flex min-h-9 overflow-hidden border border-line-soft">
                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        justify-center

                        bg-surface-raised
                      "
                      style={{
                        width: `${(totalHeaders / totalBytes) * 100}%`,
                      }}
                    >
                      <span className="mono truncate px-2 text-[9.5px] uppercase tracking-[0.06em] text-muted-soft">
                        Headers · {totalHeaders}B
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        justify-center

                        bg-accent-deep
                      "
                      style={{
                        width: `${(messageBytes / totalBytes) * 100}%`,
                      }}
                    >
                      <span className="mono truncate px-2 text-[9.5px] uppercase tracking-[0.06em] text-accent-soft">
                        Payload · {messageBytes}B
                      </span>
                    </div>
                  </div>

                  <div className="mt-1.5 text-right mono text-[9.5px] uppercase text-muted">
                    Payload:{" "}
                    <span className="text-accent-soft">
                      {messageBytes}B
                    </span>

                    {" · Headers: "}

                    <span className="text-muted-soft">
                      {totalHeaders}B
                    </span>

                    {" · Total: "}

                    <span className="text-ink">
                      {totalBytes}B
                    </span>
                  </div>
                </div>

                {/* LAYER MAP */}

                <div className="mt-4">
                  <div className="mono mb-2 text-[9px] uppercase tracking-[0.15em] text-muted">
                    Protocol stack
                  </div>

                  <div className="flex flex-col gap-1.5 sm:flex-row">
                    <LayerButton
                      layer="eth"
                      size={14}
                      active={openInfo === "eth"}
                      onToggle={toggleInfo}
                    >
                      ETH
                    </LayerButton>

                    <LayerButton
                      layer="ip"
                      size={20}
                      active={openInfo === "ip"}
                      onToggle={toggleInfo}
                    >
                      IP
                    </LayerButton>

                    <LayerButton
                      layer="tcp"
                      size={20}
                      active={openInfo === "tcp"}
                      onToggle={toggleInfo}
                    >
                      TCP
                    </LayerButton>

                    <LayerButton
                      layer="payload"
                      size={messageBytes}
                      active={openInfo === "payload"}
                      onToggle={toggleInfo}
                    >
                      DATA
                    </LayerButton>
                  </div>
                </div>

                {/* SELECTED LAYER */}

                {openInfo && (
                  <div
                    className="
                      mt-3

                      border
                      border-accent/30

                      bg-surface-deep

                      px-4
                      py-4
                    "
                  >
                    <div className="mono text-[9px] uppercase tracking-[0.15em] text-accent">
                      Selected layer
                    </div>

                    <div className="mt-2 text-[13px] font-medium text-ink">
                      {
                        {
                          eth: "Ethernet frame",
                          ip: "IP packet",
                          tcp: "TCP segment",
                          payload: "Application payload",
                        }[openInfo]
                      }
                    </div>

                    {renderLayerInfo(openInfo)}
                  </div>
                )}

                {/* ADDRESSING */}

                <div
                  className="
                    mt-6

                    border
                    border-line-soft

                    bg-surface-deep

                    px-4
                    py-4
                  "
                >
                  <div className="mono text-[9px] uppercase tracking-[0.18em] text-muted">
                    Source → Destination
                  </div>

                  <div className="mt-3 grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                    <div className="space-y-2">
                      <div className="mono text-[9px] uppercase text-muted">
                        Source
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-3">
                          <span className="mono text-[9px] text-muted">
                            MAC
                          </span>

                          <span className="mono text-[10px] text-ink">
                            AA:BB:CC:11:22:33
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <span className="mono text-[9px] text-muted">
                            IP
                          </span>

                          <span className="mono text-[10px] text-ink">
                            192.168.1.10
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <span className="mono text-[9px] text-muted">
                            PORT
                          </span>

                          <span className="mono text-[10px] text-ink">
                            49152
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden text-center sm:block">
                      <div className="mono text-[14px] text-accent">
                        →
                      </div>

                      <div className="mono mt-1 text-[7px] uppercase tracking-[0.12em] text-muted">
                        Network path
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="mono text-[9px] uppercase text-muted">
                        Destination
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-3">
                          <span className="mono text-[9px] text-muted">
                            MAC
                          </span>

                          <span className="mono text-[10px] text-ink">
                            AA:BB:CC:44:55:66
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <span className="mono text-[9px] text-muted">
                            IP
                          </span>

                          <span className="mono text-[10px] text-ink">
                            192.168.1.20
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <span className="mono text-[9px] text-muted">
                            PORT
                          </span>

                          <span className="mono text-[10px] text-ink">
                            80
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-[10.5px] leading-relaxed text-muted-soft">
                    MAC handles the local link, IP identifies the
                    destination across networks, and the port identifies
                    the receiving application.
                  </p>
                </div>

                {/* PLAY */}

                <div className="mt-6 flex flex-col gap-3 border-t border-line-soft pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted">
                      Watch it get wrapped
                    </div>

                    <p className="mt-1 max-w-lg text-[10.5px] leading-relaxed text-muted-soft">
                      Payload is built first — everything else wraps
                      around it, one layer at a time.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={playWrap}
                    className="
                      mono
                      shrink-0

                      border
                      border-accent

                      px-3
                      py-1.5

                      text-[10.5px]
                      uppercase
                      tracking-[0.08em]
                      text-accent-soft

                      transition-colors
                      duration-200

                      hover:bg-accent-deep

                      focus-visible:outline-none
                      focus-visible:ring-1
                      focus-visible:ring-accent
                    "
                  >
                    ▶ Play
                  </button>
                </div>

                {/* NESTED LAYERS */}

                <div
                  className="
                    mt-4

                    border
                    border-line-soft

                    bg-surface-deep

                    p-3
                  "
                >
                  {/* ETHERNET */}

                  {wrapStage >= 3 && (
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="mono text-[10.5px] uppercase text-accent-soft">
                            Ethernet frame
                          </span>

                          <span className="mono ml-2 text-[9.5px] text-muted">
                            Link layer · 14B
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleInfo("eth")}
                          aria-label="Inspect Ethernet layer"
                          aria-expanded={openInfo === "eth"}
                          className="
                            flex
                            h-5
                            w-5
                            shrink-0
                            items-center
                            justify-center

                            rounded-full
                            border
                            border-line

                            mono
                            text-[11px]
                            text-muted

                            transition-colors

                            hover:border-accent
                            hover:text-accent
                          "
                        >
                          {openInfo === "eth" ? "–" : "?"}
                        </button>
                      </div>

                      <p className="mt-2 text-[10.5px] leading-relaxed text-muted-soft">
                        Exists so the frame can travel one hop across
                        the local network link.
                      </p>

                      {renderLayerInfo("eth")}

                      {/* IP */}

                      {wrapStage >= 2 && (
                        <div className="mt-3 border border-line-soft bg-surface-raised p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <span className="mono text-[10.5px] uppercase text-accent-soft">
                                IP packet
                              </span>

                              <span className="mono ml-2 text-[9.5px] text-muted">
                                Network layer · 20B
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleInfo("ip")}
                              aria-label="Inspect IP layer"
                              aria-expanded={openInfo === "ip"}
                              className="
                                flex
                                h-5
                                w-5
                                shrink-0
                                items-center
                                justify-center

                                rounded-full
                                border
                                border-line

                                mono
                                text-[11px]
                                text-muted

                                transition-colors

                                hover:border-accent
                                hover:text-accent
                              "
                            >
                              {openInfo === "ip" ? "–" : "?"}
                            </button>
                          </div>

                          <p className="mt-2 text-[10.5px] leading-relaxed text-muted-soft">
                            Exists so the packet can cross multiple
                            networks to a device that isn't on the same
                            local link.
                          </p>

                          {renderLayerInfo("ip")}

                          {/* TCP */}

                          {wrapStage >= 1 && (
                            <div className="mt-3 border border-line-soft bg-surface p-3">
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <span className="mono text-[10.5px] uppercase text-accent-soft">
                                    TCP segment
                                  </span>

                                  <span className="mono ml-2 text-[9.5px] text-muted">
                                    Transport layer · 20B
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => toggleInfo("tcp")}
                                  aria-label="Inspect TCP layer"
                                  aria-expanded={openInfo === "tcp"}
                                  className="
                                    flex
                                    h-5
                                    w-5
                                    shrink-0
                                    items-center
                                    justify-center

                                    rounded-full
                                    border
                                    border-line

                                    mono
                                    text-[11px]
                                    text-muted

                                    transition-colors

                                    hover:border-accent
                                    hover:text-accent
                                  "
                                >
                                  {openInfo === "tcp" ? "–" : "?"}
                                </button>
                              </div>

                              <p className="mt-2 text-[10.5px] leading-relaxed text-muted-soft">
                                Exists so the receiver knows which
                                application the data is for, and can
                                reassemble pieces in order.
                              </p>

                              {renderLayerInfo("tcp")}

                              {/* PAYLOAD */}

                              <div
                                className="
                                  mt-3

                                  border
                                  border-accent

                                  bg-accent-deep

                                  p-3
                                "
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="min-w-0">
                                    <span className="mono text-[10.5px] uppercase text-accent-soft">
                                      Payload
                                    </span>

                                    <span className="mono ml-2 text-[9.5px] text-accent">
                                      Your data · {messageBytes}B
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleInfo("payload")
                                    }
                                    aria-label="Inspect payload"
                                    aria-expanded={
                                      openInfo === "payload"
                                    }
                                    className="
                                      flex
                                      h-5
                                      w-5
                                      shrink-0
                                      items-center
                                      justify-center

                                      rounded-full
                                      border
                                      border-accent

                                      mono
                                      text-[11px]
                                      text-accent

                                      transition-colors

                                      hover:bg-accent
                                      hover:text-accent-deep
                                    "
                                  >
                                    {openInfo === "payload"
                                      ? "–"
                                      : "?"}
                                  </button>
                                </div>

                                <p className="mt-2 text-[10.5px] leading-relaxed text-muted-soft">
                                  The one part every other layer
                                  exists to protect and deliver.
                                </p>

                                {renderLayerInfo("payload")}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                RAW BITS
            ================================================= */}

            {activeTab === "bits" && (
              <div
                role="tabpanel"
                aria-label="Raw packet bits"
              >
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  On the wire
                </div>

                <div className="mt-2 text-[15px] font-medium text-ink">
                  Ultimately, everything becomes bits
                </div>

                <div
                  className="
                    mt-3

                    border-l-2
                    border-accent

                    bg-accent/[0.035]

                    px-4
                    py-3
                  "
                >
                  <div className="mono text-[9px] uppercase tracking-[0.15em] text-muted">
                    What to notice
                  </div>

                  <p className="mt-1 text-[11.5px] leading-relaxed text-ink">
                    However many layers wrapped it, the wire ultimately
                    carries a stream of bits.
                  </p>
                </div>

                <p className="mt-4 text-[11.5px] leading-relaxed text-muted-soft">
                  Below is the encoding for the first few characters of
                  your message, one byte per character.
                </p>

                {/* BITS */}

                <div className="mt-6 flex flex-wrap items-start gap-3 sm:gap-4">
                  {Array.from(new TextEncoder().encode(message))
                    .slice(0, 5)
                    .map((byte, index) => {
                      const character = message[index];

                      const binary = byte
                        .toString(2)
                        .padStart(8, "0");

                      return (
                        <div
                          key={`${character}-${index}`}
                          className="
                            flex
                            flex-col
                            items-center
                            gap-1.5
                          "
                        >
                          <span className="mono max-w-20 truncate text-[10.5px] text-muted-soft">
                            {character}
                          </span>

                          <div className="flex shrink-0 gap-1">
                            {binary.split("").map(
                              (bit, bitIndex) => (
                                <span
                                  key={bitIndex}
                                  className="
                                    inline-flex
                                    h-[26px]
                                    min-w-[22px]
                                    items-center
                                    justify-center

                                    border
                                    border-line-soft

                                    bg-surface-deep

                                    px-1.5

                                    mono
                                    text-[10.5px]
                                    text-accent-soft
                                  "
                                >
                                  {bit}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}

                  {messageBytes > 5 && (
                    <div className="flex h-[26px] items-center">
                      <span className="mono text-[10.5px] text-muted">
                        … {Math.max(messageBytes - 5, 0)} more bytes
                      </span>
                    </div>
                  )}
                </div>

                {/* TOTAL */}

                <div
                  className="
                    mt-6

                    border
                    border-line-faint

                    bg-surface-deep

                    px-4
                    py-4
                  "
                >
                  <div className="mono text-[9.5px] uppercase text-muted">
                    Total transmitted
                  </div>

                  <div className="mt-1 text-[13px] leading-relaxed text-ink">
                    {messageBytes} bytes of data →{" "}
                    <span className="text-accent-soft">
                      {messageBytes * 8} bits
                    </span>
                    {", plus "}
                    {totalHeaders} bytes of header across Ethernet,
                    IP and TCP.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            MODAL FOOTER
        ================================================= */}

        <footer
          className="
            shrink-0

            border-t
            border-line-faint

            px-5
            py-2.5

            sm:px-6
          "
        >
          <div className="flex items-center justify-between gap-4">
            <span className="mono text-[8px] uppercase tracking-[0.14em] text-muted">
              Simplified educational model
            </span>

            <span className="mono text-[8px] uppercase tracking-[0.14em] text-muted">
              ESC TO CLOSE
            </span>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default PacketInspector;