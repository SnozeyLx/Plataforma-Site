import { useEffect, useState } from "react";
const useWebSocket = (url) => {
    const [socket, setSocket] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    useEffect(() => {
        const ws = new WebSocket(url);
        ws.onopen = () =>
            ws.onmessage = (event) => {
                setMessages(prev => [...prev, event.data]);
            };
        ws.onclose = () =>
            setSocket(ws);
        return () => ws.close();
    }, [url]);
    return { socket, messages };
};
export default function WebSocketComponent() {
    const { socket, messages } = useWebSocket('wss://ronda-api.artevitdevs.com.br:8080');
    const sendMessage = () => {
        if (socket) socket.send("Olá do React!");
    };
    return (
        <div>
            <h2>WebSocket React ↔ Unity</h2>
            <button onClick={sendMessage}>Enviar Mensagem</button>
            <ul>
                {messages.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}
