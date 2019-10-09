import { API_KEY_URL } from 'src/environments/environment';

export const POST_SIGN_UP_USER_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY_URL}`;
export const POST_SIGN_IN_USER_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY_URL}`;
