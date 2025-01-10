"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useFileStore } from "~/store";

const RouteChangeHandler = () => {
  const pathname = usePathname();
  const { setSelectedFilesToEmpty } = useFileStore();

  useEffect(() => {
    setSelectedFilesToEmpty(); // Clear Zustand state in every route change
  }, [pathname, setSelectedFilesToEmpty]);

  return null;
};

export default RouteChangeHandler;
