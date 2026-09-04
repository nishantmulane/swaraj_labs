import { useState } from "react";

import { Transmission } from "./index";
import { MessageControl } from "../controls";
import { PacketInspector } from "../packet";

import {
  KeyConcepts,
  TryThis,
  WhatsHappening,
} from "../education";

import {
  SessionStats,
  RecentTransmissions,
} from "../statistics";

import { Header, Footer } from "../layout";
import { useNetworkSimulation } from "../../hooks";

function TransmissionModule() {
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
    <>
      <div className="mx-auto w-full max-w-7xl">
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
    </>
  );
}

export default TransmissionModule;