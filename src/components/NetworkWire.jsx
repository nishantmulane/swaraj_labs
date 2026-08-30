import React, { useEffect, useState } from "react";

function NetworkWire({
  packet,
  transmission,
  onInspect,
}) {
  const status = transmission?.status || "READY";

  const isActive =
    status === "TRANSMITTING" ||
    status === "RECEIVING" ||
    status === "DELIVERED";

  const showPacket =
    Boolean(packet) &&
    (
      status === "TRANSMITTING" ||
      status === "RECEIVING" ||
      status === "DELIVERED"
    );

  /*
   * =========================================================
   * PACKET DATA
   * =========================================================
   */

  const packetId =
    packet?.id ||
    packet?.packetId ||
    "PKT-0001";

  const packetMessage =
    packet?.message ||
    packet?.payload ||
    "HELLO!";


  /*
   * =========================================================
   * PACKET POSITION
   *
   * IMPORTANT:
   * These values control ONLY horizontal movement.
   *
   * Vertical packet placement is handled by the packet card.
   * Do not add translateY here.
   * =========================================================
   */

  const [packetProgress, setPacketProgress] = useState(0);

  /*
   * =========================================================
   * ACTIVE NETWORK NODE
   *
   * null
   * router01
   * router02
   * gateway
   * =========================================================
   */

  const [activeNode, setActiveNode] = useState(null);


  /*
   * =========================================================
   * TRANSMISSION JOURNEY
   * =========================================================
   */

  useEffect(() => {
    if (status === "READY") {
      setPacketProgress(0);
      setActiveNode(null);
      return;
    }

    if (status === "TRANSMITTING") {
      setPacketProgress(0);
      setActiveNode(null);

      /*
       * -----------------------------------------------
       * ENTER NETWORK
       * -----------------------------------------------
       */

      const router01 = setTimeout(() => {
        setPacketProgress(8);
        setActiveNode("router01");
      }, 350);


      /*
       * -----------------------------------------------
       * LEAVE ROUTER 01
       * -----------------------------------------------
       */

      const leaveRouter01 = setTimeout(() => {
        setActiveNode(null);
      }, 600);


      /*
       * -----------------------------------------------
       * REACH ROUTER 02
       * -----------------------------------------------
       */

      const router02 = setTimeout(() => {
        setPacketProgress(50);
        setActiveNode("router02");
      }, 1050);


      /*
       * -----------------------------------------------
       * LEAVE ROUTER 02
       * -----------------------------------------------
       */

      const leaveRouter02 = setTimeout(() => {
        setActiveNode(null);
      }, 1300);


      /*
       * -----------------------------------------------
       * REACH GATEWAY
       * -----------------------------------------------
       */

      const gateway = setTimeout(() => {
        setPacketProgress(88);
        setActiveNode("gateway");
      }, 1750);


      /*
       * -----------------------------------------------
       * LEAVE GATEWAY
       * -----------------------------------------------
       */

      const leaveGateway = setTimeout(() => {
        setActiveNode(null);
      }, 2000);


      return () => {
        clearTimeout(router01);
        clearTimeout(leaveRouter01);
        clearTimeout(router02);
        clearTimeout(leaveRouter02);
        clearTimeout(gateway);
        clearTimeout(leaveGateway);
      };
    }


    /*
     * =====================================================
     * RECEIVING
     * =====================================================
     */

    if (status === "RECEIVING") {
      setPacketProgress(88);
      setActiveNode("gateway");
      return;
    }


    /*
     * =====================================================
     * DELIVERED
     * =====================================================
     */

    if (status === "DELIVERED") {
      setPacketProgress(88);
      setActiveNode(null);
    }

  }, [status]);


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div
      className="
        relative
        h-[150px]
        w-full
        min-w-0
      "
    >

      {/* =====================================================
          NETWORK LINE
      ===================================================== */}

      <div
        className={`
          absolute
          left-0
          right-0
          top-1/2
          h-px
          -translate-y-1/2

          ${
            isActive
              ? "bg-accent/40"
              : "bg-line"
          }

          transition-colors
          duration-300
        `}
      />


      {/* =====================================================
          ROUTER 01
      ===================================================== */}

      <div
        className="
          absolute
          left-[8%]
          top-1/2
          z-10

          flex
          -translate-x-1/2
          -translate-y-1/2
          flex-col
          items-center
        "
      >

        <div
          className={`
            relative

            flex
            h-10
            w-10
            items-center
            justify-center

            border

            bg-surface

            transition-all
            duration-200

            ${
              activeNode === "router01"
                ? "scale-105 border-accent shadow-[0_0_18px_rgba(184,217,74,0.18)]"
                : "border-line"
            }
          `}
        >

          {/* PROCESSING RING */}

          {activeNode === "router01" && (
            <span
              className="
                pointer-events-none
                absolute
                inset-[-5px]

                rounded-full

                border
                border-accent/50

                animate-ping
              "
            />
          )}


          {/* NODE */}

          <span
            className={`
              h-2
              w-2
              rounded-full

              transition-all
              duration-200

              ${
                activeNode === "router01"
                  ? "scale-150 bg-accent shadow-[0_0_14px_rgba(184,217,74,0.85)]"
                  : "bg-muted"
              }
            `}
          />

        </div>


        {/* LABEL */}

        <div
          className={`
            mono
            mt-2
            text-center
            text-[7px]
            uppercase
            tracking-[0.12em]

            ${
              activeNode === "router01"
                ? "text-accent"
                : "text-muted"
            }
          `}
        >
          ROUTER 01
        </div>


        {/* SUBLABEL */}

        <div
          className="
            mono
            mt-0.5
            text-center
            text-[6px]
            uppercase
            tracking-[0.12em]
            text-muted-soft
          "
        >
          {activeNode === "router01"
            ? "PROCESSING"
            : "ROUTER"}
        </div>

      </div>


      {/* =====================================================
          ROUTER 02
      ===================================================== */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          z-10

          flex
          -translate-x-1/2
          -translate-y-1/2
          flex-col
          items-center
        "
      >

        <div
          className={`
            relative

            flex
            h-10
            w-10
            items-center
            justify-center

            border

            bg-surface

            transition-all
            duration-200

            ${
              activeNode === "router02"
                ? "scale-105 border-accent shadow-[0_0_18px_rgba(184,217,74,0.18)]"
                : "border-line"
            }
          `}
        >

          {/* PROCESSING RING */}

          {activeNode === "router02" && (
            <span
              className="
                pointer-events-none
                absolute
                inset-[-5px]

                rounded-full

                border
                border-accent/50

                animate-ping
              "
            />
          )}


          {/* NODE */}

          <span
            className={`
              h-2
              w-2
              rounded-full

              transition-all
              duration-200

              ${
                activeNode === "router02"
                  ? "scale-150 bg-accent shadow-[0_0_14px_rgba(184,217,74,0.85)]"
                  : "bg-muted"
              }
            `}
          />

        </div>


        {/* LABEL */}

        <div
          className={`
            mono
            mt-2
            text-center
            text-[7px]
            uppercase
            tracking-[0.12em]

            ${
              activeNode === "router02"
                ? "text-accent"
                : "text-muted"
            }
          `}
        >
          ROUTER 02
        </div>


        {/* SUBLABEL */}

        <div
          className="
            mono
            mt-0.5
            text-center
            text-[6px]
            uppercase
            tracking-[0.12em]
            text-muted-soft
          "
        >
          {activeNode === "router02"
            ? "PROCESSING"
            : "ROUTER"}
        </div>

      </div>


      {/* =====================================================
          GATEWAY
      ===================================================== */}

      <div
        className="
          absolute
          right-[8%]
          top-1/2
          z-10

          flex
          -translate-x-1/2
          -translate-y-1/2
          flex-col
          items-center
        "
      >

        <div
          className={`
            relative

            flex
            h-10
            w-10
            items-center
            justify-center

            border

            bg-surface

            transition-all
            duration-200

            ${
              activeNode === "gateway"
                ? "scale-105 border-accent shadow-[0_0_18px_rgba(184,217,74,0.18)]"
                : "border-line"
            }
          `}
        >

          {/* PROCESSING RING */}

          {activeNode === "gateway" && (
            <span
              className="
                pointer-events-none
                absolute
                inset-[-5px]

                rounded-full

                border
                border-accent/50

                animate-ping
              "
            />
          )}


          {/* NODE */}

          <span
            className={`
              h-2
              w-2
              rounded-full

              transition-all
              duration-200

              ${
                activeNode === "gateway"
                  ? "scale-150 bg-accent shadow-[0_0_14px_rgba(184,217,74,0.85)]"
                  : "bg-muted"
              }
            `}
          />

        </div>


        {/* LABEL */}

        <div
          className={`
            mono
            mt-2
            text-center
            text-[7px]
            uppercase
            tracking-[0.12em]

            ${
              activeNode === "gateway"
                ? "text-accent"
                : "text-muted"
            }
          `}
        >
          GATEWAY
        </div>


        {/* SUBLABEL */}

        <div
          className="
            mono
            mt-0.5
            text-center
            text-[6px]
            uppercase
            tracking-[0.12em]
            text-muted-soft
          "
        >
          {activeNode === "gateway"
            ? "EDGE HANDOFF"
            : "EDGE"}
        </div>

      </div>


      {/* =====================================================
          LOCAL NETWORK LABEL
      ===================================================== */}

      <div
        className="
          absolute
          left-1/2
          top-[calc(50%+35px)]
          -translate-x-1/2
        "
      >

        <span
          className="
            mono
            whitespace-nowrap
            text-[6px]
            uppercase
            tracking-[0.15em]
            text-muted-soft
          "
        >
          LOCAL NETWORK
        </span>

      </div>


      {/* =====================================================
          PACKET
      ===================================================== */}

      {showPacket && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-30
          "
        >

          {/* =================================================
              PACKET ANCHOR

              IMPORTANT:
              The anchor sits directly on the network line.

              ONLY LEFT changes.

              NO VERTICAL TRANSFORM HERE.
          ================================================= */}

          <div
            className="
              absolute
              top-1/2

              transition-[left]
              duration-700
              ease-in-out
            "
            style={{
              left: `${packetProgress}%`,
            }}
          >

            {/* =================================================
                PACKET CARD
            ================================================= */}

            <button
              type="button"
              onClick={onInspect}
              className="
                pointer-events-auto

                relative

                flex
                h-[72px]
                w-[142px]

                -translate-x-1/2
                -translate-y-[108px]

                flex-col
                items-center
                justify-center

                border
                border-cyan-400/70

                bg-[#17242d]/95

                shadow-[0_0_30px_rgba(34,211,238,0.22)]

                transition-all
                duration-200

                hover:border-cyan-300
                hover:shadow-[0_0_38px_rgba(34,211,238,0.32)]
              "
            >
              {/* TOP ACCENT */}

              <span
                className="
                  absolute
                  -top-[7px]
                  left-1/2

                  h-px
                  w-[70%]

                  -translate-x-1/2

                  bg-cyan-400/60
                "
              />

              {/* LEFT ACCENT */}

              <span
                className="
                  absolute
                  -left-[7px]
                  top-1/2

                  h-[70%]
                  w-px

                  -translate-y-1/2

                  bg-cyan-400/60
                "
              />

              {/* RIGHT ACCENT */}

              <span
                className="
                  absolute
                  -right-[7px]
                  top-1/2

                  h-[70%]
                  w-px

                  -translate-y-1/2

                  bg-cyan-400/60
                "
              />

              {/* PACKET ID */}

              <span
                className="
                  mono
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-cyan-300
                "
              >
                {packetId}
              </span>

              {/* PAYLOAD */}

              <span
                className="
                  mono
                  mt-1
                  max-w-[110px]
                  truncate
                  text-[9px]
                  uppercase
                  tracking-[0.1em]
                  text-muted-soft
                "
              >
                {packetMessage}
              </span>


              {/* =========================================
                  PACKET → NETWORK CONNECTOR

                  IMPORTANT:
                  This is INSIDE the packet card.
                  Therefore left-1/2 is always the
                  exact horizontal center of the card.
              ========================================= */}

              <span
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-full

                  h-[36px]
                  w-px

                  -translate-x-1/2

                  bg-cyan-400/70
                "
              >
                <span
                  className="
                    absolute

                    bottom-0
                    left-1/2

                    h-2
                    w-2

                    -translate-x-1/2
                    translate-y-1/2

                    rounded-full

                    bg-cyan-300

                    shadow-[0_0_12px_rgba(34,211,238,0.9)]
                  "
                />

              </span>

            </button>



          </div>

        </div>
      )}

    </div>
  );
}

export default NetworkWire;