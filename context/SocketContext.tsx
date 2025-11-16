import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

// Define the context value type
interface SocketContextType {
  socket: Socket | null;
}

// Create the context with initial null
const SocketContext = createContext<SocketContextType | null>(null);

// Props for provider
interface SocketProviderProps {
  children: ReactNode;
  restaurantId: number | string; // restaurant ID
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  restaurantId,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket: Socket = io("http://YOUR_SERVER_IP:3000", {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    // Join restaurant room
    newSocket.emit("join-restaurant", restaurantId);

    return () => {
      newSocket.disconnect();
    };
  }, [restaurantId]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket
export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used inside a SocketProvider");
  }
  return context.socket;
};
