


// import { ScrollArea, Stack } from "@mantine/core";
// import classes from "../../styles/ChatList.module.css";
// import Search from "../../components/icons/search";
// // import axiosInstance from "../../utils/axiosInstance"; // تأكد من وجود هذا الملف أو بدّله بـ axios مباشرة
// import { useEffect, useState } from "react";
// import axiosInstance from "../../api/config";
// import { useAuth } from "../../context/authContext";

// export default function ChatList({ onSelectUser }) {
//   const [users, setUsers] = useState([]);
//   const { user } = useAuth();
  
//   useEffect(() => {
//     const fetchChatUsers = async () => {
//       try {
//         const res = await axiosInstance.get("chat/users", {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         setUsers(res.data.data.users);
//       } catch (err) {
//         console.error("❌ Error fetching chat users:", err);
//       }
//     };

//     fetchChatUsers();
//   }, []);

//   return (
//     <Stack spacing="xs" p="md" style={{ borderRight: "1px solid #576776" }}>
//       <h1 className={classes.title}>Messages</h1>
//       <div className={classes.divSearch}>
//         <input className={classes.search} placeholder="Search" />
//         <Search />
//       </div>

//       <ScrollArea style={{ height: "calc(100vh - 120px)" }}>
//         {users.map((user) => (
//           <div
//             key={user.id}
//             onClick={() => onSelectUser(user)}
//             style={{
//               padding: "10px",
//               cursor: "pointer",
//               borderBottom: "1px solid #576776",
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             {console.log(user)}

//             <div
//               style={{
//                 width: "3.5rem",
//                 height: "3.5rem",
//                 background: "#ccc",
//                 borderRadius: "50%",
//                 marginRight: "10px",
//               }}
//             />
//             <div>
//               <div style={{ fontWeight: 600 }}>{user.name}</div>
//               <div style={{ fontSize: "12px", color: "#888" }}>{user.role}</div>
//             </div>
//           </div>
//         ))}
//       </ScrollArea>
//     </Stack>
//   );
// }

import { ScrollArea, Stack, TextInput } from "@mantine/core";
import classes from "../../styles/ChatList.module.css";
import Search from "../../components/icons/search";
import { useEffect, useState } from "react";
import { chatApi } from "../../api/chat";
import { useAuth } from "../../context/authContext";
import axiosInstance from "../../api/config";

export default function ChatList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
 const { user } = useAuth();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("chat/users", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log("Fetched users:", response.data.data.users);
        
        // الـ API يردّ قائمة بالمستخدمين المسموح التحدث معهم
        const formatted = response.data.data.users.map((user) => ({
          id: user.id,
          name: user.name,
          // img: user.avatar || "/default-avatar.png", // إذا كان في صور
          // lastMessage: user.last_message || "No message yet",
          // time: new Date(user.last_message_at).toLocaleTimeString([], {
          //   hour: "2-digit",
          //   minute: "2-digit",
          // }),
        }));
        setUsers(formatted);
      } catch (error) {
        console.error(error);
        setUsers([]); // يمكنك عرض رسالة خطأ
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Stack spacing="xs" p="md" style={{ borderRight: "1px solid #576776" }}>
      <h1 className={classes.title}>Messages</h1>
      <div className={classes.divSearch}>
        <input className={classes.search} placeholder="Search" />
        <Search />
      </div>

      <ScrollArea style={{ height: "calc(100vh - 120px)" }}>
        {loading ? (
          <p color="dimmed">Loading...</p>
        ) : users.length === 0 ? (
          <p color="dimmed">No contacts available</p>
        ) : (
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
              {/* <div>
                <img
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  src={user.img}
                  alt={user.name}
                />
              </div> */}
              <div
                style={{ fontWeight: 600, marginRight: "auto", width: "70%" }}
              >
                <div>{user.name}</div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#888",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.lastMessage}
                </div>
                {/* <div
                  style={{
                    fontSize: "10px",
                    textAlign: "right",
                    color: "#999",
                  }}
                >
                  {user.time}
                </div> */}
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </Stack>
  );
}