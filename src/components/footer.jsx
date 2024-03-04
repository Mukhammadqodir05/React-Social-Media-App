import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-nav">
          <ul className='flex gap-5 text-gray-400'>
            <li><a>Home</a></li>
            <li><a>About Us</a></li>
            <li><a>Career</a></li>
            <li><a>Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="flex font-medium">
        <p>&copy; 2024 Trendmedia. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
