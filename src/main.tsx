import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import DynamicInput from "./DynamicInput.tsx";
import "./global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DynamicInput />{" "}
  </StrictMode>
);
