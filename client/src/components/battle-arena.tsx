import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, User, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type OrbType = "strength" | "agility" | "magic" | "health";

interface Orb {
  id: number;
  type: OrbType;
  selected: boolean;
}

export default function BattleArena() {
  const { toast } = useToast();
  const [selectedOrbs, setSelectedOrbs] = useState<number[]>([]);
  const [playerHealth, setPlayerHealth] = useState(75);
  const [enemyHealth, setEnemyHealth] = useState(45);

  // Generate initial battle grid
  const generateGrid = (): Orb[] => {
    const types: OrbType[] = ["strength", "agility", "magic", "health"];
    const grid: Orb[] = [];
    for (let i = 0; i < 36; i++) {
      grid.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        selected: false,
      });
    }
    return grid;
  };

  const [battleGrid, setBattleGrid] = useState<Orb[]>(generateGrid());

  const handleOrbClick = (orbId: number) => {
    setBattleGrid(prev => 
      prev.map(orb => 
        orb.id === orbId 
          ? { ...orb, selected: !orb.selected }
          : orb
      )
    );

    setSelectedOrbs(prev => 
      prev.includes(orbId) 
        ? prev.filter(id => id !== orbId)
        : [...prev, orbId]
    );

    // Check for matches when 3+ orbs selected
    if (selectedOrbs.length >= 2) {
      setTimeout(() => {
        checkForMatches();
      }, 100);
    }
  };

  const checkForMatches = () => {
    const selectedTypes = selectedOrbs.map(id => 
      battleGrid.find(orb => orb.id === id)?.type
    );

    // Simple match logic - 3+ of same type
    const typeCounts = selectedTypes.reduce((acc, type) => {
      if (type) acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<OrbType, number>);

    const matches = Object.entries(typeCounts).filter(([_, count]) => count >= 3);

    if (matches.length > 0) {
      const [matchType, matchCount] = matches[0];
      const damage = matchCount * 10;

      setEnemyHealth(prev => Math.max(0, prev - damage));

      toast({
        title: "Match Found!",
        description: `${matchCount} ${matchType} orbs matched! Dealt ${damage} damage!`,
      });

      // Reset selection
      setBattleGrid(prev => 
        prev.map(orb => ({ ...orb, selected: false }))
      );
      setSelectedOrbs([]);

      // Enemy turn
      setTimeout(() => {
        const enemyDamage = Math.floor(Math.random() * 15) + 5;
        setPlayerHealth(prev => Math.max(0, prev - enemyDamage));
      }, 1000);
    }
  };

  const getOrbClass = (type: OrbType) => {
    const baseClass = "battle-orb";
    switch (type) {
      case "strength": return `${baseClass} strength-orb`;
      case "agility": return `${baseClass} agility-orb`;
      case "magic": return `${baseClass} magic-orb`;
      case "health": return `${baseClass} health-orb`;
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Battle Arena</h3>

      {/* Battle Status */}
      <motion.div 
        className="glassmorphism rounded-lg p-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Current Battle</h4>
          <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded">BOSS FIGHT</span>
        </div>
        <div className="flex items-center space-x-4 mb-3">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-electric-blue to-neon-purple rounded-lg mx-auto mb-2 flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <span className="text-xs">Athlos</span>
            <div className="w-full bg-muted rounded-full h-2 mt-1">
              <motion.div 
                className="h-full bg-neon-green rounded-full"
                animate={{ width: `${playerHealth}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-2xl">⚔️</span>
            <div className="text-xs mt-1">VS</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Skull className="w-8 h-8" />
            </div>
            <span className="text-xs">Couch King</span>
            <div className="w-full bg-muted rounded-full h-2 mt-1">
              <motion.div 
                className="h-full bg-red-500 rounded-full"
                animate={{ width: `${enemyHealth}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Match-3 Grid */}
      <motion.div 
        className="glassmorphism rounded-lg p-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="font-medium mb-3">Match Orbs to Attack</h4>
        <div className="battle-grid mb-4">
          <AnimatePresence>
            {battleGrid.map((orb, index) => (
              <motion.div
                key={orb.id}
                className={`${getOrbClass(orb.type)} ${orb.selected ? 'selected' : ''}`}
                onClick={() => handleOrbClick(orb.id)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.02,
                  type: "spring" 
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Orb Legend */}
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full strength-orb"></div>
            <span>Strength</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full agility-orb"></div>
            <span>Agility</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full magic-orb"></div>
            <span>Magic</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full health-orb"></div>
            <span>Health</span>
          </div>
        </div>
      </motion.div>

      {/* Battle Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="glassmorphism p-3 h-auto flex flex-col items-center hover:bg-electric-blue/10"
        >
          <Shield className="w-6 h-6 mb-1" />
          <span className="text-sm">Defend</span>
        </Button>
        <Button 
          variant="outline"
          className="glassmorphism p-3 h-auto flex flex-col items-center hover:bg-red-500/10"
        >
          <Zap className="w-6 h-6 mb-1" />
          <span className="text-sm">Special</span>
        </Button>
      </div>
    </div>
  );
}
