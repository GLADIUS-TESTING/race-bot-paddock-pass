
// Ergast API utility functions
// Documentation: https://ergast.com/mrd/

/**
 * Base URL for the Ergast API
 */
const ERGAST_API_BASE = "https://ergast.com/api/f1";

/**
 * Fetches data from the Ergast API with proper error handling
 */
async function fetchErgastData(endpoint: string) {
  try {
    const response = await fetch(`${ERGAST_API_BASE}${endpoint}.json`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching from Ergast API:", error);
    throw error;
  }
}

/**
 * Get current F1 driver standings
 */
export async function getCurrentDriverStandings() {
  const data = await fetchErgastData("/current/driverStandings");
  return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
}

/**
 * Get current F1 constructor standings
 */
export async function getCurrentConstructorStandings() {
  const data = await fetchErgastData("/current/constructorStandings");
  return data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
}

/**
 * Get latest race results
 */
export async function getLatestRaceResults() {
  const data = await fetchErgastData("/current/last/results");
  return data.MRData.RaceTable.Races[0] || null;
}

/**
 * Get the current season schedule
 */
export async function getCurrentSeason() {
  const data = await fetchErgastData("/current");
  return data.MRData.RaceTable.Races || [];
}

/**
 * Get specific race results
 */
export async function getRaceResults(season: string, round: string) {
  const data = await fetchErgastData(`/${season}/${round}/results`);
  return data.MRData.RaceTable.Races[0] || null;
}

/**
 * Get driver information
 */
export async function getDriverInfo(driverId: string) {
  const data = await fetchErgastData(`/drivers/${driverId}`);
  return data.MRData.DriverTable.Drivers[0] || null;
}

/**
 * Get constructor information
 */
export async function getConstructorInfo(constructorId: string) {
  const data = await fetchErgastData(`/constructors/${constructorId}`);
  return data.MRData.ConstructorTable.Constructors[0] || null;
}
