import { useEffect, useRef, useState } from "react";

const useWebSocket = (url) => {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!url) return;

    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [data, ...prev]);
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [url]);

  const sendMessage = (data) => {
    if (socketRef.current && connected) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  return {
    messages,
    connected,
    sendMessage,
  };
};

export default useWebSocket;