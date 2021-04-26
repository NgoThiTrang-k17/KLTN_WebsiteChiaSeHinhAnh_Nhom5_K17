import React, { useState } from 'react';

const ChatInput = (props) => {
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const onSubmit = (e) => {
    e.preventDefault();

    const isUserProvided = user && user !== '';
    const isMessageProvided = message && message !== '';
    const isUserId = userId && userId !== '';
    
    if (isUserProvided && isMessageProvided && isUserId) {
      props.sendMessage(user, message, userId);
    } else {
      alert('Please insert user or message');
    }
  };
  const onUserUpdate = (e) => {
    setUser(e.target.value);
  };
  const onMessageUpdate = (e) => {
    setMessage(e.target.value);
  };
  const onUserIdUpdate = (e) => {
    setUserId(e.target.value);
  };
  return (
    <div>
    <h1>{userId}</h1>
    <form onSubmit={onSubmit}>
      <label htmlFor='user'>user:</label>
      <br />
      <input id='user' name='user' value={user} onChange={onUserUpdate}></input>
      <br />
      <label htmlFor='message'>message:</label>
      <br />
      <input id='message' name='message' value={message} onChange={onMessageUpdate}></input>
      <br/>
      <label htmlFor='userId'>userId:</label>
      <br />
      <input id='userId' name='userId' value={userId} onChange={onUserIdUpdate}></input>
      <br/>
      <button>Submit</button>
    </form>
    </div>
  );
};
 export default ChatInput;