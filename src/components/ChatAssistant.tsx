import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const OctopusAvatar = () => (
  <div className="w-12 h-12 flex items-center justify-center">
    <img
      src="/lovable-uploads/37109d82-72ca-42ab-82e2-b91042823a05.png"
      alt="Cute Octopus"
      className="w-11 h-11 object-contain rounded-full bg-transparent"
      draggable={false}
    />
  </div>
);

const sampleQuestions = [
  "What are the best diving spots for beginners?",
  "Tell me about marine life in the Great Barrier Reef",
  "What diving certification do I need?",
  "Best time to dive in the Maldives?",
  "How deep can I dive with Open Water certification?"
];

const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    if (!messageText) setInputValue('');
    setIsLoading(true);

    try {
      console.log('Invoking chat-assistant function with prompt:', textToSend);
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: { prompt: textToSend },
      });
      console.log('Function response data:', data);
      console.log('Function response error:', error);

      if (error) {
        throw error;
      }

      if (data && data.response) {
        const aiMessage: Message = { 
          id: Date.now().toString() + '_ai', 
          sender: 'ai', 
          text: data.response 
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else if (data && data.error) {
        const aiErrorMessage: Message = { 
          id: Date.now().toString() + '_ai_error', 
          sender: 'ai', 
          text: `Assistant Error: ${data.error}` 
        };
        setMessages((prevMessages) => [...prevMessages, aiErrorMessage]);
      } else {
        const aiErrorMessage: Message = { 
          id: Date.now().toString() + '_ai_unknown', 
          sender: 'ai', 
          text: "Sorry, I received an unexpected response. Please try again." 
        };
        setMessages((prevMessages) => [...prevMessages, aiErrorMessage]);
      }
    } catch (err: any) {
      console.error('Failed to send message to Supabase function:', err);
      const aiErrorMessage: Message = { 
        id: Date.now().toString() + '_ai_catch', 
        sender: 'ai', 
        text: `Connection Error: ${err.message || 'Could not connect to the assistant.'}` 
      };
      setMessages((prevMessages) => [...prevMessages, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuestionClick = (question: string) => {
    handleSendMessage(question);
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

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-ocean-800 border-2 border-cyan-500 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-ocean-600 to-ocean-700 p-4 border-b border-cyan-500">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/30">
            <OctopusAvatar />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Ollie</h3>
            <p className="text-cyan-200 text-sm">Your diving companion</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 relative flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                  {/* Smaller version of octopus for messages */}
                  <div className="w-6 h-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full relative border border-blue-700">
                    <div className="absolute top-1 left-1">
                      <div className="w-1 h-1 bg-white rounded-full">
                        <div className="w-0.5 h-0.5 bg-slate-800 rounded-full"></div>
                      </div>
                    </div>
                    <div className="absolute top-1 right-1">
                      <div className="w-1 h-1 bg-white rounded-full">
                        <div className="w-0.5 h-0.5 bg-slate-800 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                    <div className="w-0.5 h-2 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full"></div>
                    <div className="w-0.5 h-1.5 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full"></div>
                    <div className="w-0.5 h-2 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full"></div>
                  </div>
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-lg ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-ocean-800 text-ocean-100 border border-ocean-700'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 relative flex items-center justify-center mr-2 mt-1">
                <div className="w-6 h-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full relative border border-blue-700">
                  <div className="absolute top-1 left-1">
                    <div className="w-1 h-1 bg-white rounded-full">
                      <div className="w-0.5 h-0.5 bg-slate-800 rounded-full"></div>
                    </div>
                  </div>
                  <div className="absolute top-1 right-1">
                    <div className="w-1 h-1 bg-white rounded-full">
                      <div className="w-0.5 h-0.5 bg-slate-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                  <div className="w-0.5 h-2 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full"></div>
                  <div className="w-0.5 h-1.5 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full"></div>
                  <div className="w-0.5 h-2 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full"></div>
                </div>
              </div>
              <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-lg bg-ocean-800 text-ocean-100 border border-ocean-700 flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ollie is thinking...
              </div>
            </div>
          )}

          {/* Sample Questions - Show only when no user messages yet */}
          {messages.length === 1 && messages[0].id === 'welcome' && (
            <div className="mt-4">
              <p className="text-ocean-300 text-sm mb-3 text-center">Try asking me about:</p>
              <div className="space-y-2">
                {sampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleQuestionClick(question)}
                    className="w-full text-left p-3 rounded-xl bg-ocean-800/50 border border-ocean-700 text-ocean-200 hover:bg-ocean-700/50 hover:border-cyan-600 transition-all duration-200 text-sm"
                    disabled={isLoading}
                  >
                    💭 {question}
                  </button>
                ))}
              </div>
            </div>
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
