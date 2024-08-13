import en from '../assets/locales/en.json'

const resources = {
    translation: en,
} as const

declare module 'i18next' {
    interface CustomTypeOptions {
        resources: typeof resources
    }
}
