import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  walletAddress: text("wallet_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const characters = pgTable("characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull().default("Athlos"),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  evolutionStage: integer("evolution_stage").notNull().default(1), // 1=Novice, 2=Warrior, 3=Champion, 4=Legend
  strength: integer("strength").notNull().default(100),
  stamina: integer("stamina").notNull().default(100),
  agility: integer("agility").notNull().default(100),
  health: integer("health").notNull().default(100),
  equipment: jsonb("equipment").default({}),
});

export const quests = pgTable("quests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'daily', 'weekly', 'boss'
  name: text("name").notNull(),
  description: text("description").notNull(),
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value").notNull().default(0),
  xpReward: integer("xp_reward").notNull(),
  ethReward: decimal("eth_reward", { precision: 18, scale: 8 }).notNull(),
  completed: boolean("completed").notNull().default(false),
  claimed: boolean("claimed").notNull().default(false),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fitnessData = pgTable("fitness_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull().defaultNow(),
  steps: integer("steps").notNull().default(0),
  calories: integer("calories").notNull().default(0),
  heartRate: integer("heart_rate").notNull().default(70),
  activeMinutes: integer("active_minutes").notNull().default(0),
  distance: decimal("distance", { precision: 8, scale: 2 }).notNull().default("0"),
  workoutType: text("workout_type"), // 'running', 'cycling', 'strength', 'yoga'
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'quest_reward', 'boss_reward', 'challenge_reward'
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  description: text("description").notNull(),
  txHash: text("tx_hash"),
  status: text("status").notNull().default("pending"), // 'pending', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leaderboard = pgTable("leaderboard", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  username: text("username").notNull(),
  level: integer("level").notNull(),
  xp: integer("xp").notNull(),
  ethEarned: decimal("eth_earned", { precision: 18, scale: 8 }).notNull().default("0"),
  rank: integer("rank").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const battles = pgTable("battles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  enemyName: text("enemy_name").notNull(),
  enemyLevel: integer("enemy_level").notNull(),
  playerHealth: integer("player_health").notNull(),
  enemyHealth: integer("enemy_health").notNull(),
  status: text("status").notNull().default("active"), // 'active', 'won', 'lost'
  boardState: jsonb("board_state").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCharacterSchema = createInsertSchema(characters).omit({ id: true });
export const insertQuestSchema = createInsertSchema(quests).omit({ id: true, createdAt: true });
export const insertFitnessDataSchema = createInsertSchema(fitnessData).omit({ id: true, date: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });
export const insertBattleSchema = createInsertSchema(battles).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Quest = typeof quests.$inferSelect;
export type InsertQuest = z.infer<typeof insertQuestSchema>;
export type FitnessData = typeof fitnessData.$inferSelect;
export type InsertFitnessData = z.infer<typeof insertFitnessDataSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type Battle = typeof battles.$inferSelect;
export type InsertBattle = z.infer<typeof insertBattleSchema>;
