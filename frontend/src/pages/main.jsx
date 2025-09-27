import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";
import Navbar from "./Navbar";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Navbar />
  </StrictMode>
);