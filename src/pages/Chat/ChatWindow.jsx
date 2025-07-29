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
import { useTranslation } from "../../context/LanguageContext";

export default function ChatWindow({ userid, onBack }) {
  const { user: currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { lang } = useTranslation(); // 👈 استدعاء اللغة

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
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        height: "95vh",
        overflow: "hidden",
      }}
    >
      {/* رأس النافذة */}
      <Box
        p="md"
        style={{
          borderBottom: "1px solid var(--color-border-chat)",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isSmallScreen && (
          <ActionIcon onClick={onBack} mr="sm">
            <IconArrowLeft />
          </ActionIcon>
        )}
        <Text weight={600}>
          {data?.conversation_with?.name || "Loading..."}
        </Text>
      </Box>

      {/* منطقة الرسائل */}
      <ScrollArea style={{ flex: 1, padding: "16px" }} viewportRef={scrollRef}>
        {isLoading ? (
          <MantineText align="center" color="dimmed">
            Loading messages...
          </MantineText>
        ) : data?.messages?.length === 0 ? (
          <MantineText align="center" color="dimmed">
            No messages yet. Start the conversation!
          </MantineText>
        ) : (
          data?.messages.map((msg) => (
            <>
              {!msg.is_mine && (
                <MantineText
                  // size="sm"
                  weight={600}
                  style={{
                    color: "var(--color-P)",
                    marginBottom: 2,
                    display: "flex",
                    justifyContent: [lang === "ar" ? "end" : "start"],
                    gap: "10px",
                    fontSize:"8px",
                    // [lang === "ar" ? "marginLeft" : "marginRight"]: "auto",
                  }}
                >
                  {msg.sender.name}
                </MantineText>
              )}
              <Box
                key={msg.id}
                style={{
                  marginLeft: msg.is_mine ? "auto" : "",
                  marginRight: !msg.is_mine ? "auto" : "",
                  backgroundColor: msg.is_mine
                    ? "var(--color-1)"
                    : "var(--color-background-chat)",

                  // borderRadius: msg.is_mine
                  //   ? "20px 20px 4px 20px"
                  //   : "20px 20px 20px 4px",

                  borderRadius: "10px",

                  padding: "0px 10px",
                  height: "fit-content",
                  paddingBottom: "5px",
                  // marginTop: "10px",
                  marginBottom: "20px",
                  width: "fit-content",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: msg.is_mine ? "end" : "end",
                  alignItems: "flex-end",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    // justifyContent: msg.is_mine ? "end" : "end",
                    alignItems: "start",
                    // flexWrap: "wrap",
                    color: msg.is_mine ? "white" : "var(--color-10)",
                  }}
                >
                  {msg.message}
                </span>
                <MantineText
                  size="xs"
                  color={msg.is_mine ? "white" : "dimmed"}
                  style={{
                    textAlign: msg.is_mine ? "right" : "left",
                    marginTop: "4px",
                    fontSize: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "end",
                      gap: "10px",
                      fontSize: "8px",
                    }}
                  >
                    <span
                      style={{
                        color: !msg.is_mine ? "var(--color-P)" : "white",
                      }}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <span>
                      {msg.is_read ? (
                        msg.is_mine ? (
                          <svg
                            width="12"
                            height="7"
                            viewBox="0 0 12 7"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.801 4.88L6.507 5.586L10.74 1.353L11.447 2.06L6.507 7L3.325 3.818L4.032 3.111L5.0945 4.1735L5.801 4.8795V4.88ZM5.802 3.466L8.278 0.989502L8.983 1.6945L6.507 4.171L5.802 3.466ZM4.3885 6.2935L3.682 7L0.5 3.818L1.207 3.111L1.9135 3.8175L1.913 3.818L4.3885 6.2935Z"
                              fill={!msg.is_mine ? "var(--color-1)" : "#e6e6e6"}
                            />
                          </svg>
                        ) : null
                      ) : (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 7"
                          // width="12"
                          // height="12"
                          // viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.99841 7.586L9.59441 2.9895L10.3019 3.6965L4.99841 9L1.81641 5.818L2.52341 5.111L4.99841 7.586Z"
                            fill={!msg.is_mine ? "var(--color-1)" : "#e6e6e6"}
                          />
                        </svg>
                      )}
                    </span>
                  </div>
                </MantineText>
              </Box>
            </>
          ))
        )}
      </ScrollArea>

      {/* حقل الإرسال */}
      <Box
        p="md"
        style={{
          borderTop: "1px solid var(--color-border-chat)",
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
