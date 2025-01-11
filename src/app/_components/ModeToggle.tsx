import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "~/components/ui/button";

const ModeToggle = () => {
  const { setTheme } = useTheme();
  const theme = useTheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div>
      <Button onClick={handleThemeChange} variant="ghost">
        {theme.resolvedTheme === "light" ? (
          <Moon size={20} />
        ) : (
          <Sun size={20} />
        )}
      </Button>
    </div>
  );
};

export default ModeToggle;
