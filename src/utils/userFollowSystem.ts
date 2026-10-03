/**
 * User Follow & Civic Activity System
 * Allows citizens and administrators to follow each other's civic journey,
 * questions, quiz completions, and achievements.
 */

export interface UserActivityRecord {
  id: string;
  username: string;
  type: 'question' | 'quiz' | 'certificate' | 'lesson' | 'suggestion' | 'verification';
  title: string;
  details: string;
  timestamp: string;
  targetId?: string;
  likesCount: number;
  likedByUsernames: string[];
}

export interface UserFollowMap {
  [followerUsername: string]: string[]; // list of target usernames followed
}

const FOLLOWS_KEY = 'the_samaritan_user_follows_v2';
const ACTIVITIES_KEY = 'the_samaritan_user_activities_v2';

// Empty for real user testing: No seeded dummy activities
const INITIAL_ACTIVITIES: UserActivityRecord[] = [];

// Empty for real user testing: No seeded dummy follows
const INITIAL_FOLLOWS: UserFollowMap = {};

const DUMMY_FOLLOW_USERS = new Set([
  '@mwananchi_kwale',
  '@pwani_youth',
  '@kombani_voice',
  '@haki_mwananchi',
  '@pwani_scholar',
  '@fatuma_m',
  '@kombani_youth',
  '@mzalendo_254',
  '@kwalecitizenvoice',
  '@civicmatuga',
  '@kinangoyouth',
]);

const DUMMY_ACTIVITY_IDS = new Set(['act_1', 'act_2', 'act_3', 'act_4', 'act_5']);

export function getFollowMap(): UserFollowMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(FOLLOWS_KEY);
    if (!raw) {
      return {};
    }
    const map: UserFollowMap = JSON.parse(raw);
    const cleanMap: UserFollowMap = {};
    for (const [follower, targets] of Object.entries(map)) {
      if (!DUMMY_FOLLOW_USERS.has(follower.toLowerCase())) {
        cleanMap[follower] = targets.filter((t) => !DUMMY_FOLLOW_USERS.has(t.toLowerCase()));
      }
    }
    localStorage.setItem(FOLLOWS_KEY, JSON.stringify(cleanMap));
    return cleanMap;
  } catch (err) {
    return {};
  }
}

export function saveFollowMap(map: UserFollowMap): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FOLLOWS_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('civic_follows_updated'));
  } catch (err) {}
}

export function isFollowing(followerUsername?: string | null, targetUsername?: string | null): boolean {
  if (!followerUsername || !targetUsername) return false;
  if (followerUsername === targetUsername) return false;
  const map = getFollowMap();
  const followingList = map[followerUsername] || [];
  return followingList.includes(targetUsername);
}

export function toggleFollowUser(
  followerUsername: string,
  targetUsername: string
): { isFollowing: boolean; newFollowersCount: number } {
  if (!followerUsername || !targetUsername || followerUsername === targetUsername) {
    return { isFollowing: false, newFollowersCount: 0 };
  }

  const map = getFollowMap();
  const currentList = map[followerUsername] || [];
  const alreadyFollowing = currentList.includes(targetUsername);

  let updatedList: string[];
  if (alreadyFollowing) {
    updatedList = currentList.filter((u) => u !== targetUsername);
  } else {
    updatedList = [...currentList, targetUsername];
  }

  map[followerUsername] = updatedList;
  saveFollowMap(map);

  const followers = getFollowersOfUser(targetUsername);
  return {
    isFollowing: !alreadyFollowing,
    newFollowersCount: followers.length,
  };
}

export function getFollowersOfUser(targetUsername: string): string[] {
  const map = getFollowMap();
  const followers: string[] = [];
  for (const [follower, targets] of Object.entries(map)) {
    if (targets.includes(targetUsername)) {
      followers.push(follower);
    }
  }
  return followers;
}

export function getFollowingOfUser(followerUsername: string): string[] {
  const map = getFollowMap();
  return map[followerUsername] || [];
}

export function getFollowStats(username: string): { followersCount: number; followingCount: number } {
  const followers = getFollowersOfUser(username);
  const following = getFollowingOfUser(username);
  return {
    followersCount: followers.length,
    followingCount: following.length,
  };
}

// ---------------- Public Civic Activities Feed ---------------- //

export function getAllPublicActivities(): UserActivityRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ACTIVITIES_KEY);
    if (!raw) {
      return [];
    }
    const list: UserActivityRecord[] = JSON.parse(raw);
    const filtered = list.filter((a) => {
      if (DUMMY_ACTIVITY_IDS.has(a.id)) return false;
      if (DUMMY_FOLLOW_USERS.has(a.username.toLowerCase())) return false;
      return true;
    });
    if (filtered.length !== list.length) {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(filtered));
    }
    return filtered;
  } catch (err) {
    return [];
  }
}

export function recordPublicActivity(
  username: string,
  type: UserActivityRecord['type'],
  title: string,
  details: string,
  targetId?: string
): UserActivityRecord {
  const all = getAllPublicActivities();
  const newActivity: UserActivityRecord = {
    id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    username,
    type,
    title,
    details,
    timestamp: new Date().toISOString(),
    targetId,
    likesCount: 0,
    likedByUsernames: [],
  };

  all.unshift(newActivity);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(all.slice(0, 100)));
      window.dispatchEvent(new CustomEvent('civic_activities_updated', { detail: newActivity }));
    } catch (err) {}
  }

  return newActivity;
}

export function toggleLikeActivity(activityId: string, username: string): number {
  const all = getAllPublicActivities();
  const act = all.find((a) => a.id === activityId);
  if (!act) return 0;

  if (act.likedByUsernames.includes(username)) {
    act.likedByUsernames = act.likedByUsernames.filter((u) => u !== username);
    act.likesCount = Math.max(0, act.likesCount - 1);
  } else {
    act.likedByUsernames.push(username);
    act.likesCount = (act.likesCount || 0) + 1;
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent('civic_activities_updated'));
    } catch (err) {}
  }

  return act.likesCount;
}

export function getFeedForUser(followerUsername: string): UserActivityRecord[] {
  const all = getAllPublicActivities();
  const following = getFollowingOfUser(followerUsername);

  // Return activities from users they follow, plus their own activities
  return all.filter((a) => following.includes(a.username) || a.username === followerUsername);
}
