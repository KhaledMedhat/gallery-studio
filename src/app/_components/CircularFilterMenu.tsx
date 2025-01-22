import { AnimatePresence, motion } from "framer-motion";
import { Filter } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";

interface FilterOption {
  id: string;
  label: {
    name: string;
    icon?: React.ReactNode;
  };
}

const CircularFilterMenu: React.FC<{
  setFilter: (selectedFilter: string) => void;
}> = ({ setFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const filterOptions: FilterOption[] = [
    { id: "All", label: { name: "All" } },
    { id: "Videos", label: { name: "Videos" } },
    { id: "Images", label: { name: "Images" } },
    { id: "GIF", label: { name: "GIF" } },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
    setFilter(filterId);
    setIsOpen(false);
  };

  const getPosition = (index: number, total: number, radius: number) => {
    const angle = (index / total) * Math.PI - Math.PI / 2;
    const x = radius * Math.cos(angle); // Negative to go in opposite direction
    const y = radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="fixed bottom-20 left-4 z-50">
      <div className="relative">
        <Button
          onClick={toggleMenu}
          className="h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
          aria-label="Toggle filter menu"
        >
          <Filter size={20} />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <>
              {filterOptions.map((option, index) => {
                const { x, y } = getPosition(index, filterOptions.length, 50);
                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x, y }}
                    exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="absolute left-1/2 top-1/2"
                    style={{ marginLeft: "-40px", marginTop: "-30px" }}
                  >
                    <Button
                      variant={
                        selectedFilter === option.id ? "default" : "outline"
                      }
                      className="h-[40px] w-[80px] rounded-full"
                      onClick={() => handleFilterChange(option.id)}
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                    >
                      {option.label.name}
                    </Button>
                  </motion.div>
                );
              })}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CircularFilterMenu;
