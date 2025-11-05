import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIChatBox, Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

/**
 * Floating AI chatbot widget that appears on all pages
 * Provides customer assistance for the Sakshi platform
 */
export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: `You are Sakshi, a friendly AI assistant for the Sakshi platform. You help users understand:

1. **Triple Pricing System**: Every item can be purchased with sliding-scale money (pay what you can between min-max), seva tokens earned through volunteering, or requested completely free.

2. **Seva Token Economy**: Users earn 1 token per volunteer hour at the store, 2 tokens per completed repair at Repair Café, and tokens through swap events and workshops. Tokens expire after 1 year.

3. **Circular Economy Programs**:
   - Repair Café: Fix items, earn tokens, reduce waste
   - Swap Events: Exchange items without money
   - Upcycle Studio: Transform old items into new creations
   - Children's Free Zone: All kids' items are always free

4. **Shopping & Donating**: Browse unique, one-of-a-kind items with stories. Donate quality items for pickup and earn seva tokens.

5. **Silent Village**: Conscious living community for mindful residents
6. **Silent Retreats**: Meditation retreat bookings with scholarship options
7. **AI Meditation Assistant**: Personalized meditation guidance

Be warm, encouraging, and helpful. Use simple language. Emphasize the community impact and environmental benefits. Keep responses concise (2-3 paragraphs max).`,
    },
  ]);

  const chatMutation = trpc.ai.customerChat.useMutation({
    onSuccess: (response) => {
      const content = typeof response === 'string' ? response : JSON.stringify(response);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content,
        },
      ]);
    },
    onError: (error: any) => {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again in a moment, or contact us directly for assistance.",
        },
      ]);
    },
  });

  const handleSendMessage = (content: string) => {
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content },
    ];
    setMessages(newMessages);
    chatMutation.mutate({ messages: newMessages });
  };

  const suggestedPrompts = [
    "How does the triple pricing system work?",
    "How can I earn seva tokens?",
    "What is the Repair Café?",
    "Can I get items for free?",
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 size-14 rounded-full shadow-lg",
          "bg-gradient-to-br from-sage-green to-forest-green hover:from-forest-green hover:to-sage-green",
          "transition-all duration-300 hover:scale-110",
          isOpen && "scale-0 opacity-0"
        )}
        aria-label="Open chat assistant"
      >
        <MessageCircle className="size-6 text-white" />
      </Button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-4 duration-300">
          <div className="rounded-lg shadow-2xl border-2 border-sage-green/20 overflow-hidden bg-warm-cream">
            {/* Header */}
            <div className="bg-gradient-to-r from-sage-green to-forest-green p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-comfortaa font-bold text-white">Sakshi Assistant</h3>
                  <p className="text-xs text-white/80">Here to help you! 🌿</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 size-8"
                aria-label="Close chat"
              >
                <X className="size-5" />
              </Button>
            </div>

            {/* Chat Content */}
            <AIChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={chatMutation.isPending}
              placeholder="Ask me anything..."
              height="500px"
              emptyStateMessage="Hi! I'm Sakshi, your AI assistant. How can I help you today?"
              suggestedPrompts={suggestedPrompts}
              className="border-0 rounded-none shadow-none bg-warm-cream"
            />
          </div>
        </div>
      )}
    </>
  );
}
