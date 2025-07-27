import { motion } from "framer-motion";
import { CheckCircle, Flame, Lock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function QuestCard() {
  const { toast } = useToast();

  const handleClaimReward = (questName: string, ethAmount: string) => {
    toast({
      title: "Reward Claimed!",
      description: `${questName} - ${ethAmount} ETH added to your wallet`,
    });
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Daily Quests</h3>
      
      <div className="space-y-3">
        {/* Completed Quest */}
        <motion.div 
          className="glassmorphism rounded-lg p-4 border border-neon-green/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-neon-green" />
              <h4 className="font-medium">10,000 Steps Journey</h4>
            </div>
            <span className="text-xs bg-neon-green/20 text-neon-green px-2 py-1 rounded">COMPLETE</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Walk 10,000 steps to unlock the Forest Path</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xs">+50 XP</span>
              <span className="text-xs text-gold">+0.01 ETH</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-neon-green to-emerald-600 hover:shadow-lg hover:shadow-neon-green/25 transition-all"
              onClick={() => handleClaimReward("10,000 Steps Journey", "0.01")}
            >
              Claim Reward
            </Button>
          </div>
        </motion.div>

        {/* Active Quest */}
        <motion.div 
          className="glassmorphism rounded-lg p-4 border border-electric-blue/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-red-500" />
              <h4 className="font-medium">Calorie Crusher</h4>
            </div>
            <span className="text-xs bg-electric-blue/20 text-electric-blue px-2 py-1 rounded">ACTIVE</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Burn 500 calories to defeat the Couch Potato King</p>
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>487 / 500</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div 
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "97%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xs">+75 XP</span>
              <span className="text-xs text-gold">+0.015 ETH</span>
            </div>
            <span className="text-xs text-muted-foreground">97% Complete</span>
          </div>
        </motion.div>

        {/* Locked Quest */}
        <motion.div 
          className="glassmorphism rounded-lg p-4 border border-muted/50 opacity-75"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.75, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <h4 className="font-medium text-muted-foreground">Heart Rate Hero</h4>
            </div>
            <span className="text-xs bg-muted/20 text-muted-foreground px-2 py-1 rounded">LOCKED</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Maintain elevated heart rate for 30 minutes</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xs text-muted-foreground">+100 XP</span>
              <span className="text-xs text-muted-foreground">+0.02 ETH</span>
            </div>
            <span className="text-xs text-muted-foreground">Complete previous quest</span>
          </div>
        </motion.div>
      </div>

      {/* Weekly Challenges */}
      <h3 className="text-lg font-semibold mb-4 mt-8">Weekly Challenges</h3>
      <motion.div 
        className="glassmorphism rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-purple-600 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">Marathon Master</h4>
            <p className="text-sm text-muted-foreground">Run 25km total this week</p>
          </div>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>18.5 / 25.0 km</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <motion.div 
              className="h-full bg-gradient-to-r from-neon-purple to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "74%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">+300 XP</span>
            <span className="text-sm text-gold font-medium">+0.05 ETH</span>
          </div>
          <span className="text-xs text-muted-foreground">74% Complete</span>
        </div>
      </motion.div>
    </div>
  );
}
