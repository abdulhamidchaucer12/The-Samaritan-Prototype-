import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Compass,
  Award,
  BookOpen,
  Shield,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Coins,
  ArrowRight,
  CheckCircle2,
  Feather,
  Crown,
  Scale,
  Flame,
  Heart,
  HelpCircle,
} from 'lucide-react';
import {
  MIDMON_CHARACTERS,
  MIDMON_STORY_NODES,
  MIDMON_RELICS,
  StoryNode,
  StoryProgress,
  StoryRelic,
  getStoredStoryProgress,
  saveStoredStoryProgress,
  resetStoryProgress,
} from '../data/midmonStoriesData';
import { Language, AuthUser } from '../types';
import { grantFacilitatorTokens } from '../utils/facilitatorTokenRegistry';

interface MidmonStoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentUser?: AuthUser | null;
  onTokensUpdated?: () => void;
}

export const MidmonStoriesModal: React.FC<MidmonStoriesModalProps> = ({
  isOpen,
  onClose,
  language,
  currentUser,
  onTokensUpdated,
}) => {
  const [progress, setProgress] = useState<StoryProgress>(() => getStoredStoryProgress());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showInventory, setShowInventory] = useState(false);
  const [showLoreGuide, setShowLoreGuide] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setProgress(getStoredStoryProgress());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentNode: StoryNode = MIDMON_STORY_NODES[progress.currentNodeId] || MIDMON_STORY_NODES.c1_start;

  // Play atmospheric sound using Web Audio API
  const playStoryChime = (type: 'choice' | 'relic' | 'ending') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const now = ctx.currentTime;

      if (type === 'relic') {
        // Mystical arpeggio for relic discovery
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.35);
        });
      } else if (type === 'ending') {
        // Royal fanfare
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.15, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.5);
        });
      } else {
        // Subtle decision click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {}
  };

  const handleMakeChoice = (choice: (typeof currentNode.choices)[0]) => {
    const nextNode = MIDMON_STORY_NODES[choice.nextNodeId];
    if (!nextNode) return;

    let updatedRelics = [...progress.relics];
    if (choice.relicAwarded && !updatedRelics.some((r) => r.id === choice.relicAwarded!.id)) {
      updatedRelics.push(choice.relicAwarded);
      playStoryChime('relic');
      setLastFeedback(`✨ Relic Discovered: ${choice.relicAwarded.name}!`);
    } else {
      playStoryChime('choice');
      setLastFeedback(choice.outcomeText);
    }

    // Award tokens on ending if applicable
    if (choice.tokenReward && currentUser?.username) {
      grantFacilitatorTokens(
        currentUser.username,
        choice.tokenReward,
        `Midmon Odyssey Achievement: ${nextNode.chapterTitle}`,
        'The_Samaritan'
      );
      if (onTokensUpdated) onTokensUpdated();
    }

    const updatedStats = {
      ...progress.stats,
      [choice.statBonus.stat]: progress.stats[choice.statBonus.stat] + choice.statBonus.amount,
    };

    const updatedUnlockedChapters = Array.from(
      new Set([...progress.unlockedChapters, nextNode.chapterId])
    );

    const updatedCompletedEndings = nextNode.isEnding
      ? Array.from(new Set([...progress.completedEndings, nextNode.id]))
      : progress.completedEndings;

    if (nextNode.isEnding) {
      playStoryChime('ending');
    }

    const newProgress: StoryProgress = {
      currentNodeId: nextNode.id,
      visitedNodeIds: Array.from(new Set([...progress.visitedNodeIds, nextNode.id])),
      relics: updatedRelics,
      stats: updatedStats,
      unlockedChapters: updatedUnlockedChapters,
      completedEndings: updatedCompletedEndings,
      startedAt: progress.startedAt,
      lastPlayedAt: new Date().toISOString(),
    };

    setProgress(newProgress);
    saveStoredStoryProgress(newProgress);

    setTimeout(() => {
      setLastFeedback(null);
    }, 4500);
  };

  const handleReset = () => {
    if (window.confirm(language === 'en' ? 'Restart the Chronicles of the Midmons from Chapter 1?' : 'Anzisha upya Hadithi za Midmons kutoka Sura ya 1?')) {
      const reset = resetStoryProgress();
      setProgress(reset);
      setLastFeedback(language === 'en' ? 'Story reset to Chapter 1.' : 'Hadithi imeanzishwa upya.');
      setTimeout(() => setLastFeedback(null), 3000);
    }
  };

  const handleJumpToChapter = (chapterId: number) => {
    const chapterNodeKeys = Object.keys(MIDMON_STORY_NODES).filter(
      (k) => MIDMON_STORY_NODES[k].chapterId === chapterId
    );
    if (chapterNodeKeys.length > 0) {
      const targetId = chapterNodeKeys[0];
      const newProgress: StoryProgress = {
        ...progress,
        currentNodeId: targetId,
        visitedNodeIds: Array.from(new Set([...progress.visitedNodeIds, targetId])),
      };
      setProgress(newProgress);
      saveStoredStoryProgress(newProgress);
      playStoryChime('choice');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 border border-amber-500/40 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Celestial Starfield Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-amber-950/80 via-purple-950/70 to-slate-950 border-b border-amber-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 border border-amber-300/40">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300">
                  {language === 'en' ? 'Exclusive Easter Egg' : 'Zawadi ya Siri ya Kiwango cha Juu'}
                </span>
                <span className="text-[10px] font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-800">
                  5,000+ TKNS
                </span>
              </div>
              <h2 className="font-serif font-black text-lg sm:text-xl text-amber-200 tracking-tight flex items-center gap-2">
                <span>{language === 'en' ? 'The World of the Midmons' : 'Ulimwengu wa Midmons'}</span>
                <span className="text-xs text-amber-400 font-sans font-normal hidden md:inline">
                  • {language === 'en' ? 'Lucy Shallah & Sundiata Keita' : 'Lucy Shallah na Sundiata Keita'}
                </span>
              </h2>
            </div>
          </div>

          {/* Quick Header Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              type="button"
              onClick={() => setShowInventory(!showInventory)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showInventory
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-amber-300'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'en' ? 'Relics' : 'Mabaki'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-900/60 text-amber-200 text-[10px] font-black">
                {progress.relics.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowLoreGuide(!showLoreGuide)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Lore & Key Players"
            >
              <HelpCircle className="w-4 h-4 text-purple-300" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chapters & Story Realm Progress Bar */}
        <div className="px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 text-xs overflow-x-auto">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((ch) => {
              const isUnlocked = progress.unlockedChapters.includes(ch);
              const isCurrent = currentNode.chapterId === ch;
              return (
                <button
                  key={ch}
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => handleJumpToChapter(ch)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : isUnlocked
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      : 'bg-slate-900 text-slate-600 cursor-not-allowed opacity-60'
                  }`}
                >
                  <span>Ch. {ch}</span>
                  {isUnlocked && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* Player Alignments & Stats */}
          <div className="flex items-center gap-3 text-[11px] font-bold shrink-0">
            <span className="flex items-center gap-1 text-emerald-400" title="Justice (Lucy Shallah Alignment)">
              <Scale className="w-3.5 h-3.5" />
              <span>{progress.stats.justice}</span>
            </span>
            <span className="flex items-center gap-1 text-amber-400" title="Valor (Sundiata Keita Alignment)">
              <Flame className="w-3.5 h-3.5" />
              <span>{progress.stats.valor}</span>
            </span>
            <span className="flex items-center gap-1 text-purple-400" title="Harmony (Midmon Balance)">
              <Heart className="w-3.5 h-3.5" />
              <span>{progress.stats.harmony}</span>
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="p-1 text-slate-400 hover:text-red-400 transition-colors ml-1"
              title="Reset Story"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Feedback Banner (Decisions / Relics) */}
        {lastFeedback && (
          <div className="bg-amber-500/20 border-b border-amber-400/40 px-5 py-2 text-xs font-bold text-amber-200 flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>{lastFeedback}</span>
          </div>
        )}

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
          {/* Relic Inventory Drawer (if toggled) */}
          {showInventory && (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 space-y-3 animate-in fade-in slide-in-from-top-3">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                <div className="flex items-center gap-2 font-serif font-bold text-amber-200 text-sm">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{language === 'en' ? 'Ancient Midmon Relic Vault' : 'Kikapu cha Mabaki ya Kale ya Midmon'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInventory(false)}
                  className="text-xs text-amber-400 hover:underline cursor-pointer"
                >
                  {language === 'en' ? 'Close' : 'Funga'}
                </button>
              </div>

              {progress.relics.length === 0 ? (
                <p className="text-xs text-amber-200/70 italic">
                  {language === 'en'
                    ? 'No relics discovered yet. Explore choices and dialogue paths to unearth ancient artifacts!'
                    : 'Bado hujapata mabaki. Fanya maamuzi kote kwenye hadithi ili kupata vitu vya kale!'}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {progress.relics.map((relic) => (
                    <div
                      key={relic.id}
                      className="p-3 rounded-xl bg-slate-900/90 border border-amber-400/40 space-y-1 text-xs"
                    >
                      <div className="flex items-center gap-2 font-bold text-amber-300">
                        <span className="text-base">{relic.icon}</span>
                        <span>{relic.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{relic.description}</p>
                      <div className="pt-1 text-[10px] text-amber-400/90 flex items-center justify-between">
                        <span><strong>Power:</strong> {relic.power}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Lore & Key Player Guide (if toggled) */}
          {showLoreGuide && (
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/50 space-y-3 animate-in fade-in slide-in-from-top-3">
              <div className="flex items-center justify-between border-b border-purple-500/30 pb-2">
                <div className="flex items-center gap-2 font-serif font-bold text-purple-200 text-sm">
                  <Compass className="w-4 h-4 text-purple-400" />
                  <span>{language === 'en' ? 'Key Players & The World of the Midmons' : 'Wahusika Wakuu na Ulimwengu wa Midmons'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLoreGuide(false)}
                  className="text-xs text-purple-400 hover:underline cursor-pointer"
                >
                  {language === 'en' ? 'Close' : 'Funga'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.values(MIDMON_CHARACTERS).map((char) => (
                  <div
                    key={char.id}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{char.avatarEmoji}</span>
                      <div>
                        <h4 className="font-bold text-slate-100">{char.name}</h4>
                        <span className="text-[10px] text-amber-400">{char.title}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{char.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Story Scene Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-700/80 space-y-4 shadow-xl">
            {/* Location & Chapter Header */}
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono text-xs font-bold text-amber-300">
                  {currentNode.chapterTitle}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 italic">
                  {currentNode.location}
                </span>
              </div>

              {currentNode.isEnding && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-extrabold text-xs animate-pulse">
                  {currentNode.endingTitle}
                </span>
              )}
            </div>

            {/* Narrative Passage */}
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-normal">
              {currentNode.narrativeText}
            </p>

            {/* In-Character Dialogue Callout (if active speaker) */}
            {currentNode.dialogue && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3">
                <span className="text-2xl shrink-0">
                  {currentNode.speaker === 'Lucy Shallah'
                    ? '⚖️'
                    : currentNode.speaker === 'Sundiata Keita'
                    ? '🦁'
                    : currentNode.speaker === 'Lucy Shallah & Sundiata Keita'
                    ? '⚖️🦁'
                    : currentNode.speaker === 'Miriam Midmon'
                    ? '🦅'
                    : currentNode.speaker === 'Commander Kim Midmon'
                    ? '🎖️'
                    : currentNode.speaker === 'Agnes Kimberly Midmon'
                    ? '🌱'
                    : currentNode.speaker === 'Kimonge Jr.'
                    ? '🚜'
                    : '📜'}
                </span>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    {currentNode.speaker}
                  </div>
                  <blockquote className="text-xs sm:text-sm font-serif italic text-amber-100/90 leading-relaxed">
                    {currentNode.dialogue}
                  </blockquote>
                </div>
              </div>
            )}

            {/* Companion Thought Box */}
            {currentNode.companionCommentary && (
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200/90 flex items-start gap-2.5">
                <Feather className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-purple-300 font-semibold block text-[11px]">
                    {currentNode.companionCommentary.speaker}’s Perspective:
                  </strong>
                  <span className="italic leading-snug">
                    &ldquo;{currentNode.companionCommentary.thought}&rdquo;
                  </span>
                </div>
              </div>
            )}

            {/* Historical / Constitutional Lore Note */}
            {currentNode.loreNote && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Constitutional & Historical Archive:</strong> {currentNode.loreNote}</span>
              </div>
            )}
          </div>

          {/* Interactive Decision Paths */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>{language === 'en' ? 'Choose Your Action & Timeline Path:' : 'Chagua Hatua na Njia Yako:'}</span>
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {currentNode.choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleMakeChoice(choice)}
                  className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800/90 hover:from-slate-850 hover:to-indigo-950/90 border border-slate-700 hover:border-amber-400/80 transition-all shadow-md hover:shadow-amber-500/10 group cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          choice.affinity === 'justice'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : choice.affinity === 'valor'
                            ? 'bg-amber-950 text-amber-300 border border-amber-700'
                            : 'bg-purple-950 text-purple-300 border border-purple-700'
                        }`}
                      >
                        +{choice.statBonus.amount} {choice.statBonus.stat.toUpperCase()}
                      </span>
                      {choice.tokenReward && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/50 flex items-center gap-1">
                          <Coins className="w-3 h-3 text-amber-400" />
                          <span>+{choice.tokenReward} TKNS REWARD</span>
                        </span>
                      )}
                      {choice.relicAwarded && (
                        <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                          <span>✨ Grants:</span>
                          <strong>{choice.relicAwarded.name}</strong>
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-amber-200 transition-colors">
                      {choice.text}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-amber-500 text-slate-400 group-hover:text-slate-950 flex items-center justify-center transition-all shrink-0">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">
              {language === 'en' ? 'Open World Chronicles' : 'Hadithi za Ulimwengu Wazi'}
            </span>
            <span>•</span>
            <span>{language === 'en' ? 'World of the Midmons' : 'Ulimwengu wa Midmons'}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-red-400 hover:underline cursor-pointer"
            >
              {language === 'en' ? 'Reset Progress' : 'Anzisha Upya'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              {language === 'en' ? 'Close Portal' : 'Funga Lango'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
