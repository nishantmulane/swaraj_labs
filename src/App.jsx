import Header from "./components/Header";
import Transmission from "./components/Transmission";
import PacketInspector from "./components/PacketInspector";
import MessageControl from "./components/MessageControl";
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
  } = useNetworkSimulation();

  return (
    <main className="network-grid min-h-screen">
      <div className="mx-auto max-w-6xl">
        <Header />

        <Transmission
          packet={packet}
          transmission={transmission}
          draftMessage={message}
        />

        <PacketInspector
          packet={packet}
          draftMessage={message}
          transmission={transmission}
        />

        <MessageControl
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          isSending={isBusy}
        />

        <Footer />
      </div>
    </main>
  );
}

export default App;