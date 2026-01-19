import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QualityReview,
  ConstrainedEdit,
  DecisionFork,
  BreakAndFix
} from '@/components/activity';
import { ProjectPreview } from '@/components/preview';
import { AIResponse } from '@/components/ai';
import { GitLog } from '@/components/project';
import { GameHeader, ProgressPills, CelebrationOverlay } from '@/components/game';
import { useActivityPage } from '@/hooks';
import { ActivityType } from '@/enums';
import { lessonsData } from '@/test-utils/lessons.dummy';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [gitLogOpen, setGitLogOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationXP, setCelebrationXP] = useState(0);

  // Game state
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(3);
  const [xp, setXp] = useState(0);

  const lesson = lessonsData.find(l => l.id === lessonId);

  const {
    currentActivity,
    activities,
    currentActivityIndex,
    project,
    gitLog,
    isAIStreaming,
    aiResponse,
    canAdvance,
    handleActivityComplete: originalHandleActivityComplete,
    handleDecision,
    handleCodeSubmit,
    triggerAIResponse,
    goToNextActivity,
    goToActivity,
    setProjectBroken,
  } = useActivityPage();

  // Wrap activity complete to show celebration
  const handleActivityComplete = (activityId: string, responseKey?: string) => {
    const earnedXP = 25;
    setCelebrationXP(earnedXP);
    setXp(prev => prev + earnedXP);
    setShowCelebration(true);
    originalHandleActivityComplete(activityId, responseKey);
  };

  const handleCelebrationContinue = () => {
    setShowCelebration(false);
    if (currentActivityIndex < activities.length - 1) {
      goToNextActivity();
    }
  };

  // Set project broken when on Break & Fix activity
  useEffect(() => {
    if (currentActivity?.type === ActivityType.BREAK_AND_FIX) {
      setProjectBroken();
    }
  }, [currentActivity, setProjectBroken]);

  if (!lesson) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Lesson não encontrada</h1>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  const renderActivityContent = () => {
    if (!currentActivity) return null;

    switch (currentActivity.type) {
      case ActivityType.QUALITY_REVIEW:
        return (
          <QualityReview
            activity={currentActivity}
            onApprove={() => handleActivityComplete(currentActivity.id, 'act-1-feedback-approve')}
            onRegenerate={() => triggerAIResponse('act-1-generate')}
            onEdit={(code) => {
              handleCodeSubmit(code, currentActivity.targetFiles[0]);
              handleActivityComplete(currentActivity.id, 'act-1-feedback-edit');
            }}
          />
        );
      
      case ActivityType.CONSTRAINED_EDIT:
        return (
          <ConstrainedEdit
            activity={currentActivity}
            onSubmit={(code) => {
              handleCodeSubmit(code, currentActivity.targetFiles[0]);
              handleActivityComplete(currentActivity.id, 'act-2-success');
            }}
          />
        );
      
      case ActivityType.DECISION_FORK:
        return (
          <DecisionFork
            activity={currentActivity}
            onDecide={(optionId) => {
              handleDecision(optionId);
              handleActivityComplete(currentActivity.id);
            }}
          />
        );
      
      case ActivityType.BREAK_AND_FIX:
        return (
          <BreakAndFix
            activity={currentActivity}
            errorMessage="TypeError: Cannot read property 'map' of undefined
    at CheckoutPage (CheckoutPage.tsx:7:18)"
            onFix={(code) => {
              handleCodeSubmit(code, currentActivity.targetFiles[0]);
              handleActivityComplete(currentActivity.id);
            }}
            onRequestHint={() => triggerAIResponse('act-4-hint')}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Game Header */}
      <GameHeader 
        lives={lives}
        streak={streak}
        xp={xp}
      />

      {/* Progress Pills */}
      <div className="shrink-0 border-b border-border bg-card/30">
        <ProgressPills
          activities={activities}
          currentIndex={currentActivityIndex}
          onActivityClick={goToActivity}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Activity */}
        <div className="flex-1 lg:w-[55%] flex flex-col overflow-hidden p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentActivity?.id}
              className="flex-1 overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderActivityContent()}
            </motion.div>
          </AnimatePresence>

          {/* AI Response */}
          {(aiResponse || isAIStreaming) && (
            <div className="mt-4">
              <AIResponse text={aiResponse} isStreaming={isAIStreaming} />
            </div>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div className="hidden lg:flex lg:w-[45%] flex-col p-4 relative">
          <ProjectPreview 
            status={project.status} 
            errorMessage={currentActivity?.type === ActivityType.BREAK_AND_FIX 
              ? "TypeError: Cannot read property 'map' of undefined" 
              : undefined
            }
          />
          
          {/* Git Log Toggle */}
          <GitLog
            entries={gitLog}
            isOpen={gitLogOpen}
            onToggle={() => setGitLogOpen(!gitLogOpen)}
          />
        </div>
      </div>

      {/* Celebration Overlay */}
      <CelebrationOverlay
        isVisible={showCelebration}
        xpEarned={celebrationXP}
        message="Activity completa!"
        onContinue={handleCelebrationContinue}
      />
    </div>
  );
}
