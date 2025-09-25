import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  
  useEffect(() => {
    if (isMenuOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [isMenuOpen]);

  const navigation = [
    { name:'Home', href: '/'},
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/projects' },
    { name: 'Design Quotient', href: '/design-quotient' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const isActive = (href: string) => location.pathname === href;

  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="minimal-nav">
      <div className="container-minimal">
  <div className="flex justify-between items-center h-16 md:h-20 lg:h-24">
          <Link to="/" className="logo-text">
            RRA DESIGN ARCHITECTS
          </Link>

          {}
          <nav className="hidden lg:flex items-center space-x-16">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${
                  isActive(item.href) ? 'text-white border-b border-white/30 pb-1' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <div className="hamburger">
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
              </div>
            )}
          </button>
        </div>

        {}
        {isMenuOpen &&
          createPortal(
            <div className="mobile-menu z-[60]" onClick={() => setIsMenuOpen(false)}>
              {}
              <button
                aria-label="Close menu"
                className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
              >
                <X className="h-6 w-6" />
              </button>
              <div className="mobile-nav-links" onClick={(e) => e.stopPropagation()}>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="mobile-nav-link"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>,
            document.body
          )}
      </div>
    </header>
  );
};

export default Header;