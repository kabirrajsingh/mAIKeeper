import React, { useState } from 'react';
import axios from 'axios';
import { ProductCard2 } from '../Compoenents/ProductCard2';
import './GuidedPage.css';

const ChatApp = () => {
  const [threadId, setThreadId] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);

  const startChat = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8080/start', {
        startText: "Hi! My wedding is in 2 weeks and I need a wedding planner. Can you help me?",
        userMetadata: null,
        threadId: 0
      });
      setThreadId(response.data.threadId);
      setChat([{ text: response.data.reply, type: 'qa' }]);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const sendMessage = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8080/next', {
        threadId: threadId,
        userMetadata: null,
        replyFromUser: message,
        productIds: ['p1', 'p2']
      });
      setChat([...chat, { text: message, type: 'user' }, { text: response.data.Description, type: 'product', products: response.data.productIds }]);
      fetchProductDetails(response.data.productIds);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchProductDetails = async (productIds) => {
    try {
      const productDetails = await Promise.all(productIds.map(async (productId) => {
        const response = await axios.get(`http://127.0.0.1:8080/fetchprod`, { params: { productId } });
        return { ...response.data, productId };
      }));
      setProducts(productDetails);
      console.log(productDetails)
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h1 className="chat-title">Guided Shopping Experience</h1>
        <div className="chat-messages">
          {chat.map((entry, index) => (
            <div key={index} className={`chat-message ${entry.type === 'user' ? 'user-message' : 'bot-message'}`}>
              <div className="message-content">{entry.text}</div>
              {entry.type === 'product' && (
                <div className="product-grid">
                  {products.map((product, idx) => (
                    <ProductCard2
                      key={idx}
                      title={product.productDetails.title}
                      price={product.productDetails.price}
                      description={product.productDetails.description}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="chat-send-button" onClick={sendMessage}>Send</button>
        </div>
        {!threadId && (
          <button className="chat-start-button" onClick={startChat}>Start Chat</button>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
