import { motion } from "framer-motion";
import { Footprints, Flame } from "lucide-react";

export default function FitnessStats() {
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const streakData = [true, true, true, true, true, true, true]; // All completed for demo

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-3">Today's Progress</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.div 
          className="glassmorphism rounded-lg p-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Footprints className="w-5 h-5 text-electric-blue" />
            <span className="text-xs text-muted-foreground">Goal: 10k</span>
          </div>
          <div className="text-2xl font-bold mb-1">8,432</div>
          <div className="text-sm text-muted-foreground">Steps</div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <motion.div 
              className="h-full bg-electric-blue rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "84%" }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="glassmorphism rounded-lg p-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Flame className="w-5 h-5 text-red-500" />
            <span className="text-xs text-muted-foreground">Goal: 600</span>
          </div>
          <div className="text-2xl font-bold mb-1">487</div>
          <div className="text-sm text-muted-foreground">Calories</div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <motion.div 
              className="h-full bg-red-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "81%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="glassmorphism rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Weekly Streak</h4>
          <span className="text-gold font-bold">🔥 7 days</span>
        </div>
        <div className="flex justify-between">
          {weekDays.map((day, index) => (
            <motion.div 
              key={day}
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <div className={`w-8 h-8 rounded-full mx-auto mb-1 ${
                streakData[index] 
                  ? index === 6 
                    ? "bg-electric-blue animate-pulse-glow" 
                    : "bg-neon-green"
                  : "bg-muted"
              }`}></div>
              <span className="text-xs">{day}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
