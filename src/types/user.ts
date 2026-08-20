// src/types/user.ts

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  accentColor: 'primary' | 'secondary' | 'tertiary' | 'muted';
  language: string;
}

/**
 * Retorno do endpoint GET /api/users/me e PUT /api/users/me
 * Equivalente ao UserProfileResponse.java
 */
export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  // Adicione outros campos que seu Java retorna (ex: avatarUrl, role, etc)
  isAdmin?: boolean; 
  preferences?: UserPreferences;
}

/**
 * Payload para POST /api/users/register
 * Equivalente ao User.java (na hora de salvar)
 */
export interface RegisterUserPayload {
  username: string;
  email: string;
  password?: string; // Opcional no retorno, obrigatório no envio
}

/**
 * Payload para POST /api/users/login
 * Equivalente ao AuthRequest.java
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Payload para PUT /api/users/me
 * Equivalente ao UpdateProfileRequest.java
 */
export interface UpdateProfilePayload {
  username?: string;
  email?: string;
}

/**
 * Payload para PUT /api/users/me/password
 * Equivalente ao UpdatePasswordRequest.java
 */
export interface UpdatePasswordPayload {
  currentPassword?: string; // Ou o nome exato que está no seu record/classe Java
  newPassword: string;
}