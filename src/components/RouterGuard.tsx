import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface RouterGuardProps {
  children: React.ReactNode;
}

const LEGACY_ROUTES = [
  '/preview_page.html',
  '/preview_page',
  '/index.html',
  '/main.html'
];

export default function RouterGuard({ children }: RouterGuardProps) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle legacy routes that should redirect to home
    if (LEGACY_ROUTES.includes(location.pathname)) {
      console.log(`Redirecting from legacy route: ${location.pathname} to /`);
      navigate('/', { replace: true });
      return;
    }

    // Handle any .html routes that shouldn't exist in the SPA
    if (location.pathname.endsWith('.html') && !location.pathname.startsWith('/portfolio/')) {
      console.log(`Redirecting from .html route: ${location.pathname} to /`);
      navigate('/', { replace: true });
      return;
    }
  }, [location.pathname, navigate]);

  return <>{children}</>;
}