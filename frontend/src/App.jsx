import { Routes, Route } from "react-router-dom";
import ProductDetail from "./pages/ProductDetail.jsx";

function App() {
  return (
    <Routes>
      <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
  );
}

export default App;
