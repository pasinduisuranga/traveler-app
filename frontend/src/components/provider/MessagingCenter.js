import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MessagingCenter = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/providers/1/conversations');
      setConversations(response.data);
    } catch (error) {
      // Mock data
      setConversations([
        {
          id: 1,
          customerName: 'Sarah Johnson',
          experienceTitle: 'Sinharaja Rainforest Trek',
          lastMessage: 'Is equipment provided for the trek?',
          lastMessageTime: '2025-09-19 10:30',
          unread: 2,
          status: 'active',
          bookingId: 'BK-1001'
        },
        {
          id: 2,
          customerName: 'Mike Williams',
          experienceTitle: 'Whale Watching at Mirissa',
          lastMessage: 'Thank you for the wonderful experience!',
          lastMessageTime: '2025-09-18 14:20',
          unread: 0,
          status: 'completed',
          bookingId: 'BK-1002'
        },
        {
          id: 3,
          customerName: 'Emma Davis',
          experienceTitle: 'Bird Watching in Bundala',
          lastMessage: 'Can I book for next weekend?',
          lastMessageTime: '2025-09-17 09:15',
          unread: 1,
          status: 'inquiry',
          bookingId: null
        }
      ]);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`/api/providers/1/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      // Mock data based on conversation
      if (conversationId === 1) {
        setMessages([
          {
            id: 1,
            senderId: 'customer',
            senderName: 'Sarah Johnson',
            text: 'Hi! I\'m interested in the Sinharaja Rainforest Trek. Do you provide all the necessary equipment?',
            timestamp: '2025-09-19 09:00',
            read: true
          },
          {
            id: 2,
            senderId: 'provider',
            senderName: 'Eco Adventures Lanka',
            text: 'Hello Sarah! Yes, we provide all essential trekking equipment including backpacks, walking sticks, and rain gear. You just need to bring comfortable walking shoes and clothes.',
            timestamp: '2025-09-19 09:15',
            read: true
          },
          {
            id: 3,
            senderId: 'customer',
            senderName: 'Sarah Johnson',
            text: 'That\'s great! What about food and water?',
            timestamp: '2025-09-19 10:00',
            read: true
          },
          {
            id: 4,
            senderId: 'customer',
            senderName: 'Sarah Johnson',
            text: 'Is equipment provided for the trek?',
            timestamp: '2025-09-19 10:30',
            read: false
          }
        ]);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: Date.now(),
      senderId: 'provider',
      senderName: 'Eco Adventures Lanka',
      text: newMessage,
      timestamp: new Date().toLocaleString(),
      read: false
    };

    try {
      await axios.post(`/api/providers/1/conversations/${selectedConversation.id}/messages`, {
        text: newMessage
      });
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Update conversation list
      setConversations(conversations.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: newMessage, lastMessageTime: message.timestamp }
          : conv
      ));
    } catch (error) {
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (filter === 'all') return true;
    if (filter === 'unread') return conv.unread > 0;
    if (filter === 'inquiry') return conv.status === 'inquiry';
    if (filter === 'active') return conv.status === 'active';
    return true;
  });

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0);

  return (
    <div className="messaging-center">
      <div className="messaging-header">
        <h2>💬 Messaging Center</h2>
        <div className="unread-count">
          {totalUnread} unread message{totalUnread !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="messaging-layout">
        {/* Conversations List */}
        <div className="conversations-panel">
          <div className="conversations-filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({conversations.filter(c => c.unread > 0).length})
            </button>
            <button 
              className={`filter-btn ${filter === 'inquiry' ? 'active' : ''}`}
              onClick={() => setFilter('inquiry')}
            >
              Inquiries
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active Bookings
            </button>
          </div>

          <div className="conversations-list">
            {filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                className={`conversation-item ${selectedConversation?.id === conversation.id ? 'selected' : ''} ${conversation.unread > 0 ? 'unread' : ''}`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="conversation-avatar">
                  {conversation.customerName.charAt(0)}
                </div>
                <div className="conversation-info">
                  <div className="conversation-header">
                    <h4>{conversation.customerName}</h4>
                    <span className="conversation-time">{conversation.lastMessageTime}</span>
                  </div>
                  <p className="conversation-experience">{conversation.experienceTitle}</p>
                  <p className="conversation-preview">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <div className="unread-badge">{conversation.unread}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Messages Panel */}
        <div className="messages-panel">
          {selectedConversation ? (
            <>
              <div className="messages-header">
                <div className="chat-header-info">
                  <h3>{selectedConversation.customerName}</h3>
                  <p>{selectedConversation.experienceTitle}</p>
                  {selectedConversation.bookingId && (
                    <span className="booking-badge">Booking: {selectedConversation.bookingId}</span>
                  )}
                </div>
                <div className="chat-actions">
                  <button className="button secondary">View Booking</button>
                  <button className="button secondary">⋮</button>
                </div>
              </div>

              <div className="messages-container">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.senderId === 'provider' ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <div className="message-text">{message.text}</div>
                      <div className="message-time">{message.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="message-input-container">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows="3"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <div className="message-actions">
                  <button className="button secondary">📎</button>
                  <button className="button secondary">😊</button>
                  <button className="button" onClick={sendMessage}>Send</button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingCenter;