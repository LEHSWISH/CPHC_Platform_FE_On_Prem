export enum coreRoutesEnum {
    HOME = 'home',
    SIGN_UP = 'signup',
    LOG_IN = 'login',
    RESET_PASSWORD = 'reset-password',
    ABHA = 'abha',
    CREATE_ABHA = 'create-abha',
    RECOVER_ABHA = 'recover-abha',
    YATRA_DETAIL = 'yatra-detail',
    LINK_ABHA = 'link',
    CARE_GIVER = 'care-giver',
    MEDICAL_RECORDS = 'medical-records',
    LOCATE_MEDICAL_FACILITY = 'locate-health-facility',
    VITALS = 'vitals',
    WELCOME = 'welcome',
    CONTACT_US = 'contact-us',
}

export enum nestedRoutePathsEnum {
    CREATE_ABHA_WITH_TP_ID = 'tpid',
    HOSPITAL_CARD_DETAILS = 'hosp-details',
    MY_REQUESTS='my-requests'
}

export enum homeNestedRoutesEnum {
    YATRI_PROFILE = 'profile',
    VIEW_YATRA_DETAILS = 'yatra-details',
    YATRA_DETAILS = 'add-yatra-details',
    CREATE_ABHA_WITH_TP_ID = nestedRoutePathsEnum.CREATE_ABHA_WITH_TP_ID,
    MEDICAL_DECLARATION = 'medical-declaration'
}

export const DefaultAuthenticatedRedirectRoute = `/${coreRoutesEnum.HOME}`

export const DefaultUnAuthenticatedRedirectRoute = `/${coreRoutesEnum.LOG_IN}`
// Made Coming soon as the default UnAuthentical Route instead of Login Page till live.
