import Header from "./components/Header";
import Transmission from "./components/Transmission";
import PacketInspector from "./components/PacketInspector";
import MessageControl from "./components/MessageControl";
import Footer from "./components/Footer";

import useNetworkSimulation from "./hooks/useNetworkSimulation";

function App() {
  const { message, setMessage, packet, sendMessage, isSending, isDelivered } =
    useNetworkSimulation();

  return (
    <main className="network-grid min-h-screen">
      <div className="mx-auto max-w-6xl">
        <Header />

        <Transmission
          packet={packet}
          isSending={isSending}
          isDelivered={isDelivered}
        />

        <PacketInspector packet={packet} />

        <MessageControl
          message={message}
          setMessage={setMessage}
          onSend={sendMessage}
          disabled={isSending}
        />

        <Footer />
      </div>
    </main>
  );
}

export default App;