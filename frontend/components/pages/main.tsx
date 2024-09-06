"use client";

import React from "react";
import { useAccount } from "wagmi";
import Dashboard from "./dashboard";
import WelcomePage from "./welcome";

const MainPage = () => {
  const { isConnected } = useAccount();
  return (
    <div className="container">
      {isConnected ? <Dashboard /> : <WelcomePage/>}
    </div>
  );
};

export default MainPage;
