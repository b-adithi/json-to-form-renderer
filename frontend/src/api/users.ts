import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export interface User {
  username: string;
  password: string;
  createdOn?: string;
  updatedOn?: string;
}

export interface LoginResult {
  success: boolean;
  token: string;
  error?: string;
}

/**
 * Authenticates a user by sending login credentials to the server.
 *
 * @param username - The username for authentication
 * @param password - The password for authentication
 * @returns A Promise that resolves to a LoginResult containing authentication data
 * @throws {Error} When the login request fails or credentials are invalid
 *
 * @example
 * ```typescript
 * const result = await loginUser('john_doe', 'securePassword123');
 * console.log(result.token);
 * ```
 */
export async function loginUser(
  username: string,
  password: string
): Promise<LoginResult> {
  return apiClient.post<LoginResult>(ENDPOINTS.login, { username, password });
}
