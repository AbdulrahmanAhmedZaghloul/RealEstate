// components/chat/ChatList.js
import { ScrollArea, Stack } from "@mantine/core";
import classes from "../../styles/ChatList.module.css";
import Search from "../../components/icons/search";
import { useChatUsers } from "../../hooks/queries/Chat/useChatUsers";
import { useUserConversations } from "../../hooks/queries/Chat/useUsersConversations";

export default function ChatList({ onSelectUser }) {
  const { data: conversations, isLoading, error } = useUserConversations();
  console.log(conversations);
  console.log(error);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error loading conversations</p>;

  return (
    <Stack
      spacing="xs"
      p="md"
      style={{ borderRight: "1px solid var(--color-border-chat)" }}
    >
      <h1 className={classes.title}>Messages</h1>
      <div className={classes.divSearch}>
        <input className={classes.search} placeholder="Search" />
        <Search />
      </div>

      <ScrollArea style={{ height: "calc(100vh - 120px)" }}>
        {conversations && conversations.length > 0 ? (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectUser(conversation.user)} // send selected user
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid var(--color-border-chat)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span className={classes.conversationUser}>
                  {conversation.user.name} ({conversation.user.role})
                </span>
                {conversation.unread_count > 0 && (
                  <span className={classes.unread_count}>
                    {conversation.unread_count}
                  </span>
                )}
              </div>
              <div style={{ fontSize: "12px", color: "#888" }}>
                {conversation.last_message?.message || "No messages yet"}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#aaa",
                  alignSelf: "flex-end",
                }}
              >
                {new Date(
                  conversation.last_message.created_at
                ).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "dimmed", padding: "10px" }}>
            No conversations available
          </p>
        )}
      </ScrollArea>
    </Stack>
  );
}

// export default function ChatList({ onSelectUser }) {
//   const { data: users, isLoading, error } = useChatUsers();

//   if (isLoading)
//     return <p style={{ padding: "md", color: "dimmed" }}>Loading...</p>;
//   if (error)
//     return <p style={{ padding: "md", color: "red" }}>Error loading users</p>;

//   return (
//     <Stack
//       spacing="xs"
//       p="md"
//       style={{ borderRight: "1px solid var(--color-border-chat)" }}
//     >
//       <h1 className={classes.title}>Messages</h1>
//       <div className={classes.divSearch}>
//         <input className={classes.search} placeholder="Search" />
//         <Search />
//       </div>
//       <ScrollArea style={{ height: "calc(100vh - 120px)" }}>
//         {users && users.length > 0 ? (
//           users.map((user) => (
//             <div
//               key={user.id}
//               onClick={() => onSelectUser(user)}
//               style={{
//                 padding: "10px",
//                 cursor: "pointer",
//                 borderBottom: "1px solid var(--color-border-chat)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               {console.log(user)}

//               <div
//                 style={{
//                   marginRight: "auto",
//                   width: "70%",
//                 }}
//               >
//                 <div
//                   style={{
//                     color: "var(--color-user-chat)",
//                     fontSize: "13px",
//                     fontFamily: "inter",
//                     fontWeight: "inherit",
//                     lineHeight: "16px",
//                   }}
//                 >
//                   {user.name}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p style={{ color: "dimmed", padding: "10px" }}>
//             No contacts available
//           </p>
//         )}
//       </ScrollArea>
//     </Stack>
//   );
// }
