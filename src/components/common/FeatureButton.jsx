import { useFeature } from "@growthbook/growthbook-react";
import { Link } from "react-router-dom";

export function FeatureButton({ to, children, className }) {
  const { value: showButton } = useFeature("showButton");

  if (showButton) {
    return (
      <button className={className} onClick={() => (window.location.href = to)}>
        {children}
      </button>
    );
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}
