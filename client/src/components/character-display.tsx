import { motion } from "framer-motion";
import { Zap, Heart, Wind, Shield } from "lucide-react";

export default function CharacterDisplay() {
  return (
    <div className="p-4">
      <div className="glassmorphism rounded-2xl p-6 holographic">
        <div className="text-center">
          {/* Character Avatar */}
          <motion.div 
            className="relative mx-auto w-32 h-32 mb-4"
            animate={{ 
              boxShadow: [
                "0 0 5px hsl(213, 94%, 68%)",
                "0 0 20px hsl(213, 94%, 68%), 0 0 30px hsl(213, 94%, 68%)",
                "0 0 5px hsl(213, 94%, 68%)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
              alt="Athlos Warrior Character" 
              className="w-full h-full rounded-full object-cover border-4 border-electric-blue"
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-xs font-bold text-dark-bg">
              15
            </div>
          </motion.div>
          
          <h2 className="text-xl font-bold mb-1">Athlos the Warrior</h2>
          <p className="text-muted-foreground text-sm mb-4">Champion of Fithea</p>
          
          {/* XP Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>XP Progress</span>
              <span>2,847 / 3,200</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-electric-blue to-neon-purple rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "89%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Character Stats */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div 
              className="glassmorphism rounded-lg p-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="w-4 h-4 text-electric-blue" />
                <span className="text-sm">Strength</span>
              </div>
              <div className="text-lg font-bold">847</div>
            </motion.div>
            
            <motion.div 
              className="glassmorphism rounded-lg p-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm">Stamina</span>
              </div>
              <div className="text-lg font-bold">623</div>
            </motion.div>
            
            <motion.div 
              className="glassmorphism rounded-lg p-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Wind className="w-4 h-4 text-neon-green" />
                <span className="text-sm">Agility</span>
              </div>
              <div className="text-lg font-bold">741</div>
            </motion.div>
            
            <motion.div 
              className="glassmorphism rounded-lg p-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Shield className="w-4 h-4 text-gold" />
                <span className="text-sm">Health</span>
              </div>
              <div className="text-lg font-bold">892</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
