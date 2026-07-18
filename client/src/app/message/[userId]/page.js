'use client';

// Load the chat app without server-side rendering.
import dynamic from 'next/dynamic';

const ChatApp = dynamic(() => import('./ChatApp.jsx'), { ssr: false });
// Render the dynamic chat page wrapper.
export default function ChatPage() {
  return <ChatApp />;
}
