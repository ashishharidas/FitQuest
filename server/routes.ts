import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertQuestSchema, insertFitnessDataSchema, insertTransactionSchema, insertBattleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/user/wallet/:address", async (req, res) => {
    try {
      const user = await storage.getUserByWallet(req.params.address);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/user", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Character routes
  app.get("/api/character/:userId", async (req, res) => {
    try {
      const character = await storage.getCharacter(req.params.userId);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/character/:userId", async (req, res) => {
    try {
      const character = await storage.updateCharacter(req.params.userId, req.body);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Quest routes
  app.get("/api/quests/:userId", async (req, res) => {
    try {
      const quests = await storage.getUserQuests(req.params.userId);
      res.json(quests);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/quest", async (req, res) => {
    try {
      const questData = insertQuestSchema.parse(req.body);
      const quest = await storage.createQuest(questData);
      res.status(201).json(quest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quest data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/quest/:id", async (req, res) => {
    try {
      const quest = await storage.updateQuest(req.params.id, req.body);
      if (!quest) {
        return res.status(404).json({ message: "Quest not found" });
      }
      res.json(quest);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/quest/:id/claim", async (req, res) => {
    try {
      const quest = await storage.getQuest(req.params.id);
      if (!quest) {
        return res.status(404).json({ message: "Quest not found" });
      }
      if (!quest.completed) {
        return res.status(400).json({ message: "Quest not completed" });
      }
      if (quest.claimed) {
        return res.status(400).json({ message: "Quest already claimed" });
      }

      // Update quest as claimed
      const updatedQuest = await storage.updateQuest(req.params.id, { claimed: true });
      
      // Create transaction record
      await storage.createTransaction({
        userId: quest.userId,
        type: "quest_reward",
        amount: quest.ethReward,
        description: `${quest.name} Quest Completion`,
        status: "completed",
      });

      // Update character XP
      const character = await storage.getCharacter(quest.userId);
      if (character) {
        const newXp = character.xp + quest.xpReward;
        const newLevel = Math.floor(newXp / 200) + 1; // Simple level calculation
        await storage.updateCharacter(quest.userId, { 
          xp: newXp, 
          level: newLevel,
          evolutionStage: Math.min(4, Math.floor(newLevel / 10) + 1)
        });
      }

      res.json(updatedQuest);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Fitness data routes
  app.get("/api/fitness/:userId", async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const fitnessData = await storage.getFitnessData(req.params.userId, date);
      res.json(fitnessData);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/fitness", async (req, res) => {
    try {
      const fitnessData = insertFitnessDataSchema.parse(req.body);
      const data = await storage.createFitnessData(fitnessData);
      
      // Update quest progress based on fitness data
      const activeQuests = await storage.getActiveQuests(fitnessData.userId);
      for (const quest of activeQuests) {
        let progressValue = 0;
        if (quest.name.includes("Steps") || quest.name.includes("steps")) {
          progressValue = fitnessData.steps || 0;
        } else if (quest.name.includes("Calorie") || quest.name.includes("calories")) {
          progressValue = fitnessData.calories || 0;
        }
        
        if (progressValue > 0) {
          const newCurrentValue = Math.min(quest.targetValue, quest.currentValue + progressValue);
          const completed = newCurrentValue >= quest.targetValue;
          await storage.updateQuest(quest.id, { 
            currentValue: newCurrentValue, 
            completed 
          });
        }
      }
      
      res.status(201).json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid fitness data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Transaction routes
  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const transactions = await storage.getUserTransactions(req.params.userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Battle routes
  app.get("/api/battle/:userId", async (req, res) => {
    try {
      const battle = await storage.getUserBattle(req.params.userId);
      if (!battle) {
        return res.status(404).json({ message: "No active battle found" });
      }
      res.json(battle);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/battle", async (req, res) => {
    try {
      const battleData = insertBattleSchema.parse(req.body);
      const battle = await storage.createBattle(battleData);
      res.status(201).json(battle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid battle data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/battle/:id", async (req, res) => {
    try {
      const battle = await storage.updateBattle(req.params.id, req.body);
      if (!battle) {
        return res.status(404).json({ message: "Battle not found" });
      }
      res.json(battle);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Mock smartwatch sync endpoint
  app.post("/api/sync-fitness/:userId", async (req, res) => {
    try {
      // Simulate smartwatch data sync
      const mockFitnessData = {
        userId: req.params.userId,
        steps: Math.floor(Math.random() * 5000) + 6000,
        calories: Math.floor(Math.random() * 300) + 400,
        heartRate: Math.floor(Math.random() * 40) + 60,
        activeMinutes: Math.floor(Math.random() * 60) + 30,
        distance: (Math.random() * 5 + 3).toFixed(2),
        workoutType: ["running", "cycling", "strength", "yoga"][Math.floor(Math.random() * 4)],
      };

      const data = await storage.createFitnessData(mockFitnessData);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Store routes
  app.get("/api/store/items", async (req, res) => {
    try {
      const items = await storage.getStoreItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching store items:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/store/purchase", async (req, res) => {
    try {
      const { userId, itemId, quantity = 1 } = req.body;
      
      // Get the item and character
      const [item, character] = await Promise.all([
        storage.getStoreItem(itemId),
        storage.getCharacter(userId),
      ]);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      
      const totalCost = parseFloat(item.ethCost) * quantity;
      const currentBalance = parseFloat(character.ethBalance);
      
      if (currentBalance < totalCost) {
        return res.status(400).json({ message: "Insufficient ETH balance" });
      }
      
      // Create purchase record
      const purchase = await storage.createPurchase({
        userId,
        itemId,
        quantity,
        totalCost: totalCost.toString(),
      });
      
      // Update character stats and balance
      const statUpdates: Partial<Character> = {
        ethBalance: (currentBalance - totalCost).toString(),
      };
      
      // Apply stat increase with 100 max cap
      if (item.statType === "strength") {
        statUpdates.strength = Math.min(100, character.strength + (item.statIncrease * quantity));
      } else if (item.statType === "stamina") {
        statUpdates.stamina = Math.min(100, character.stamina + (item.statIncrease * quantity));
      } else if (item.statType === "agility") {
        statUpdates.agility = Math.min(100, character.agility + (item.statIncrease * quantity));
      } else if (item.statType === "health") {
        statUpdates.health = Math.min(100, character.health + (item.statIncrease * quantity));
      }
      
      await storage.updateCharacter(userId, statUpdates);
      
      res.json({ purchase, message: "Purchase successful" });
    } catch (error) {
      console.error("Error processing purchase:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Arena routes
  app.get("/api/arena/progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const progress = await storage.getArenaProgress(userId);
      
      if (!progress) {
        // Create initial progress if none exists
        const newProgress = await storage.createArenaProgress({
          userId,
          currentLevel: 1,
          currentSeries: 1,
          battlesCompletedToday: 0,
          totalBattlesWon: 0,
        });
        return res.json(newProgress);
      }
      
      res.json(progress);
    } catch (error) {
      console.error("Error fetching arena progress:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/arena/battle", async (req, res) => {
    try {
      const { userId } = req.body;
      
      const [character, progress] = await Promise.all([
        storage.getCharacter(userId),
        storage.getArenaProgress(userId),
      ]);
      
      if (!character || !progress) {
        return res.status(404).json({ message: "Character or progress not found" });
      }
      
      // Check if user can battle today (max 2 battles per day)
      const today = new Date().toDateString();
      const lastBattleDate = progress.lastBattleDate ? new Date(progress.lastBattleDate).toDateString() : null;
      
      let battlesCompletedToday = progress.battlesCompletedToday;
      if (lastBattleDate !== today) {
        battlesCompletedToday = 0; // Reset for new day
      }
      
      if (battlesCompletedToday >= 2) {
        return res.status(400).json({ message: "Maximum battles per day reached" });
      }
      
      // Generate enemy based on current level
      const enemyLevels = [
        { name: "Shadow Goblin", health: 80, xp: 15 },
        { name: "Stone Orc", health: 120, xp: 25 },
        { name: "Fire Demon", health: 160, xp: 35 },
        { name: "Ice Giant", health: 200, xp: 45 },
        { name: "Dark Knight", health: 240, xp: 55 },
        { name: "Ancient Dragon", health: 280, xp: 65 },
        { name: "Void Lord", health: 320, xp: 75 },
      ];
      
      const enemy = enemyLevels[progress.currentLevel - 1];
      const heroXP = character.xp;
      
      // Battle outcome based on hero XP vs enemy XP
      const playerWins = heroXP > enemy.xp;
      
      let updates: Partial<ArenaProgress> = {
        battlesCompletedToday: battlesCompletedToday + 1,
        lastBattleDate: new Date(),
      };
      
      let characterUpdates: Partial<Character> = {};
      
      if (playerWins) {
        updates.totalBattlesWon = progress.totalBattlesWon + 1;
        
        // Level progression
        if (progress.currentLevel < 7) {
          updates.currentLevel = progress.currentLevel + 1;
        } else {
          // New series starts
          updates.currentLevel = 1;
          updates.currentSeries = progress.currentSeries + 1;
        }
        
        // Reward XP and ETH
        const xpReward = 20 + (progress.currentLevel * 5);
        const ethReward = 0.01 + (progress.currentLevel * 0.005);
        
        characterUpdates.xp = character.xp + xpReward;
        characterUpdates.ethBalance = (parseFloat(character.ethBalance) + ethReward).toString();
      }
      
      // Update progress and character
      await Promise.all([
        storage.updateArenaProgress(userId, updates),
        storage.updateCharacter(userId, characterUpdates),
      ]);
      
      res.json({ 
        result: playerWins ? "victory" : "defeat",
        enemy: enemy.name,
        playerXP: heroXP,
        enemyXP: enemy.xp,
        rewards: playerWins ? {
          xp: 20 + (progress.currentLevel * 5),
          eth: 0.01 + (progress.currentLevel * 0.005),
        } : null,
      });
    } catch (error) {
      console.error("Error processing arena battle:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
