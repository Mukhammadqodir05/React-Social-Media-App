import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { useUserData } from '../getUserData';
import { GrSend } from 'react-icons/gr';
import { HiEmojiHappy } from 'react-icons/hi';
import { MdAttachFile } from 'react-icons/md';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import EmojiRender from 'react-emoji-render';
import EmojiPicker from 'emoji-picker-react';

const SendMessage = () => {
  const [input, setInput] = useState('');
  const [fullName, setFullName] = useState('');
  const [uid, setUid] = useState('');
  const { userProfile } = useUserData();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInput = useRef(null);

  useEffect(() => {
    if (userProfile && userProfile.length > 0) {
      setFullName(userProfile[0].fullName);
      setUid(userProfile[0].uid);
    }
  }, [userProfile]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input === '') {
      return;
    }

    await addDoc(collection(db, 'messages'), {
      text: input,
      name: fullName,
      uid: uid,
      timestamp: serverTimestamp(),
    });
    setInput('');
  };

  const handleEmojiClick = (event, emojiObject) => {
    setInput(input + emojiObject.emoji);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setInput((prevInput) => prevInput + !`[${file.name}](${window.URL.createObjectURL(file)})`);
  };
  
  return (
    <main className='flex justify-end w-full max-w-[1000px] bg-white border-t border-gray-200'>
      <form onSubmit={sendMessage} className='flex w-full items-center p-4'>
        <input
          className='w-full h-12 px-4 py-2 rounded-full outline-none border border-gray-300 text-sm text-gray-800 placeholder-gray-500 focus:ring focus:ring-violet-400'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type='text'
          placeholder='Type your message...'
        />
        <button type='button' className='ml-3' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <HiEmojiHappy size={24} className='text-gray-500 cursor-pointer' />
        </button>
        <input
          type="file"
          id="file"
          ref={fileInput}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        <label htmlFor="file">
          <MdAttachFile size={24} className='text-gray-500 cursor-pointer' />
        </label>
        <button type='submit'>
          <GrSend size={24} className='text-violet-700 cursor-pointer' />
        </button>
      </form>
      {showEmojiPicker && (
        <div className='w-full'>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </main>
  );
};

export default SendMessage;

