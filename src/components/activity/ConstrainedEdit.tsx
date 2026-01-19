import { useState, useMemo } from 'react';
import { Activity } from '@/types';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { ActivityGameCard } from '@/components/game';
import { GameButton } from '@/components/game';
import { Check, Info } from 'lucide-react';
import { initialProjectFiles } from '@/test-utils/project.dummy';
import { motion } from 'framer-motion';

interface ConstrainedEditProps {
  activity: Activity;
  onSubmit: (code: string) => void;
}

export function ConstrainedEdit({ activity, onSubmit }: ConstrainedEditProps) {
  const initialCode = useMemo(() => {
    const file = initialProjectFiles.find(f => f.path === activity.targetFiles[0]);
    return file?.content || '';
  }, [activity.targetFiles]);

  const [code, setCode] = useState(initialCode);

  return (
    <ActivityGameCard
      type={activity.type}
      title={activity.title}
      question="Melhore o código nas regiões destacadas"
      actions={
        <GameButton onClick={() => onSubmit(code)} variant="primary" icon={<Check className="w-5 h-5" />}>
          Aplicar
        </GameButton>
      }
    >
      <div className="h-full flex flex-col gap-4">
        {/* Editable Regions Hints */}
        {activity.editableRegions && (
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activity.editableRegions.map((region, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm"
              >
                <Info className="w-3.5 h-3.5 text-primary" />
                <span className="text-foreground font-medium">
                  Linhas {region.startLine}-{region.endLine}
                </span>
                {region.hint && (
                  <span className="text-muted-foreground">• {region.hint}</span>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Code Editor */}
        <div className="flex-1 min-h-0">
          <CodeEditor
            value={code}
            onChange={setCode}
            language="typescript"
            height="100%"
            highlightLines={activity.editableRegions?.flatMap(r => 
              Array.from({ length: r.endLine - r.startLine + 1 }, (_, i) => r.startLine + i)
            )}
          />
        </div>
      </div>
    </ActivityGameCard>
  );
}
