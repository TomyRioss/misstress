'use client';

import Chat from '@/components/Chat';

export default function ChatPage() {
  return (
    <div className="min-h-screen pt-16 lg:pt-8">
      <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)]">
        <Chat />
      </div>
    </div>
  );
}
