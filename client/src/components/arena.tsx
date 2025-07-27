import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, User, Skull, Swords, Trophy, Crown, Coins, Calendar, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface ArenaProgress {
  id: string;
  userId: string;
  currentLevel: number;
  currentSeries: number;
  battlesCompletedToday: number;
  totalBattlesWon: number;
  lastBattleDate: string | null;
}

interface BattleResult {
  result: "victory" | "defeat";
  enemy: string;
  playerXP: number;
  enemyXP: number;
  rewards?: {
    xp: number;
    eth: number;
  };
}

const ENEMY_LEVELS = [
  { name: "Shadow Goblin", health: 80, xp: 15, description: "A sneaky creature lurking in the shadows", color: "from-gray-600 to-gray-800" },
  { name: "Stone Orc", health: 120, xp: 25, description: "A tough warrior with rock-hard skin", color: "from-amber-600 to-orange-800" },
  { name: "Fire Demon", health: 160, xp: 35, description: "A blazing fiend from the underworld", color: "from-red-600 to-red-800" },
  { name: "Ice Giant", health: 200, xp: 45, description: "A massive frost-covered beast", color: "from-cyan-600 to-blue-800" },
  { name: "Dark Knight", health: 240, xp: 55, description: "A fallen paladin consumed by darkness", color: "from-purple-600 to-purple-800" },
  { name: "Ancient Dragon", health: 280, xp: 65, description: "A legendary wyrm of immense power", color: "from-green-600 to-emerald-800" },
  { name: "Void Lord", health: 320, xp: 75, description: "The ultimate master of destruction", color: "from-black to-gray-900" },
];

export function Arena() {
  const { toast } = useToast();
  const [battleInProgress, setBattleInProgress] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/arena/progress", "mock-user-id"],
    queryFn: () => fetch("/api/arena/progress/mock-user-id").then(res => res.json()),
  }) as { data: ArenaProgress | undefined, isLoading: boolean };

  const { data: character } = useQuery({
    queryKey: ["/api/character/mock-user-id"],
  }) as { data: { xp: number, ethBalance: string } | undefined };

  const battleMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/arena/battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "mock-user-id" }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: (result: BattleResult) => {
      setBattleResult(result);
      queryClient.invalidateQueries({ queryKey: ["/api/arena/progress", "mock-user-id"] });
      queryClient.invalidateQueries({ queryKey: ["/api/character/mock-user-id"] });
      
      if (result.result === "victory") {
        toast({
          title: "Victory!",
          description: `Defeated ${result.enemy}! Earned ${result.rewards?.xp} XP and ${result.rewards?.eth} ETH`,
        });
      } else {
        toast({
          title: "Defeat",
          description: `${result.enemy} was too powerful. Train harder and try again!`,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Battle Failed",
        description: error.message || "Could not start battle",
        variant: "destructive",
      });
    },
  });

  const handleBattle = () => {
    setBattleInProgress(true);
    setBattleResult(null);
    
    // Simulate battle animation time
    setTimeout(() => {
      battleMutation.mutate();
      setBattleInProgress(false);
    }, 2000);
  };

  const currentEnemy = progress ? ENEMY_LEVELS[progress.currentLevel - 1] : ENEMY_LEVELS[0];
  const canBattle = progress && progress.battlesCompletedToday < 2;

  if (progressLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-700 rounded animate-pulse" />
          <div className="h-64 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Battle Arena</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-blue-400">
            <Calendar className="h-4 w-4" />
            <span>{progress?.battlesCompletedToday || 0}/2 battles today</span>
          </div>
          <div className="flex items-center gap-2 text-yellow-400">
            <Trophy className="h-4 w-4" />
            <span>{progress?.totalBattlesWon || 0} victories</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Arena Progress */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Crown className="h-5 w-5 text-yellow-400" />
              Arena Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Series</span>
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                Series {progress?.currentSeries || 1}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Current Level</span>
                <span className="text-white font-bold">{progress?.currentLevel || 1}/7</span>
              </div>
              <Progress 
                value={((progress?.currentLevel || 1) / 7) * 100} 
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-7 gap-1 mt-4">
              {ENEMY_LEVELS.map((enemy, index) => (
                <div
                  key={index}
                  className={`h-8 rounded flex items-center justify-center text-xs font-bold ${
                    (progress?.currentLevel || 1) > index + 1
                      ? "bg-green-600 text-white"
                      : (progress?.currentLevel || 1) === index + 1
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-600 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Enemy */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Skull className="h-5 w-5 text-red-400" />
              Level {progress?.currentLevel || 1} Enemy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`bg-gradient-to-r ${currentEnemy.color} p-4 rounded-lg text-center`}>
              <h3 className="text-xl font-bold text-white mb-2">{currentEnemy.name}</h3>
              <p className="text-gray-200 text-sm">{currentEnemy.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{currentEnemy.health}</div>
                <div className="text-sm text-gray-400">Health</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{currentEnemy.xp}</div>
                <div className="text-sm text-gray-400">Required XP</div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Your XP</span>
                <span className="text-white font-bold">{character?.xp || 0}</span>
              </div>
              <div className="text-center">
                {(character?.xp || 0) > currentEnemy.xp ? (
                  <Badge className="bg-green-600">Victory Predicted</Badge>
                ) : (
                  <Badge variant="destructive">Defeat Predicted</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Battle Section */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Swords className="h-5 w-5 text-orange-400" />
            Battle Arena
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence mode="wait">
            {battleInProgress && (
              <motion.div
                key="battle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <Swords className="h-16 w-16 text-orange-400" />
                </motion.div>
                <p className="text-white mt-4 text-lg">Battle in progress...</p>
              </motion.div>
            )}

            {battleResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center py-6 rounded-lg ${
                  battleResult.result === "victory" 
                    ? "bg-green-600/20 border border-green-600/50" 
                    : "bg-red-600/20 border border-red-600/50"
                }`}
              >
                <div className={`text-3xl font-bold ${
                  battleResult.result === "victory" ? "text-green-400" : "text-red-400"
                }`}>
                  {battleResult.result === "victory" ? "VICTORY!" : "DEFEAT"}
                </div>
                <p className="text-gray-300 mt-2">vs {battleResult.enemy}</p>
                {battleResult.rewards && (
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Zap className="h-4 w-4" />
                      <span>+{battleResult.rewards.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Coins className="h-4 w-4" />
                      <span>+{battleResult.rewards.eth} ETH</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {!battleInProgress && !battleResult && (
              <motion.div
                key="ready"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6"
              >
                <div className="text-gray-300 mb-4">
                  Ready to face {currentEnemy.name}?
                </div>
                <Button
                  onClick={handleBattle}
                  disabled={!canBattle || battleMutation.isPending}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  size="lg"
                >
                  {!canBattle ? "Daily Limit Reached (2/2)" : "Start Battle"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {battleResult && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={() => setBattleResult(null)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                {canBattle ? "Battle Again" : "View Progress"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}