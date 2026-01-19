import { motion } from 'framer-motion';
import { Heart, Flame, Zap } from 'lucide-react';

interface GameHeaderProps {
  lives: number;
  streak: number;
  xp: number;
  onBack?: () => void;
}

export function GameHeader({ lives, streak, xp }: GameHeaderProps) {
  return (
    <header className="shrink-0 h-14 px-4 flex items-center justify-between border-b border-border bg-card/50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-lg font-black text-primary-foreground">i</span>
        </div>
        <span className="font-display font-bold text-foreground hidden sm:block">iterate</span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        {/* Lives */}
        <motion.div 
          className="flex items-center gap-1"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Heart 
                className={`w-5 h-5 ${i < lives ? 'text-life fill-life' : 'text-muted-foreground/30'}`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Streak */}
        <motion.div 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-streak/10 border border-streak/20"
          whileHover={{ scale: 1.05 }}
        >
          <Flame className="w-4 h-4 text-streak" />
          <span className="font-bold text-sm text-streak">{streak}</span>
        </motion.div>

        {/* XP */}
        <motion.div 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-xp/10 border border-xp/20"
          whileHover={{ scale: 1.05 }}
        >
          <Zap className="w-4 h-4 text-xp" />
          <span className="font-bold text-sm text-xp">{xp}</span>
        </motion.div>
      </div>
    </header>
  );
}
