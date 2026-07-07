/*import AppRoutes from "./routes/AppRoutes";

function App() {
  return <AppRoutes />;
}

export default App;*/
import { Routes, Route } from "react-router-dom";

import Home from "./pages/shared/home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
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