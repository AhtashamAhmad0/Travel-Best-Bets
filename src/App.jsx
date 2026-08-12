import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./common/navbar";
import Trip from "./component/trip";
import TripDetails from "./pages/TripDetails";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar stays constant on every page */}
      <Navbar />

      <main>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Trip />} />

          {/* Trip Details */}
          <Route
            path="/details/:slug"
            element={<TripDetails />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;