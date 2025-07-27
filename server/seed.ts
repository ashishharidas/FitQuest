import { db } from "./db";
import { users, characters, quests, fitnessData, transactions, leaderboard, storeItems, arenaProgress } from "@shared/schema";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Create sample users
    const usersData = [
      {
        id: "mock-user-id",
        username: "AlexWarrior",
        email: "alex@fitquest.com",
        walletAddress: "0x742d35Cc6670C5C2DFeF62A47D8Bd3E7Af2",
      },
      {
        id: "user-1",
        username: "FitLegend47",
        email: "legend@fitquest.com",
        walletAddress: "0x123d35Cc6670C5C2DFeF62A47D8Bd3E7Af3",
      },
      {
        id: "user-2",
        username: "WarriorRex",
        email: "rex@fitquest.com",
        walletAddress: "0x456d35Cc6670C5C2DFeF62A47D8Bd3E7Af4",
      },
      {
        id: "user-3",
        username: "FitQueen99",
        email: "queen@fitquest.com",
        walletAddress: "0x789d35Cc6670C5C2DFeF62A47D8Bd3E7Af5",
      },
    ];

    for (const userData of usersData) {
      await db
        .insert(users)
        .values(userData)
        .onConflictDoNothing();
    }

    console.log("✅ Created users:", usersData.length);

    // Create character
    const [character] = await db
      .insert(characters)
      .values({
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
      })
      .onConflictDoNothing()
      .returning();

    console.log("✅ Created character:", character?.name || "existing");

    // Create sample quests
    const questsData = [
      {
        id: "quest-steps-1",
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
      },
      {
        id: "quest-calories-1",
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
      },
      {
        id: "quest-marathon-1",
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
      },
    ];

    for (const quest of questsData) {
      await db
        .insert(quests)
        .values(quest)
        .onConflictDoNothing();
    }

    console.log("✅ Created quests:", questsData.length);

    // Create fitness data
    const fitnessToday = {
      userId: "mock-user-id",
      date: new Date(),
      steps: 8432,
      calories: 487,
      heartRate: 85,
      activeMinutes: 65,
      distance: "6.2",
      workoutType: "running",
    };

    await db
      .insert(fitnessData)
      .values(fitnessToday)
      .onConflictDoNothing();

    console.log("✅ Created fitness data");

    // Create transactions
    const transactionsData = [
      {
        userId: "mock-user-id",
        type: "quest_reward",
        amount: "0.01",
        description: "10,000 Steps Quest Completion",
        txHash: "0x123...abc",
        status: "completed",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        userId: "mock-user-id",
        type: "challenge_reward",
        amount: "0.05",
        description: "Weekly Challenge - Strength Seeker",
        txHash: "0x456...def",
        status: "completed",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ];

    for (const transaction of transactionsData) {
      await db
        .insert(transactions)
        .values(transaction)
        .onConflictDoNothing();
    }

    console.log("✅ Created transactions:", transactionsData.length);

    // Create leaderboard entries
    const leaderboardData = [
      {
        id: "mock-user-id",
        userId: "mock-user-id",
        username: "AlexWarrior",
        level: 15,
        xp: 2847,
        ethEarned: "2.47",
        rank: 47,
      },
      {
        id: "user-1",
        userId: "user-1",
        username: "FitLegend47",
        level: 42,
        xp: 94750,
        ethEarned: "12.45",
        rank: 1,
      },
      {
        id: "user-2",
        userId: "user-2",
        username: "WarriorRex",
        level: 38,
        xp: 87234,
        ethEarned: "10.12",
        rank: 2,
      },
      {
        id: "user-3",
        userId: "user-3",
        username: "FitQueen99",
        level: 35,
        xp: 79891,
        ethEarned: "8.77",
        rank: 3,
      },
    ];

    for (const entry of leaderboardData) {
      await db
        .insert(leaderboard)
        .values(entry)
        .onConflictDoNothing();
    }

    console.log("✅ Created leaderboard entries:", leaderboardData.length);

    // Create store items
    const storeItemsData = [
      {
        id: "strength-boost-1",
        name: "Iron Weights",
        description: "Basic iron weights to build raw strength",
        statType: "strength",
        statIncrease: 5,
        ethCost: "0.01",
        category: "upgrade",
        isActive: true,
      },
      {
        id: "strength-boost-2",
        name: "Titanium Barbell",
        description: "Advanced titanium equipment for serious strength gains",
        statType: "strength",
        statIncrease: 10,
        ethCost: "0.02",
        category: "upgrade",
        isActive: true,
      },
      {
        id: "stamina-boost-1",
        name: "Endurance Elixir",
        description: "Mystical potion that enhances cardiovascular endurance",
        statType: "stamina",
        statIncrease: 5,
        ethCost: "0.01",
        category: "upgrade",
        isActive: true,
      },
      {
        id: "stamina-boost-2",
        name: "Marathon Runner's Boots",
        description: "Legendary boots that boost stamina significantly",
        statType: "stamina",
        statIncrease: 10,
        ethCost: "0.02",
        category: "upgrade",
        isActive: true,
      },
      {
        id: "agility-boost-1",
        name: "Swift Gloves",
        description: "Lightweight gloves that improve speed and agility",
        statType: "agility",
        statIncrease: 5,
        ethCost: "0.01",
        category: "upgrade",
        isActive: true,
      },
      {
        id: "agility-boost-2",
        name: "Wind Walker Shoes",
        description: "Enchanted footwear that grants incredible agility",
        statType: "agility",
        statIncrease: 10,
        ethCost: "0.02",
        category: "upgrade",
        isActive: true,
      },
      {
        id: "health-boost-1",
        name: "Healing Herbs",
        description: "Natural herbs that boost overall health and vitality",
        statType: "health",
        statIncrease: 5,
        ethCost: "0.01",
        category: "upgrade",
        isActive: true,
      },
      {
        id: "health-boost-2",
        name: "Phoenix Feather",
        description: "Rare feather that provides massive health enhancement",
        statType: "health",
        statIncrease: 10,
        ethCost: "0.02",
        category: "upgrade",
        isActive: true,
      },
    ];

    for (const item of storeItemsData) {
      await db
        .insert(storeItems)
        .values(item)
        .onConflictDoNothing();
    }

    console.log("✅ Created store items:", storeItemsData.length);

    // Create arena progress for users
    const arenaProgressData = [
      {
        userId: "mock-user-id",
        currentLevel: 3,
        currentSeries: 1,
        battlesCompletedToday: 1,
        totalBattlesWon: 5,
        lastBattleDate: new Date(),
      },
      {
        userId: "user-1",
        currentLevel: 7,
        currentSeries: 2,
        battlesCompletedToday: 0,
        totalBattlesWon: 15,
        lastBattleDate: new Date(Date.now() - 86400000), // Yesterday
      },
    ];

    for (const progress of arenaProgressData) {
      await db
        .insert(arenaProgress)
        .values(progress)
        .onConflictDoNothing();
    }

    console.log("✅ Created arena progress:", arenaProgressData.length);

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed().then(() => process.exit(0));
}

export { seed };