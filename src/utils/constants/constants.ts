/**
 * Constants and URLs
 * 
 * This file defines constants and URLs used throughout the application. It includes
 * URLs for medical certificates, FAQs, and authentication tokens. These constants are
 * imported and used in various parts of the application to ensure consistency and 
 * ease of maintenance.
 */


import { environment } from "../../environments/environment";

export const MEDICAL_CERTIFICATE_URL = `${environment.frontendUrl}docs/health/Medical_Certificate.pdf`
export const FAQ_URL = `${environment.frontendUrl}docs/health/FAQ.json`

export const BASIC_AUTH_TOKEN = `NmdVZ1MwUXY2eTg5a2lXejcwVG81QT09OjA3NFltNTJ5RmN0QTdNbzlQMEtST2c9PQ==`