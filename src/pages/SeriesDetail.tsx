
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Trophy, Calendar, Flag, Users, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

// Sample data for different racing series
const seriesData: Record<string, SeriesInfo> = {
  "formula-1": {
    name: "Formula 1",
    fullName: "FIA Formula One World Championship",
    description: "Formula 1 is the highest class of international racing for open-wheel single-seater formula racing cars. Teams compete with the fastest purpose-built cars regulated by the FIA.",
    currentChampion: "Max Verstappen (Red Bull Racing)",
    constructorChampion: "Red Bull Racing",
    nextRace: "Miami Grand Prix (May 8, 2025)",
    pointSystem: "25-18-15-12-10-8-6-4-2-1 for top 10 finishers, plus 1 point for fastest lap if in top 10",
    standings: [
      { position: 1, driver: "Max Verstappen", team: "Red Bull Racing", points: 392 },
      { position: 2, driver: "Charles Leclerc", team: "Ferrari", points: 328 },
      { position: 3, driver: "Lando Norris", team: "McLaren", points: 315 },
      { position: 4, driver: "Lewis Hamilton", team: "Mercedes", points: 299 },
      { position: 5, driver: "Carlos Sainz", team: "Ferrari", points: 275 },
    ],
    teamStandings: [
      { position: 1, team: "Red Bull Racing", points: 612 },
      { position: 2, team: "Ferrari", points: 603 },
      { position: 3, team: "McLaren", points: 542 },
      { position: 4, team: "Mercedes", points: 521 },
      { position: 5, team: "Aston Martin", points: 180 },
    ]
  },
  "motogp": {
    name: "MotoGP",
    fullName: "FIM MotoGP World Championship",
    description: "MotoGP is the premier motorcycle racing world championship. Grand Prix motorcycles are purpose-built racing machines that are unavailable for purchase by the general public.",
    currentChampion: "Francesco Bagnaia (Ducati)",
    constructorChampion: "Ducati",
    nextRace: "Spanish Grand Prix (April 28, 2025)",
    pointSystem: "25-20-16-13-11-10-9-8-7-6-5-4-3-2-1 for top 15 finishers",
    standings: [
      { position: 1, driver: "Francesco Bagnaia", team: "Ducati", points: 387 },
      { position: 2, driver: "Jorge Martin", team: "Pramac Racing", points: 371 },
      { position: 3, driver: "Marc Marquez", team: "Gresini Racing", points: 332 },
      { position: 4, driver: "Enea Bastianini", team: "Ducati", points: 298 },
      { position: 5, driver: "Pedro Acosta", team: "Tech3", points: 243 },
    ],
    teamStandings: [
      { position: 1, team: "Ducati Lenovo Team", points: 685 },
      { position: 2, team: "Prima Pramac Racing", points: 611 },
      { position: 3, team: "Aprilia Racing", points: 402 },
      { position: 4, team: "Gresini Racing MotoGP", points: 375 },
      { position: 5, team: "Monster Energy Yamaha", points: 212 },
    ]
  },
  "wec": {
    name: "WEC",
    fullName: "FIA World Endurance Championship",
    description: "The World Endurance Championship features endurance races with multiple classes of cars competing simultaneously. Teams of multiple drivers share a single car, with races lasting from 6 to 24 hours.",
    currentChampion: "Toyota Gazoo Racing",
    constructorChampion: "Toyota",
    nextRace: "6 Hours of Spa-Francorchamps (May 10, 2025)",
    pointSystem: "25-18-15-12-10-8-6-4-2-1 for top 10 finishers, with additional points at Le Mans",
    standings: [
      { position: 1, driver: "Kamui Kobayashi / Mike Conway / Nyck de Vries", team: "Toyota", points: 137 },
      { position: 2, driver: "Sébastien Buemi / Brendon Hartley / Ryo Hirakawa", team: "Toyota", points: 129 },
      { position: 3, driver: "Kevin Estre / Laurens Vanthoor / André Lotterer", team: "Porsche", points: 121 },
      { position: 4, driver: "Antonio Fuoco / Miguel Molina / Nicklas Nielsen", team: "Ferrari", points: 98 },
      { position: 5, driver: "Earl Bamber / Alex Lynn / Nick Tandy", team: "Cadillac", points: 76 },
    ],
    teamStandings: [
      { position: 1, team: "Toyota Gazoo Racing", points: 266 },
      { position: 2, team: "Porsche Penske Motorsport", points: 199 },
      { position: 3, team: "Ferrari AF Corse", points: 185 },
      { position: 4, team: "Cadillac Racing", points: 131 },
      { position: 5, team: "BMW M Team WRT", points: 98 },
    ]
  },
  "formula-e": {
    name: "Formula E",
    fullName: "ABB FIA Formula E World Championship",
    description: "Formula E is a single-seater motorsport championship for electric cars. The series races primarily on temporary city-center street circuits and focuses on promoting electric vehicle technology.",
    currentChampion: "Nick Cassidy (Jaguar TCS Racing)",
    constructorChampion: "Jaguar TCS Racing",
    nextRace: "Berlin E-Prix (May 20, 2025)",
    pointSystem: "25-18-15-12-10-8-6-4-2-1 for top 10 finishers, plus points for pole position and fastest lap",
    standings: [
      { position: 1, driver: "Nick Cassidy", team: "Jaguar", points: 196 },
      { position: 2, driver: "Pascal Wehrlein", team: "Porsche", points: 189 },
      { position: 3, driver: "Mitch Evans", team: "Jaguar", points: 180 },
      { position: 4, driver: "Jean-Éric Vergne", team: "DS Penske", points: 151 },
      { position: 5, driver: "António Félix da Costa", team: "Porsche", points: 132 },
    ],
    teamStandings: [
      { position: 1, team: "Jaguar TCS Racing", points: 376 },
      { position: 2, team: "TAG Heuer Porsche", points: 321 },
      { position: 3, team: "DS Penske", points: 243 },
      { position: 4, team: "Nissan Formula E Team", points: 192 },
      { position: 5, team: "Envision Racing", points: 170 },
    ]
  },
  "indycar": {
    name: "IndyCar",
    fullName: "NTT IndyCar Series",
    description: "The IndyCar Series is the premier level of open-wheel racing in North America. The series features a mix of oval tracks, road courses, and street circuits, with the Indianapolis 500 as its flagship event.",
    currentChampion: "Alex Palou (Chip Ganassi Racing)",
    constructorChampion: "Chip Ganassi Racing",
    nextRace: "Grand Prix of Long Beach (April 21, 2025)",
    pointSystem: "50-40-35-32-30-28-26-24-22-20... points, with double points for Indianapolis 500",
    standings: [
      { position: 1, driver: "Alex Palou", team: "Chip Ganassi Racing", points: 623 },
      { position: 2, driver: "Colton Herta", team: "Andretti Global", points: 592 },
      { position: 3, driver: "Scott Dixon", team: "Chip Ganassi Racing", points: 578 },
      { position: 4, driver: "Pato O'Ward", team: "Arrow McLaren", points: 554 },
      { position: 5, driver: "Will Power", team: "Team Penske", points: 527 },
    ],
    teamStandings: [
      { position: 1, team: "Chip Ganassi Racing", points: 1201 },
      { position: 2, team: "Team Penske", points: 1154 },
      { position: 3, team: "Andretti Global", points: 1079 },
      { position: 4, team: "Arrow McLaren", points: 978 },
      { position: 5, team: "Meyer Shank Racing", points: 587 },
    ]
  },
  "nascar": {
    name: "NASCAR",
    fullName: "NASCAR Cup Series",
    description: "NASCAR is the largest racing series in the United States, featuring modified stock cars. The series primarily races on oval tracks with various banking angles and lengths, as well as some road courses.",
    currentChampion: "Ryan Blaney (Team Penske)",
    constructorChampion: "Ford",
    nextRace: "Talladega 500 (April 25, 2025)",
    pointSystem: "Complex playoff system with regular season points and elimination-style playoffs",
    standings: [
      { position: 1, driver: "Ryan Blaney", team: "Team Penske", points: 2412 },
      { position: 2, driver: "William Byron", team: "Hendrick Motorsports", points: 2366 },
      { position: 3, driver: "Kyle Larson", team: "Hendrick Motorsports", points: 2339 },
      { position: 4, driver: "Christopher Bell", team: "Joe Gibbs Racing", points: 2302 },
      { position: 5, driver: "Denny Hamlin", team: "Joe Gibbs Racing", points: 2289 },
    ],
    teamStandings: [
      { position: 1, team: "Hendrick Motorsports", points: 4705 },
      { position: 2, team: "Joe Gibbs Racing", points: 4591 },
      { position: 3, team: "Team Penske", points: 4412 },
      { position: 4, team: "Stewart-Haas Racing", points: 3877 },
      { position: 5, team: "23XI Racing", points: 3765 },
    ]
  },
  "wrc": {
    name: "WRC",
    fullName: "FIA World Rally Championship",
    description: "The World Rally Championship is a rallying series organized by the FIA. Drivers and their co-drivers compete in modified road cars on surfaces ranging from gravel and tarmac to snow and ice.",
    currentChampion: "Kalle Rovanperä (Toyota Gazoo Racing)",
    constructorChampion: "Toyota Gazoo Racing",
    nextRace: "Rally Portugal (May 15, 2025)",
    pointSystem: "25-18-15-12-10-8-6-4-2-1 for top 10 finishers, plus additional points for Power Stage",
    standings: [
      { position: 1, driver: "Kalle Rovanperä", team: "Toyota", points: 187 },
      { position: 2, driver: "Thierry Neuville", team: "Hyundai", points: 173 },
      { position: 3, driver: "Elfyn Evans", team: "Toyota", points: 145 },
      { position: 4, driver: "Ott Tänak", team: "Hyundai", points: 139 },
      { position: 5, driver: "Sébastien Ogier", team: "Toyota", points: 112 },
    ],
    teamStandings: [
      { position: 1, team: "Toyota Gazoo Racing", points: 444 },
      { position: 2, team: "Hyundai Shell Mobis WRT", points: 412 },
      { position: 3, team: "M-Sport Ford WRT", points: 235 },
    ]
  },
  "dtm": {
    name: "DTM",
    fullName: "Deutsche Tourenwagen Masters",
    description: "DTM is a touring car series based in Germany. Since 2021, the series uses GT3-spec cars, which are based on production sports cars but heavily modified for racing.",
    currentChampion: "Thomas Preining (Manthey EMA)",
    constructorChampion: "Porsche",
    nextRace: "Nürburgring (June 8, 2025)",
    pointSystem: "25-18-15-12-10-8-6-4-2-1 for top 10 finishers, plus points for qualifying",
    standings: [
      { position: 1, driver: "Thomas Preining", team: "Manthey EMA", points: 218 },
      { position: 2, driver: "Mirko Bortolotti", team: "SSR Performance", points: 197 },
      { position: 3, driver: "René Rast", team: "Schubert Motorsport", points: 189 },
      { position: 4, driver: "Kelvin van der Linde", team: "ABT Sportsline", points: 163 },
      { position: 5, driver: "Maro Engel", team: "WINWARD Racing", points: 146 },
    ],
    teamStandings: [
      { position: 1, team: "Manthey EMA", points: 341 },
      { position: 2, team: "SSR Performance", points: 327 },
      { position: 3, team: "Schubert Motorsport", points: 312 },
      { position: 4, team: "ABT Sportsline", points: 284 },
      { position: 5, team: "WINWARD Racing", points: 257 },
    ]
  }
};

// Types
interface SeriesInfo {
  name: string;
  fullName: string;
  description: string;
  currentChampion: string;
  constructorChampion: string;
  nextRace: string;
  pointSystem: string;
  standings: StandingEntry[];
  teamStandings: TeamStandingEntry[];
}

interface StandingEntry {
  position: number;
  driver: string;
  team: string;
  points: number;
}

interface TeamStandingEntry {
  position: number;
  team: string;
  points: number;
}

const SeriesDetail = () => {
  const { seriesId } = useParams<{ seriesId: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const series = seriesId ? seriesData[seriesId] : null;
  
  useEffect(() => {
    if (series) {
      document.title = `RacePulse - ${series.name}`;
    } else {
      document.title = "RacePulse - Series Not Found";
    }
  }, [series]);

  if (!series) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Series Not Found</h1>
            <p className="mb-6">Sorry, we couldn't find information for the requested racing series.</p>
            <Button asChild>
              <Link to="/">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm" className="mb-4">
            <Link to="/">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Flag className="h-6 w-6 text-racing-red" />
            {series.name}
          </h1>
          <p className="text-gray-600">{series.fullName}</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="standings">Standings</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <p className="mb-6">{series.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Trophy className="h-5 w-5 text-racing-red mt-0.5" />
                      <div>
                        <h3 className="font-medium">Current Champion</h3>
                        <p>{series.currentChampion}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Car className="h-5 w-5 text-racing-red mt-0.5" />
                      <div>
                        <h3 className="font-medium">Constructor Champion</h3>
                        <p>{series.constructorChampion}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-racing-red mt-0.5" />
                      <div>
                        <h3 className="font-medium">Next Race</h3>
                        <p>{series.nextRace}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Trophy className="h-5 w-5 text-racing-red mt-0.5" />
                      <div>
                        <h3 className="font-medium">Point System</h3>
                        <p className="text-sm">{series.pointSystem}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="standings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-racing-red" />
                  Driver Standings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-racing-black text-white">
                      <TableHead className="w-12">Pos</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {series.standings.map((entry) => (
                      <TableRow key={entry.position}>
                        <TableCell className="font-medium">{entry.position}</TableCell>
                        <TableCell>{entry.driver}</TableCell>
                        <TableCell>{entry.team}</TableCell>
                        <TableCell className="text-right font-bold">{entry.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-racing-red" />
                  Team Standings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-racing-black text-white">
                      <TableHead className="w-12">Pos</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {series.teamStandings.map((entry) => (
                      <TableRow key={entry.position}>
                        <TableCell className="font-medium">{entry.position}</TableCell>
                        <TableCell>{entry.team}</TableCell>
                        <TableCell className="text-right font-bold">{entry.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SeriesDetail;
