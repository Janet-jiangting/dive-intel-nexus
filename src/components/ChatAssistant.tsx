
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Draggable from 'react-draggable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Minimize } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ChatHeader from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import SampleQuestions from './SampleQuestions';
import OctopusAvatar from './OctopusAvatar';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const sampleQuestions = [
  "What are the best diving spots for beginners?",
  "Tell me about marine life in the Great Barrier Reef",
  "What diving certification do I need?",
  "Best time to dive in the Maldives?",
  "How deep can I dive with Open Water certification?",
];

const CHAT_W = 384 + 32; // w-96 = 384px + 32px gap for safety
const CHAT_H = 600; // from className="h-[600px]"

const ChatAssistant = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [minimized, setMinimized] = useState(false);
  const [dragPosition, setDragPosition] = useState<{x: number, y: number} | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Calculate position based on actual content container
  const calculateIdealPosition = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Use Tailwind's container responsive breakpoints
    let containerMaxWidth = windowWidth;
    if (windowWidth >= 640) containerMaxWidth = 640; // sm
    if (windowWidth >= 768) containerMaxWidth = 768; // md
    if (windowWidth >= 1024) containerMaxWidth = 1024; // lg
    if (windowWidth >= 1280) containerMaxWidth = 1280; // xl
    if (windowWidth >= 1536) containerMaxWidth = 1400; // 2xl (custom max-width)
    
    // Container padding matches the px-4 class (16px on each side)
    const containerPadding = 16;
    const actualContainerWidth = Math.min(containerMaxWidth, windowWidth - containerPadding * 2);
    const containerLeft = (windowWidth - actualContainerWidth) / 2;
    const containerRight = containerLeft + actualContainerWidth;
    
    // Position close to content on the right
    const gapFromContainer = 16;
    const x = containerRight + gapFromContainer;
    
    // Vertically center in the viewport to align with the "middle" of the page content
    const y = (windowHeight - CHAT_H) / 2;
    
    // Ensure it doesn't go off screen
    const maxX = windowWidth - CHAT_W - 16;
    const finalX = Math.min(x, maxX);
    const finalY = Math.max(16, y);
    
    console.log('Position calculation (right, middle-aligned):', {
      windowWidth,
      windowHeight,
      containerRight,
      calculatedX: x,
      calculatedY: y,
      finalX,
      finalY
    });
    
    return { x: finalX, y: finalY };
  };

  // Determine if we should use ideal positioning
  const shouldUseIdealPosition = () => {
    return location.pathname === '/';
  };

  // Get position based on current route and state
  const getCurrentPosition = () => {
    if (shouldUseIdealPosition()) {
      return calculateIdealPosition();
    }
    return dragPosition || calculateIdealPosition();
  };

  // Reset position when navigating to main page
  useEffect(() => {
    if (shouldUseIdealPosition()) {
      // Small delay to ensure DOM is rendered
      const timer = setTimeout(() => {
        setDragPosition(null); // Reset drag position to trigger recalculation
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Handle window resize for responsive positioning
  useEffect(() => {
    const handleResize = () => {
      if (shouldUseIdealPosition()) {
        setDragPosition(null); // Reset to trigger recalculation
      }
    };

    const debouncedResize = setTimeout(handleResize, 150);
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(debouncedResize);
      window.removeEventListener('resize', handleResize);
    };
  }, [location.pathname]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (textToSend === '' || isLoading) return;

    const userMessage: Message = { 
      id: Date.now().toString() + '_user', 
      sender: 'user', 
      text: textToSend 
    };
    
    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: { prompt: textToSend },
      });

      if (error) throw error;

      if (data && data.response) {
        const aiMessage: Message = { 
          id: Date.now().toString() + '_ai', 
          sender: 'ai', 
          text: data.response 
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else if (data && data.error) {
        const aiErrorMessage: Message = { 
          id: Date.now().toString() + '_ai_error', 
          sender: 'ai', 
          text: `Assistant Error: ${data.error}` 
        };
        setMessages((prev) => [...prev, aiErrorMessage]);
      } else {
        const aiErrorMessage: Message = { 
          id: Date.now().toString() + '_ai_unknown', 
          sender: 'ai', 
          text: "Sorry, I received an unexpected response. Please try again." 
        };
        setMessages((prev) => [...prev, aiErrorMessage]);
      }
    } catch (err: any) {
      const aiErrorMessage: Message = { 
        id: Date.now().toString() + '_ai_catch', 
        sender: 'ai', 
        text: `Connection Error: ${err.message || 'Could not connect to the assistant.'}` 
      };
      setMessages((prev) => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with welcome message and sample questions
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { 
          id: 'welcome', 
          sender: 'ai', 
          text: "🌊 Hello! I'm Ollie, your DiveAtlas assistant! I'm here to help you explore the underwater world. Feel free to ask me anything about diving, marine life, or dive sites!" 
        }
      ]);
    }
  }, [messages.length]);

  const handleSampleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  // Handler for minimize button in header
  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMinimized(true);
  };

  // When minimized Ollie is clicked, restore to last position or ideal position
  const handleRestore = () => {
    setMinimized(false);
  };

  // Track drag position but respect ideal positioning on main page
  const onDrag = (_: any, data: {x:number, y:number}) => {
    setDragPosition({x: data.x, y: data.y});
  };

  // Get the current position to use
  const currentPosition = getCurrentPosition();

  // Render minimized view with draggable OctopusAvatar
  if (minimized) {
    return (
      <Draggable
        handle=".minimize-ollie-handle"
        position={dragPosition || currentPosition}
        onDrag={onDrag}
        bounds="body"
      >
        <div
          style={{
            position: "absolute",
            zIndex: 50,
            cursor: "pointer",
            width: 56,
            height: 56,
            background: "rgba(21, 101, 192, 0.94)", // ocean-800 with opacity
            borderRadius: "9999px",
            boxShadow: "0 6px 32px 0 rgba(0,0,0,0.19)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #22d3ee", // cyan-400
          }}
          className="minimize-ollie-handle select-none"
          onClick={handleRestore}
          title="Open Ollie"
        >
          <OctopusAvatar size={38} />
        </div>
      </Draggable>
    );
  }

  return (
    <Draggable
      handle=".chat-header-drag-handle"
      position={dragPosition || currentPosition}
      onDrag={onDrag}
      bounds="body"
    >
      <div
        className="z-50 w-96 h-[600px] bg-ocean-800 border-2 border-cyan-500 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {/* Add drag handle and Minimize button */}
        <div className="chat-header-drag-handle cursor-move select-none relative">
          {/* Main Header */}
          <ChatHeader />
          {/* Minimize button in top-right corner of header */}
          <button
            type="button"
            aria-label="Minimize"
            className="absolute right-3 top-3 bg-ocean-700/80 rounded-full p-1.5 text-ocean-100 hover:bg-cyan-600 hover:text-white transition-all"
            onClick={handleMinimize}
            tabIndex={0}
            style={{ zIndex: 10 }}
          >
            <Minimize size={18} />
          </button>
        </div>
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 flex items-center justify-center mr-2 mt-1">
                  <img
                    src="/lovable-uploads/37109d82-72ca-42ab-82e2-b91042823a05.png"
                    alt="Cute Octopus"
                    className="w-7 h-7 object-contain rounded-full bg-transparent"
                    draggable={false}
                  />
                </div>
                <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-lg bg-ocean-800 text-ocean-100 border border-ocean-700 flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ollie is thinking...
                </div>
              </div>
            )}
            {/* Sample Questions - Show only when no user messages yet */}
            {messages.length === 1 && messages[0].id === 'welcome' && (
              <SampleQuestions
                questions={sampleQuestions}
                onSelect={handleSampleQuestionClick}
                isLoading={isLoading}
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-ocean-700 bg-ocean-700/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Ollie about diving..."
              className="flex-grow bg-ocean-700/50 border-ocean-600 text-white placeholder-ocean-400 focus:ring-cyan-500 focus:border-cyan-500 rounded-xl"
              disabled={isLoading}
              autoComplete="off"
            />
            <Button 
              type="submit" 
              className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl px-4" 
              disabled={isLoading || inputValue.trim() === ''}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
        </div>
      </div>
    </Draggable>
  );
};

export default ChatAssistant;
