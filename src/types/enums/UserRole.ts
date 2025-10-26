export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
