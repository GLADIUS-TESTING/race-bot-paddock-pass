
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";

// Map of frequently asked questions and their detailed answers
const faqAnswers: Record<string, string> = {
  "formula 1": "Formula 1 (F1) is the highest class of international racing for open-wheel single-seater formula racing cars. The 'formula' in the name refers to the set of rules that all participants' cars must meet. F1 races, or Grands Prix, are held worldwide on both purpose-built circuits and closed public roads. The F1 season consists of a series of races, with points awarded based on finishing positions to determine two annual championships—one for drivers and one for constructors (teams).",
  "f1": "Formula 1 (F1) is the highest class of international racing for open-wheel single-seater formula racing cars. The 'formula' in the name refers to the set of rules that all participants' cars must meet. F1 races, or Grands Prix, are held worldwide on both purpose-built circuits and closed public roads. The F1 season consists of a series of races, with points awarded based on finishing positions to determine two annual championships—one for drivers and one for constructors (teams).",
  "greatest f1 driver": "The debate over the greatest F1 driver of all time is highly subjective. Lewis Hamilton and Michael Schumacher share the record for most World Championships (7). Hamilton holds records for most wins, pole positions, and podium finishes. Other legendary drivers include Ayrton Senna, known for his raw speed, Juan Manuel Fangio, who won 5 championships in the 1950s, Alain Prost for his calculated driving style, and more recently, Max Verstappen for his aggressive racecraft. The 'greatest' often depends on which qualities—such as raw speed, consistency, adaptability, or championships won—one values most.",
  "karting": "To get started in karting: 1) Visit local kart tracks to watch races and talk to competitors. 2) Take a karting lesson or enroll in a karting school to learn basics. 3) Purchase appropriate safety gear (helmet, suit, gloves, etc.). 4) Consider renting karts initially before investing in your own. 5) Join a local club and participate in club races to gain experience. 6) As you improve, explore regional and national competitions. Karting is the traditional first step into motorsport, with many F1 drivers starting as young as 5-8 years old in karts.",
  "indycar": "IndyCar is the premier open-wheel racing series in North America. The cars feature a standard Dallara chassis with engines from either Honda or Chevrolet. IndyCar races on a mix of oval tracks, road courses, and street circuits, with the Indianapolis 500 being its most prestigious event. The series emphasizes driver skill with more standardized equipment than Formula 1, often resulting in closer competition.",
  "f1 vs indycar": "F1 and IndyCar differ in several key ways: 1) Cars: F1 cars are built by individual teams with unique designs, while IndyCar uses a spec chassis with limited customization. 2) Tracks: F1 races primarily on road/street courses, while IndyCar races on a mix of ovals, road courses, and street circuits. 3) Technology: F1 features more advanced aerodynamics and hybrid technology. 4) Speed: On straights, IndyCars can be faster, but F1 cars are quicker around corners. 5) Competition: IndyCar tends to have more varied winners due to standardized equipment, while F1 often sees dominance by top teams. 6) Cost: F1 teams spend hundreds of millions annually, whereas IndyCar operates on a fraction of that budget.",
  "motogp": "MotoGP is the premier class of motorcycle road racing events, featuring the most advanced and fastest motorcycles specifically built for racing. It features 1000cc prototypes that are not available for purchase and cannot be legally ridden on public roads. The championship consists of a series of Grand Prix events on circuits around the world, with riders competing for both individual and constructor titles.",
  "wec": "The World Endurance Championship (WEC) is a series of long-distance sports car races, with the famous 24 Hours of Le Mans as its centerpiece. Cars compete in different classes simultaneously on the same track: Hypercars (top class), LMP2 (prototype class), and LMGT3 (production-based cars). Races typically last 6, 8, or 24 hours, with teams of drivers taking turns at the wheel. The championship tests both speed and reliability of cars and endurance of drivers.",
  "formula e": "Formula E is an all-electric single-seater racing championship. Launched in 2014, it features races (called E-Prix) primarily on temporary street circuits in major cities worldwide. The series promotes electric vehicle technology and sustainability. Formula E cars have a distinctive design with a maximum power output of 250kW (approximately 335hp) and can reach speeds of up to 280 km/h (174 mph).",
  "nascar": "NASCAR (National Association for Stock Car Auto Racing) is an American stock car racing series known for its high-speed oval track racing. It features purpose-built race cars with a stock car appearance. NASCAR's premier division is the Cup Series, with races typically consisting of 400-500 miles on oval tracks. The sport is known for its close racing, drafting techniques, and strategic pit stops.",
  "wrc": "The World Rally Championship (WRC) is the premier international rally racing series. Unlike circuit racing, rally drivers compete on stages of public or private roads closed for the event, with various surfaces including gravel, tarmac, snow, and ice. Drivers race against the clock rather than directly against each other, with a co-driver providing pace notes. The championship features different classes of cars, with the top Rally1 category featuring hybrid powertrains.",
  "dtm": "DTM (Deutsche Tourenwagen Masters) is a German touring car series featuring production-based race cars. Originally exclusively German, it has expanded to include international events. Since 2021, DTM has used GT3 cars, which are based on production sports cars but heavily modified for racing. The series is known for close racing and high levels of manufacturer involvement.",
};

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "RacePulse - Motorsport Chatbot";
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const findBestAnswer = (question: string): string => {
    // Convert input to lowercase for case-insensitive matching
    const lowerQuestion = question.toLowerCase();
    
    // Check for direct matches in our FAQ database
    for (const [key, answer] of Object.entries(faqAnswers)) {
      if (lowerQuestion.includes(key)) {
        return answer;
      }
    }
    
    // Check for question types
    if (lowerQuestion.includes("how") && lowerQuestion.includes("start")) {
      return faqAnswers["karting"];
    }
    
    if (lowerQuestion.includes("best") || lowerQuestion.includes("greatest")) {
      if (lowerQuestion.includes("driver") || lowerQuestion.includes("racer")) {
        return faqAnswers["greatest f1 driver"];
      }
    }
    
    if (lowerQuestion.includes("difference") || lowerQuestion.includes("vs") || lowerQuestion.includes("versus")) {
      if ((lowerQuestion.includes("f1") || lowerQuestion.includes("formula 1")) && lowerQuestion.includes("indycar")) {
        return faqAnswers["f1 vs indycar"];
      }
    }
    
    // Default response if no match is found
    return "I don't have specific information about that yet. Please try asking about Formula 1, MotoGP, IndyCar, WEC, Formula E, NASCAR, WRC, or DTM. You can also ask about karting or the differences between racing series.";
  };

  const handleSend = (e: React.FormEvent) => {
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

    // Find the best answer for the user's question
    const answer = findBestAnswer(input);
    
    // Add bot response after a short delay to simulate thinking
    setTimeout(() => {
      const botMessage: Message = {
        text: answer,
        sender: "bot",
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 800);
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
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Ask me anything about motorsports, from F1 and MotoGP to getting started in racing!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input area */}
              <div className="border-t p-4">
                <form onSubmit={handleSend} className="flex gap-2">
                  <Input
                    placeholder="Ask about F1, MotoGP, or how to start racing..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" className="bg-racing-red hover:bg-racing-red/90">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground">
                    Try asking: "What is Formula 1?" or "How do I get started in karting?"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Chatbot;
