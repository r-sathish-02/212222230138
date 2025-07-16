// Logging Middleware/src/loggingMiddleware.ts (Final version of getAccessToken function)

import axios from 'axios';

// IMPORTANT: Replace these placeholders with your ACTUAL values obtained after manual registration.
// These are sensitive and should ideally come from secure environment variables in a real application.
// For this assignment, ensure they match your registration details.
const CLIENT_ID = process.env.CLIENT_ID || 'YOUR_CLIENT_ID_FROM_REGISTRATION';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'YOUR_CLIENT_SECRET_FROM_REGISTRATION';
const REG_EMAIL = process.env.REG_EMAIL || 'your.registered@email.com';
const REG_NAME = process.env.REG_NAME || 'Your Name';
const REG_ROLLNO = process.env.REG_ROLLNO || 'YOUR_ROLL_NUMBER';
const ACCESS_CODE = process.env.ACCESS_CODE || 'qguCff';

const BASE_EVAL_URL = 'http://20.244.56.144/evaluation-service';
let accessToken: string | null = null;
let tokenExpiry: number = 0; // Unix timestamp in milliseconds

/**
 * Authenticates with the evaluation server and obtains an access token.
 * Caches the token and refreshes if expired.
 * @returns {Promise<string>} The access token.
 * @throws {Error} If authentication fails.
 */
async function getAccessToken(): Promise<string> {
    const now = Date.now();

    // 1. Check if we have a valid, unexpired token in cache
    // Refresh if token expires within 1 minute (60 * 1000 ms)
    if (accessToken && tokenExpiry > now + 60 * 1000) {
        console.log("[Log Middleware] Using cached access token.");
        return accessToken; // Here, accessToken is definitively a 'string'
    }

    // 2. If no valid cached token, attempt to fetch a new one
    console.log("[Log Middleware] Attempting to get new access token...");
    try {
        const response = await axios.post(`${BASE_EVAL_URL}/auth`, {
            email: REG_EMAIL,
            name: REG_NAME,
            rollNo: REG_ROLLNO,
            accessCode: ACCESS_CODE,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200 && response.data.access_token) {
            accessToken = response.data.access_token;
            tokenExpiry = now + (response.data.expires_in * 1000);
            console.log("[Log Middleware] Access token obtained successfully.");
            // Explicitly assert that accessToken is a string before returning
            // This is the key fix if TypeScript's control flow analysis isn't enough.
            return accessToken as string; // Assert accessToken as string here
        } else {
            throw new Error(`Authentication failed: Status ${response.status}, Response: ${JSON.stringify(response.data)}`);
        }
    } catch (error: any) {
        console.error("[Log Middleware] Error obtaining access token:", error.response?.data || error.message);
        throw new Error("Log Middleware: Could not obtain access token. Logs will not be sent.");
    }
}

/**
 * Sends a log entry to the evaluation server.
 * ... (rest of the Log function is unchanged)
 */
export async function Log(stack: string, level: string, pkg: string, message: string): Promise<void> {
    if (!CLIENT_ID || CLIENT_ID === 'YOUR_CLIENT_ID_FROM_REGISTRATION') {
        console.warn("[Log Middleware] CLIENT_ID is not set. Please perform manual registration first and update environment variables/code. Logs will not be sent.");
        return;
    }

    try {
        const token = await getAccessToken();
        const logUrl = `${BASE_EVAL_URL}/logs`;

        const logData = {
            stack: stack.toLowerCase(),
            level: level.toLowerCase(),
            package: pkg.toLowerCase(),
            message: message
        };

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const response = await axios.post(logUrl, logData, { headers });

        if (response.status === 200) {
            console.log(`[Log Middleware] Log sent successfully. LogID: ${response.data.logID}`);
        } else {
            console.error(`[Log Middleware] Failed to send log: Status ${response.status}, Response: ${JSON.stringify(response.data)}`);
        }
    } catch (error: any) {
        console.error("[Log Middleware] Error in Log function (could not send log):", error.message);
    }
}