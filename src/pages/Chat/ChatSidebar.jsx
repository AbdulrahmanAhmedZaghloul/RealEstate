// src/components/chat/ChatSidebar.jsx
import { ScrollArea, Stack, TextInput } from "@mantine/core";

const users = [
  { name: "John Doe", lastMessage: "How are you doing?", time: "16:45" },
  { name: "Travis Barker", lastMessage: "... is typing", time: "16:45" },
  { name: "Kate Rose", lastMessage: "See you tomorrow!", time: "16:45" },
  { name: "Robert Parker", lastMessage: "Awesome!", time: "16:45" },
  { name: "Rick Owens", lastMessage: "Good idea 😉", time: "16:45" },
  { name: "George Orwell", lastMessage: "Literally 1984 😁", time: "16:45" },
  { name: "Franz Kafka", lastMessage: "Interested in insecticides for...", time: "16:45" },
  { name: "Tom Hardy", lastMessage: "Smells like design spirit...", time: "16:45" },
  { name: "Vivienne Westwood", lastMessage: "This cat is so funny 😹", time: "16:45" },
  { name: "Anthony Paul", lastMessage: "Check out my page 😎", time: "16:45" },
  { name: "Stan Smith", lastMessage: "Want to see this kicks rn", time: "16:45" },
];

export default function ChatSidebar({ onSelectUser }) {
  return (
    <Stack spacing="xs" p="md">
      <TextInput placeholder="Search" />
      <ScrollArea style={{ height: "calc(100vh - 120px)" }}>
        {users.map((user, idx) => (
          <div
            key={idx}
            onClick={() => onSelectUser(user)}
            style={{
              padding: "10px",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
          >
            <div style={{ fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: "12px", color: "#888" }}>{user.lastMessage}</div>
            <div style={{ fontSize: "10px", textAlign: "right" }}>{user.time}</div>
          </div>
        ))}
      </ScrollArea>
    </Stack>
  );
}
