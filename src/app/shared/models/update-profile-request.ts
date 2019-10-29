export interface UpdateProfileRequest {
   idToken: string;
   displayName: string;
   photoUrl: string;
   deleteAttribute: string[];
   returnSecureToken: boolean;
}
