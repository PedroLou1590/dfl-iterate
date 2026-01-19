import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

interface AIHistoryButtonProps {
  messageCount: number;
  onClick: () => void;
  hasUnread?: boolean;
}

export function AIHistoryButton({ messageCount, onClick, hasUnread }: AIHistoryButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Bot size={18} />
      <span className="relative">
        <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
          {messageCount}
        </span>
        {hasUnread && (
          <motion.span
            className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
          />
        )}
      </span>
    </motion.button>
  );
}
