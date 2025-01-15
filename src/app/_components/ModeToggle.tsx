import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

const ModeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleThemeChange = () => {
    if (resolvedTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  if (!isMounted) {
    return null; // Render nothing on the server
  }
  return (
    <div>
      <Button asChild onClick={handleThemeChange} variant="ghost">
        {resolvedTheme === "light" ? (
          <div>
            <Moon size={20} />
          </div>
        ) : (
          <div>
            <Sun size={20} />
          </div>
        )}
      </Button>
    </div>
  );
};

export default ModeToggle;
