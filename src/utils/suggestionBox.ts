export interface FeatureSuggestion {
  id: string;
  title: string;
  category: 'curriculum' | 'tools' | 'qna' | 'mobile' | 'language' | 'other';
  description: string;
  targetModule?: string;
  suggestedBy: string;
  votes: number;
  voterIds: string[];
  createdAt: string;
  status: 'received' | 'under_review' | 'planned' | 'completed';
  adminNote?: string;
  reviewedBy?: string;
}

const SUGGESTIONS_STORAGE_KEY = 'the_samaritan_feature_suggestions_v1';

// Empty for real user testing: No seeded dummy suggestions
const INITIAL_SUGGESTIONS: FeatureSuggestion[] = [];

const DUMMY_SUGGESTION_IDS = new Set([
  'sugg-audio-swahili',
  'sugg-budget-calculator',
  'sugg-offline-pwa',
  'sugg-admin-baraza-mode',
  'sugg-admin-sms-broadcast',
  'sugg-samaritan-devolution-metrics',
]);

const DUMMY_SUGGESTION_USERS = new Set([
  '@kwalecitizenvoice',
  '@civicmatuga',
  '@kinangoyouth',
  '@mwananchi_kwale',
  '@pwani_youth',
  '@kombani_voice',
]);

export function getFeatureSuggestions(): FeatureSuggestion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SUGGESTIONS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const filtered = parsed.filter((s: FeatureSuggestion) => {
      if (DUMMY_SUGGESTION_IDS.has(s.id)) return false;
      const user = (s.suggestedBy || '').toLowerCase();
      if (DUMMY_SUGGESTION_USERS.has(user)) return false;
      return true;
    });
    if (filtered.length !== parsed.length) {
      localStorage.setItem(SUGGESTIONS_STORAGE_KEY, JSON.stringify(filtered));
    }
    return filtered;
  } catch (err) {
    return [];
  }
}

export function submitFeatureSuggestion(
  title: string,
  description: string,
  category: FeatureSuggestion['category'],
  suggestedBy: string,
  targetModule?: string
): { success: boolean; suggestion?: FeatureSuggestion; message: string } {
  if (!title.trim() || title.trim().length < 5) {
    return { success: false, message: 'Please provide a clear suggestion title (at least 5 characters).' };
  }
  if (!description.trim() || description.trim().length < 15) {
    return { success: false, message: 'Please describe your feature suggestion in detail (at least 15 characters).' };
  }

  const suggestions = getFeatureSuggestions();
  const newSuggestion: FeatureSuggestion = {
    id: `sugg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: title.trim(),
    description: description.trim(),
    category,
    targetModule: targetModule?.trim() || 'General Platform',
    suggestedBy: suggestedBy.trim() || 'Civic Participant',
    votes: 1,
    voterIds: [suggestedBy.trim() || 'creator'],
    createdAt: new Date().toISOString(),
    status: 'received',
  };

  const updated = [newSuggestion, ...suggestions];
  try {
    localStorage.setItem(SUGGESTIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed saving suggestion', e);
  }

  return {
    success: true,
    suggestion: newSuggestion,
    message: 'Thank you! Your feature suggestion has been submitted to the platform development backlog.',
  };
}

export function voteOnFeatureSuggestion(
  suggestionId: string,
  voterIdentifier: string
): { success: boolean; newVotes: number; alreadyVoted: boolean } {
  const suggestions = getFeatureSuggestions();
  const index = suggestions.findIndex((s) => s.id === suggestionId);
  if (index === -1) return { success: false, newVotes: 0, alreadyVoted: false };

  const item = suggestions[index];
  const userKey = voterIdentifier.trim() || 'guest';
  const hasVoted = item.voterIds.includes(userKey);

  let newVoterIds: string[];
  let newVoteCount: number;

  if (hasVoted) {
    // Retract vote
    newVoterIds = item.voterIds.filter((id) => id !== userKey);
    newVoteCount = Math.max(0, item.votes - 1);
  } else {
    // Add vote
    newVoterIds = [...item.voterIds, userKey];
    newVoteCount = item.votes + 1;
  }

  suggestions[index] = {
    ...item,
    votes: newVoteCount,
    voterIds: newVoterIds,
  };

  try {
    localStorage.setItem(SUGGESTIONS_STORAGE_KEY, JSON.stringify(suggestions));
  } catch (e) {
    console.error('Failed updating suggestion vote', e);
  }

  return {
    success: true,
    newVotes: newVoteCount,
    alreadyVoted: !hasVoted,
  };
}

export function updateSuggestionStatus(
  suggestionId: string,
  newStatus: FeatureSuggestion['status'],
  adminNote?: string,
  reviewedBy?: string
): boolean {
  const suggestions = getFeatureSuggestions();
  const index = suggestions.findIndex((s) => s.id === suggestionId);
  if (index === -1) return false;

  suggestions[index] = {
    ...suggestions[index],
    status: newStatus,
    adminNote: adminNote !== undefined ? adminNote : suggestions[index].adminNote,
    reviewedBy: reviewedBy !== undefined ? reviewedBy : suggestions[index].reviewedBy,
  };

  try {
    localStorage.setItem(SUGGESTIONS_STORAGE_KEY, JSON.stringify(suggestions));
    return true;
  } catch (e) {
    return false;
  }
}

export function upvoteFeatureSuggestion(suggestionId: string, voterIdentifier = 'admin'): boolean {
  return voteOnFeatureSuggestion(suggestionId, voterIdentifier).success;
}
