import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

/* ---------- Icons ---------- */
const HomeIcon = ({ active }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="20"
    width="20"
    className={active ? "text-primary-500" : "text-gray-400"}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </svg>
);

const PackageIcon = ({ active }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="20"
    width="20"
    className={active ? "text-primary-500" : "text-gray-400"}
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.27 6.96L12 12.01l8.73-5.05" />
    <path d="M12 22.08V12" />
  </svg>
);

const PlusIcon = () => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="18"
    width="18"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/* ---------- Sidebar ---------- */
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { key: "home", label: "Home", icon: HomeIcon, path: "/dashboard" },
    { key: "packages", label: "Package Management", icon: PackageIcon, path: "/dashboard/packages" },
  ];

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-6">
        <img src="/logo.svg" alt="Travel Best Bets" className="h-8 w-auto" />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {navItems.map(({ key, label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={key}
              onClick={() => navigate(path)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-500/10 text-primary-500"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon active={isActive} />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

/* ---------- Home Page ---------- */
const HomePage = () => (
  <div>
    <h1 className="text-2xl font-semibold text-gray-900">Home</h1>
    <p className="mt-2 text-sm text-gray-500">
      Welcome back. This is your dashboard overview.
    </p>
  </div>
);

/* ---------- Package Management Page ---------- */
const PackageManagementPage = () => {
  const handleAddPackage = () => {
    // Wire this up to open a form / modal once the Add Package flow is built
    console.log("Add Package clicked");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Package Management</h1>
        <button
          onClick={handleAddPackage}
          className="flex items-center gap-2 bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
        >
          <PlusIcon />
          Add Package
        </button>
      </div>

      <div className="mt-8 flex h-64 items-center justify-center border border-dashed border-gray-300 text-sm text-gray-400">
        No packages yet. Click "Add Package" to create one.
      </div>
    </div>
  );
};

/* ---------- Dashboard Shell ---------- */
const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-10 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/packages" element={<PackageManagementPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;