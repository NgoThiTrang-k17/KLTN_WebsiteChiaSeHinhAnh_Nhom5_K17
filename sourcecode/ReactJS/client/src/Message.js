import React from 'react';

const Message = (props) =>{
    return <div className="message">
        <p><strong>{props.user}</strong> say: </p>
        <p>{props.message}</p>
    </div>
}
export default Message;