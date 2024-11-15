// LogoLayout.jsx
import React from 'react';
import Navbar from './components/Navbar';

function LogoLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default LogoLayout;
