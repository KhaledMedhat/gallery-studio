"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Particles from "~/components/ui/particles";

const ParticlesWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <>
      {children}
      <Particles
        className="absolute inset-0 h-full"
        quantity={400}
        ease={80}
        color={color}
        refresh
      />
    </>
  );
};
export default ParticlesWrapper;
