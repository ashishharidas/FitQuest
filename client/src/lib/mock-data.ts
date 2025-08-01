import type { User, Character, Quest, FitnessData, Transaction, LeaderboardEntry } from "@shared/schema";

export const mockUser: User = {
  id: "mock-user-id",
  username: "AlexWarrior",
  email: "alex@fitquest.com",
  walletAddress: "0x742d35Cc6670C5C2DFeF62A47D8Bd3E7Af2",
  createdAt: new Date("2024-01-15"),
};

export const mockCharacter: Character = {
  id: "mock-character-id",
  userId: "mock-user-id",
  name: "Athlos",
  level: 15,
  xp: 2847,
  evolutionStage: 2, // Warrior
  strength: 847,
  stamina: 623,
  agility: 741,
  health: 892,
  equipment: {},
};

export const mockQuests: Quest[] = [
  {
    id: "quest-1",
    userId: "mock-user-id",
    type: "daily",
    name: "10,000 Steps Journey",
    description: "Walk 10,000 steps to unlock the Forest Path",
    targetValue: 10000,
    currentValue: 10000,
    xpReward: 50,
    ethReward: "0.01",
    completed: true,
    claimed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
  {
    id: "quest-2",
    userId: "mock-user-id",
    type: "daily",
    name: "Calorie Crusher",
    description: "Burn 500 calories to defeat the Couch Potato King",
    targetValue: 500,
    currentValue: 487,
    xpReward: 75,
    ethReward: "0.015",
    completed: false,
    claimed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
  {
    id: "quest-3",
    userId: "mock-user-id",
    type: "weekly",
    name: "Marathon Master",
    description: "Run 25km total this week",
    targetValue: 25000,
    currentValue: 18500,
    xpReward: 300,
    ethReward: "0.05",
    completed: false,
    claimed: false,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
];

export const mockFitnessData: FitnessData[] = [
  {
    id: "fitness-1",
    userId: "mock-user-id",
    date: new Date(),
    steps: 8432,
    calories: 487,
    heartRate: 85,
    activeMinutes: 65,
    distance: "6.2",
    workoutType: "running",
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    userId: "mock-user-id",
    type: "quest_reward",
    amount: "0.01",
    description: "10,000 Steps Quest Completion",
    txHash: "0x123...abc",
    status: "completed",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "tx-2",
    userId: "mock-user-id",
    type: "challenge_reward",
    amount: "0.05",
    description: "Weekly Challenge - Strength Seeker",
    txHash: "0x456...def",
    status: "completed",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "tx-3",
    userId: "mock-user-id",
    type: "boss_reward",
    amount: "0.1",
    description: "Boss Victory - Couch Potato King",
    txHash: "0x789...ghi",
    status: "completed",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: "lb-1",
    userId: "user-1",
    username: "FitLegend47",
    level: 42,
    xp: 94750,
    ethEarned: "12.45",
    rank: 1,
    updatedAt: new Date(),
  },
  {
    id: "lb-2",
    userId: "user-2",
    username: "WarriorRex",
    level: 38,
    xp: 87234,
    ethEarned: "10.12",
    rank: 2,
    updatedAt: new Date(),
  },
  {
    id: "lb-3",
    userId: "user-3",
    username: "FitQueen99",
    level: 35,
    xp: 79891,
    ethEarned: "8.77",
    rank: 3,
    updatedAt: new Date(),
  },
  {
    id: "lb-4",
    userId: "mock-user-id",
    username: "AlexWarrior",
    level: 15,
    xp: 2847,
    ethEarned: "2.47",
    rank: 47,
    updatedAt: new Date(),
  },
];
