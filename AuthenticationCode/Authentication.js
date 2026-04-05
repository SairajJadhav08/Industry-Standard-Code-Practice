import conf from '../Configuration'
import { Client, Account, ID } from "appwrite";

/*
  This file handles all authentication logic for our app.

  Why this structure?
  -------------------
  We are currently using Appwrite as our backend service.

  But in the future, if we switch to another service (like Firebase),
  we only need to update this file — NOT the entire frontend.

  This makes our code:
  ✔ Easy to maintain
  ✔ Scalable
  ✔ Future-proof

  This approach is commonly used in production-level applications.
*/

export class AuthService {
    client = new Client();
    account;

    constructor () {
        // Configure Appwrite client
        this.client
            .setEndpoint(conf.appwriteurl)
            .setProject(conf.appwriteprojectid)

        // Create Account instance using the client
        this.account = new Account(this.client)
    }

    // Create a new user account
    async createAccount ({email, password, name}) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );

            // If account is created successfully, log the user in
            if (userAccount) {
                return this.login({ email, password });
            } else {
                return userAccount;
            }

        } catch (error) {
            throw error;
        }
    }

    // Login user using email & password
    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    // Check if user is currently logged in
    async signupStatus() {
        try {
            const user = await this.account.get();

            return user ? user : null;

        } catch (error) {
            throw error;
        }
    }

    // Logout user (delete all active sessions)
    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            throw error;
        }
    }
}

// Create a single instance (Singleton pattern)
const authService = new AuthService();

/*
  Exporting a single instance makes it easy to use across the app.

  Example usage in frontend:
  -------------------------
  authService.createAccount(...)
  authService.login(...)
  authService.logout(...)

  If backend changes in future,
  we only update this file — everything else remains the same.
*/

export default authService;