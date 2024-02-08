import React from 'react';
import Chat_app from './Chat_app';
import SendMessage from './SendMessage';

const Main_chat = () => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-screen'>
      <div className='flex flex-col w-full max-w-[700px] h-screen overflow-hidden'>
        <div className='flex flex-col h-full w-full'>
          <div className='flex flex-col h-full overflow-y-auto'>
            <Chat_app />
          </div>
          <div className='flex'>
             <SendMessage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main_chat;

