
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
    console.log(`Fetching Ergast data from: ${ERGAST_API_BASE}${endpoint}.json`);
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
 * Note: As of 2025, this returns the most recent standings data available
 */
export async function getCurrentDriverStandings() {
  try {
    // Try to get 2025 data
    const data = await fetchErgastData("/2025/driverStandings");
    if (data.MRData.StandingsTable.StandingsLists.length > 0) {
      return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
    }
    
    // Fallback to current season if 2025 isn't available yet
    console.log("2025 driver standings not found, falling back to current season");
    const currentData = await fetchErgastData("/current/driverStandings");
    return currentData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
  } catch (error) {
    console.error("Error getting driver standings:", error);
    return [];
  }
}

/**
 * Get current F1 constructor standings
 * Note: As of 2025, this returns the most recent standings data available
 */
export async function getCurrentConstructorStandings() {
  try {
    // Try to get 2025 data
    const data = await fetchErgastData("/2025/constructorStandings");
    if (data.MRData.StandingsTable.StandingsLists.length > 0) {
      return data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
    }
    
    // Fallback to current season if 2025 isn't available yet
    console.log("2025 constructor standings not found, falling back to current season");
    const currentData = await fetchErgastData("/current/constructorStandings");
    return currentData.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
  } catch (error) {
    console.error("Error getting constructor standings:", error);
    return [];
  }
}

/**
 * Get latest race results
 * Note: As of 2025, this returns the most recent race data available
 */
export async function getLatestRaceResults() {
  try {
    // Try to get 2025 data for the last race
    const data = await fetchErgastData("/2025/last/results");
    if (data.MRData.RaceTable.Races.length > 0) {
      return data.MRData.RaceTable.Races[0] || null;
    }
    
    // Fallback to current season if 2025 isn't available yet
    console.log("2025 race results not found, falling back to current season");
    const currentData = await fetchErgastData("/current/last/results");
    return currentData.MRData.RaceTable.Races[0] || null;
  } catch (error) {
    console.error("Error getting latest race results:", error);
    return null;
  }
}

/**
 * Get the current season schedule
 * Note: As of 2025, this returns the most recent calendar data available
 */
export async function getCurrentSeason() {
  try {
    // Try to get 2025 data
    const data = await fetchErgastData("/2025");
    if (data.MRData.RaceTable.Races.length > 0) {
      return data.MRData.RaceTable.Races || [];
    }
    
    // Fallback to current season if 2025 isn't available yet
    console.log("2025 season data not found, falling back to current season");
    const currentData = await fetchErgastData("/current");
    return currentData.MRData.RaceTable.Races || [];
  } catch (error) {
    console.error("Error getting current season:", error);
    return [];
  }
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
