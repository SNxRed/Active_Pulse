// LogoLayout.jsx
import React from 'react';
import Navbar from './components/Navbar';

function LogoLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default LogoLayout;
