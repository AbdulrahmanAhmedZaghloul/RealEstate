// components/chat/ChatList.js
import { ScrollArea, Stack } from "@mantine/core";
import classes from "../../styles/ChatList.module.css";
import Search from "../../components/icons/search";
import { useChatUsers } from "../../hooks/queries/Chat/useChatUsers";
// import { useChatUsers } from "../../hooks/queries/chat/useChatUsers";

export default function ChatList({ onSelectUser }) {
  const { data: users, isLoading, error } = useChatUsers();

  if (isLoading) return <p style={{ padding: "md", color: "dimmed" }}>Loading...</p>;
  if (error) return <p style={{ padding: "md", color: "red" }}>Error loading users</p>;

  return (
    <Stack spacing="xs" p="md" style={{ borderRight: "1px solid #576776" }}>
      <h1 className={classes.title}>Messages</h1>
      <div className={classes.divSearch}>
        <input className={classes.search} placeholder="Search" />
        <Search />
      </div>
      <ScrollArea style={{ height: "calc(100vh - 120px)" }}>
        {users && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #576776",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontWeight: 600, marginRight: "auto", width: "70%" }}>
                <div>{user.name}</div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "dimmed", padding: "10px" }}>No contacts available</p>
        )}
      </ScrollArea>
    </Stack>
  );
}
// import { ScrollArea, Stack, TextInput } from "@mantine/core";
// import classes from "../../styles/ChatList.module.css";
// import Search from "../../components/icons/search";
// import { useEffect, useState } from "react";
//  import { useAuth } from "../../context/authContext";
// import axiosInstance from "../../api/config";

// export default function ChatList({ onSelectUser }) {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//  const { user } = useAuth();
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axiosInstance.get("chat/users", {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         console.log("Fetched users:", response.data.data.users);
        
//         // الـ API يردّ قائمة بالمستخدمين المسموح التحدث معهم
//         const formatted = response.data.data.users.map((user) => ({
//           id: user.id,
//           name: user.name,
//           // img: user.avatar || "/default-avatar.png", // إذا كان في صور
//           // lastMessage: user.last_message || "No message yet",
//           // time: new Date(user.last_message_at).toLocaleTimeString([], {
//           //   hour: "2-digit",
//           //   minute: "2-digit",
//           // }),
//         }));
//         setUsers(formatted);
//       } catch (error) {
//         console.error(error);
//         setUsers([]); // يمكنك عرض رسالة خطأ
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <Stack spacing="xs" p="md" style={{ borderRight: "1px solid #576776" }}>
//       <h1 className={classes.title}>Messages</h1>
//       <div className={classes.divSearch}>
//         <input className={classes.search} placeholder="Search" />
//         <Search />
//       </div>

//       <ScrollArea style={{ height: "calc(100vh - 120px)" }}>
//         {loading ? (
//           <p color="dimmed">Loading...</p>
//         ) : users.length === 0 ? (
//           <p color="dimmed">No contacts available</p>
//         ) : (
//           users.map((user) => (
//             <div
//               key={user.id}
//               onClick={() => onSelectUser(user)}
//               style={{
//                 padding: "10px",
//                 cursor: "pointer",
//                 borderBottom: "1px solid #576776",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               {/* <div>
//                 <img
//                   style={{
//                     width: "50px",
//                     height: "50px",
//                     borderRadius: "50%",
//                     objectFit: "cover",
//                   }}
//                   src={user.img}
//                   alt={user.name}
//                 />
//               </div> */}
//               <div
//                 style={{ fontWeight: 600, marginRight: "auto", width: "70%" }}
//               >
//                 <div>{user.name}</div>
//                 <div
//                   style={{
//                     fontSize: "12px",
//                     color: "#888",
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                 >
//                   {user.lastMessage}
//                 </div>
//                 {/* <div
//                   style={{
//                     fontSize: "10px",
//                     textAlign: "right",
//                     color: "#999",
//                   }}
//                 >
//                   {user.time}
//                 </div> */}
//               </div>
//             </div>
//           ))
//         )}
//       </ScrollArea>
//     </Stack>
//   );
// }