import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./common/navbar";
import Trip from "./component/trip";
import TripDetails from "./pages/TripDetails";
import AdminLogin from "./component/AdminLogin";
import Dashboard from "./admin/Dashboard";

/* Layout for public-facing pages — Navbar shows here only */
function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages — Navbar visible */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Trip />} />
          <Route path="/details/:slug" element={<TripDetails />} />
        </Route>

        {/* Admin pages — no Navbar */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;