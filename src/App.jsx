import { useState } from "react";

import { EntryTransition, Transmission } from "./components/transmission";
import { MessageControl } from "./components/controls";
import { PacketInspector } from "./components/packet";

import {
  KeyConcepts,
  TryThis,
  WhatsHappening,
} from "./components/education";

import {
  SessionStats,
  RecentTransmissions,
} from "./components/statistics";

import { Header, Footer } from "./components/layout";
import { useNetworkSimulation } from "./hooks";

function App() {
  const [entered, setEntered] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

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
      {!entered && (
        <EntryTransition onComplete={() => setEntered(true)} />
      )}

      {/* IMPORTANT:
          This wrapper is animated with translate-y/opacity.
          A transformed ancestor changes the containing block of
          position: fixed descendants, which was causing the
          Packet Inspector to position relative to this wrapper
          instead of the viewport.
      */}
      <div
        className={`
          mx-auto w-full max-w-7xl
          transition-all duration-700 ease-out
          ${
            entered
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }
        `}
      >
        <Header />

        <section className="px-6 pt-5 sm:px-10 lg:px-8">
          <Transmission
            packet={packet}
            transmission={transmission}
            draftMessage={message}
            onInspect={() => setIsInspectorOpen(true)}
          />

          <div className="mt-3">
            <MessageControl
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              isSending={isBusy}
              transmission={transmission}
            />
          </div>
        </section>

        <section className="mt-4 px-6 sm:px-10 lg:px-8">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 xl:auto-rows-fr">
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

        {history.length > 0 && (
          <section className="mt-4 px-6 sm:px-10 lg:px-8">
            <RecentTransmissions history={history} />
          </section>
        )}

        <Footer />
      </div>

      {/* =====================================================
          PACKET INSPECTOR

          MUST remain outside the transformed page wrapper.
          It is a viewport-level modal, not a child of the
          animated application surface.
      ===================================================== */}

      {isInspectorOpen && (
        <PacketInspector
          key={packet?.id || "draft"}
          packet={packet}
          draftMessage={message}
          transmission={transmission}
          onClear={clearPacket}
          onClose={() => setIsInspectorOpen(false)}
        />
      )}
    </main>
  );
}

export default App;
