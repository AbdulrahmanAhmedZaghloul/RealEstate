import { Burger } from "@mantine/core";
import { useSidebar } from "../../context/sidebarContext";

export function BurgerButton() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <Burger
      opened={sidebarOpen}
      onClick={(e) => {
        e.stopPropagation();
        setSidebarOpen((prev) => !prev);
      }}
      size="md"
      hiddenFrom="md"
      color="var(--color-3)"
    ></Burger>
  );
}
