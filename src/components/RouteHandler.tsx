import { useEffect } from 'react';

// This component handles route management at the browser level
export default function RouteHandler() {
  useEffect(() => {
    // Handle initial route on mount
    const handleInitialRoute = () => {
      const path = window.location.pathname;
      
      // List of legacy routes that should redirect to home
      const legacyRoutes = [
        '/preview_page.html',
        '/preview_page',
        '/index.html',
        '/main.html'
      ];
      
      if (legacyRoutes.includes(path)) {
        console.log(`RouteHandler: Redirecting from ${path} to /`);
        window.history.replaceState(null, '', '/');
        // Force a re-render by dispatching a popstate event
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
      }
      
      // Handle any .html files that might be accessed directly
      if (path.endsWith('.html') && !path.startsWith('/portfolio/')) {
        console.log(`RouteHandler: Redirecting .html route ${path} to /`);
        window.history.replaceState(null, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
      }
    };

    // Handle route on initial load
    handleInitialRoute();

    // Listen for popstate events (browser back/forward)
    const handlePopState = () => {
      handleInitialRoute();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return null; // This component doesn't render anything
}