import { type User, type InsertUser, type Character, type InsertCharacter, type Quest, type InsertQuest, type FitnessData, type InsertFitnessData, type Transaction, type InsertTransaction, type LeaderboardEntry, type Battle, type InsertBattle } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Characters
  getCharacter(userId: string): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(userId: string, updates: Partial<Character>): Promise<Character | undefined>;

  // Quests
  getUserQuests(userId: string): Promise<Quest[]>;
  getQuest(id: string): Promise<Quest | undefined>;
  createQuest(quest: InsertQuest): Promise<Quest>;
  updateQuest(id: string, updates: Partial<Quest>): Promise<Quest | undefined>;
  getActiveQuests(userId: string): Promise<Quest[]>;

  // Fitness Data
  getFitnessData(userId: string, date?: Date): Promise<FitnessData[]>;
  createFitnessData(data: InsertFitnessData): Promise<FitnessData>;
  updateFitnessData(userId: string, date: Date, updates: Partial<FitnessData>): Promise<FitnessData | undefined>;

  // Transactions
  getUserTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | undefined>;

  // Leaderboard
  getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  updateLeaderboardEntry(userId: string, data: Partial<LeaderboardEntry>): Promise<void>;

  // Battles
  getUserBattle(userId: string): Promise<Battle | undefined>;
  createBattle(battle: InsertBattle): Promise<Battle>;
  updateBattle(id: string, updates: Partial<Battle>): Promise<Battle | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private characters: Map<string, Character> = new Map(); // keyed by userId
  private quests: Map<string, Quest> = new Map();
  private fitnessData: Map<string, FitnessData[]> = new Map(); // keyed by userId
  private transactions: Map<string, Transaction[]> = new Map(); // keyed by userId
  private leaderboard: Map<string, LeaderboardEntry> = new Map(); // keyed by userId
  private battles: Map<string, Battle> = new Map(); // keyed by userId

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create sample user
    const userId = randomUUID();
    const user: User = {
      id: userId,
      username: "AlexWarrior",
      email: "alex@fitquest.com",
      walletAddress: "0x742d35Cc6670C5C2DFeF62A47D8Bd3E7Af2",
      createdAt: new Date("2024-01-15"),
    };
    this.users.set(userId, user);

    // Create character
    const character: Character = {
      id: randomUUID(),
      userId,
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
    this.characters.set(userId, character);

    // Create sample quests
    const quests: Quest[] = [
      {
        id: randomUUID(),
        userId,
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
        id: randomUUID(),
        userId,
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
        id: randomUUID(),
        userId,
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

    quests.forEach(quest => this.quests.set(quest.id, quest));

    // Create fitness data
    const today = new Date();
    const fitnessToday: FitnessData = {
      id: randomUUID(),
      userId,
      date: today,
      steps: 8432,
      calories: 487,
      heartRate: 85,
      activeMinutes: 65,
      distance: "6.2",
      workoutType: "running",
    };
    this.fitnessData.set(userId, [fitnessToday]);

    // Create transactions
    const transactions: Transaction[] = [
      {
        id: randomUUID(),
        userId,
        type: "quest_reward",
        amount: "0.01",
        description: "10,000 Steps Quest Completion",
        txHash: "0x123...abc",
        status: "completed",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        userId,
        type: "challenge_reward",
        amount: "0.05",
        description: "Weekly Challenge - Strength Seeker",
        txHash: "0x456...def",
        status: "completed",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ];
    this.transactions.set(userId, transactions);

    // Create leaderboard entry
    const leaderboardEntry: LeaderboardEntry = {
      id: randomUUID(),
      userId,
      username: user.username,
      level: character.level,
      xp: character.xp,
      ethEarned: "2.47",
      rank: 47,
      updatedAt: new Date(),
    };
    this.leaderboard.set(userId, leaderboardEntry);

    // Add some top leaderboard entries
    const topEntries = [
      { username: "FitLegend47", level: 42, xp: 94750, ethEarned: "12.45", rank: 1 },
      { username: "WarriorRex", level: 38, xp: 87234, ethEarned: "10.12", rank: 2 },
      { username: "FitQueen99", level: 35, xp: 79891, ethEarned: "8.77", rank: 3 },
    ];

    topEntries.forEach(entry => {
      const id = randomUUID();
      const topUser: LeaderboardEntry = {
        id: randomUUID(),
        userId: id,
        username: entry.username,
        level: entry.level,
        xp: entry.xp,
        ethEarned: entry.ethEarned,
        rank: entry.rank,
        updatedAt: new Date(),
      };
      this.leaderboard.set(id, topUser);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.walletAddress === walletAddress);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getCharacter(userId: string): Promise<Character | undefined> {
    return this.characters.get(userId);
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = randomUUID();
    const character: Character = { ...insertCharacter, id };
    this.characters.set(insertCharacter.userId, character);
    return character;
  }

  async updateCharacter(userId: string, updates: Partial<Character>): Promise<Character | undefined> {
    const character = this.characters.get(userId);
    if (!character) return undefined;
    const updatedCharacter = { ...character, ...updates };
    this.characters.set(userId, updatedCharacter);
    return updatedCharacter;
  }

  async getUserQuests(userId: string): Promise<Quest[]> {
    return Array.from(this.quests.values()).filter(quest => quest.userId === userId);
  }

  async getQuest(id: string): Promise<Quest | undefined> {
    return this.quests.get(id);
  }

  async createQuest(insertQuest: InsertQuest): Promise<Quest> {
    const id = randomUUID();
    const quest: Quest = { ...insertQuest, id, createdAt: new Date() };
    this.quests.set(id, quest);
    return quest;
  }

  async updateQuest(id: string, updates: Partial<Quest>): Promise<Quest | undefined> {
    const quest = this.quests.get(id);
    if (!quest) return undefined;
    const updatedQuest = { ...quest, ...updates };
    this.quests.set(id, updatedQuest);
    return updatedQuest;
  }

  async getActiveQuests(userId: string): Promise<Quest[]> {
    return Array.from(this.quests.values()).filter(
      quest => quest.userId === userId && !quest.completed
    );
  }

  async getFitnessData(userId: string, date?: Date): Promise<FitnessData[]> {
    const userFitnessData = this.fitnessData.get(userId) || [];
    if (date) {
      return userFitnessData.filter(data => 
        data.date.toDateString() === date.toDateString()
      );
    }
    return userFitnessData;
  }

  async createFitnessData(insertData: InsertFitnessData): Promise<FitnessData> {
    const id = randomUUID();
    const data: FitnessData = { ...insertData, id, date: new Date() };
    const userFitnessData = this.fitnessData.get(insertData.userId) || [];
    userFitnessData.push(data);
    this.fitnessData.set(insertData.userId, userFitnessData);
    return data;
  }

  async updateFitnessData(userId: string, date: Date, updates: Partial<FitnessData>): Promise<FitnessData | undefined> {
    const userFitnessData = this.fitnessData.get(userId) || [];
    const dataIndex = userFitnessData.findIndex(data => 
      data.date.toDateString() === date.toDateString()
    );
    if (dataIndex === -1) return undefined;
    
    const updatedData = { ...userFitnessData[dataIndex], ...updates };
    userFitnessData[dataIndex] = updatedData;
    this.fitnessData.set(userId, userFitnessData);
    return updatedData;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return this.transactions.get(userId) || [];
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { ...insertTransaction, id, createdAt: new Date() };
    const userTransactions = this.transactions.get(insertTransaction.userId) || [];
    userTransactions.push(transaction);
    this.transactions.set(insertTransaction.userId, userTransactions);
    return transaction;
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    for (const [userId, userTransactions] of this.transactions.entries()) {
      const transactionIndex = userTransactions.findIndex(t => t.id === id);
      if (transactionIndex !== -1) {
        const updatedTransaction = { ...userTransactions[transactionIndex], ...updates };
        userTransactions[transactionIndex] = updatedTransaction;
        this.transactions.set(userId, userTransactions);
        return updatedTransaction;
      }
    }
    return undefined;
  }

  async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    return Array.from(this.leaderboard.values())
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit);
  }

  async updateLeaderboardEntry(userId: string, data: Partial<LeaderboardEntry>): Promise<void> {
    const existing = this.leaderboard.get(userId);
    if (existing) {
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.leaderboard.set(userId, updated);
    }
  }

  async getUserBattle(userId: string): Promise<Battle | undefined> {
    return this.battles.get(userId);
  }

  async createBattle(insertBattle: InsertBattle): Promise<Battle> {
    const id = randomUUID();
    const battle: Battle = { ...insertBattle, id, createdAt: new Date() };
    this.battles.set(insertBattle.userId, battle);
    return battle;
  }

  async updateBattle(id: string, updates: Partial<Battle>): Promise<Battle | undefined> {
    for (const [userId, battle] of this.battles.entries()) {
      if (battle.id === id) {
        const updatedBattle = { ...battle, ...updates };
        this.battles.set(userId, updatedBattle);
        return updatedBattle;
      }
    }
    return undefined;
  }
}

export const storage = new MemStorage();
