
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
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

const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleMinimize = () => setIsMinimized((prev) => !prev);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

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

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative animate-float">
          <div className="absolute bottom-full right-0 mb-4 w-52 bg-white p-3 rounded-lg shadow-lg text-center text-sm text-ocean-800 -mr-2">
            <p className="font-semibold">Ask Octopus Ollie anything about the ocean！ 🌊</p>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white transform rotate-45 -z-10"></div>
          </div>
          <Button
            onClick={toggleMinimize}
            className="rounded-full w-20 h-20 bg-cyan-600 hover:bg-cyan-700 p-0 flex items-center justify-center shadow-2xl"
            aria-label="Open chat"
          >
            <OctopusAvatar size={64} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-ocean-800 border-2 border-cyan-500 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
      <ChatHeader onMinimize={toggleMinimize} />

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 flex items-center justify-center mr-2 mt-1">
                {/* Show octopus for typing - reuse octopus avatar */}
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
  );
};

export default ChatAssistant;
