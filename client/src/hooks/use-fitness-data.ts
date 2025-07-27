import { useState, useEffect } from "react";

interface FitnessData {
  steps: number;
  calories: number;
  heartRate: number;
  activeMinutes: number;
  distance: number;
  workoutType: string;
  lastUpdated: Date;
}

export function useFitnessData() {
  const [fitnessData, setFitnessData] = useState<FitnessData>({
    steps: 8432,
    calories: 487,
    heartRate: 85,
    activeMinutes: 65,
    distance: 6.2,
    workoutType: "running",
    lastUpdated: new Date(),
  });

  const [isConnected, setIsConnected] = useState(true);

  // Simulate real-time fitness data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFitnessData(prev => ({
        ...prev,
        steps: prev.steps + Math.floor(Math.random() * 10),
        calories: prev.calories + Math.floor(Math.random() * 3),
        heartRate: Math.max(60, Math.min(180, prev.heartRate + (Math.random() - 0.5) * 10)),
        lastUpdated: new Date(),
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const syncFitnessData = async () => {
    // Simulate syncing with smartwatch
    const mockData = {
      steps: Math.floor(Math.random() * 5000) + 6000,
      calories: Math.floor(Math.random() * 300) + 400,
      heartRate: Math.floor(Math.random() * 40) + 60,
      activeMinutes: Math.floor(Math.random() * 60) + 30,
      distance: Math.random() * 5 + 3,
      workoutType: ["running", "cycling", "strength", "yoga"][Math.floor(Math.random() * 4)],
      lastUpdated: new Date(),
    };

    setFitnessData(mockData);
    return mockData;
  };

  const connectDevice = async (deviceType: "apple_watch" | "fitbit") => {
    // Simulate device connection
    setIsConnected(true);
    return true;
  };

  return {
    fitnessData,
    isConnected,
    syncFitnessData,
    connectDevice,
  };
}
