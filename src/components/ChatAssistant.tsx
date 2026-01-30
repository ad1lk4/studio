'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User as UserIcon, LoaderCircle } from 'lucide-react';
import { getChatResponse } from '@/ai/flows/chatFlow';
import type { Message } from 'genkit/content';
import { cn } from '@/lib/utils';

type ChatMessage = {
    role: 'user' | 'model';
    text: string;
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage: ChatMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, newUserMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
        const history: Message[] = messages.map(msg => ({
            role: msg.role,
            content: [{ text: msg.text }]
        }));

        const responseText = await getChatResponse(history, currentInput);
        const newModelMessage: ChatMessage = { role: 'model', text: responseText };
        setMessages((prev) => [...prev, newModelMessage]);
    } catch (error) {
        console.error("Failed to get chat response:", error);
        const errorMessage: ChatMessage = { role: 'model', text: "Произошла ошибка. Пожалуйста, попробуйте еще раз." };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-8 w-8" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] flex flex-col h-[70vh] max-h-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <Bot />
                Ай-сұлу, ваш AI-помощник
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4 -mr-4" viewportRef={scrollAreaRef}>
             <div className="space-y-4 p-4">
                {messages.map((message, index) => (
                    <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {message.role === 'model' && <div className="p-2 rounded-full bg-secondary"><Bot className="w-5 h-5 shrink-0 text-secondary-foreground" /></div>}
                         <div className={cn("p-3 rounded-lg max-w-[85%]", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                         </div>
                        {message.role === 'user' && <div className="p-2 rounded-full bg-secondary"><UserIcon className="w-5 h-5 shrink-0 text-secondary-foreground" /></div>}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3 justify-start">
                        <div className="p-2 rounded-full bg-secondary"><Bot className="w-5 h-5 shrink-0 text-secondary-foreground" /></div>
                        <div className="p-3 rounded-lg bg-muted flex items-center">
                            <LoaderCircle className="w-5 h-5 animate-spin" />
                        </div>
                    </div>
                )}
             </div>
          </ScrollArea>
          <DialogFooter>
            <div className="flex w-full items-center space-x-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    placeholder="Спросите что-нибудь..."
                    disabled={isLoading}
                    autoComplete="off"
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
