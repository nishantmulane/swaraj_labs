import Header from "./components/Header";
import Transmission from "./components/Transmission";
import PacketInspector from "./components/PacketInspector";
import MessageControl from "./components/MessageControl";
import SessionStats from "./components/SessionStats";
import WhatsHappening from "./components/WhatsHappening";
import KeyConcepts from "./components/KeyConcepts";
import TryThis from "./components/TryThis";
import Footer from "./components/Footer";

import useNetworkSimulation from "./hooks/useNetworkSimulation";

function App() {
  const {
    message,
    setMessage,
    packet,
    transmission,
    sendMessage,
    isBusy,
    clearPacket,

    history,
    packetsSent,
    packetsDelivered,
    dataTransferred,
    failedPackets,
  } = useNetworkSimulation();

  return (
    <main className="network-grid min-h-screen">
      <div className="mx-auto w-full max-w-7xl">
        {/* =========================================
            HEADER
        ========================================= */}

        <Header />

        {/* =========================================
            PRIMARY LAB
        ========================================= */}

        <section
          className="
            px-6
            pt-5
            sm:px-10
            lg:px-8
          "
        >
          <div
            className="
              grid
              gap-4

              lg:grid-cols-[minmax(0,1fr)_320px]

              lg:items-stretch
            "
          >
            {/* =====================================
                LEFT — TRANSMISSION
            ===================================== */}

            <div
              className="
                flex
                min-w-0
                flex-col
              "
            >
              <Transmission
                packet={packet}
                transmission={transmission}
                draftMessage={message}
              />

              <div className="mt-3">
                <MessageControl
                  message={message}
                  setMessage={setMessage}
                  sendMessage={sendMessage}
                  isSending={isBusy}
                />
              </div>
            </div>

            {/* =====================================
                RIGHT — PACKET INSPECTOR
            ===================================== */}

            <aside
              className="
                flex
                min-w-0
              "
            >
              <PacketInspector
                packet={packet}
                draftMessage={message}
                transmission={transmission}
                onClear={clearPacket}
              />
            </aside>
          </div>
        </section>

        {/* =========================================
            SUPPORTING INFORMATION
        ========================================= */}

        <section
          className="
            mt-4
            px-6
            sm:px-10
            lg:px-8
          "
        >
          <div
            className="
              grid
              gap-3

              md:grid-cols-2
              xl:grid-cols-4

              xl:auto-rows-fr
            "
          >
            <WhatsHappening
              packet={packet}
              transmission={transmission}
            />

            <KeyConcepts />

            <TryThis />

            <SessionStats
              packetsSent={packetsSent}
              packetsDelivered={packetsDelivered}
              dataTransferred={dataTransferred}
              failedPackets={failedPackets}
            />
          </div>
        </section>

        {/* =========================================
            RECENT TRANSMISSIONS
        ========================================= */}

        {history.length > 0 && (
          <section
            className="
              mt-4
              px-6
              sm:px-10
              lg:px-8
            "
          >
            <div
              className="
                overflow-hidden
                border
                border-line-soft
                bg-surface
              "
            >
              {/* Header */}

              <div
                className="
                  flex
                  items-center
                  justify-between

                  border-b
                  border-line-soft

                  px-4
                  py-2.5
                "
              >
                <div
                  className="
                    mono
                    text-[8px]
                    uppercase
                    tracking-[0.2em]
                    text-muted
                  "
                >
                  Recent Transmissions
                </div>

                <span
                  className="
                    mono
                    text-[7px]
                    uppercase
                    tracking-[0.15em]
                    text-muted-soft
                  "
                >
                  {history.length} packets
                </span>
              </div>

              {/* Table */}

              <div className="overflow-x-auto">
                <div className="min-w-[560px]">
                  <div
                    className="
                      grid
                      grid-cols-[1.2fr_1fr_2fr_0.8fr_1fr]

                      border-b
                      border-line-faint

                      px-4
                      py-2

                      mono
                      text-[7px]
                      uppercase
                      tracking-[0.15em]
                      text-muted-soft
                    "
                  >
                    <span>ID</span>
                    <span>Time</span>
                    <span>Message</span>
                    <span>Size</span>
                    <span>Status</span>
                  </div>

                  {history.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="
                        grid
                        grid-cols-[1.2fr_1fr_2fr_0.8fr_1fr]

                        border-b
                        border-line-faint

                        px-4
                        py-2

                        last:border-b-0

                        mono
                        text-[8px]
                        text-muted
                      "
                    >
                      <span className="text-accent-soft">
                        {item.id}
                      </span>

                      <span>
                        {item.time || "—"}
                      </span>

                      <span className="truncate pr-3 text-ink">
                        {item.payload}
                      </span>

                      <span>
                        {item.size} B
                      </span>

                      <span className="text-accent">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================
            FOOTER
        ========================================= */}

        <Footer />
      </div>
    </main>
  );
}

export default App;