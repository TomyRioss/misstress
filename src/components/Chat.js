'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

export default function Chat() {
  const [messages, setMessages] = useState([]); // { role: 'user' | 'assistant', content: string }
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showHistory, setShowHistory] = useState(true);
  const listRef = useRef(null);

  // Cargar historial del localStorage al iniciar
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Guardar historial en localStorage cuando cambie
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  useEffect(() => {
    // Scroll to bottom when new message arrives
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }

      const data = await res.json();
      const assistantMessage = {
        role: 'assistant',
        content:
          typeof data.reply === 'string'
            ? data.reply
            : JSON.stringify(data.reply),
        isError: data.error || false,
        isFallback: data.fallback || false,
      };
      setMessages(prev => {
        const newMessages = [...prev, assistantMessage];
        // Auto-guardar la conversación después de cada respuesta
        saveCurrentChat(newMessages);
        return newMessages;
      });
    } catch (err) {
      console.error('Error en el chat:', err);
      const errorMessage = {
        role: 'assistant',
        content:
          'Lo siento, hubo un error al procesar tu mensaje. Inténtalo de nuevo.',
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Funciones para el historial de chats
  const saveCurrentChat = (currentMessages = messages) => {
    if (currentMessages.length === 0) return;

    const chatData = {
      id: currentChatId || Date.now().toString(),
      messages: currentMessages,
      title: getChatTitle(currentMessages),
      lastMessage: new Date().toISOString(),
    };

    setChatHistory(prev => {
      const existingIndex = prev.findIndex(chat => chat.id === chatData.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = chatData;
        return updated;
      } else {
        return [chatData, ...prev].slice(0, 20); // Limitar a 20 chats
      }
    });

    if (!currentChatId) {
      setCurrentChatId(chatData.id);
    }
  };

  const getChat = id => {
    return chatHistory.find(chat => chat.id === id);
  };

  const getMessagesFromChat = chatId => {
    const chat = chatHistory.find(c => c.id === chatId);
    return chat ? chat.messages : [];
  };

  const getLastUserMessage = messages => {
    const userMessages = messages.filter(m => m.role === 'user');
    return userMessages.length > 0
      ? userMessages[userMessages.length - 1].content
      : '';
  };

  const getLastAssistantMessage = messages => {
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    return assistantMessages.length > 0
      ? assistantMessages[assistantMessages.length - 1].content
      : '';
  };

  const formatMessagePreview = content => {
    if (typeof content !== 'string') return 'Mensaje sin contenido';
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  };

  const getTimeLabel = timestamp => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('es');
  };

  const getUniqueMessage = messages => {
    const userMessage = getLastUserMessage(messages);
    const assistantMessage = getLastAssistantMessage(messages);
    return userMessage || assistantMessage || 'Chat vacío';
  };

  const getColorByType = message => {
    if (message.isError) return 'text-red-600';
    if (message.isFallback) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getScaledMessage = messages => {
    if (messages.length === 0) return 'Nuevo chat';
    const firstUserMsg = messages.find(m => m.role === 'user');
    return firstUserMsg
      ? formatMessagePreview(firstUserMsg.content)
      : 'Chat iniciado';
  };

  const getChatIcon = messages => {
    if (messages.length === 0) return '💬';
    const hasError = messages.some(m => m.isError);
    const hasFallback = messages.some(m => m.isFallback);
    if (hasError) return '⚠️';
    if (hasFallback) return '🤖';
    return '✨';
  };

  const getChatTitle = messages => {
    if (messages.length === 0) return 'Nuevo chat';
    const firstUserMsg = messages.find(m => m.role === 'user');
    return firstUserMsg
      ? formatMessagePreview(firstUserMsg.content)
      : 'Chat iniciado';
  };

  const loadChat = chatId => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
    }
  };

  const deleteChat = chatId => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));

    if (currentChatId === chatId) {
      setMessages([]);
      setCurrentChatId(null);
    }

    toast.success('Chat eliminado');
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-neutral-900">
      {/* Chat Principal - Más Amplio */}
      <div
        className={`flex flex-col ${
          showHistory ? 'flex-1' : 'w-full'
        } border-r border-gray-200 dark:border-neutral-700`}
      >
        {/* Header del Chat */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              🤖 Asistente Financiero
            </h2>
            {currentChatId && (
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-neutral-700 px-2 py-1 rounded-full">
                Chat activo
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={startNewChat}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ➕ Nuevo Chat
            </button>
            <button
              onClick={toggleHistory}
              className="px-3 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              {showHistory ? '👈 Ocultar' : '👉 Historial'}
            </button>
          </div>
        </div>

        {/* Área de Mensajes */}
        <div
          ref={listRef}
          className="flex-1 p-6 space-y-4 overflow-y-auto bg-white dark:bg-neutral-900"
        >
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                ¡Hola! Soy tu asistente financiero
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Puedo ayudarte con gastos, presupuesto, categorías y análisis de
                tus finanzas. ¡Pregúntame cualquier cosa!
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : msg.isError
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-l-4 border-red-500'
                    : msg.isFallback
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-l-4 border-yellow-400'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-bl-sm'
                }`}
              >
                {msg.role === 'assistant' && msg.isError && (
                  <div className="flex items-center mb-2">
                    <span className="text-red-500 mr-1">⚠️</span>
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Error
                    </span>
                  </div>
                )}
                {msg.role === 'assistant' && msg.isFallback && (
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 mr-1">🤖</span>
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                      Asistente Local
                    </span>
                  </div>
                )}
                <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0">
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown
                      components={{
                        // Personalizar elementos específicos
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-4 mb-2">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-4 mb-2">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="mb-1">{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic">{children}</em>
                        ),
                        code: ({ children }) => (
                          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto mb-2">
                            {children}
                          </pre>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-lg font-bold mb-2">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-base font-bold mb-2">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-bold mb-1">{children}</h3>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic mb-2">
                            {children}
                          </blockquote>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {children}
                          </a>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto mb-2">
                            <table className="min-w-full text-xs border-collapse border border-gray-300 dark:border-gray-600">
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-gray-100 dark:bg-gray-700">
                            {children}
                          </thead>
                        ),
                        tbody: ({ children }) => <tbody>{children}</tbody>,
                        tr: ({ children }) => (
                          <tr className="border-b border-gray-200 dark:border-gray-600">
                            {children}
                          </tr>
                        ),
                        td: ({ children }) => (
                          <td className="px-2 py-1 border border-gray-300 dark:border-gray-600">
                            {children}
                          </td>
                        ),
                        th: ({ children }) => (
                          <th className="px-2 py-1 border border-gray-300 dark:border-gray-600 font-semibold">
                            {children}
                          </th>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-neutral-800 p-3 rounded-lg text-sm max-w-[70%]">
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse">🤖</div>
                  <span>Escribiendo...</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Mejorado */}
        <div className="p-4 border-t border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                className="w-full resize-none p-3 rounded-lg border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white text-sm max-h-32"
                placeholder="Escribe tu mensaje aquí... (Presiona Enter para enviar)"
                style={{
                  minHeight: '44px',
                  scrollbarWidth: 'thin',
                }}
              />
            </div>
            <button
              onClick={handleSend}
              className="px-6 py-3 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-1">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Enviando</span>
                </div>
              ) : (
                '📤 Enviar'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Panel de Historial */}
      {showHistory && (
        <div className="w-80 bg-gray-50 dark:bg-neutral-800 border-l border-gray-200 dark:border-neutral-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              📚 Historial de Chats
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {chatHistory.length} conversaciones guardadas
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chatHistory.length === 0 ? (
              <div className="p-4 text-center">
                <div className="text-4xl mb-2">💭</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No hay chats guardados aún
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {chatHistory.map(chat => (
                  <div
                    key={chat.id}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                      currentChatId === chat.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
                        : 'hover:bg-gray-100 dark:hover:bg-neutral-700'
                    }`}
                    onClick={() => loadChat(chat.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm">
                            {getChatIcon(chat.messages)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {getTimeLabel(chat.lastMessage)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {getChatTitle(chat.messages)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                          {chat.messages.length} mensajes
                        </p>
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-1"
                        title="Eliminar chat"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
