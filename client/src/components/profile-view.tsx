import { motion } from "framer-motion";
import { 
  Footprints, 
  Flame, 
  Target, 
  Zap, 
  Crown, 
  Star, 
  Bell, 
  Watch, 
  Users 
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function ProfileView() {
  const achievements = [
    { icon: Footprints, name: "First Steps", description: "1,000 steps", color: "bg-gold", unlocked: true },
    { icon: Flame, name: "Calorie Burner", description: "500 calories", color: "bg-red-500", unlocked: true },
    { icon: Target, name: "Quest Master", description: "10 quests", color: "bg-electric-blue", unlocked: true },
    { icon: Zap, name: "Warrior", description: "Level 15", color: "bg-neon-purple", unlocked: true },
    { icon: Crown, name: "Champion", description: "Level 25", color: "bg-slate-600", unlocked: false },
    { icon: Star, name: "Legend", description: "Level 50", color: "bg-slate-600", unlocked: false },
  ];

  return (
    <div className="p-4">
      {/* Profile Header */}
      <motion.div 
        className="glassmorphism rounded-lg p-6 text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
          alt="User Profile" 
          className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-electric-blue"
        />
        <h3 className="text-xl font-bold mb-1">Alex Warrior</h3>
        <p className="text-muted-foreground text-sm mb-4">Joined January 2024 • Warrior Rank</p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-lg font-bold">47</div>
            <div className="text-xs text-muted-foreground">Global Rank</div>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-lg font-bold">2.47</div>
            <div className="text-xs text-muted-foreground">ETH Earned</div>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-lg font-bold">87</div>
            <div className="text-xs text-muted-foreground">Quests Done</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Achievements */}
      <h4 className="font-semibold mb-3">Achievements</h4>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {achievements.map((achievement, index) => (
          <motion.div 
            key={achievement.name}
            className={`glassmorphism rounded-lg p-3 text-center ${
              !achievement.unlocked ? "opacity-50" : ""
            }`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: achievement.unlocked ? 1 : 0.5, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={achievement.unlocked ? { scale: 1.05 } : {}}
          >
            <div className={`w-8 h-8 ${achievement.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>
              <achievement.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs font-medium">{achievement.name}</div>
            <div className="text-xs text-muted-foreground">{achievement.description}</div>
          </motion.div>
        ))}
      </div>

      {/* Settings */}
      <h4 className="font-semibold mb-3">Settings</h4>
      <div className="space-y-3">
        {[
          { icon: Bell, label: "Push Notifications", enabled: true },
          { icon: Watch, label: "Smartwatch Sync", enabled: true },
          { icon: Users, label: "Social Features", enabled: false },
        ].map((setting, index) => (
          <motion.div 
            key={setting.label}
            className="glassmorphism rounded-lg p-4 flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <setting.icon className="w-5 h-5 text-muted-foreground" />
              <span>{setting.label}</span>
            </div>
            <Switch defaultChecked={setting.enabled} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
