
// components/chat/Chat.js
import { Box, Grid, Drawer } from "@mantine/core";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { useEffect, useState } from "react";

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
        <Drawer
          opened={drawerOpened}
          onClose={() => setDrawerOpened(false)}
          title="Messages"
          padding="md"
        >
          <ChatList onSelectUser={(user) => {
            setSelectedUser(user);
            setDrawerOpened(false);
          }} />
        </Drawer>
      )}

      <Grid gutter={0} style={{ height: "calc(100vh - 40px)" }}>
        {/* القائمة الجانبية */}
        {!isSmallScreen && (
          <Grid.Col span={3}>
            <ChatList onSelectUser={setSelectedUser} />
          </Grid.Col>
        )}

        {/* نافذة المحادثة */}
        <Grid.Col span={9}>
          <ChatWindow userid={selectedUser} onBack={() => setDrawerOpened(true)} />
        </Grid.Col>
      </Grid>
    </>
  );
}

// import { Box, Grid, Drawer } from "@mantine/core";
// // import ChatSidebar from "./ChatSidebar";
// import ChatList from "./ChatList";
// import ChatWindow from "./ChatWindow";
// import { useEffect, useState } from "react";

// export default function Chat() {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [drawerOpened, setDrawerOpened] = useState(false);
//   const [isSmallScreen, setIsSmallScreen] = useState(false);
//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(max-width: 600px)");
//     const handleResize = () => setIsSmallScreen(mediaQuery.matches);
//     handleResize(); // تنفيذ أول مرة
//     mediaQuery.addEventListener("change", handleResize);

//     return () => mediaQuery.removeEventListener("change", handleResize);
//   }, []);

//   return (
//     <>
//       {/* للشاشات الصغيرة يظهر السايدبار كـ Drawer */}
//       {/* <MediaQuery largerThan="sm" styles={{ display: "none" }}> */}
//       {isSmallScreen && (
//         <Drawer
//           opened={drawerOpened}
//           onClose={() => setDrawerOpened(false)}
//           title="Messages"
//           padding="md"
//         >
//           <ChatList
//             onSelectUser={(user) => {
//               setSelectedUser(user);
//               setDrawerOpened(false);
//             }}
//           />
//         </Drawer>
//       )}
//       {/* </MediaQuery> */}

//       <Grid gutter={0} style={{ height: "calc(100vh - 40px)" }}>
//         {/* القائمة الجانبية (Left panel) */}
//         {/* {!isSmallScreen && (
//           <Grid.Col span={3}>
//             <ChatList onSelectUser={setSelectedUser} />
//           </Grid.Col>
//         )} */}
//         {!isSmallScreen && (
//           <Grid.Col span={3}>
//             <ChatList onSelectUser={setSelectedUser} />
//           </Grid.Col>
//         )}

//         {/* نافذة المحادثة (Right panel) */}
//         <Grid.Col span={9}>
//           <ChatWindow
//             userid={selectedUser}
//             onBack={() => setDrawerOpened(true)}
//           />
//         </Grid.Col>
//       </Grid>
//     </>
//   );
// }
