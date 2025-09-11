"use client";

import { useState, useEffect } from 'react';

const SIDEBAR_COOKIE_NAME = "sidebar:state";

/**
 * Hook to read the sidebar state from cookies on the client side
 * @returns object with sidebarOpen state and isLoading flag
 */
export function useSidebarState() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to true
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Read from cookie on client side
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const sidebarCookie = cookies.find(cookie => 
        cookie.trim().startsWith(`${SIDEBAR_COOKIE_NAME}=`)
      );
      
      if (sidebarCookie) {
        const value = sidebarCookie.split('=')[1]?.trim();
        const isOpen = value === 'true';
        
        // Debug logging (remove in production)
        if (process.env.NODE_ENV === 'development') {
          console.log('Sidebar cookie value:', value, '-> isOpen:', isOpen);
        }
        
        setSidebarOpen(isOpen);
      } else if (process.env.NODE_ENV === 'development') {
        console.log('No sidebar cookie found, using default (true)');
      }
      
      setIsLoading(false);
    }
  }, []);
  
  // Return the state directly for simpler usage
  // If still loading, return the default (true) to prevent layout shift
  return isLoading ? true : sidebarOpen;
}