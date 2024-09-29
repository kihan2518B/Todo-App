"use client"
import { UserButton, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  // Redirect to sign-in if not authenticated
  if (isLoaded && !userId) {
    router.push('/signin');
    return <div>Redirecting...</div>;
  }

  return (
    <div>
      <h1>Welcome to the Todo App</h1>
      <UserButton />
    </div>
  );
}
