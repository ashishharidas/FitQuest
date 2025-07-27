import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  users, 
  characters, 
  quests, 
  fitnessData, 
  transactions, 
  leaderboard, 
  battles,
  type User, 
  type InsertUser, 
  type Character, 
  type InsertCharacter, 
  type Quest, 
  type InsertQuest, 
  type FitnessData, 
  type InsertFitnessData, 
  type Transaction, 
  type InsertTransaction, 
  type LeaderboardEntry, 
  type Battle, 
  type InsertBattle 
} from "@shared/schema";

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

export class DatabaseStorage implements IStorage {
  
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getCharacter(userId: string): Promise<Character | undefined> {
    const [character] = await db.select().from(characters).where(eq(characters.userId, userId));
    return character || undefined;
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const [character] = await db
      .insert(characters)
      .values(insertCharacter)
      .returning();
    return character;
  }

  async updateCharacter(userId: string, updates: Partial<Character>): Promise<Character | undefined> {
    const [character] = await db
      .update(characters)
      .set(updates)
      .where(eq(characters.userId, userId))
      .returning();
    return character || undefined;
  }

  async getUserQuests(userId: string): Promise<Quest[]> {
    return await db.select().from(quests).where(eq(quests.userId, userId));
  }

  async getQuest(id: string): Promise<Quest | undefined> {
    const [quest] = await db.select().from(quests).where(eq(quests.id, id));
    return quest || undefined;
  }

  async createQuest(insertQuest: InsertQuest): Promise<Quest> {
    const [quest] = await db
      .insert(quests)
      .values(insertQuest)
      .returning();
    return quest;
  }

  async updateQuest(id: string, updates: Partial<Quest>): Promise<Quest | undefined> {
    const [quest] = await db
      .update(quests)
      .set(updates)
      .where(eq(quests.id, id))
      .returning();
    return quest || undefined;
  }

  async getActiveQuests(userId: string): Promise<Quest[]> {
    return await db
      .select()
      .from(quests)
      .where(eq(quests.userId, userId));
  }

  async getFitnessData(userId: string, date?: Date): Promise<FitnessData[]> {
    let query = db.select().from(fitnessData).where(eq(fitnessData.userId, userId));
    if (date) {
      query = query.where(eq(fitnessData.date, date));
    }
    return await query;
  }

  async createFitnessData(insertFitnessData: InsertFitnessData): Promise<FitnessData> {
    const [data] = await db
      .insert(fitnessData)
      .values(insertFitnessData)
      .returning();
    return data;
  }

  async updateFitnessData(userId: string, date: Date, updates: Partial<FitnessData>): Promise<FitnessData | undefined> {
    const [data] = await db
      .update(fitnessData)
      .set(updates)
      .where(eq(fitnessData.userId, userId))
      .returning();
    return data || undefined;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const [transaction] = await db
      .update(transactions)
      .set(updates)
      .where(eq(transactions.id, id))
      .returning();
    return transaction || undefined;
  }

  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    return await db.select().from(leaderboard).limit(limit);
  }

  async updateLeaderboardEntry(userId: string, data: Partial<LeaderboardEntry>): Promise<void> {
    await db
      .insert(leaderboard)
      .values({ ...data, id: userId } as LeaderboardEntry)
      .onConflictDoUpdate({
        target: leaderboard.id,
        set: data,
      });
  }

  async getUserBattle(userId: string): Promise<Battle | undefined> {
    const [battle] = await db.select().from(battles).where(eq(battles.userId, userId));
    return battle || undefined;
  }

  async createBattle(insertBattle: InsertBattle): Promise<Battle> {
    const [battle] = await db
      .insert(battles)
      .values(insertBattle)
      .returning();
    return battle;
  }

  async updateBattle(id: string, updates: Partial<Battle>): Promise<Battle | undefined> {
    const [battle] = await db
      .update(battles)
      .set(updates)
      .where(eq(battles.id, id))
      .returning();
    return battle || undefined;
  }
}

export const storage = new DatabaseStorage();