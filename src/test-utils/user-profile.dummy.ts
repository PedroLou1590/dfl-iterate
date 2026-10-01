import type { UserProfile } from '@/types/UserProfile';

const INITIAL_USER_PROFILE: UserProfile = {
  id: 'user-1',
  name: 'Ana Fellow',
  email: 'ana.fellow@devfellowship.dev',
  age: 24,
  avatarUrl: 'https://i.pravatar.cc/64?u=user-1',
};

let userProfileData: UserProfile = { ...INITIAL_USER_PROFILE };

export function getUserProfileData(): UserProfile {
  return { ...userProfileData };
}

export function setUserProfileData(next: UserProfile): UserProfile {
  userProfileData = { ...next };
  return { ...userProfileData };
}

export function resetUserProfileData(): void {
  userProfileData = { ...INITIAL_USER_PROFILE };
}