"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useFileStore } from "~/store";

const RouteChangeHandler = () => {
  const pathname = usePathname();
  const { setSelectedFilesToEmpty, setShowcaseUrl } = useFileStore();

  useEffect(() => {
    setSelectedFilesToEmpty();
    setShowcaseUrl({ url: "", type: "" });
    // Clear Zustand state in every route change
  }, [pathname, setSelectedFilesToEmpty, setShowcaseUrl]);

  return null;
};

export default RouteChangeHandler;
