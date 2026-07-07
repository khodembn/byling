/*import AppRoutes from "./routes/AppRoutes";

function App() {
  return <AppRoutes />;
}

export default App;*/
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Register from "./pages/Register";
import Login from "./pages/login";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/register" element={<Register />} />

      <Route path="/login" element={<Login />} />

    </Routes>
  );
}

export default App;