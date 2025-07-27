import { motion } from "framer-motion";
import { CheckCircle, Flame, Lock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Quest } from "@shared/schema";

export default function QuestCard() {
  const { toast } = useToast();
  
  // Mock user ID for demo - in production this would come from authentication
  const userId = "mock-user-id";

  const { data: quests } = useQuery<Quest[]>({
    queryKey: ["/api/quests", userId],
  });

  const claimRewardMutation = useMutation({
    mutationFn: async (questId: string) => {
      const response = await fetch(`/api/quest/${questId}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to claim reward");
      }
      return response.json();
    },
    onSuccess: (data, questId) => {
      // Find the quest to get its details
      const quest = quests?.find(q => q.id === questId);
      if (quest) {
        toast({
          title: "Reward Claimed!",
          description: `${quest.name} - ${quest.ethReward} ETH added to your wallet`,
        });
      }
      // Invalidate and refetch quests and character data
      queryClient.invalidateQueries({ queryKey: ["/api/quests", userId] });
      queryClient.invalidateQueries({ queryKey: ["/api/character", userId] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions", userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Claim Failed",
        description: error.message || "Unable to claim reward",
        variant: "destructive",
      });
    },
  });

  const handleClaimReward = (questId: string) => {
    claimRewardMutation.mutate(questId);
  };

  if (!quests) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Loading Quests...</h3>
      </div>
    );
  }

  const dailyQuests = quests.filter(q => q.type === "daily");
  const weeklyQuests = quests.filter(q => q.type === "weekly");

  const getQuestIcon = (questName: string) => {
    if (questName.includes("Steps") || questName.includes("steps")) return Flame;
    if (questName.includes("Calorie") || questName.includes("calories")) return Flame;
    if (questName.includes("Heart") || questName.includes("heart")) return Target;
    return Target;
  };

  const getQuestStatus = (quest: Quest) => {
    if (quest.claimed) return { label: "CLAIMED", color: "text-muted-foreground bg-muted/20", border: "border-muted/50" };
    if (quest.completed) return { label: "COMPLETE", color: "text-neon-green bg-neon-green/20", border: "border-neon-green/50" };
    return { label: "ACTIVE", color: "text-electric-blue bg-electric-blue/20", border: "border-electric-blue/50" };
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Daily Quests</h3>
      
      <div className="space-y-3">
        {dailyQuests.map((quest, index) => {
          const Icon = getQuestIcon(quest.name);
          const status = getQuestStatus(quest);
          const progress = quest.targetValue > 0 ? (quest.currentValue / quest.targetValue) * 100 : 0;
          
          return (
            <motion.div 
              key={quest.id}
              className={`glassmorphism rounded-lg p-4 border ${status.border} ${quest.claimed ? 'opacity-75' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: quest.claimed ? 0.75 : 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {quest.completed && !quest.claimed ? (
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                  ) : (
                    <Icon className="w-5 h-5 text-red-500" />
                  )}
                  <h4 className="font-medium">{quest.name}</h4>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{quest.description}</p>
              
              {!quest.completed && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{quest.currentValue} / {quest.targetValue}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, progress)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-xs">+{quest.xpReward} XP</span>
                  <span className="text-xs text-gold">+{quest.ethReward} ETH</span>
                </div>
                {quest.completed && !quest.claimed ? (
                  <Button 
                    className="bg-gradient-to-r from-neon-green to-emerald-600 hover:shadow-lg hover:shadow-neon-green/25 transition-all"
                    onClick={() => handleClaimReward(quest.id)}
                    disabled={claimRewardMutation.isPending}
                  >
                    {claimRewardMutation.isPending ? "Claiming..." : "Claim Reward"}
                  </Button>
                ) : quest.claimed ? (
                  <span className="text-xs text-muted-foreground">Reward Claimed</span>
                ) : (
                  <span className="text-xs text-muted-foreground">{Math.round(progress)}% Complete</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly Challenges */}
      {weeklyQuests.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-4 mt-8">Weekly Challenges</h3>
          <div className="space-y-3">
            {weeklyQuests.map((quest, index) => {
              const progress = quest.targetValue > 0 ? (quest.currentValue / quest.targetValue) * 100 : 0;
              const status = getQuestStatus(quest);
              
              return (
                <motion.div 
                  key={quest.id}
                  className={`glassmorphism rounded-lg p-4 border ${status.border}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-purple-600 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{quest.name}</h4>
                      <p className="text-sm text-muted-foreground">{quest.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  
                  {!quest.completed && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{(quest.currentValue / 1000).toFixed(1)} / {(quest.targetValue / 1000).toFixed(1)} km</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-neon-purple to-purple-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, progress)}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">+{quest.xpReward} XP</span>
                      <span className="text-sm text-gold font-medium">+{quest.ethReward} ETH</span>
                    </div>
                    {quest.completed && !quest.claimed ? (
                      <Button 
                        className="bg-gradient-to-r from-neon-green to-emerald-600 hover:shadow-lg hover:shadow-neon-green/25 transition-all"
                        onClick={() => handleClaimReward(quest.id)}
                        disabled={claimRewardMutation.isPending}
                      >
                        {claimRewardMutation.isPending ? "Claiming..." : "Claim Reward"}
                      </Button>
                    ) : quest.claimed ? (
                      <span className="text-xs text-muted-foreground">Reward Claimed</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">{Math.round(progress)}% Complete</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
