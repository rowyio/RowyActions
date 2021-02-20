// Initialize Firebase Admin
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

export const db = admin.firestore();
export const auth = admin.auth();
export const env = functions.config();
