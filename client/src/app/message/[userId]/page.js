'use client';

import dynamic from 'next/dynamic';

const ChatApp = dynamic(() => import('./ChatApp.jsx'), { ssr: false });
export default function ChatPage() {
  return <ChatApp />;
}
