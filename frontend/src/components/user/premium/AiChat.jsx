import React, { useState } from 'react';
import './AiChat.css';

const AiChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage = {
      text: inputMessage,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Make API call to your backend AI service
      const response = await fetch('http://localhost:5000/api/ai-chat/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();

      if (response.status === 503) {
        // Handle quota exceeded error
        const aiMessage = {
          text: "I apologize, but I'm temporarily unavailable. Please try again later or contact support.",
          sender: 'ai'
        };
        setMessages(prev => [...prev, aiMessage]);
      } else if (data.error) {
        const aiMessage = {
          text: "Sorry, I encountered an error. Please try again.",
          sender: 'ai'
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Add AI response to chat
        const aiMessage = {
          text: data.response,
          sender: 'ai'
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const aiMessage = {
        text: "Sorry, there was an error connecting to the AI service. Please try again later.",
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiMessage]);
    }

    setInputMessage('');
  };

  return (
    <div className="ai-chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask me anything about the website..."
          className="chat-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default AiChat; 