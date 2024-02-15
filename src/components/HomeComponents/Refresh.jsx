import React from 'react';
import Interactify from '/src/assets/Interactify.png'


const Refresh = () => {
  return (
    <main className='flex flex-col bg-white justify-center items-center w-full h-screen'>
      <div className='flex flex-col items-center'>
        <img className='w-80 mb-4' src={Interactify} alt="Interactify Logo" />
      </div>
      <div className='flex absolute bottom-10'>
        <h1 className='font-bold text-5xl gradient-text'>Trendmedia</h1>
      </div>
    </main>
  );
};

export default Refresh;
