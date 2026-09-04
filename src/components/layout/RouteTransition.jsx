import { useLocation } from "react-router-dom";

function RouteTransition({ children }) {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="
        animate-route-enter
      "
    >
      {children}
    </div>
  );
}

export default RouteTransition;