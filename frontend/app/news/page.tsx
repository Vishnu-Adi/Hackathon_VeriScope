'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push('/news/2b1e8dc7-236b-4047-9cf1-89917bfb28d2');
  }, [router]);

  return null; // Render nothing or a loading indicator while redirecting
}