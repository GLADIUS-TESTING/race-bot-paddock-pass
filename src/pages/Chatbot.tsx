
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Info, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { getGroqResponse } from "@/utils/groqApi";

interface Message {
  text: string;
  sender: "user" | "bot";
  timestamp: number;
}

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! I'm your motorsport expert assistant. Ask me anything about racing, championships, drivers, or how to get started in motorsports!",
      sender: "bot",
      timestamp: Date.now()
    }
  ]);
  const [apiKey, setApiKey] = useState("");
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "RacePulse - Motorsport Chatbot";
    scrollToBottom();
    
    // Check if API key exists in localStorage
    const storedApiKey = localStorage.getItem('groq_api_key');
    if (storedApiKey) {
      setIsApiKeySet(true);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      text: input,
      sender: "user",
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get response from Groq API
      const answer = await getGroqResponse(input);
      
      // Add bot response
      const botMessage: Message = {
        text: answer,
        sender: "bot",
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      // Add error message
      const errorMessage: Message = {
        text: "Sorry, I encountered an error. Please try again later.",
        sender: "bot",
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = () => {
    if (apiKey.trim() === "") {
      toast.error("Please enter a valid API key");
      return;
    }
    
    localStorage.setItem('groq_api_key', apiKey);
    setIsApiKeySet(true);
    setApiKey("");
    toast.success("API key saved successfully");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bot className="h-6 w-6 text-racing-red" />
              Motorsport Expert Chatbot
            </h1>
            
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chatbot Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">Groq API Key</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        placeholder="Enter your Groq API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Your API key is stored locally in your browser and never sent to our servers.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={saveApiKey}>Save Settings</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      This chatbot uses the Groq AI API. You'll need to provide your API key in the settings.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <Card className="border-racing-gray/20">
            <CardContent className="p-0">
              {/* Chat messages */}
              <div className="h-[60vh] overflow-y-auto p-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === "user"
                          ? "bg-racing-red text-white"
                          : "bg-gray-100 dark:bg-racing-gray/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.sender === "bot" ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <span className="font-semibold">
                          {msg.sender === "user" ? "You" : "RacePulse Bot"}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-gray-100 dark:bg-racing-gray/20 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <span className="font-semibold">RacePulse Bot</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-racing-red rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-racing-red rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-racing-red rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input area */}
              <div className="border-t p-4">
                {!isApiKeySet ? (
                  <div className="text-center p-4">
                    <p className="mb-3">Please set your Groq API key in the settings to start chatting.</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Set API Key</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Chatbot Settings</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="apiKeyModal">Groq API Key</Label>
                            <Input
                              id="apiKeyModal"
                              type="password"
                              placeholder="Enter your Groq API key"
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Get your API key from <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Groq Console</a>.
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={saveApiKey}>Save Settings</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                      placeholder="Ask about F1, MotoGP, or how to start racing..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button type="submit" className="bg-racing-red hover:bg-racing-red/90" disabled={isLoading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                )}
                {isApiKeySet && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">
                      Try asking: "What is Formula 1?" or "How do I get started in karting?"
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Chatbot;
