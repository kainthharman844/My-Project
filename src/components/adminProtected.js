'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRouteProtect({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Check if admin info exists in localStorage
    const adminInfo = localStorage.getItem('adminInfo');
    if (!adminInfo) {
      // Not logged in, redirect to login
      router.replace('/pages/admin-login'); // Adjust path if your login page is different
    }
  }, [router]);

  // Optionally, you can add a loading state here if you want
  return children;
}