import React from 'react';

const Header = () => {
    return (
        <header>
            <div className="brand-logo">
                <img src="/textures/logo.png" alt="BCOP Logo" />
            </div>
            <div className="header-content">
                <h1>BEEF</h1>
                <p className="subtitle">Convert your Image to Bloxd blocks</p>
            </div>
        </header>
    );
};

export default Header;