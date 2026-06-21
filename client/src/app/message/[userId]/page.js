'use client';

import dynamic from 'next/dynamic';

const ChatApp = dynamic(() => import('./ChapApp.jsx'), { ssr: false });
export default function ChatPage() {
  return <ChatApp />;
}
