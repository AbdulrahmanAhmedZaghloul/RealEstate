
// // hooks/useSocket.js
// import { useEffect, useRef } from "react";
// import { io } from "socket.io-client";

// export const useSocket = (url = "http://localhost:5173") => {
//   const socketRef = useRef(null);

//   useEffect(() => {
//     socketRef.current = io(url);

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, [url]);

//   return socketRef.current;
// };
