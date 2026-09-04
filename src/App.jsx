import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  Hero,
  ModuleHome,
} from "./components/modules";

import {
  TransmissionModule,
} from "./components/transmission";

import { RouteTransition } from "./components/layout";

function ComingSoon({ title }) {
  return (
    <main className="network-grid min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6">
        <div className="text-center">
          <div
            className="
              mono
              text-[10px]
              uppercase
              tracking-[0.18em]
              text-accent
            "
          >
            Module
          </div>

          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            {title}
          </h1>

          <p className="mt-3 text-sm text-text-muted">
            This module is currently under development.
          </p>
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <main className="network-grid min-h-screen">
        <RouteTransition>
          <Routes>
            {/* HERO / ENTRY */}

            <Route
              path="/"
              element={<Hero />}
            />

            {/* MODULE SELECTION */}

            <Route
              path="/modules"
              element={<ModuleHome />}
            />

            {/* MODULE 01 */}

            <Route
              path="/transmission"
              element={<TransmissionModule />}
            />

            {/* FUTURE MODULES */}

            <Route
              path="/subnetting"
              element={
                <ComingSoon title="Subnetting" />
              }
            />

            <Route
              path="/routing"
              element={
                <ComingSoon title="Routing" />
              }
            />

            <Route
              path="/osi"
              element={
                <ComingSoon title="OSI Model" />
              }
            />
          </Routes>
        </RouteTransition>
      </main>
    </BrowserRouter>
  );
}

export default App;