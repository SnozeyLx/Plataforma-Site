import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
const IconChat = "/assets/img/IconChat.png";
const Avatar1 = "/assets/img/avatar/avatar1.png";
const Avatar2 = "/assets/img/avatar/avatar2.png";
const Avatar3 = "/assets/img/avatar/avatar3.png";
const Avatar4 = "/assets/img/avatar/avatar4.png";
const Avatar5 = "/assets/img/avatar/avatar5.png";
const Avatar6 = "/assets/img/avatar/avatar6.png";
const Avatar7 = "/assets/img/avatar/avatar7.png";
const Avatar8 = "/assets/img/avatar/avatar8.png";
const Avatar9 = "/assets/img/avatar/avatar9.png";
const Avatar10 = "/assets/img/avatar/avatar10.png";
const Avatar11 = "/assets/img/avatar/avatar11.png";
const Avatar12 = "/assets/img/avatar/avatar12.png";
const Avatar13 = "/assets/img/avatar/avatar13.png";
const Avatar14 = "/assets/img/avatar/avatar14.png";
const Avatar15 = "/assets/img/avatar/avatar15.png";
const Avatar16 = "/assets/img/avatar/avatar16.png";
const Avatar17 = "/assets/img/avatar/avatar17.png";
const Avatar18 = "/assets/img/avatar/avatar18.png";
const Avatar19 = "/assets/img/avatar/avatar19.png";
const Avatar20 = "/assets/img/avatar/avatar20.png";
const Avatar21 = "/assets/img/avatar/avatar21.png";
const Avatar22 = "/assets/img/avatar/avatar22.png";
const Avatar23 = "/assets/img/avatar/avatar23.png";
const Avatar24 = "/assets/img/avatar/avatar24.png";
const ChatOnline = ({ token }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Conectando...');
  const [username, setUsername] = useState(localStorage.getItem('userName'));
  const [userId, setUserId] = useState(localStorage.getItem('UserId'));
  const [isConnected, setIsConnected] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const ws = useRef(null);
  const reconnectAttempt = useRef(0);
  const maxReconnectAttempts = 5;
  const avatares = [
    Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6,
    Avatar7, Avatar8, Avatar9, Avatar10, Avatar11, Avatar12,
    Avatar13, Avatar14, Avatar15, Avatar16, Avatar17, Avatar18,
    Avatar19, Avatar20, Avatar21, Avatar22, Avatar23, Avatar24
  ];
  const getUserAvatar = (imageProfile) => {
    if (typeof imageProfile === 'string' && imageProfile.includes('avatar')) {
      return imageProfile;
    }
    const avatarIndex = parseInt(imageProfile);
    if (!isNaN(avatarIndex) && avatarIndex >= 1 && avatarIndex <= avatares.length) {
      const selectedAvatar = avatares[avatarIndex - 1];
      return selectedAvatar;
    }
    return avatares[0];
  };
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      const messagesWithImageProfile = parsedMessages.map(msg => ({
        ...msg,
        senderImageProfile: msg.senderImageProfile || '0'
      }));
      setMessages(messagesWithImageProfile);
    }
  }, []);
  useEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }, [messages]);
  const safeSend = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      const interval = setInterval(() => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify(message));
          clearInterval(interval);
        }
      }, 100);
    }
  };
  useEffect(() => {
    const connect = () => {
      setConnectionStatus('Conectando...');
      ws.current = new WebSocket(`wss://api.rondaonlinebr.com:8081/chat`);
      ws.current.onopen = () => {
        setConnectionStatus('Conectado');
        setIsConnected(true);
        reconnectAttempt.current = 0;
        safeSend({
          type: 'register',
          role: 'chat',
          token: token,
        });
      };
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'viewer_count') {
            setViewerCount(data.count);
          }
          if (data.type === 'chat_message') {
            const newMsg = {
              senderName: data.senderName,
              senderAvatar: data.senderAvatar,
              senderImageProfile: data.senderImageProfile || '0',
              senderId: data.senderId,
              content: data.content,
              time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isAdmin: data.senderName === 'Admin',
            };
            setMessages(prev => {
              const updatedMessages = [...prev, newMsg];
              localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
              return updatedMessages;
            });
          }

        } catch (err) {
          console.error('Erro ao processar mensagem:', err);
        }
      };
      ws.current.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
        setConnectionStatus('Erro na conexão');
        setIsConnected(false);
      };
      ws.current.onclose = () => {
        setConnectionStatus('Desconectado');
        setIsConnected(false);
        if (reconnectAttempt.current < maxReconnectAttempts) {
          const delay = Math.min(5000, 1000 * Math.pow(2, reconnectAttempt.current));
          reconnectAttempt.current++;
          setTimeout(connect, delay);
        } else {
          setConnectionStatus('Não foi possível reconectar');
        }
      };
    };
    connect();
    return () => {
      if (ws.current) ws.current.close();
    };
  }, [token]);
  const handleSendMessage = () => {
    const message = newMessage.trim();
    const name = localStorage.getItem('userName');
    const id = localStorage.getItem('UserId');
    const imageProfile = localStorage.getItem('userImageProfile');
    if (message) {
      safeSend({
        type: 'chat_message',
        content: message,
        senderName: name && name !== "null" ? name : `User-${id}`,
        senderAvatar: getUserAvatar(imageProfile || '0'),
        senderImageProfile: imageProfile || '0',
        senderId: id,
        timestamp: Date.now()
      });
      setNewMessage('');
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  useEffect(() => {
    if (isConnected) {
      setTimeout(() => {
        inputRef.current?.blur();
        inputRef.current?.focus();
      }, 100);
    }
  }, [isConnected]);
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.setAttribute('tabindex', '-1');
    }
  }, []);
  useEffect(() => {
    const handleClickAnywhere = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        inputRef.current.focus();
      }
    };
    document.addEventListener('click', handleClickAnywhere);
    return () => {
      document.removeEventListener('click', handleClickAnywhere);
    };
  }, []);

  useEffect(() => {
    const handleKeyDownGlobal = (e) => {
      if (document.activeElement.tagName !== 'INPUT') {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDownGlobal);
    return () => {
      window.removeEventListener('keydown', handleKeyDownGlobal);
    };
  }, []);

  return (
    <div className="d-flex flex-column shadow-lg"
      style={{
        marginLeft: "21px",
        borderRadius: "25px",
        backgroundColor: '#0f172a',
        color: 'white',
        maxHeight: '820px',
        height: '820px',
        width: "90%",
        overflow: 'hidden'
      }}>
      <div className="p-3 text-center">
        <h5 className="mb-2">Chat Online</h5>
      </div>
      <div className="flex-grow-1 px-3 py-2"
        style={{
          backgroundColor: '#0f172a',
          color: 'white',
          overflowY: 'auto',
          borderRadius: '0',
          display: 'inline',
          flexDirection: 'inherit',
          justifyContent: 'flex-end',
        }}>
        {messages.length === 0 ? (
          <div className="text-center text-muted mt-3"></div>
        ) : (
          messages.map((msg, index) => {
            const isSelf = msg.senderId === userId;
            const isAdmin = msg.senderName === 'Admin';
            const isDealer = msg.senderName === 'Dealer';

            const bubbleColor = isAdmin
              ? '#7c3aed'
              : isDealer
                ? '#f59e0b'
                : isSelf
                  ? '#0F462F'
                  : '#1A242D';

            const textColor = (isDealer || isAdmin) ? '#000' : '#fff';
            return (
              <div key={index} style={{ maxWidth: '90%' }} className={isSelf ? 'ms-auto' : ''}>
                {!isSelf ? (
                  <div className="chat-line other">
                    <img
                      className="chat-avatar"
                      src={getUserAvatar(msg.senderImageProfile || msg.senderAvatar || '0')}
                      alt={`Avatar de ${msg.senderName}`}
                      style={{
                        border: isAdmin ? '2px solid #a78bfa' : isDealer ? '2px solid #fbbf24' : '2px solid #9ca3af',
                        width: "40px",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = avatares[0];
                      }}
                    />
                    <div
                      className={`bubble ${isAdmin ? 'is-admin' : ''} ${isDealer ? 'is-dealer' : ''}`}
                      style={{
                        backgroundColor: bubbleColor,
                        color: textColor,
                        borderTopLeftRadius: 0
                      }}
                    >
                      <div className="bubble-grid">
                        <div className="bubble-name">
                          {msg.senderName.length > 10 ? msg.senderName.substring(0, 10) + "..." : msg.senderName}
                        </div>
                        <div className="bubble-text">{msg.content}</div>
                        <div className="bubble-time">{msg.time}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="chat-line self">
                    <div
                      className="bubble"
                      style={{
                        backgroundColor: bubbleColor,
                        color: textColor,
                        borderTopRightRadius: 0,
                      }}
                    >
                      <div className="bubble-grid">
                        <div className="bubble-text">{msg.content}</div>
                        <div className="bubble-time">{msg.time}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>
      <div className="p-3">
        <div className="input-group">
          <input
            ref={inputRef}
            type="text"
            className="form-control bg-dark text-white border-0"
            placeholder={isConnected ? 'Digite sua mensagem...' : 'Aguardando conexão...'}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isConnected}
            style={{ borderRadius: '20px' }}
          />
          <img
            onClick={handleSendMessage}
            style={{
              zIndex: 1000,
              marginLeft: "-30px",
              position: "relative",
              cursor: isConnected && newMessage.trim() ? "pointer" : "not-allowed",
              opacity: isConnected && newMessage.trim() ? 1 : 0.5
            }}
            src={IconChat}
            alt="Enviar"
          />
        </div>
      </div>
    </div>
  );
};
export default ChatOnline;
