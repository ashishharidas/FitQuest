import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CharacterDisplay from "@/components/character-display";
import FitnessStats from "@/components/fitness-stats";
import QuestCard from "@/components/quest-card";
import BattleArena from "@/components/battle-arena";
import WalletPanel from "@/components/wallet-panel";
import Leaderboard from "@/components/leaderboard";
import ProfileView from "@/components/profile-view";
import { Store } from "@/components/store";
import BottomNavigation from "@/components/bottom-navigation";
import { useQuery } from "@tanstack/react-query";
import type { User, Character, Quest, FitnessData, Transaction, LeaderboardEntry } from "@shared/schema";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock user ID for demo - in production this would come from authentication
  const userId = "mock-user-id";

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user", userId],
    enabled: false, // Disabled for demo, using mock data
  });

  const { data: character } = useQuery<Character>({
    queryKey: ["/api/character", userId],
  });

  const { data: quests } = useQuery<Quest[]>({
    queryKey: ["/api/quests", userId],
  });

  const { data: fitnessData } = useQuery<FitnessData[]>({
    queryKey: ["/api/fitness", userId],
    enabled: false, // Disabled for demo, using mock data
  });

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions", userId],
  });

  const { data: leaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CharacterDisplay />
            <FitnessStats />
          </motion.div>
        );
      case "quests":
        return (
          <motion.div
            key="quests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuestCard />
          </motion.div>
        );
      case "arena":
        return (
          <motion.div
            key="arena"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <BattleArena />
          </motion.div>
        );
      case "wallet":
        return (
          <motion.div
            key="wallet"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <WalletPanel />
          </motion.div>
        );
      case "leaderboard":
        return (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Leaderboard />
          </motion.div>
        );
      case "profile":
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ProfileView />
          </motion.div>
        );
      case "store":
        return (
          <motion.div
            key="store"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Store />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-card min-h-screen relative">
      {/* Header */}
      <div className="glassmorphism p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple flex items-center justify-center">
              <span className="text-lg font-bold">A</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">FitQuest RPG</h1>
              <p className="text-xs text-muted-foreground">Level 15 Warrior</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gradient-to-r from-gold/20 to-gold/10 px-2 py-1 rounded-lg">
              <div className="w-4 h-4 bg-gold rounded-full"></div>
              <span className="text-xs font-medium">2.47 ETH</span>
            </div>
            <button className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
              <span className="text-sm">🔔</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="pb-20 relative z-10">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
