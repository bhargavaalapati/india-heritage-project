// src/components/Chatbot.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComment, FaTimes, FaPaperPlane } from 'react-icons/fa';
import chatbotData from '../data/chatbotData.json'; // <-- Import the bot's brain

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialGreeting = chatbotData.intents.find(i => i.intent === 'greeting').responses[0];
      setMessages([{ type: 'bot', text: initialGreeting }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newMessage = { type: 'user', text: inputValue };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue('');

    setTimeout(() => {
      const botResponse = getBotResponse(newMessage.text);
      setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: botResponse }]);
    }, 1000);
  };

  const getBotResponse = (userText) => {
    const lowerText = userText.toLowerCase();

    // --- Stage 1: Moderation ---
    const isSensitive = chatbotData.moderation.blockedWords.some(word => lowerText.includes(word));
    if (isSensitive) {
      return chatbotData.moderation.response;
    }

    // --- Stage 2: Knowledge Base State Search (Most Specific) ---
    for (const state of chatbotData.knowledgeBase.states) {
      if (lowerText.includes(state.name.toLowerCase())) {
        if (lowerText.includes('capital')) return `The capital of ${state.name} is ${state.capital}.`;
        if (lowerText.includes('language')) return `The primary languages spoken in ${state.name} are ${state.language}.`;
        if (lowerText.includes('food')) return `Some famous foods from ${state.name} include ${state.food.join(', ')}.`;
        if (lowerText.includes('festival')) return `${state.name} is known for festivals like ${state.festivals.join(', ')}.`;
        if (lowerText.includes('heritage') || lowerText.includes('sites')) return `In ${state.name}, you can visit famous heritage sites like ${state.heritageSites.join(', ')}.`;
        return `Great choice! ${state.name} is famous for ${state.famousFor.join(', ')}. What would you like to know more about?`;
      }
    }

    // --- NEW Stage 3: Knowledge Base Keyword Search ---
    // This will search for specific sites or topics across all states.
    for (const state of chatbotData.knowledgeBase.states) {
      // Check heritage sites
      for (const site of state.heritageSites) {
        if (lowerText.includes(site.toLowerCase())) {
          return `${site} is a famous heritage site located in ${state.name}. ${state.name} is also known for ${state.famousFor.join(', ')}.`;
        }
      }
      // Check famous topics
      for (const topic of state.famousFor) {
        if (lowerText.includes(topic.toLowerCase())) {
            return `${topic} is a well-known attraction in ${state.name}. You can also explore other sites there like ${state.heritageSites.join(', ')}.`;
        }
      }
    }

    // --- Stage 4: Simple Intent Matching (General) ---
    for (const intent of chatbotData.intents) {
      const isMatch = intent.keywords.some(keyword => lowerText.includes(keyword));
      if (isMatch) {
        return intent.responses[0];
      }
    }

    // --- Stage 5: Fallback (Last Resort) ---
    return "I'm not sure how to answer that. You can ask me about the capital, language, food, or festivals of a specific state in India!";
  };
  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 bg-orange-500 text-white rounded-full p-4 shadow-lg hover:bg-orange-600 transition-colors z-50"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <FaTimes size={24} /> : <FaComment size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, x: 50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-20 right-6 w-80 h-[450px] bg-white rounded-xl shadow-2xl flex flex-col z-40 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-t-xl flex justify-between items-center shadow-md">
              <h3 className="font-semibold text-lg">India Heritage Chatbot</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/20 transition">
                <FaTimes size={20} />
              </button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-xl text-sm ${
                      msg.type === 'user'
                        ? 'bg-orange-100 text-orange-800 rounded-br-none'
                        : 'bg-slate-200 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <motion.button
                type="submit"
                className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPaperPlane size={20} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;