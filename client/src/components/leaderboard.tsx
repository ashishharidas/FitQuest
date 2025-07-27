import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

type LeaderboardType = "xp" | "level" | "eth";

export default function Leaderboard() {
  const [activeFilter, setActiveFilter] = useState<LeaderboardType>("xp");

  const topPlayers = [
    {
      rank: 1,
      username: "FitLegend47",
      level: 42,
      evolution: "Legend",
      xp: 94750,
      eth: "12.45",
      avatar: "from-gold to-yellow-500"
    },
    {
      rank: 2,
      username: "WarriorRex",
      level: 38,
      evolution: "Champion",
      xp: 87234,
      eth: "10.12",
      avatar: "from-slate-400 to-slate-500"
    },
    {
      rank: 3,
      username: "FitQueen99",
      level: 35,
      evolution: "Champion",
      xp: 79891,
      eth: "8.77",
      avatar: "from-orange-500 to-orange-600"
    }
  ];

  const otherPlayers = [
    { rank: 48, username: "StepMaster", xp: 2756 },
    { rank: 49, username: "RunnerUp", xp: 2634 },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { bg: "bg-gold", text: "text-dark-bg" };
    if (rank === 2) return { bg: "bg-slate-400", text: "text-dark-bg" };
    if (rank === 3) return { bg: "bg-orange-600", text: "text-white" };
    return { bg: "bg-muted", text: "text-foreground" };
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Global Leaderboard</h3>
      
      {/* Filter Tabs */}
      <div className="flex bg-muted rounded-lg p-1 mb-4">
        {[
          { key: "xp", label: "XP" },
          { key: "level", label: "Level" },
          { key: "eth", label: "ETH" }
        ].map((filter) => (
          <Button
            key={filter.key}
            variant="ghost"
            size="sm"
            className={`flex-1 rounded-md ${
              activeFilter === filter.key 
                ? "bg-electric-blue text-white" 
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveFilter(filter.key as LeaderboardType)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Top 3 */}
      <motion.div 
        className="glassmorphism rounded-lg p-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-2 mb-3">
          <Trophy className="w-5 h-5 text-gold" />
          <h4 className="font-medium">Top Champions</h4>
        </div>
        <div className="space-y-3">
          {topPlayers.map((player, index) => {
            const badge = getRankBadge(player.rank);
            return (
              <motion.div
                key={player.rank}
                className={`flex items-center space-x-3 p-2 rounded-lg ${
                  player.rank === 1 ? "bg-gold/10" :
                  player.rank === 2 ? "bg-slate-600/10" : "bg-orange-600/10"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-8 h-8 ${badge.bg} rounded-full flex items-center justify-center ${badge.text} font-bold text-sm`}>
                  {player.rank}
                </div>
                <div className={`w-10 h-10 bg-gradient-to-r ${player.avatar} rounded-full`}></div>
                <div className="flex-1">
                  <div className="font-medium flex items-center space-x-1">
                    <span>{player.username}</span>
                    {player.rank === 1 && <Crown className="w-4 h-4 text-gold" />}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Level {player.level} • {player.evolution}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {activeFilter === "xp" && `${player.xp.toLocaleString()} XP`}
                    {activeFilter === "level" && `Level ${player.level}`}
                    {activeFilter === "eth" && `${player.eth} ETH`}
                  </div>
                  {activeFilter === "xp" && (
                    <div className="text-xs text-gold">{player.eth} ETH</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Your Rank */}
      <motion.div 
        className="glassmorphism rounded-lg p-4 border border-electric-blue/50 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-electric-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
            47
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-electric-blue to-neon-purple rounded-full"></div>
          <div className="flex-1">
            <div className="font-medium flex items-center space-x-1">
              <span>You</span>
              <Zap className="w-4 h-4 text-electric-blue" />
            </div>
            <div className="text-xs text-muted-foreground">Level 15 • Warrior</div>
          </div>
          <div className="text-right">
            <div className="font-bold">2,847 XP</div>
            <div className="text-xs text-gold">2.47 ETH</div>
          </div>
        </div>
      </motion.div>

      {/* More Rankings */}
      <div className="space-y-2">
        {otherPlayers.map((player, index) => (
          <motion.div 
            key={player.rank}
            className="flex items-center justify-between p-3 glassmorphism rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm w-6">{player.rank}</span>
              <div className={`w-8 h-8 bg-gradient-to-r ${
                index % 2 === 0 ? "from-blue-500 to-blue-600" : "from-green-500 to-green-600"
              } rounded-full`}></div>
              <span className="font-medium">{player.username}</span>
            </div>
            <span className="text-sm">{player.xp.toLocaleString()} XP</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
