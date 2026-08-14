import { useEffect, useRef, useState } from "react";

function useNetworkSimulation() {
  // =========================================
  // MESSAGE / PACKET STATE
  // =========================================

  const [message, setMessage] = useState("HELLO!");
  const [packet, setPacket] = useState(null);

  const [packetCounter, setPacketCounter] = useState(0);
  const [history, setHistory] = useState([]);

  // =========================================
  // SESSION STATS
  // =========================================

  const [packetsSent, setPacketsSent] = useState(0);
  const [packetsDelivered, setPacketsDelivered] = useState(0);
  const [dataTransferred, setDataTransferred] = useState(0);

  const [failedPackets] = useState(0);

  // =========================================
  // TRANSMISSION STATE
  // =========================================

  const [transmission, setTransmission] = useState({
    status: "READY",
    createdAt: null,
    sentAt: null,
    receivingAt: null,
    deliveredAt: null,
  });

  const timersRef = useRef([]);

  // =========================================
  // TIMER HELPERS
  // =========================================

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

  // =========================================
  // CLEAR LAST PACKET
  // =========================================

  function clearPacket() {
    clearTimers();

    setPacket(null);

    setTransmission({
      status: "READY",
      createdAt: null,
      sentAt: null,
      receivingAt: null,
      deliveredAt: null,
    });
  }

  // =========================================
  // SEND MESSAGE
  // =========================================

  function sendMessage() {
    const payload = message.trim();

    if (!payload || transmission.status !== "READY") {
      return;
    }

    const nextPacketNumber = packetCounter + 1;
    const now = new Date();

    const packetId = `PKT-${String(
      nextPacketNumber
    ).padStart(4, "0")}`;

    const payloadSize = new TextEncoder()
      .encode(payload)
      .length;

    const newPacket = {
      id: packetId,
      source: "Sender",
      destination: "Receiver",
      payload,
      size: payloadSize,
      createdAt: now.toISOString(),
    };

    // =========================================
    // CLEAR PREVIOUS TIMERS
    // =========================================

    clearTimers();

    // =========================================
    // CREATE PACKET
    // =========================================

    setPacketCounter(nextPacketNumber);
    setPacket(newPacket);

    // =========================================
    // SESSION STATS
    // =========================================

    setPacketsSent(
      (current) => current + 1
    );

    setDataTransferred(
      (current) => current + payloadSize
    );

    // =========================================
    // TRANSMITTING
    // =========================================

    setTransmission({
      status: "TRANSMITTING",

      createdAt: now.toISOString(),
      sentAt: now.toISOString(),

      receivingAt: null,
      deliveredAt: null,
    });

    // =========================================
    // RECEIVING
    // =========================================

    schedule(() => {
      const receivingAt =
        new Date().toISOString();

      setTransmission((current) => ({
        ...current,

        status: "RECEIVING",

        receivingAt,
      }));
    }, 2000);

    // =========================================
    // DELIVERED
    // =========================================

    schedule(() => {
      const deliveredAt =
        new Date().toISOString();

      setTransmission((current) => ({
        ...current,

        status: "DELIVERED",

        deliveredAt,
      }));

      setPacketsDelivered(
        (current) => current + 1
      );

      setHistory((current) => [
        {
          ...newPacket,

          deliveredAt,
          status: "DELIVERED",
        },

        ...current,
      ]);
    }, 2800);

    // =========================================
    // RESET TRANSMISSION STATE
    // =========================================
    //
    // IMPORTANT:
    // We DO NOT clear packet here.
    //
    // Packet Inspector keeps showing
    // the last packet until the user
    // explicitly presses CLEAR.
    // =========================================

    schedule(() => {
      setTransmission({
        status: "READY",

        createdAt: null,
        sentAt: null,
        receivingAt: null,
        deliveredAt: null,
      });

      setMessage("");
    }, 5300);
  }

  // =========================================
  // CLEANUP
  // =========================================

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  // =========================================
  // DERIVED STATE
  // =========================================

  const isBusy =
    transmission.status !== "READY";

  const isDelivered =
    transmission.status === "DELIVERED";

  // =========================================
  // RETURN
  // =========================================

  return {
    message,
    setMessage,

    packet,

    transmission,

    history,

    packetCounter,

    packetsSent,
    packetsDelivered,
    dataTransferred,
    failedPackets,

    sendMessage,
    clearPacket,

    isBusy,
    isDelivered,
  };
}

export default useNetworkSimulation;