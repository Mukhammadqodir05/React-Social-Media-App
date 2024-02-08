import React from 'react';
import { auth } from '../firebase';

const Message = ({ message }) => {

  const isMyMessage = message.uid === auth.currentUser.uid;
  const containerStyle = {
    display: 'flex',
    justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
    marginBottom: '12px',
  };

  return (
    <div style={containerStyle} className='flex w-full h-full'>
      <div className=' md:max-w-[300px] '
        style={{
          background: isMyMessage ? '#395dff' : '#e5e5ea',
          color: isMyMessage ? 'white' : 'black',
          padding: '12px',
          borderRadius: isMyMessage ? '12px 0 12px 12px' : '0 12px 12px 12px',
          overflowWrap: 'break-word',
         
        }}
      >
        {isMyMessage ? null : <span style={{ width: 0 }}></span>}
        <p className=''>{message.text}</p>
      </div>
    </div>
  );
};

export default Message;