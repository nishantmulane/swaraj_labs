import { useState } from "react";

function useNetworkSimulation() {
  const [message, setMessage] = useState("HELLO!");
  const [packet, setPacket] = useState(null);

  function sendMessage() {
    if (!message.trim() || packet?.status === "TRANSMITTING") {
      return;
    }

    const newPacket = {
      id: crypto.randomUUID(),
      source: "Sender",
      destination: "Receiver",
      payload: message,
      size: new TextEncoder().encode(message).length,
      status: "TRANSMITTING",
    };

    setPacket(newPacket);

    setTimeout(() => {
      setPacket((currentPacket) => {
        if (!currentPacket) {
          return null;
        }

        return {
          ...currentPacket,
          status: "DELIVERED",
        };
      });
    }, 2000);
  }

  const isSending = packet?.status === "TRANSMITTING";
  const isDelivered = packet?.status === "DELIVERED";

  return {
    message,
    setMessage,
    packet,
    sendMessage,
    isSending,
    isDelivered,
  };
}

export default useNetworkSimulation;