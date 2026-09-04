import { useNavigate } from "react-router-dom";

import { Header, Footer } from "../layout";
import ModuleCard from "./ModuleCard";

const modules = [
  {
    id: "transmission",
    number: "01",
    eyebrow: "PACKET TRANSMISSION",
    title: "Packet Transmission",
    description:
      "Observe how a message becomes a packet and travels across a routed network.",
    topic: "PACKETS · HOPS · FORWARDING",
    available: true,
  },
  {
    id: "subnetting",
    number: "02",
    eyebrow: "SUBNETTING",
    title: "Subnetting",
    description:
      "Explore how IP networks are divided and understand the boundaries between them.",
    topic: "IP · MASKS · NETWORKS",
    available: true,
  },
  {
    id: "routing",
    number: "03",
    eyebrow: "ROUTING",
    title: "Routing",
    description:
      "Discover how networks determine where packets should travel next.",
    topic: "ROUTES · FORWARDING",
    available: false,
  },
  {
    id: "osi",
    number: "04",
    eyebrow: "OSI MODEL",
    title: "OSI Model",
    description:
      "Understand how network communication is organized across different layers.",
    topic: "LAYERS · PROTOCOLS · COMMUNICATION",
    available: false,
  },
];

function ModuleHome() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <Header />

      <main>
        {/* =====================================
            MODULE SELECTION
        ===================================== */}

        <section className="px-6 pb-14 pt-10 sm:px-10 sm:pt-12 lg:px-8 lg:pb-16 lg:pt-12">
          {/* =====================================
              SECTION META
          ===================================== */}

          <div
            className="
              mb-5
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div
              className="
                mono
                text-[9px]
                uppercase
                tracking-[0.18em]
                text-muted
              "
            >
              Curriculum
            </div>

            <div
              className="
                flex
                items-center
                gap-3

                mono
                text-[8px]
                uppercase
                tracking-[0.16em]
              "
            >
              <span className="text-muted">
                Lab Status
              </span>

              <span className="text-accent">
                02 / 04 Available
              </span>
            </div>
          </div>

          {/* =====================================
              MODULE CARDS
          ===================================== */}

          <div className="grid gap-3 md:grid-cols-2">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onSelect={() =>
                  module.available &&
                  navigate(`/${module.id}`)
                }
              />
            ))}
          </div>
        </section>

        {/* =====================================
            APPROACH
        ===================================== */}

        <section className="border-y border-line-soft">
          <div
            className="
              grid
              gap-10

              px-6
              py-16

              sm:px-10

              lg:grid-cols-[0.7fr_1.3fr]
              lg:px-8
              lg:py-20
            "
          >
            <div
              className="
                mono
                text-[9px]
                uppercase
                tracking-[0.18em]
                text-accent
              "
            >
              The Lab Principle
            </div>

            <div>
              <h2
                className="
                  max-w-3xl
                  text-3xl
                  font-medium
                  leading-tight
                  tracking-[-0.045em]

                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Don’t just learn the concept.
                <span className="text-muted">
                  {" "}
                  See it happen.
                </span>
              </h2>

              <p
                className="
                  mt-6
                  max-w-xl
                  text-[13px]
                  leading-7
                  text-muted
                "
              >
                Swaraj Labs turns abstract networking concepts into visible
                systems. Observe what happens, inspect the process, and
                experiment until the idea becomes intuitive.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

export default ModuleHome;