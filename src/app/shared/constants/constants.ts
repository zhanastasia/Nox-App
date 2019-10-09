export const API_KEY_URL = 'AIzaSyAfAY0epIj65g7ceQLDwqERnrl91cCPbIQ';
export const SING_UP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
export const SING_IN_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';

export function POST_SING_UP_USER(): string {
   return `${SING_UP_URL}${API_KEY_URL}`;
}

export function POST_SING_IN_USER(): string {
   return `${SING_IN_URL}${API_KEY_URL}`;
}
