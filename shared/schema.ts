import { sql, relations } from "drizzle-orm";
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
  strength: integer("strength").notNull().default(25),
  stamina: integer("stamina").notNull().default(30),
  agility: integer("agility").notNull().default(20),
  health: integer("health").notNull().default(35),
  ethBalance: decimal("eth_balance", { precision: 18, scale: 8 }).notNull().default("0.1"),
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

export const arenaProgress = pgTable("arena_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  currentLevel: integer("current_level").notNull().default(1), // 1-7
  currentSeries: integer("current_series").notNull().default(1),
  battlesCompletedToday: integer("battles_completed_today").notNull().default(0),
  lastBattleDate: timestamp("last_battle_date").defaultNow(),
  totalBattlesWon: integer("total_battles_won").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const storeItems = pgTable("store_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  statType: text("stat_type").notNull(), // 'strength', 'stamina', 'agility', 'health'
  statIncrease: integer("stat_increase").notNull(),
  ethCost: decimal("eth_cost", { precision: 18, scale: 8 }).notNull(),
  maxPurchases: integer("max_purchases"), // null for unlimited
  category: text("category").notNull().default("upgrade"), // 'upgrade', 'equipment', 'consumable'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const storePurchases = pgTable("store_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  itemId: varchar("item_id").notNull().references(() => storeItems.id),
  quantity: integer("quantity").notNull().default(1),
  totalCost: decimal("total_cost", { precision: 18, scale: 8 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  character: one(characters),
  quests: many(quests),
  fitnessData: many(fitnessData),
  transactions: many(transactions),
  battles: many(battles),
  arenaProgress: one(arenaProgress),
  storePurchases: many(storePurchases),
}));

export const charactersRelations = relations(characters, ({ one }) => ({
  user: one(users, {
    fields: [characters.userId],
    references: [users.id],
  }),
}));

export const questsRelations = relations(quests, ({ one }) => ({
  user: one(users, {
    fields: [quests.userId],
    references: [users.id],
  }),
}));

export const fitnessDataRelations = relations(fitnessData, ({ one }) => ({
  user: one(users, {
    fields: [fitnessData.userId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const battlesRelations = relations(battles, ({ one }) => ({
  user: one(users, {
    fields: [battles.userId],
    references: [users.id],
  }),
}));

export const arenaProgressRelations = relations(arenaProgress, ({ one }) => ({
  user: one(users, {
    fields: [arenaProgress.userId],
    references: [users.id],
  }),
}));

export const storeItemsRelations = relations(storeItems, ({ many }) => ({
  purchases: many(storePurchases),
}));

export const storePurchasesRelations = relations(storePurchases, ({ one }) => ({
  user: one(users, {
    fields: [storePurchases.userId],
    references: [users.id],
  }),
  item: one(storeItems, {
    fields: [storePurchases.itemId],
    references: [storeItems.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCharacterSchema = createInsertSchema(characters).omit({ id: true });
export const insertQuestSchema = createInsertSchema(quests).omit({ id: true, createdAt: true });
export const insertFitnessDataSchema = createInsertSchema(fitnessData).omit({ id: true, date: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });
export const insertBattleSchema = createInsertSchema(battles).omit({ id: true, createdAt: true });
export const insertArenaProgressSchema = createInsertSchema(arenaProgress).omit({ id: true, createdAt: true });
export const insertStoreItemSchema = createInsertSchema(storeItems).omit({ id: true, createdAt: true });
export const insertStorePurchaseSchema = createInsertSchema(storePurchases).omit({ id: true, createdAt: true });

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
export type ArenaProgress = typeof arenaProgress.$inferSelect;
export type InsertArenaProgress = z.infer<typeof insertArenaProgressSchema>;
export type StoreItem = typeof storeItems.$inferSelect;
export type InsertStoreItem = z.infer<typeof insertStoreItemSchema>;
export type StorePurchase = typeof storePurchases.$inferSelect;
export type InsertStorePurchase = z.infer<typeof insertStorePurchaseSchema>;
