/**
 * Environment Configuration
 * 
 * This file defines the environment configuration for the application.
 * It contains the base URLs for various services used in the application.
 * These URLs are essential for making API calls to different back-end services.
 * Please ensure that these URLs are modified according to the specific environment in which your application will be used.
 *
 * Services Configured:
 * - User Service
 * - ABHA Service
 * - Health Service
 * - Notification Service
 */


const environment = {
    baseUrlUserService:'https://dev-itda.yatripulse.in:9001/',
    baseUrlAbhaService:'https://dev-itda.yatripulse.in:9004/',
    baseUrlHealthService:'https://dev-itda.yatripulse.in:9003/',
    baseUrlNotificationService:'https://dev-itda.yatripulse.in:9002/', 
    frontendUrl: 'https://dev-itda.yatripulse.in/',
}

try {
    // environment.baseUrl=import.meta.env.VITE_API_BASE_URL
} catch (err) {
    console.error(err)
}

export { environment }
