import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CustomerList from './CustomerList';
import ChatArea from './ChatArea';

const ChatSection = ({ customers, setCustomers, messages, setMessages, user, searchQuery }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-[calc(100vh-100px)] bg-gray-50"
    >
      <CustomerList
        customers={customers}
        setCustomers={setCustomers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        searchQuery={searchQuery}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <ChatArea
        selectedCustomer={selectedCustomer}
        messages={messages}
        setMessages={setMessages}
        user={user}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </motion.div>
  );
};

export default ChatSection;