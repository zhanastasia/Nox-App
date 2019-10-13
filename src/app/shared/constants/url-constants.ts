import { environment } from 'src/environments/environment';

export const POST_SIGN_UP_USER_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKeyUrl}`;
export const POST_SIGN_IN_USER_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKeyUrl}`;
