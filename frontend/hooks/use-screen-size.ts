"use client";
import { useState, useEffect } from "react";
export const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDropDownButtonForActionsVisible, setIsDropDownButtonForActionsVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }

      if (width <= 1200) {
        setIsDropDownButtonForActionsVisible(true);
      } else {
        setIsDropDownButtonForActionsVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isMobile,
    isDropDownButtonForActionsVisible,
  };
};
