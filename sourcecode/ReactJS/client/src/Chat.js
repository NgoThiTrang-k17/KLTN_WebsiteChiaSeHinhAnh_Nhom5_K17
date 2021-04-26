/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import ChatInput from './ChatInput';
import ChatWindow from './ChatWindow';

const Chat = () => {
//   const [connection, setConnection] = useState(null);
  const [chat, setChat] = useState([]);
  const lastestChat = useRef(null);

  lastestChat.current = chat;
  
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/hubs/chat')
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then( result => {
        console.log('connected');
        connection.invoke('GetConnectionId').then((connectionId)=>{
          document.getElementById('signalRConnectionId').innerHTML = connectionId
        })
        connection.on('sendToUser', message => {
          const updatedChat = [...lastestChat.current];
          updatedChat.push(message);
        
          setChat(updatedChat);
        });
      })
      .catch((e) => console.log('connection failed: ', e));
  }, []);

  const sendMessage = async (user, message, userid) => {
    const chatMessage = {
      user: user,
      message: message,
      userId: userid,
    };

    try {
      await fetch('http://localhost:5000/Chat', {
        method: 'POST',
        body: JSON.stringify(chatMessage),
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }
    catch (e) {
      console.log('send message failed.', e);
    }
  }
  return (
    <div>
      <ChatInput sendMessage={sendMessage}></ChatInput>
      <hr />
      <ChatWindow chat={chat}></ChatWindow>
    </div>
  );
};
export default Chat;
