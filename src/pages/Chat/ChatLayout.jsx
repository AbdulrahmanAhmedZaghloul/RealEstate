// components/chat/Chat.js
import { Box, Grid, Drawer } from "@mantine/core";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { useEffect, useState } from "react";
import { BurgerButton } from "../../components/buttons/burgerButton";

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)");
    const handleResize = () => setIsSmallScreen(mediaQuery.matches);
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <>
      {/* للشاشات الصغيرة */}
      {isSmallScreen && (
        <>
          <BurgerButton />
          <Drawer
            opened={drawerOpened}
            onClose={() => setDrawerOpened(false)}
            // title="Messages"
            padding="md"
          >
            <ChatList
              onSelectUser={(user) => {
                setSelectedUser(user);
                setDrawerOpened(false);
              }}
            />
          </Drawer>
        </>
      )}

      <Grid
        gutter={0}
        style={{
          height: "95vh",
          overflow: "hidden",
          backgroundColor: "var(--color-5)",
        }}
      >
        {/* القائمة الجانبية */}
        {!isSmallScreen && (
          <Grid.Col span={3}>
            <ChatList onSelectUser={setSelectedUser} />
          </Grid.Col>
        )}

        {/* نافذة المحادثة */}
        <Grid.Col span={9}>
          <ChatWindow
            userid={selectedUser}
            onBack={() => setDrawerOpened(true)}
          />
        </Grid.Col>
      </Grid>
    </>
  );
}
