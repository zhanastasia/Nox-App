export interface UpdateProfileResponse {
   localId: string;
   email: string;
   displayName: string;
   photoUrl: string;
   passwordHash: string;
   providerUserInfo: object[];
   idToken: string;
   refreshToken: string;
   expiresIn: string;
}
