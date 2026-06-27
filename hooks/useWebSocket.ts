import { useState, useEffect, useCallback, useRef } from "react";

interface WebSocketMessage {
  type: string;
  payload?: any;
  data?: string;
  timestamp?: number;
}

export function useWebSocket(defaultUrl: string = "SIMULATE_LOCAL") {
  const [isConnected, setIsConnected] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [hostUrl, setHostUrl] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const key = localStorage.getItem("APP_SECRET_KEY");
    const url = localStorage.getItem("APP_HOST_URL");
    setApiKey(key);
    setHostUrl(url || defaultUrl);
  }, [defaultUrl]);

  const saveApiKey = useCallback((key: string) => {
    localStorage.setItem("APP_SECRET_KEY", key);
    setApiKey(key);
  }, []);

  const saveHostUrl = useCallback((url: string) => {
    localStorage.setItem("APP_HOST_URL", url);
    setHostUrl(url);
  }, []);

  useEffect(() => {
    let pingTimer: NodeJS.Timeout;
    const apiUrl = hostUrl || defaultUrl;

    // If simulating local for preview visual, don't require API key initially
    if (apiUrl === "SIMULATE_LOCAL") {
      const simulateConnect = () => {
        setIsConnected(true);
        pingTimer = setInterval(() => {
          setLatency(10 + Math.floor(Math.random() * 8));
        }, 2000);
      };
      const simTimer = setTimeout(simulateConnect, 1500);
      return () => {
        clearTimeout(simTimer);
        clearInterval(pingTimer);
      };
    }

    if (!apiKey) {
      setIsConnected(false);
      setLatency(null);
      return;
    }

    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      try {
        // Use wss protocol if https, else ws
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = apiUrl.startsWith("ws")
          ? apiUrl
          : `${protocol}//${apiUrl}`;
        const ws = new WebSocket(`${wsUrl}?auth=${apiKey}`);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          // Ping to measure latency
          pingTimer = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "ping", timestamp: Date.now() }));
            }
          }, 2000);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "pong" && data.timestamp) {
              setLatency(Date.now() - data.timestamp);
            } else {
              setLastMessage(data);
            }
          } catch (e) {
            console.error("Failed to parse WebSocket message", e);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          setLatency(null);
          // Auto reconnect connection drop
          reconnectTimer = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          setIsConnected(false);
          ws.close();
        };
      } catch (err) {
        setIsConnected(false);
        reconnectTimer = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        // Clear onclose before closing to prevent reconnect loops on unmount
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
      clearTimeout(reconnectTimer);
      clearInterval(pingTimer);
    };
  }, [hostUrl, defaultUrl, apiKey]);

  const sendMessage = useCallback((type: string, payload: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  }, []);

  return {
    isConnected,
    latency,
    lastMessage,
    sendMessage,
    apiKey,
    saveApiKey,
    hostUrl,
    saveHostUrl,
  };
}
