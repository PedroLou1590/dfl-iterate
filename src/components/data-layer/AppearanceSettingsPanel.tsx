import { cn } from "@devfellowship/components";
import { Sun, Moon, Volume2, VolumeX, Languages, Loader2 } from "lucide-react";
import type { UserPreferences } from "./types";

const LANGUAGE_LABELS: Record<UserPreferences["language"], string> = {
  "pt-BR": "Português (BR)",
  "en-US": "English (US)",
};

interface IconToggleProps {
  active: boolean;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

function IconToggle({
  active,
  onClick,
  disabled,
  loading,
  icon,
  label,
  className,
}: IconToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border px-6 py-4 cursor-pointer",
        "transition-[opacity,border-color,background-color,color] duration-300 ease-in-out",
        loading ? "opacity-40 cursor-default" : "opacity-100",
        disabled && !loading ? "cursor-default" : "",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-primary/50",
        className,
      )}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

export interface AppearanceSettingsPanelProps {
  preferences: UserPreferences;
  className?: string;
  onToggleTheme?: () => void;
  onToggleSound?: () => void;
  isUpdatingTheme?: boolean;
  isUpdatingSound?: boolean;
  updateError?: string;
}

export function AppearanceSettingsPanel({
  preferences,
  className,
  onToggleTheme,
  onToggleSound,
  isUpdatingTheme,
  isUpdatingSound,
  updateError,
}: AppearanceSettingsPanelProps) {
  const isDark = preferences.theme === "dark";
  const isBusy = isUpdatingTheme || isUpdatingSound;

  return (
    <div
      className={cn("space-y-4", className)}
      data-testid="appearance-settings-panel"
    >
      <h2 className="text-lg font-semibold text-foreground">Preferências</h2>

      <div className="flex gap-3">
        <div className="flex-1">
          <IconToggle
            active={isDark}
            onClick={onToggleTheme}
            disabled={isBusy}
            loading={isUpdatingTheme}
            icon={
              isDark ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )
            }
            label={isDark ? "Escuro" : "Claro"}
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <IconToggle
            active={preferences.soundEffectsEnabled}
            onClick={onToggleSound}
            disabled={isBusy}
            loading={isUpdatingSound}
            icon={
              preferences.soundEffectsEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )
            }
            label={preferences.soundEffectsEnabled ? "Ativado" : "Desativado"}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Idioma</span>
        </div>
        <span className="text-sm font-medium text-foreground shrink-0">
          {LANGUAGE_LABELS[preferences.language]}
        </span>
      </div>

      {updateError && (
        <p className="text-xs text-destructive pt-1">{updateError}</p>
      )}
    </div>
  );
}
