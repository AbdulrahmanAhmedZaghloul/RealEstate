// import {
//   Box,
//   Textarea,
//   Button,
//   ScrollArea,
//   Text,
//   ActionIcon,
// } from "@mantine/core";
// import { useEffect, useRef, useState } from "react";
// import { IconArrowLeft } from "@tabler/icons-react";
// import axiosInstance from "../../api/config";
// import { useAuth } from "../../context/authContext";
 
// export default function ChatWindow({ userid, onBack }) {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const scrollRef = useRef(null);
//   const [isSmallScreen, setIsSmallScreen] = useState(false);
//   const { user } = useAuth();
// console.log(userid.id); 

//   // تحديد حجم الشاشة
//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(max-width: 600px)");
//     const handleChange = () => setIsSmallScreen(mediaQuery.matches);
//     handleChange();
//     mediaQuery.addEventListener("change", handleChange);
//     return () => mediaQuery.removeEventListener("change", handleChange);
//   }, []);

//   // تحميل المحادثة عند اختيار المستخدم
//   useEffect(() => {
//     const fetchConversation = async () => {
// if (!userid || !userid.id) return;
//       try {
//         const res = await axiosInstance.get(`chat/${userid.id}`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         console.log(res.data.data.messages);
        
//         setMessages(res.data.data.messages);
//       } catch (err) {
//         console.error("❌ Error loading conversation:", err);
//       }
//     };

//     fetchConversation();
//   }, [user]);

//   // إرسال رسالة
//   const sendMessage = async () => {
//     if (!message.trim()) return;

//     try {
//       const res = await axiosInstance.post(
//         "chat",
//         {
//           receiver_id: userid.id,
//           message,
//         },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       setMessages([...messages, { ...res.data.data.message, is_mine: true }]);
//       setMessage("");
//     } catch (err) {
//       console.error("❌ Error sending message:", err);
//     }
//   };

//   useEffect(() => {
//     scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
//   }, [messages]);

//   if (!userid) {
//     return (
//       <Box p="md" style={{ textAlign: "center" }}>
//         {isSmallScreen && (
//           <ActionIcon onClick={onBack}>
//             <IconArrowLeft />
//           </ActionIcon>
//         )}
//         <Text>Select a conversation</Text>
//       </Box>
//     );
//   }

//   return (
//     <Box
      // style={{
      //   display: "flex",
      //   flexDirection: "column",
      //   height: "95vh",
      // }}
//     >
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
//         {console.log(userid)}
//         <Text weight={600}>{userid.name}</Text>
//       </Box>

//       <ScrollArea style={{ flex: 1, padding: "16px" }} viewportRef={scrollRef}>
//         {console.log(messages)}
        
//         {messages.map((msg, idx) => (
//           <Box
//             key={idx}
//             style={{
//               alignSelf: msg.is_mine ? "flex-end" : "flex-start",
//               background: msg.is_mine ? "#735BF2" : "#f1f1f1",
//               color: msg.is_mine ? "white" : "black",
//               borderRadius: "20px",
//               padding: "10px 16px",
//               marginBottom: "10px",
//               maxWidth: "70%",
//             }}
//           >
//             {msg.message}
//           </Box>
//         ))}
//       </ScrollArea>

//       <Box
//         p="md"
//         style={{
//           borderTop: "1px solid #576776",
//           display: "flex",
//           gap: "10px",
//         }}
//       >
//         <Textarea
//           placeholder="Type your message..."
//           autosize
//           minRows={1}
//           maxRows={3}
//           style={{ flex: 1 }}
//           value={message}
//           onChange={(e) => setMessage(e.currentTarget.value)}
//         />
//         <Button
//           onClick={sendMessage}
//           style={{ borderRadius: "50%", width: "3rem", height: "2.4rem" }}
//         >
//           ✉️
//         </Button>
//       </Box>
//     </Box>
//   );
// }


















import {
  Box,
  Textarea,
  Button,
  ScrollArea,
  Text,
  ActionIcon,
  Text as MantineText,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import { chatApi } from "../../api/chat";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
 
export default function ChatWindow({ userid, onBack }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
 const { user } = useAuth();
  
  // كشف الشاشة الصغيرة
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)");
    const handleChange = () => setIsSmallScreen(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

   useEffect(() => {
     if (!userid) return;

     const fetchConversation = async () => {
       setLoading(true);
       try {
         const response = await axiosInstance.get(`chat/${userid.id}`, {
           headers: { Authorization: `Bearer ${user.token}` },
         });
         console.log("Fetched messages:", response.data.data.messages);

         const formatted = response.data.data.messages.map((msg) => ({
           id: msg.id,
           fromMe: msg.sender_id === parseInt(localStorage.getItem("user_id")), // أو من context
           text: msg.message,
           sentAt: new Date(msg.created_at).toLocaleTimeString(),
         }));
         setMessages(formatted);

         // علّم الرسائل كمقروءة
         response.data.unread_messages?.forEach((msgId) => {
           axiosInstance
             .post(`chat/messages/${msgId}/read`, null, {
               headers: { Authorization: `Bearer ${user.token}` },
             })
             .catch(console.error);
         });
       } catch (error) {
         console.error("فشل جلب المحادثة", error);
       } finally {
         setLoading(false);
       }
     };

     fetchConversation();
   }, [userid]);

   useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  
  const sendMessage = async () => {
    if (!message.trim() || !userid) return;

    try {
      const payload = {
        receiver_id: userid.id,
        message: message.trim(),
        message_type: "text",
      };

      const response = await axiosInstance.post("chat", payload, {
           headers: { Authorization: `Bearer ${user.token}` },
         }); // POST /chat

      const newMsg = {
        id: response.data.message.id,
        fromMe: true,
        text: message,
        sentAt: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, newMsg]);
      setMessage("");
    } catch (error) {
      console.error("فشل إرسال الرسالة", error.response?.data || error.message);
      alert("لا يمكن إرسال الرسالة. تأكد من الصلاحيات.");
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
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        height: "95vh",
      }}
    >
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
        <Text weight={600}>{user.name}</Text>
      </Box>

      <ScrollArea style={{ flex: 1, padding: "16px" }} viewportRef={scrollRef}>
   
        {messages.map((msg) => (
          <Box
            key={msg.id}
            style={{
              alignSelf: msg.fromMe ? "flex-end" : "flex-start",
              backgroundColor: msg.fromMe ? "#735BF2" : "#f1f1f1",
              color: msg.fromMe ? "white" : "black",
              borderRadius: "20px",
              padding: "10px 16px",
              marginBottom: "10px",
              maxWidth: "70%",
              wordBreak: "break-word",
            }}
          >
            {msg.text}
            <MantineText
              size="xs"
              color="dimmed"
              style={{
                textAlign: msg.fromMe ? "right" : "left",
                marginTop: "4px",
              }}
            >
              {msg.sentAt}
            </MantineText>
          </Box>
        ))}
      </ScrollArea>

      <Box
        p="md"
        style={{ borderTop: "1px solid #576776", display: "flex", gap: "10px" }}
      >
        <Textarea
          placeholder="Type your message here..."
          autosize
          minRows={1}
          maxRows={3}
          style={{ flex: 1 }}
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button
          onClick={sendMessage}
          style={{ borderRadius: "50%", width: "3rem", height: "2.4rem" }}
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
// } from "@mantine/core";
// import { useEffect, useRef, useState } from "react";
// import { IconArrowLeft } from "@tabler/icons-react";

// export default function ChatWindow({ user, onBack }) {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const scrollRef = useRef(null);
//   const [isSmallScreen, setIsSmallScreen] = useState(false);

//   // كشف حجم الشاشة
//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(max-width: 600px)");
//     const handleChange = () => setIsSmallScreen(mediaQuery.matches);
//     handleChange();
//     mediaQuery.addEventListener("change", handleChange);
//     return () => mediaQuery.removeEventListener("change", handleChange);
//   }, []);

//   const sendMessage = () => {
//     if (message.trim()) {
//       setMessages([...messages, { fromMe: true, text: message }]);
//       setMessage("");
//     }
//   };

//   useEffect(() => {
//     scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
//   }, [messages]);

//   if (!user) {
//     return (
//       <>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           {isSmallScreen && (
//             <ActionIcon onClick={onBack}  >
//               <IconArrowLeft />
//             </ActionIcon>
//           )}

//           <Box p="md">Select a conversation</Box>
//         </div>
//       </>
//     );
//   }

//   return (
//     <Box
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "end",
//         // backgroundColor: "#f2f2f2",
//         // border: "1px solid #f2f2f2",
//         height: "95vh",
//       }}
//     >
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

//         <Text weight={600}>{user.name}</Text>
//       </Box>

//       <ScrollArea
//         style={{ flex: 1, padding: "16px", overflowX: "hidden" }}
//         viewportRef={scrollRef}
//       >
//         {messages.map((msg, idx) => (
//           <Box
//             key={idx}
//             style={{
//               alignSelf: msg.fromMe ? "flex-end" : "flex-start",
//               background: msg.fromMe ? "#735BF2" : "#f1f1f1",
//               color: msg.fromMe ? "white" : "black",
//               borderRadius: "20px",
//               padding: "10px 16px",
//               marginBottom: "10px",
//               maxWidth: "70%",
//               overflowWrap: "break-word", // الأهم
//               wordBreak: "break-word", // دعم إضافي
//               hyphens: "auto",
//               // backgroundColor:"#f5f5f5"
//             }}
//           >
//             {msg.text}
//           </Box>
//         ))}
//       </ScrollArea>

//       <Box
//         p="md"
//         style={{
//           borderTop: "1px solid #576776",
//           display: "flex",
//           gap: "10px",
//           justifyContent: "end",
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
//         />
//         <Button
//           onClick={sendMessage}
//           style={{
//             borderRadius: "50%",
//             width: "3rem",
//             height: "2.4rem",
//             // padding: "20px",
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
//               stroke-width="1.5"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//             />
//           </svg>
//         </Button>
//       </Box>
//     </Box>
//   );
// }
