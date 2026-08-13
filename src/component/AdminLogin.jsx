import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EyeIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 640 512"
    height="16"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z" />
  </svg>
);

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
    // Login API call goes here — for now, just proceed to the dashboard
    navigate("/dashboard");
  };

  return (
    <div className="grid max-h-screen min-h-screen overflow-auto bg-[#FFF7ED] md:grid-cols-2">
      {/* LEFT IMAGE */}
      <div>
        <img
          src="/adminpic.png"
          alt="login"
          className="hidden h-full max-h-screen min-h-screen w-full object-cover md:block"
        />
      </div>

      {/* RIGHT LOGIN */}
      <div className="mx-auto flex max-h-screen min-h-screen max-w-[350px] flex-col items-center justify-center gap-20 px-11 py-5">
        <img src="/logo.svg" alt="Travel Best Bets" className="h-auto w-full max-w-[188px]" />

        <form onSubmit={handleLogin} className="w-full">
          {/* USERNAME */}
          <div>
            <label htmlFor="username" className="block text-sm">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border px-5 py-3 outline-none ring-0 border-inputBorder hover:border-primary-500 focus:border-primary-500"
            />
          </div>

          {/* PASSWORD */}
          <div className="mt-7">
            <label htmlFor="password" className="block text-sm">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border px-5 py-3 pr-12 outline-none ring-0 border-inputBorder hover:border-primary-500 focus:border-primary-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-[55%] -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                <EyeIcon />
              </button>
            </div>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="mt-3 flex justify-end">
            <a className="text-sm font-bold text-primary-500 underline" href="/forget-password">
              Forgot Password?
            </a>
          </div>

         
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-primary-500 px-6 py-3 text-white text-base font-medium transition-all duration-300 hover:bg-primary-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;