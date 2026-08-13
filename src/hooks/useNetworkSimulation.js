import { useEffect, useRef, useState } from "react";

function useNetworkSimulation() {
  const [message, setMessage] = useState("HELLO!");
  const [packet, setPacket] = useState(null);

  const [transmission, setTransmission] = useState({
    status: "READY",
  });

  const timersRef = useRef([]);

  function clearTimers() {
    timersRef.current.forEach((timer) => {
      clearTimeout(timer);
    });

    timersRef.current = [];
  }

  function schedule(callback, delay) {
    const timer = setTimeout(callback, delay);

    timersRef.current.push(timer);

    return timer;
  }

  function sendMessage() {
    const payload = message.trim();

    if (!payload || transmission.status !== "READY") {
      return;
    }

    const newPacket = {
      id: crypto.randomUUID(),
      source: "Sender",
      destination: "Receiver",
      payload,
      size: new TextEncoder().encode(payload).length,
    };

    clearTimers();

    setPacket(newPacket);

    // -----------------------------------------
    // 1. TRANSMITTING
    // -----------------------------------------

    setTransmission({
      status: "TRANSMITTING",
    });

    // -----------------------------------------
    // 2. RECEIVING
    // -----------------------------------------

    schedule(() => {
      setTransmission({
        status: "RECEIVING",
      });
    }, 2000);

    // -----------------------------------------
    // 3. SUCCESSFUL DELIVERY
    // -----------------------------------------

    schedule(() => {
      setTransmission({
        status: "DELIVERED",
      });
    }, 2800);

    // -----------------------------------------
    // 4. RESET
    // -----------------------------------------

    schedule(() => {
      setTransmission({
        status: "READY",
      });

      setPacket(null);

      // Clear the old message so the interface
      // is genuinely ready for a new transmission.
      setMessage("");
    }, 5300);
  }

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const isBusy =
    transmission.status !== "READY";

  const isDelivered =
    transmission.status === "DELIVERED";

  return {
    message,
    setMessage,

    packet,

    transmission,

    sendMessage,

    isBusy,
    isDelivered,
  };
}

export default useNetworkSimulation;