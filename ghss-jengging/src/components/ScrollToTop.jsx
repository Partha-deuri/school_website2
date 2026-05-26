import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the very top-left of the window instantly
    window.scrollTo(0, 0);
  }, [pathname]); // This triggers every time the URL path changes

  return null; // This component renders nothing to the screen
}