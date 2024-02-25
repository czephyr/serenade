import NextAuth from "next-auth/next";
import KeycloakProvider from "next-auth/providers/keycloak";
import {jwtDecode} from 'jwt-decode'
import { encrypt } from "@/utils/encryption"; 

export const authOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.OIDC_ID as string,
            clientSecret: process.env.OIDC_SECRET as string,
            issuer: process.env.OIDC_ISSUER as string,
        }),
    ],

    callbacks: {
        // encryption here, then sent to browser
        async jwt({token, user, account, profile }) {
            const nowTimeStamp = Math.floor(Date.now() / 1000);
            if (account) {
                console.log("account")
                // account is only available the first time this callback is called on a new session (after the user signs in)
                token.decoded = jwtDecode(account.access_token);
                token.access_token = account.access_token;
                token.id_token = account.id_token;
                token.expires_at = account.expires_at;
                token.refresh_token = account.refresh_token;
                return token;
            } else if (nowTimeStamp < token.expires_at) {
                console.log("jwt2")
                // token has not expired yet, return it
                return token;
            } else {
                // token is expired, try to refresh it
                console.log("Token has expired. Will refresh...")

                return token
            }
        },
        // only stuff added in jwt to the token can be used in session
        // not encrypted, sent to browser
        async session({ session, token }) {
            console.log("session")
            // Send properties to the client
            session.token_token = token.access_token
            session.access_token = encrypt(token.access_token); // see utils/sessionTokenAccessor.js
            session.id_token = encrypt(token.id_token);  // see utils/sessionTokenAccessor.js
            session.roles = token.decoded.realm_access.roles;
            session.error = token.error;
            return session;
        }
    }
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

