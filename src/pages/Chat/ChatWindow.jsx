// components/chat/ChatWindow.js
import {
  Box,
  Textarea,
  Button,
  ScrollArea,
  Text,
  ActionIcon,
  Text as MantineText,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
// import { useConversation } from "../../hooks/chat/useConversation";
// import { useSendMessage } from "../../hooks/chat/useSendMessage";
import { useAuth } from "../../context/authContext";
import { useConversation } from "../../hooks/queries/Chat/useConversation";
import { useSendMessage } from "../../hooks/queries/Chat/useSendMessage";

export default function ChatWindow({ userid, onBack }) {
  const { user: currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const { data, isLoading } = useConversation(userid);
  const { mutate: sendMessage } = useSendMessage();

  // كشف الشاشة الصغيرة
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)");
    const handleChange = () => setIsSmallScreen(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // التمرير إلى الأسفل
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [data?.messages]);

  const handleSubmit = () => {
    if (message.trim() && userid) {
      sendMessage({
        token: currentUser.token,
        receiver_id: userid.id,
        message,
      });
      
      setMessage("");
    }
  };

  if (!userid) {
    return (
      <Box
        p="md"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {isSmallScreen && (
          <ActionIcon onClick={onBack} mr="sm">
            <IconArrowLeft />
          </ActionIcon>
        )}
        <MantineText>Select a conversation to start chatting</MantineText>
      </Box>
    );
  }

  return (
    <Box style={{ display: "flex", flexDirection: "column", height: "95vh", overflowX: "hidden" }}>
      {/* رأس النافذة */}
      <Box
        p="md"
        style={{
          borderBottom: "1px solid #576776",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isSmallScreen && (
          <ActionIcon onClick={onBack} mr="sm">
            <IconArrowLeft />
          </ActionIcon>
        )}
        <Text weight={600}>{data?.conversation_with?.name || "Loading..."}</Text>
      </Box>

      {/* منطقة الرسائل */}
      <ScrollArea style={{ flex: 1, padding: "16px" }} viewportRef={scrollRef}>
        {isLoading ? (
          <MantineText align="center" color="dimmed">Loading messages...</MantineText>
        ) : data?.messages?.length === 0 ? (
          <MantineText align="center" color="dimmed">No messages yet. Start the conversation!</MantineText>
        ) : (
          data?.messages.map((msg) => (
            <Box
              key={msg.id}
              style={{
                marginLeft: msg.is_mine ? "auto" : "",
                marginRight: !msg.is_mine ? "auto" : "",
                backgroundColor: msg.is_mine ? "#735BF2" : "#e6e6e6",
                color: msg.is_mine ? "white" : "black",
                borderRadius: msg.is_mine ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                padding: "10px 16px",
                marginBottom: "10px",
                maxWidth: "70%",
                wordBreak: "break-word",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {!msg.is_mine && (
                <MantineText size="xs" weight={600} style={{ color: "#735BF2", marginBottom: 2 }}>
                  {msg.sender.name}
                </MantineText>
              )}
              <div>{msg.message}</div>
              <MantineText
                size="xs"
                color={msg.is_mine ? "white" : "dimmed"}
                style={{
                  textAlign: msg.is_mine ? "right" : "left",
                  marginTop: "4px",
                  fontSize: "10px",
                }}
              >
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </MantineText>
            </Box>
          ))
        )}
      </ScrollArea>

      {/* حقل الإرسال */}
      <Box
        p="md"
        style={{
          borderTop: "1px solid #576776",
          display: "flex",
          gap: "10px",
        }}
      >
        <Textarea
          placeholder="Type your message here..."
          autosize
          minRows={1}
          maxRows={3}
          style={{ flex: 1 }}
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
        />
        <Button
          onClick={handleSubmit}
          style={{
            borderRadius: "50%",
            width: "3rem",
            height: "2.4rem",
            backgroundColor: "#735BF2",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9989 7.99998L8.99889 11M18.2869 1.03098C18.3818 0.99823 18.484 0.992841 18.5818 1.01542C18.6796 1.03801 18.7691 1.08765 18.84 1.15869C18.9109 1.22972 18.9604 1.31927 18.9829 1.41711C19.0053 1.51495 18.9998 1.61713 18.9669 1.71198L13.0429 18.642C13.0074 18.7432 12.9424 18.8314 12.8562 18.8952C12.77 18.959 12.6666 18.9954 12.5595 18.9997C12.4523 19.004 12.3464 18.976 12.2553 18.9194C12.1643 18.8627 12.0924 18.78 12.0489 18.682L8.82989 11.44C8.77573 11.3195 8.67932 11.2231 8.55889 11.169L1.31689 7.94898C1.21918 7.90535 1.1368 7.83343 1.08039 7.74251C1.02398 7.65159 0.996127 7.54584 1.00043 7.43892C1.00474 7.33201 1.04101 7.22884 1.10455 7.14275C1.16809 7.05666 1.25599 6.9916 1.35689 6.95598L18.2869 1.03098Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </Box>
    </Box>
  );
}

// import {
//   Box,
//   Textarea,
//   Button,
//   ScrollArea,
//   Text,
//   ActionIcon,
//   Text as MantineText,
// } from "@mantine/core";
// import { useEffect, useRef, useState } from "react";
// import { IconArrowLeft } from "@tabler/icons-react";
// import axiosInstance from "../../api/config";
// import { useAuth } from "../../context/authContext";

// export default function ChatWindow({ userid, onBack }) {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [conversationWith, setConversationWith] = useState(null); // ← من الـ API
//   const scrollRef = useRef(null);
//   const [isSmallScreen, setIsSmallScreen] = useState(false);

//   const { user: currentUser } = useAuth(); // المستخدم الحالي (أنت)

//   // كشف الشاشة الصغيرة
//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(max-width: 600px)");
//     const handleChange = () => setIsSmallScreen(mediaQuery.matches);
//     handleChange();
//     mediaQuery.addEventListener("change", handleChange);
//     return () => mediaQuery.removeEventListener("change", handleChange);
//   }, []);

//   // جلب المحادثة عند اختيار مستخدم
//   useEffect(() => {
//     if (!userid) return;

//     const fetchConversation = async () => {
//       setLoading(true);
//       try {
//         const response = await axiosInstance.get(`chat/${userid.id}`, {
//           headers: { Authorization: `Bearer ${currentUser.token}` },
//         });

//         // استخراج بيانات المحادثة
//         const { conversation_with, messages: apiMessages } = response.data.data;

//         // تحديث اسم الطرف الآخر من الـ API (أدق من الاعتماد على ChatList)
//         setConversationWith(conversation_with);

//         // تنسيق الرسائل للعرض
//         const formatted = apiMessages.map((msg) => ({
//           id: msg.id,
//           is_mine: msg.is_mine,
//           message: msg.message,
//           sender: msg.sender,
//           created_at: msg.created_at,
//           is_read: msg.is_read,
//         }));

//         setMessages(formatted);

//         // ✅ علّم الرسائل غير المقروءة كمقروءة
//         if (response.data.data.unread_messages?.length > 0) {
//           response.data.data.unread_messages.forEach((msgId) => {
//             axiosInstance
//               .post(`chat/messages/${msgId}/read`, null, {
//                 headers: { Authorization: `Bearer ${currentUser.token}` },
//               })
//               .catch((err) =>
//                 console.error("فشل في تعليم الرسالة كمقروءة:", msgId, err)
//               );
//           });
//         }
//       } catch (error) {
//         console.error("فشل جلب المحادثة", error.response?.data || error.message);
//         // يمكنك إظهار إشعار خطأ للمستخدم
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchConversation();
//   }, [userid, currentUser.token]);

//   // التمرير التلقائي إلى الأسفل عند تغيير الرسائل
//   useEffect(() => {
//     scrollRef.current?.scrollTo({
//       top: scrollRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [messages]);

//   // إرسال رسالة جديدة
//   const sendMessage = async () => {
//     if (!message.trim() || !userid) return;

//     try {
//       const payload = {
//         receiver_id: userid.id,
//         message: message.trim(),
//         message_type: "text",
//       };

//       const response = await axiosInstance.post("chat", payload, {
//         headers: { Authorization: `Bearer ${currentUser.token}` },
//       });

//       // إضافة الرسالة الجديدة للواجهة
//       const newMsg = {
//         id: response.data.message.id,
//         is_mine: true,
//         message: message.trim(),
//         sender: {
//           id: currentUser.user_id || currentUser.id,
//           name: currentUser.name,
//           role: currentUser.role,
//         },
//         created_at: new Date().toISOString(),
//         is_read: false,
//       };

//       setMessages((prev) => [...prev, newMsg]);
//       setMessage("");
//     } catch (error) {
//       console.error("فشل إرسال الرسالة", error.response?.data || error.message);
//       alert("لا يمكن إرسال الرسالة. تأكد من الصلاحيات أو حاول لاحقًا.");
//     }
//   };

//   // إذا لم يتم اختيار مستخدم
//   if (!userid) {
//     return (
//       <Box
//         p="md"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100%",
//         }}
//       >
//         {isSmallScreen && (
//           <ActionIcon onClick={onBack} mr="sm">
//             <IconArrowLeft />
//           </ActionIcon>
//         )}
//         <MantineText>Select a conversation to start chatting</MantineText>
//       </Box>
//     );
//   }

//   return (
//     <Box style={{ display: "flex", flexDirection: "column", height: "95vh", overflowX: "hidden" }}>
//       {/* رأس النافذة */}
//       <Box
//         p="md"
//         style={{
//           borderBottom: "1px solid #576776",
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         {isSmallScreen && (
//           <ActionIcon onClick={onBack} mr="sm">
//             <IconArrowLeft />
//           </ActionIcon>
//         )}
//         <Text weight={600}>{conversationWith?.name || userid.name || "Loading..."}</Text>
//       </Box>

//       {/* منطقة عرض الرسائل */}
//       <ScrollArea style={{ flex: 1, padding: "16px", overflowX: "hidden" }} viewportRef={scrollRef}>
//         {loading ? (
//           <MantineText align="center" color="dimmed">Loading messages...</MantineText>
//         ) : messages.length === 0 ? (
//           <MantineText align="center" color="dimmed">No messages yet. Start the conversation!</MantineText>
//         ) : (
//           messages.map((msg) => (
//             <Box
//               key={msg.id}
//               style={{

//                 marginLeft: msg.is_mine ? "auto" : "",
//                 marginRight: !msg.is_mine ? "auto" : "", 
//                 backgroundColor: msg.is_mine ? "#735BF2" : "#e6e6e6",
//                 color: msg.is_mine ? "white" : "black",
//                 borderRadius: msg.is_mine ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
//                 padding: "10px 16px",
//                 marginBottom: "10px",
//                 maxWidth: "70%",
//                 wordBreak: "break-word",
//                 boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
//               }}
//             >
//               {/* اسم المرسل (فقط في الرسائل الواردة) */}
//               {!msg.is_mine && (
//                 <MantineText size="xs" weight={600} style={{ color: "#735BF2", marginBottom: 2 }}>
//                   {msg.sender.name}
//                 </MantineText>
//               )}

//               {/* نص الرسالة */}
//               <div>{msg.message}</div>

//               {/* وقت الإرسال */}
//               <MantineText
//                 size="xs"
//                 color={msg.is_mine ? "white" : "dimmed"}
//                 style={{
//                   textAlign: msg.is_mine ? "right" : "left",
//                   marginTop: "4px",
//                   fontSize: "10px",
//                 }}
//               >
//                 {new Date(msg.created_at).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </MantineText>
//             </Box>
//           ))
//         )}
//       </ScrollArea>

//       {/* حقل إدخال الرسالة */}
//       <Box
//         p="md"
//         style={{
//           borderTop: "1px solid #576776",
//           display: "flex",
//           gap: "10px",
//         }}
//       >
//         <Textarea
//           placeholder="Type your message here..."
//           autosize
//           minRows={1}
//           maxRows={3}
//           style={{ flex: 1 }}
//           value={message}
//           onChange={(e) => setMessage(e.currentTarget.value)}
//           onKeyPress={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               sendMessage();
//             }
//           }}
//         />
//         <Button
//           onClick={sendMessage}
//           style={{
//             borderRadius: "50%",
//             width: "3rem",
//             height: "2.4rem",
//             backgroundColor: "#735BF2",
//           }}
//         >
//           <svg
//             width="40"
//             height="40"
//             viewBox="0 0 20 20"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M11.9989 7.99998L8.99889 11M18.2869 1.03098C18.3818 0.99823 18.484 0.992841 18.5818 1.01542C18.6796 1.03801 18.7691 1.08765 18.84 1.15869C18.9109 1.22972 18.9604 1.31927 18.9829 1.41711C19.0053 1.51495 18.9998 1.61713 18.9669 1.71198L13.0429 18.642C13.0074 18.7432 12.9424 18.8314 12.8562 18.8952C12.77 18.959 12.6666 18.9954 12.5595 18.9997C12.4523 19.004 12.3464 18.976 12.2553 18.9194C12.1643 18.8627 12.0924 18.78 12.0489 18.682L8.82989 11.44C8.77573 11.3195 8.67932 11.2231 8.55889 11.169L1.31689 7.94898C1.21918 7.90535 1.1368 7.83343 1.08039 7.74251C1.02398 7.65159 0.996127 7.54584 1.00043 7.43892C1.00474 7.33201 1.04101 7.22884 1.10455 7.14275C1.16809 7.05666 1.25599 6.9916 1.35689 6.95598L18.2869 1.03098Z"
//               stroke="white"
//               strokeWidth="1.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </Button>
//       </Box>
//     </Box>
//   );
// }
