'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { io } from 'socket.io-client';
import axios from 'axios';
import Ballpit from '../../../../design/Ballpit';
import '../../styles/stylesforchat.css';

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
});

export default function ChatApp() {
  const { userId } = useParams();
  const [me, setMe] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesContainerRef = useRef(null);
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setMe(storedUser);

    socket.on('chat message', (msg) => {
      if (
        (msg.sender === storedUser._id && msg.receiver === userId) ||
        (msg.sender === userId && msg.receiver === storedUser._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off('chat message');
  }, [userId]);

  useEffect(() => {
    if (me && userId) {
      axios
        .get(`http://localhost:5000/api/messages/${me._id}/${userId}`)
        .then((res) => setMessages(res.data))
        .catch(console.error);
    }
  }, [me, userId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/users/${userId}`)
        .then((res) => {
          setOtherUser(res.data.user);
        })
        .catch((err) => console.error('Failed to load other user:', err));
    }
  }, [userId]);

  const sendMessage = async () => {
    if (!input.trim() || !me?._id) return;

    const message = {
      sender: me._id,
      receiver: userId,
      text: input.trim(),
    };

    try {
      socket.emit('chat message', message);
      setInput('');
    } catch (err) {
      console.error('שגיאה בשליחת הודעה:', err.response?.data || err.message);
    }
  };

  return (
    <div className="chat-page" style={{ position: 'relative', overflow: 'hidden' }}>
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}>
        <Ballpit
          count={70}
          gravity={1.5}
          friction={0.8}
          wallBounce={0.95}
          followCursor={true}
          colors={[
            0xff0000,
            0xff00ff,
            0xffff00,
            0x00ff00,
            0x00ffff,
            0x0000ff,
            0xff6600,
            0x39ff14
          ]}
        />
      </div>
      <div className="chat-box">
        <div className="chat-header">
          Chat with @{otherUser?.username || '...'}

          <button className="return-btn" onClick={() => window.history.back()}>
            X
          </button>

        </div>

        <div className="messages" ref={messagesContainerRef}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${msg.sender !== me?._id ? 'other' : ''}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
