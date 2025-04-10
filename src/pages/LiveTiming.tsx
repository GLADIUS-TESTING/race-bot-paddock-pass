
import { useState, useEffect } from "react";
import { Flag, ChevronDown, ChevronUp, Clock, Trophy, ArrowDownUp, Activity, RefreshCcw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { getLatestRaceResults, getCurrentDriverStandings } from "@/utils/ergastApi";

// Team colors - based on official F1 team colors
const teamColors: Record<string, string> = {
  "Red Bull": "#0600EF",
  "Mercedes": "#00D2BE",
  "Ferrari": "#DC0000",
  "McLaren": "#FF8700",
  "Aston Martin": "#006F62",
  "Alpine": "#0090FF",
  "Williams": "#005AFF",
  "AlphaTauri": "#2B4562",
  "Alfa Romeo": "#900000",
  "Haas F1 Team": "#FFFFFF",
  "Haas": "#FFFFFF",
  "Racing Point": "#F596C8",
  "Toro Rosso": "#469BFF",
  "Renault": "#FFF500",
  "Force India": "#FF80C7",
  "Sauber": "#9B0000",
  "Manor Marussia": "#6E0000",
  "Marussia": "#6E0000",
  "Caterham": "#00d2be",
  "Lotus F1": "#FFB800",
  "HRT": "#B2945B",
  "Virgin": "#c30010",
  "Brawn": "#BFD447",
  "Toyota": "#CC0000",
  "Super Aguri": "#E60012",
  "Honda": "#CC0000",
  "Spyker": "#FF6600",
  "Midland": "#EB6E1A",
  "BAR": "#006F62",
  "Jordan": "#FF9800",
  "Jaguar": "#0D5C32",
  "Arrows": "#FF8800",
  "Prost": "#04088F",
  "Minardi": "#000000",
  "Stewart": "#FFFFFF",
  "Tyrrell": "#0000FF",
  "Benetton": "#00841D",
  "Footwork": "#FF8800",
  "Ligier": "#0045FF",
  "Forti": "#FF7F00",
  "Larrousse": "#EBC80C",
  "Simtek": "#000000",
  "Pacific": "#0066CC",
  "RB": "#3671C6", // AlphaTauri rebranded to RB for 2024
  "VCARB": "#3671C6", // Alternative name for RB/AlphaTauri
};

// Race session types
const raceSessions = ["FP1", "FP2", "FP3", "Qualifying", "Race"];

const LiveTiming = () => {
  const [activeSession, setActiveSession] = useState("Race"); // Race by default
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  useEffect(() => {
    document.title = "RacePulse - Live Timing";
  }, []);

  // Fetch latest race results from Ergast API
  const { 
    data: raceData, 
    isLoading: isRaceLoading, 
    error: raceError,
    refetch: refetchRace
  } = useQuery({
    queryKey: ['latestRace'],
    queryFn: getLatestRaceResults,
    staleTime: 300000, // 5 minutes
  });

  // Fetch current driver standings from Ergast API
  const { 
    data: standingsData, 
    isLoading: isStandingsLoading,
    refetch: refetchStandings
  } = useQuery({
    queryKey: ['driverStandings'],
    queryFn: getCurrentDriverStandings,
    staleTime: 300000, // 5 minutes
  });

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Calculate race progress (for demonstration purposes)
  const calculateRaceProgress = () => {
    if (!raceData || !raceData.Results) return 100;
    
    const currentDate = new Date();
    const raceDate = new Date(raceData.date + "T" + (raceData.time || "13:00:00Z"));
    
    // If race is in the future, show 0% progress
    if (currentDate < raceDate) return 0;
    
    // If race is more than 2 hours old, show 100% progress
    const twoHoursAfterRace = new Date(raceDate.getTime() + 2 * 60 * 60 * 1000);
    if (currentDate > twoHoursAfterRace) return 100;
    
    // Calculate progress percentage
    const totalRaceTime = twoHoursAfterRace.getTime() - raceDate.getTime();
    const elapsedTime = currentDate.getTime() - raceDate.getTime();
    return Math.min(100, Math.max(0, (elapsedTime / totalRaceTime) * 100));
  };

  // Format race results to match our table structure
  const formatRaceResults = () => {
    if (!raceData || !raceData.Results) return [];
    
    return raceData.Results.map((result: any) => ({
      pos: result.position,
      num: result.number,
      driver: `${result.Driver.givenName} ${result.Driver.familyName}`,
      team: result.Constructor.name,
      time: result.Time?.time || (result.status === "Finished" ? "+1 Lap" : result.status),
      gap: result.Time?.time ? (parseInt(result.position) === 1 ? "Leader" : result.Time.time) : "-",
      interval: result.Time?.time ? (parseInt(result.position) === 1 ? "-" : result.Time.time) : "-",
      laps: result.laps,
      status: result.status === "Finished" ? "Finished" : result.status
    }));
  };

  // Get sorted data based on current sort settings
  const getSortedData = () => {
    const data = formatRaceResults();
    if (!sortField || !data.length) return data;
    
    return [...data].sort((a, b) => {
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

  // Handle manual refresh of data
  const handleRefresh = () => {
    refetchRace();
    refetchStandings();
    toast({
      title: "Refreshing data",
      description: "Getting the latest race information",
    });
  };

  // Placeholder race time calculation
  const getRaceTimeDisplay = () => {
    if (!raceData) return "--:--:--";
    
    const raceProgress = calculateRaceProgress();
    if (raceProgress >= 100) return "Completed";
    if (raceProgress <= 0) return "Not Started";
    
    // Calculate approx time based on progress (for demo)
    const minutesElapsed = Math.floor((raceProgress / 100) * 120); // Assuming 2 hour race
    const hours = Math.floor(minutesElapsed / 60);
    const minutes = minutesElapsed % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  };

  if (raceError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Error Loading Data</h2>
              <p className="mb-4">There was a problem loading the race data. Please try again later.</p>
              <Button onClick={() => refetchRace()}>Try Again</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Flag className="h-6 w-6 text-racing-red" />
              Live Race Timing
            </h1>
            {raceData && (
              <div>
                <h2 className="text-xl font-semibold">{raceData.raceName}</h2>
                <p className="text-muted-foreground">{raceData.Circuit?.circuitName}</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-1">
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
            {isRaceLoading ? (
              <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="font-medium">LOADING</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-racing-red/10 text-racing-red px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-racing-red rounded-full animate-pulse-racing"></div>
                <span className="font-medium">LIVE</span>
              </div>
            )}
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
              <p className="text-2xl font-bold">{getRaceTimeDisplay()}</p>
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
                <Progress value={calculateRaceProgress()} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {raceData?.Results ? `Lap ${raceData.Results[0]?.laps || "--"}` : "--"}
                  </span>
                  <span>{Math.round(calculateRaceProgress())}%</span>
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
                      {session === "Qualifying" ? "Q" : session.charAt(0)}
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
                {isRaceLoading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <TableRow key={index} className="animate-pulse">
                      <TableCell className="py-4"><div className="h-5 bg-gray-200 rounded-md w-5"></div></TableCell>
                      <TableCell><div className="h-6 w-6 bg-gray-200 rounded-full"></div></TableCell>
                      <TableCell><div className="h-5 bg-gray-200 rounded-md w-32"></div></TableCell>
                      <TableCell><div className="h-5 bg-gray-200 rounded-md w-24"></div></TableCell>
                      <TableCell><div className="h-5 bg-gray-200 rounded-md w-20"></div></TableCell>
                      <TableCell><div className="h-5 bg-gray-200 rounded-md w-16"></div></TableCell>
                      <TableCell><div className="h-5 bg-gray-200 rounded-md w-16"></div></TableCell>
                      <TableCell><div className="h-5 bg-gray-200 rounded-md w-8"></div></TableCell>
                      <TableCell><div className="h-5 bg-gray-200 rounded-md w-16"></div></TableCell>
                    </TableRow>
                  ))
                ) : (
                  getSortedData().map((driver) => (
                    <TableRow key={driver.pos} className="hover:bg-gray-50">
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
                          driver.status === "Finished" || driver.status === "Running"
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {driver.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LiveTiming;
