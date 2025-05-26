
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Drawer, 
  DrawerTrigger, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerFooter, 
  DrawerClose 
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now().toString() + '_user', sender: 'user', text: inputValue.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('Invoking chat-assistant function with prompt:', currentInput);
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: { prompt: currentInput }, // Use currentInput instead of userMessage.text to ensure it's the value before clearing
      });
      console.log('Function response data:', data);
      console.log('Function response error:', error);


      if (error) {
        throw error;
      }

      if (data && data.response) {
        const aiMessage: Message = { id: Date.now().toString() + '_ai', sender: 'ai', text: data.response };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else if (data && data.error) {
        const aiErrorMessage: Message = { id: Date.now().toString() + '_ai_error', sender: 'ai', text: `Assistant Error: ${data.error}` };
        setMessages((prevMessages) => [...prevMessages, aiErrorMessage]);
      } else {
         const aiErrorMessage: Message = { id: Date.now().toString() + '_ai_unknown', sender: 'ai', text: "Sorry, I received an unexpected response. Please try again." };
        setMessages((prevMessages) => [...prevMessages, aiErrorMessage]);
      }
    } catch (err: any) {
      console.error('Failed to send message to Supabase function:', err);
      const aiErrorMessage: Message = { id: Date.now().toString() + '_ai_catch', sender: 'ai', text: `Connection Error: ${err.message || 'Could not connect to the assistant.'}` };
      setMessages((prevMessages) => [...prevMessages, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: 'initial_greeting', sender: 'ai', text: "Hello! I'm DiveAtlas assistant. How can I help you explore the underwater world today?" }]);
    }
  }, [isOpen]);


  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-seagreen-600 hover:bg-seagreen-700 text-white shadow-lg z-[100] border-none"
            aria-label="Open Chat Assistant"
            onClick={() => setIsOpen(true)}
          >
            <MessageSquare className="h-7 w-7" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[80vh] bg-ocean-900 border-ocean-700 text-white z-[110]">
          <div className="mx-auto w-full max-w-md flex flex-col h-full">
            <DrawerHeader className="flex justify-between items-center p-4 border-b border-ocean-700">
              <DrawerTitle className="text-lg font-semibold text-white flex items-center">
                <Bot className="mr-2 h-5 w-5 text-seagreen-400" /> DiveAtlas Assistant
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="text-ocean-300 hover:text-white">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <ScrollArea className="flex-grow p-4" viewportRef={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex mb-2 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm shadow ${
                        msg.sender === 'user'
                          ? 'bg-seagreen-600 text-white ml-auto'
                          : 'bg-ocean-800 text-ocean-100 mr-auto'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start mb-2">
                    <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm shadow bg-ocean-800 text-ocean-100 mr-auto flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <DrawerFooter className="p-4 border-t border-ocean-700 bg-ocean-900">
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
                  placeholder="Ask about diving..."
                  className="flex-grow bg-ocean-800 border-ocean-600 text-white placeholder-ocean-400 focus:ring-seagreen-500 focus:border-seagreen-500"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <Button type="submit" className="bg-seagreen-600 hover:bg-seagreen-700 text-white" disabled={isLoading || inputValue.trim() === ''}>
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ChatAssistant;
