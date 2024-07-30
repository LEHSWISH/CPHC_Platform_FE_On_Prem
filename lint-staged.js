/**
 * Lint-Staged Configuration File
 * 
 * This file configures lint-staged to run specified commands on staged files before they are committed.
 * It ensures that linting and formatting tasks are applied to only the staged files, improving code quality and consistency.
 */


export default {
    '*.{js,jsx,ts,tsx}': [
        'eslint --max-warnings=20',
        // 'react-scripts test --bail --watchAll=false --findRelatedTests --passWithNoTests',
        () => 'tsc-files --noEmit',
    ],
    '*.{js,jsx,ts,tsx,json,css,js}': ['prettier --write'],
}
