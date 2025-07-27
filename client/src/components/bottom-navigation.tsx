import { motion } from "framer-motion";
import { Home, ScrollText, Swords, Wallet, Trophy, User, ShoppingBag } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "dashboard", icon: Home, label: "Dashboard" },
  { id: "quests", icon: ScrollText, label: "Quests" },
  { id: "arena", icon: Swords, label: "Arena" },
  { id: "store", icon: ShoppingBag, label: "Store" },
  { id: "wallet", icon: Wallet, label: "Wallet" },
  { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
];

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-card border-t border-border z-50">
      <div className="glassmorphism flex justify-around py-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`flex flex-col items-center p-2 transition-colors ${
              activeTab === tab.id ? "text-electric-blue" : "text-muted-foreground"
            }`}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <tab.icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 w-8 h-0.5 bg-electric-blue rounded-full"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
