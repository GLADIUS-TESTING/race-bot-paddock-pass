
import { useState, useEffect } from "react";
import { Flag, ChevronDown, ChevronUp, Clock, Trophy, ArrowDownUp, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

// Sample race data
const raceSessions = ["Practice 1", "Practice 2", "Practice 3", "Qualifying", "Race"];

// Sample driver data
const drivers = [
  { pos: 1, num: 1, driver: "Max Verstappen", team: "Red Bull Racing", time: "1:34.567", gap: "+0.000", interval: "+0.000", laps: 42, status: "Running" },
  { pos: 2, num: 11, driver: "Sergio Perez", team: "Red Bull Racing", time: "1:34.789", gap: "+0.222", interval: "+0.222", laps: 42, status: "Running" },
  { pos: 3, num: 44, driver: "Lewis Hamilton", team: "Mercedes", time: "1:34.901", gap: "+0.334", interval: "+0.112", laps: 42, status: "Running" },
  { pos: 4, num: 63, driver: "George Russell", team: "Mercedes", time: "1:35.012", gap: "+0.445", interval: "+0.111", laps: 42, status: "Running" },
  { pos: 5, num: 16, driver: "Charles Leclerc", team: "Ferrari", time: "1:35.045", gap: "+0.478", interval: "+0.033", laps: 42, status: "Running" },
  { pos: 6, num: 55, driver: "Carlos Sainz", team: "Ferrari", time: "1:35.123", gap: "+0.556", interval: "+0.078", laps: 42, status: "Running" },
  { pos: 7, num: 4, driver: "Lando Norris", team: "McLaren", time: "1:35.234", gap: "+0.667", interval: "+0.111", laps: 42, status: "Running" },
  { pos: 8, num: 81, driver: "Oscar Piastri", team: "McLaren", time: "1:35.345", gap: "+0.778", interval: "+0.111", laps: 41, status: "Running" },
  { pos: 9, num: 14, driver: "Fernando Alonso", team: "Aston Martin", time: "1:35.456", gap: "+0.889", interval: "+0.111", laps: 41, status: "Running" },
  { pos: 10, num: 18, driver: "Lance Stroll", team: "Aston Martin", time: "1:35.567", gap: "+1.000", interval: "+0.111", laps: 41, status: "Running" },
];

// Team colors
const teamColors: Record<string, string> = {
  "Red Bull Racing": "#0600EF",
  "Mercedes": "#00D2BE",
  "Ferrari": "#DC0000",
  "McLaren": "#FF8700",
  "Aston Martin": "#006F62",
  "Alpine": "#0090FF",
  "Williams": "#005AFF",
  "AlphaTauri": "#2B4562",
  "Alfa Romeo": "#900000",
  "Haas F1 Team": "#FFFFFF"
};

const LiveTiming = () => {
  const [activeSession, setActiveSession] = useState(raceSessions[4]); // Race by default
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [raceProgress, setRaceProgress] = useState(67); // Percentage of race completed
  const [currentLap, setCurrentLap] = useState(42);
  const [totalLaps, setTotalLaps] = useState(63);
  const [raceTime, setRaceTime] = useState("01:12:45");

  useEffect(() => {
    document.title = "RacePulse - Live Timing";
    
    // Simulate race progress updates
    const interval = setInterval(() => {
      setRaceProgress((prev) => {
        // Random small increment between 0.1 and 0.3
        const increment = Math.random() * 0.2 + 0.1;
        const newProgress = prev + increment;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sorted drivers based on current sort settings
  const getSortedDrivers = () => {
    if (!sortField) return drivers;
    
    return [...drivers].sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Flag className="h-6 w-6 text-racing-red" />
            Live Race Timing
          </h1>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">Spanish Grand Prix</h2>
              <p className="text-muted-foreground">Circuit de Barcelona-Catalunya</p>
            </div>
            
            <div className="flex items-center gap-2 bg-racing-red/10 text-racing-red px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-racing-red rounded-full animate-pulse-racing"></div>
              <span className="font-medium">LIVE</span>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Race Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{raceTime}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Race Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={raceProgress} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Lap {currentLap} / {totalLaps}</span>
                  <span>{Math.round(raceProgress)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={activeSession} onValueChange={setActiveSession} className="w-full">
                <TabsList className="grid grid-cols-5 h-8">
                  {raceSessions.map((session) => (
                    <TabsTrigger
                      key={session}
                      value={session}
                      className={`text-xs ${
                        session === activeSession ? "bg-racing-red text-white" : ""
                      }`}
                    >
                      {session.charAt(0)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-0 overflow-auto">
            <Table>
              <TableHeader className="bg-racing-black text-white sticky top-0">
                <TableRow>
                  <TableHead 
                    className="w-12 cursor-pointer"
                    onClick={() => handleSort("pos")}
                  >
                    <div className="flex items-center">
                      Pos
                      {sortField === "pos" && (
                        sortDirection === "asc" ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("driver")}
                  >
                    <div className="flex items-center">
                      Driver
                      {sortField === "driver" && (
                        sortDirection === "asc" ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("team")}
                  >
                    <div className="flex items-center">
                      Team
                      {sortField === "team" && (
                        sortDirection === "asc" ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("time")}
                  >
                    <div className="flex items-center">
                      Time
                      {sortField === "time" && (
                        sortDirection === "asc" ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Gap</TableHead>
                  <TableHead>Interval</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("laps")}
                  >
                    <div className="flex items-center">
                      Laps
                      {sortField === "laps" && (
                        sortDirection === "asc" ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getSortedDrivers().map((driver) => (
                  <TableRow key={driver.num} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {driver.pos}
                    </TableCell>
                    <TableCell>
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: teamColors[driver.team] || "#333" }}
                      >
                        {driver.num}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{driver.driver}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-4 rounded-sm"
                          style={{ backgroundColor: teamColors[driver.team] || "#333" }}
                        ></div>
                        {driver.team}
                      </div>
                    </TableCell>
                    <TableCell>{driver.time}</TableCell>
                    <TableCell>{driver.gap}</TableCell>
                    <TableCell>{driver.interval}</TableCell>
                    <TableCell>{driver.laps}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        driver.status === "Running" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {driver.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LiveTiming;
