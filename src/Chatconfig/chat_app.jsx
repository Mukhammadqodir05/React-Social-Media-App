import React, { useState, useEffect, useRef } from 'react';
import Message from './message';
import { auth,db } from '../firebase';
import { collection, orderBy, query, onSnapshot, doc, deleteDoc } from 'firebase/firestore';


const Chat_app = () => {
  const [messages, setMessages] = useState([]);
  const scroll = useRef();

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe();
  }, []);


  const handleDelete = (id) => {
    deleteDoc(doc(db, 'messages', id));
  };

  useEffect(() => {
    if(scroll.current){
      scroll.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages])

  return (
    <div className="overflow-y-auto ">
      <div className='px-4 py-2'>
        {messages &&
          messages.map((message) => (
            <div key={message.id}>
              <button onClick={() => handleDelete(message.id)}>Delete</button>
              <Message message={message} />
            </div>
          ))}
      </div>
      <span ref={scroll}></span>
    </div>
  );
};

export default Chat_app;