import { useEffect, useMemo, useState } from "react";

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// NOTE: App.jsx mounts this component with `key={packet?.id || "draft"}`,
// so a fresh packet always gives us a fresh component instance — the
// initial state below runs once per packet, no reset-on-prop-change
// effect needed.
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
    ? typeof packet.createdAt === "string" && Number.isNaN(Date.parse(packet.createdAt))
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

  const messageBytes = useMemo(() => {
    return new TextEncoder().encode(message).length;
  }, [message]);

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

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const tabGuides = {
    journey:
      'This packet was just created. Run a scenario below to see how a network actually confirms delivery — or handles loss.',

    layers:
      'Tap "Play" to watch the payload get wrapped, or tap any "?" for that layer\'s technical fields.',

    bits:
      "This is what actually travels down the wire — no headers, no layers, just bits.",
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setOpenInfo(null);
    setGuideText(tabGuides[tab]);
  };

  const toggleInfo = (layer) => {
    const next = openInfo === layer ? null : layer;

    setOpenInfo(next);

    if (!next) {
      setGuideText(tabGuides.layers);
      return;
    }

    const guides = {
      eth: "Ethernet only has to get this as far as the next switch or router — one hop.",
      ip: "IP is the only layer that knows how to route across different networks.",
      tcp: "TCP is what lets multiple apps share one internet connection without mixing up data.",
      payload:
        "This is the only part of the packet your application actually asked to send.",
    };

    setGuideText(guides[layer]);
  };

  const runScenario = (type) => {
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

    setTimeout(() => {
      setStatus((current) => ({
        ...current,
        transmitting: true,
      }));

      setTimestamps((current) => ({
        ...current,
        transmitting: formatTime(new Date()),
      }));
    }, 500);

    setTimeout(() => {
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

  const playWrap = () => {
    setWrapStage(0);

    setGuideText(
      "Starting with just the payload — your raw message, unwrapped."
    );

    const messages = [
      "TCP wraps it into a segment, adding ports and sequence info.",
      "IP wraps that into a packet, adding source and destination addresses.",
      "Ethernet wraps that into a frame — ready for the local link.",
    ];

    [1, 2, 3].forEach((stage, index) => {
      setTimeout(() => {
        setWrapStage(stage);
        setGuideText(messages[index]);
      }, (index + 1) * 700);
    });
  };

  const renderLayerInfo = (layer) => {
    if (openInfo !== layer) return null;

    const data = {
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

    if (layer === "payload") {
      return (
        <div className="mt-3 border-t border-accent/25 pt-3">
          <div className="mono text-[12px] text-ink">
            "{message}"
          </div>
        </div>
      );
    }

    return (
      <div className="mt-3 border-t border-line-soft pt-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data[layer].map(([label, value]) => (
            <div key={label}>
              <div className="mono text-[9px] uppercase text-muted">
                {label}
              </div>

              <div className="mono mt-1 text-[10.5px] text-ink">
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

        bg-black/60
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
          h-[calc(100dvh-24px)]
          max-h-[calc(100dvh-24px)]
          w-full
          max-w-5xl
          flex-col
          overflow-hidden

          border
          border-line

          bg-surface

          shadow-[0_30px_100px_rgba(0,0,0,0.55),0_0_70px_rgba(184,217,74,0.03)]
        "
      >

        {/* =========================================
            HEADER
        ========================================= */}

        <header
          className="
            flex
            shrink-0
            items-center
            justify-between

            border-b
            border-line-soft

            px-5
            py-4

            sm:px-6
          "
        >
          <div>
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

          <div className="flex items-center gap-2">
            {packet && (
              <button
                type="button"
                onClick={() => {
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

                  transition

                  hover:border-line
                  hover:text-ink
                "
              >
                Clear packet
              </button>
            )}

            <button
              type="button"
              onClick={() => onClose?.()}
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

                transition

                hover:border-line
                hover:text-ink
              "
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </header>


        {/* =========================================
            TABS
        ========================================= */}

        <div
          className="
            flex
            shrink-0
            gap-6

            border-b
            border-line-soft

            px-5

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
              onClick={() => changeTab(key)}
              aria-selected={activeTab === key}
              className={`
                mono
                border-b-2
                border-transparent
                py-2.5
                text-[11px]
                uppercase
                tracking-[0.08em]

                transition

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


        {/* =========================================
            GUIDE BAR
        ========================================= */}

        <div
          className="
            mono
            flex
            shrink-0
            items-center
            gap-2

            border-b
            border-line-faint

            bg-surface-raised

            px-5
            py-2

            text-[10.5px]
            text-muted-soft

            sm:px-6
          "
        >
          <span className="text-accent">
            →
          </span>

          <span>
            {guideText}
          </span>
        </div>


        {/* =========================================
            SCROLLABLE CONTENT
        ========================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto">

          <div
            className="
              mx-auto
              w-full
              max-w-3xl

              p-5

              sm:p-6
              lg:p-8
            "
          >

            {/* =====================================
                JOURNEY
            ===================================== */}

            {activeTab === "journey" && (
              <div>

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

                <div className="mt-5 flex items-center">

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
                          ? status.failed
                            ? "bg-[#e0716a]"
                            : "bg-accent"
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
                          ? status.failed
                            ? "border-[#e0716a] bg-[#2a1513] text-[#e0716a]"
                            : "border-accent bg-accent-deep text-accent"
                          : "border-line-soft text-muted"
                      }
                    `}
                  >
                    {status.final
                      ? status.failed
                        ? "✕"
                        : "✓"
                      : "○"}
                  </div>

                </div>


                {/* STEPPER LABELS */}

                <div className="mt-2 grid grid-cols-3 text-center">

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
                          status.failed
                            ? "text-[#e0716a]"
                            : status.final
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


                {/* SCENARIO */}

                <div
                  className="
                    mt-4

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
                    Run a scenario — see what actually happens
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">

                    <button
                      type="button"
                      onClick={() => runScenario("success")}
                      className="
                        border
                        border-line-soft

                        px-3
                        py-1.5

                        mono
                        text-[10.5px]
                        uppercase
                        text-accent-soft

                        transition

                        hover:border-line
                        hover:bg-surface-raised
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
                        py-1.5

                        mono
                        text-[10.5px]
                        uppercase
                        text-[#e0716a]

                        transition

                        hover:border-line
                        hover:bg-surface-raised
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

                    bg-gradient-to-r
                    from-accent/[0.07]
                    to-transparent

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
                    and networks are built to detect and recover from the
                    failed case, not just the happy one.
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
                    <div className="mono text-[13px] text-ink">
                      "{message}"
                    </div>

                    <div className="mono mt-1 text-[10px] text-muted">
                      {message.length} characters · {messageBytes} bytes as UTF-8
                    </div>
                  </div>

                </section>


                {/* NAVIGATION */}

                <section className="mt-6 grid grid-cols-2 gap-3">

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

                      transition

                      hover:border-line
                      hover:bg-surface-raised
                    "
                  >
                    <div className="mono text-[10px] uppercase text-muted">
                      Next
                    </div>

                    <div className="mt-1 text-[13px] font-medium">
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

                      transition

                      hover:border-line
                      hover:bg-surface-raised
                    "
                  >
                    <div className="mono text-[10px] uppercase text-muted">
                      Also
                    </div>

                    <div className="mt-1 text-[13px] font-medium">
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


            {/* =====================================
                LAYERS
            ===================================== */}

            {activeTab === "layers" && (
              <div>

                <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  Inside the packet
                </div>

                <div className="mt-2 text-[15px] font-medium">
                  Each layer wraps the one before it
                </div>


                <div
                  className="
                    mt-3
                    border-l-2
                    border-accent

                    bg-gradient-to-r
                    from-accent/[0.07]
                    to-transparent

                    px-4
                    py-3
                  "
                >
                  <div className="mono text-[9px] uppercase tracking-[0.15em] text-muted">
                    What to notice
                  </div>

                  <p className="mt-1 text-[11.5px] leading-relaxed text-ink">
                    Everything outside the lime box is overhead — added
                    only so the network can deliver it. Your app never
                    sees it.
                  </p>
                </div>


                {/* HEADER / PAYLOAD */}

                <div className="mt-6">

                  <div className="flex h-9 overflow-hidden border border-line-soft">

                    <div
                      className="
                        flex
                        items-center
                        justify-center

                        bg-surface-raised
                      "
                      style={{
                        width: `${(totalHeaders / totalBytes) * 100}%`,
                      }}
                    >
                      <span className="mono text-[9.5px] uppercase tracking-[0.1em] text-muted-soft">
                        Headers · {totalHeaders}B
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-center

                        bg-accent-deep
                      "
                      style={{
                        width: `${(messageBytes / totalBytes) * 100}%`,
                      }}
                    >
                      <span className="mono text-[9.5px] uppercase tracking-[0.1em] text-accent-soft">
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


                {/* MAP BAR */}

                <div className="mt-3 flex h-8 overflow-hidden border border-line-soft">

                  <div
                    className="
                      flex
                      flex-1
                      cursor-pointer
                      items-center
                      justify-center
                      bg-[#211e10]

                      transition
                      hover:brightness-110
                    "
                    onClick={() => toggleInfo("eth")}
                  >
                    <span className="mono text-[9px] text-[#d5c33f]">
                      ETH · 14B
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      flex-1
                      cursor-pointer
                      items-center
                      justify-center
                      bg-[#10201a]

                      transition
                      hover:brightness-110
                    "
                    onClick={() => toggleInfo("ip")}
                  >
                    <span className="mono text-[9px] text-[#6dd3a2]">
                      IP · 20B
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      flex-1
                      cursor-pointer
                      items-center
                      justify-center
                      bg-[#101c2a]

                      transition
                      hover:brightness-110
                    "
                    onClick={() => toggleInfo("tcp")}
                  >
                    <span className="mono text-[9px] text-[#72b4ef]">
                      TCP · 20B
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      flex-[1.2]
                      cursor-pointer
                      items-center
                      justify-center
                      bg-accent-deep

                      transition
                      hover:brightness-110
                    "
                    onClick={() => toggleInfo("payload")}
                  >
                    <span className="mono text-[9px] text-accent-soft">
                      DATA · {messageBytes}B
                    </span>
                  </div>

                </div>


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

                  <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">

                    <div className="space-y-1.5">

                      <div className="flex items-center justify-between gap-3">
                        <span className="mono text-[9px] text-[#d5c33f]">
                          MAC
                        </span>

                        <span className="mono text-[10px] text-ink">
                          AA:BB:CC:11:22:33
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span className="mono text-[9px] text-[#6dd3a2]">
                          IP
                        </span>

                        <span className="mono text-[10px] text-ink">
                          192.168.1.10
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span className="mono text-[9px] text-[#72b4ef]">
                          PORT
                        </span>

                        <span className="mono text-[10px] text-ink">
                          49152
                        </span>
                      </div>

                    </div>

                    <div className="mono text-[14px] text-muted">
                      →
                    </div>

                    <div className="space-y-1.5 text-right">

                      <div className="flex items-center justify-between gap-3">
                        <span className="mono text-[9px] text-[#d5c33f]">
                          MAC
                        </span>

                        <span className="mono text-[10px] text-ink">
                          AA:BB:CC:44:55:66
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span className="mono text-[9px] text-[#6dd3a2]">
                          IP
                        </span>

                        <span className="mono text-[10px] text-ink">
                          192.168.1.20
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span className="mono text-[9px] text-[#72b4ef]">
                          PORT
                        </span>

                        <span className="mono text-[10px] text-ink">
                          80
                        </span>
                      </div>

                    </div>

                  </div>

                  <p className="mt-3 text-[10.5px] leading-relaxed text-muted-soft">
                    MAC gets it across one local link, IP gets it across
                    networks, the port tells the receiving computer which
                    app it's for.
                  </p>

                </div>


                {/* PLAY */}

                <div className="mt-6 flex items-center justify-between">

                  <div>
                    <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted">
                      Watch it get wrapped
                    </div>

                    <p className="mt-1 text-[10.5px] text-muted-soft">
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
                      text-accent-soft

                      transition

                      hover:bg-accent-deep
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
                    border-[#4a4322]
                    bg-[#211e10]
                    p-3
                  "
                >

                  {/* ETHERNET */}

                  {wrapStage >= 3 && (
                    <div>

                      <div className="flex items-center justify-between">

                        <div>
                          <span className="mono text-[10.5px] uppercase text-[#d5c33f]">
                            Ethernet frame
                          </span>

                          <span className="mono ml-2 text-[9.5px] text-muted">
                            Link layer · 14B
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleInfo("eth")}
                          className="
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center

                            rounded-full

                            border
                            border-[#d5c33f]

                            mono
                            text-[11px]
                            text-[#d5c33f]

                            opacity-75

                            hover:opacity-100
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
                        <div
                          className="
                            mt-3
                            border
                            border-[#244334]
                            bg-[#10201a]
                            p-3
                          "
                        >

                          <div className="flex items-center justify-between">

                            <div>
                              <span className="mono text-[10.5px] uppercase text-[#6dd3a2]">
                                IP packet
                              </span>

                              <span className="mono ml-2 text-[9.5px] text-muted">
                                Network layer · 20B
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleInfo("ip")}
                              className="
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center

                                rounded-full

                                border
                                border-[#6dd3a2]

                                mono
                                text-[11px]
                                text-[#6dd3a2]

                                opacity-75

                                hover:opacity-100
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
                            <div
                              className="
                                mt-3
                                border
                                border-[#253c52]
                                bg-[#101c2a]
                                p-3
                              "
                            >

                              <div className="flex items-center justify-between">

                                <div>
                                  <span className="mono text-[10.5px] uppercase text-[#72b4ef]">
                                    TCP segment
                                  </span>

                                  <span className="mono ml-2 text-[9.5px] text-muted">
                                    Transport layer · 20B
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => toggleInfo("tcp")}
                                  className="
                                    flex
                                    h-5
                                    w-5
                                    items-center
                                    justify-center

                                    rounded-full

                                    border
                                    border-[#72b4ef]

                                    mono
                                    text-[11px]
                                    text-[#72b4ef]

                                    opacity-75

                                    hover:opacity-100
                                  "
                                >
                                  {openInfo === "tcp" ? "–" : "?"}
                                </button>

                              </div>

                              <p className="mt-2 text-[10.5px] leading-relaxed text-muted-soft">
                                Exists so the receiver knows which app
                                the data is for, and can reassemble pieces
                                in order.
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

                                <div className="flex items-center justify-between">

                                  <div>
                                    <span className="mono text-[10.5px] uppercase text-accent-soft">
                                      Payload
                                    </span>

                                    <span className="mono ml-2 text-[9.5px] text-accent">
                                      Your data · {messageBytes}B
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => toggleInfo("payload")}
                                    className="
                                      flex
                                      h-5
                                      w-5
                                      items-center
                                      justify-center

                                      rounded-full

                                      border
                                      border-accent

                                      mono
                                      text-[11px]
                                      text-accent

                                      opacity-75

                                      hover:opacity-100
                                    "
                                  >
                                    {openInfo === "payload" ? "–" : "?"}
                                  </button>

                                </div>

                                <p className="mt-2 text-[10.5px] leading-relaxed text-muted-soft">
                                  The one part every other layer exists
                                  to protect and deliver.
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


            {/* =====================================
                RAW BITS
            ===================================== */}

            {activeTab === "bits" && (
              <div>

                <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  On the wire
                </div>

                <div className="mt-2 text-[15px] font-medium">
                  Ultimately, everything becomes bits
                </div>


                <div
                  className="
                    mt-3

                    border-l-2
                    border-accent

                    bg-gradient-to-r
                    from-accent/[0.07]
                    to-transparent

                    px-4
                    py-3
                  "
                >
                  <div className="mono text-[9px] uppercase tracking-[0.15em] text-muted">
                    What to notice
                  </div>

                  <p className="mt-1 text-[11.5px] leading-relaxed text-ink">
                    However many layers wrapped it, the wire only ever
                    carries one thing: a stream of 1s and 0s.
                  </p>
                </div>


                <p className="mt-4 text-[11.5px] leading-relaxed text-muted-soft">
                  Below is the real encoding for the first few characters
                  of your message, one byte per character (UTF-8).
                </p>


                {/* BITS */}

                <div className="mt-6 flex flex-wrap items-start gap-4">

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

                          <span className="mono text-[10.5px] text-muted-soft">
                            {character}
                          </span>

                          <div className="flex gap-1">

                            {binary.split("").map((bit, bitIndex) => (
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
                            ))}

                          </div>

                        </div>
                      );
                    })}

                  {message.length > 5 && (
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

                  <div className="mt-1 text-[13px]">
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


        {/* =========================================
            FOOTER
        ========================================= */}

        <footer
          className="
            shrink-0

            border-t
            border-line-faint

            px-5
            py-3

            sm:px-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-1

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <span
              className="
                mono
                text-[9px]
                uppercase
                tracking-[0.15em]
                text-muted
              "
            >
              Simplified educational representation
            </span>

            <span
              className="
                mono
                text-[9px]
                uppercase
                tracking-[0.15em]
                text-muted
              "
            >
              Swaraj Labs / Network
            </span>

          </div>

        </footer>

      </section>
    </div>
  );
}

export default PacketInspector;