export interface LoginApiResponseType {
    token: string | null
    yatri: null | unknown
    message: string | null
}

export interface YatriDetailsType {
    firstName: string
    lastName: string
    emailId: string
    gender: string
    dateOfBirth: string
    tourStartDate: string
    tourEndDate: string
    tourDuration: number
    createdByTime: null
    updatedByTime: null
    fullName: string
    age?: number
    address?: string
    pinCode?: string
    state?: string
    district?: string
    phoneNumber?: string
}

export interface MedicalsReportsType {
    createdOn?: null | string
    updatedOn?: null | string
    heartDisease: boolean
    hypertension: boolean
    respiratoryDiseaseOrAsthma: boolean
    diabetesMellitus: boolean
    tuberculosis: boolean
    epilepsyOrAnyNeurologicalDisorder: boolean
    kidneyOrUrinaryDisorder: boolean
    cancer: boolean
    migraineOrPersistentHeadache: boolean
    anyAllergies: boolean
    disorderOfTheJointsOrMusclesArthritisGout: boolean
    anyMajorSurgery: boolean
}

interface AbhaUserDetailsType {
    createdOn: string
    updatedOn: string
    id: string
    ABHANumber: string
    firstName: string
    middleName: string
    lastName: string
    fullName: string
    dateOfBirth: string
    gender: string
    imagePath: string | null
    phoneNumber: string
    emailId: string
    phrAddress: string[]
    address: string
    districtCode: string
    stateCode: string
    districtName: string
    stateName: string
    pinCode: string
    abhaType: null | string
    abhaStatus: string
    yatriPulseUserId: string
    abhaVerified: boolean
}

interface TourismUserInfoType {
    idtpId: string
    fullName: string
    phoneNumber: string
    gender: string
    age: number
    attemptLeft: null | unknown
    address: string
}

export interface YatriAllDetailsResponseType {
    userName: string
    phoneNumber: string
    licenseAgreement: boolean
    licenseAgreementTime: null
    abhaNumber: string | null
    abhaUserId: string | null
    documentsPath?: Array<{
        fileName: string
        filePath: string
        createdOn: string
        updatedOn: string
        id: string
        careContextId: string
        hospitalLabName: string
        medicalDocumentType: string
        visitPurpose: string
        lastUpdatedOn?: string
    }>
    governmentIdType: string | null
    governmentId: string | null
    // idtpId: null
    // idypId: null
    yatriDetails?: YatriDetailsType | null
    medicalsReports?: MedicalsReportsType | null
    abhaUserDetails?: AbhaUserDetailsType | null
    tourismUserInfo?: TourismUserInfoType | null
}

export interface AbhaVerificationGenerateMobileOtpResponseType {
    txnId: string
    message: string | null
    code: string | null
    details: string | null
}

export interface AbhaVerificationGenerateMobileOtpErrorResponseType {
    code: string
    message: string
    serialVersionUID: number
    status: number
    errorDetails?: {
        code: string
        message: string
        details: null | Array<{
            message?: string
            code?: string
            attribute?: {
                key: string
                value: string
            }
        }>
    }
    details?: null | string
}

export interface AbhaVerificationVerifyMobileOtpResponseType {
    token: string
    refreshToken: string
    expiresIn: number
    refreshExpiresIn: number
    healthIdNumber: null | string
    name: null | string
    gender: null | string
    yearOfBirth: number
    monthOfBirth: number
    dayOfBirth: number
    firstName: null | string
    healthId: null | string
    lastName: null | string
    middleName: null | string
    stateCode: number
    districtCode: number
    subDistrictCode: number
    villageCode: number
    townCode: number
    wardCode: number
    address: null | string
    stateName: null | string
    districtName: null | string
    subdistrictName: null | string
    villageName: null | string
    townName: null | string
    wardName: null | string
    email: null | string
    kycPhoto: null | string
    mobile: null | string
    authMethods: null | string
    pincode: null | number | string
    tags: null | string
    kycVerified: boolean
    verificationStatus: null | string
    verificationType: null | string
    phrAddress: null | string
    linkedPhrAddress: number
    transactionId: null
    emailVerified: boolean
    new: boolean
}

export interface AbhaCreationGenerateAadharOtpResponseTypeV2 {
    txnId: string
    message: string
    mobile: string
    mobileNumberMatched: boolean
    ABHANumber: string | null
    tokens: {
        token?: string
        expiresIn?: number
        refreshToken?: string
        refreshExpiresIn?: string
    } | null
    firstName: string
    authType: string | null
    abhaAddressList: string | null
    preferredAbhaAddress: string | null
    healthIdNumber: string | null
    preSignedUrl: string | null
    new: boolean
}

export interface AbhaCreationGenerateAadharOtpResponseType {
    txnId: string
    message: string
    mobile: string
    mobileNumberMatched: boolean
    ABHANumber: string
}

export interface AbhaCreationGenerateAadharOtpErrorResponseType {
    code: string
    message: string
    serialVersionUID: number
    status: number
}

export interface GetUserInfoByIDTP_ApiErrorResponseType {
    serialVersionUID: number
    status: number
    code: string
    message: string
}

interface StateElementType {
    stateCode: string
    stateName: string
}

export interface StateAllResponseType extends Array<StateElementType> {}

interface DistrictElementType {
    districtCode: string
    districtName: string
}

export interface DistrictAllResponseType extends Array<DistrictElementType> {}

interface RhfFacilityType {
    facilityId: string
    facilityName: string
    facilityStatus: string
    facilityType: string
    ownership: string
    address: string
    abdmEnabled: boolean
}

export interface RhfFacilityListType extends Array<RhfFacilityType> {}

export interface AbhaCreationVerifyAadharOtpResponseType
    extends AbhaCreationGenerateAadharOtpResponseTypeV2 {}

export interface AbhaCreationGenerateMobileOtpResponseType
    extends AbhaCreationGenerateAadharOtpResponseTypeV2 {}

export interface AbhaCreationVerifyMobileOtpResponseType
    extends AbhaCreationGenerateAadharOtpResponseTypeV2 {}

export interface GetUserInfoByIDTP_ApiResponseType {
    firstName: string
    lastName: null | string
    fullName: string
    emailId: string | null
    aadhaarNo: string | null
    phoneNumber: string
    gender: string
    dateOfBirth: null | string
    age: number
    tourStartDate: string
    tourEndDate: string
    tourDuration: number
    attemptLeft: string
    address?: string
}

export interface GetMedicalUploadPreSignedUrlResponseType
    extends Array<{
        fileName: string
        filePath: string
        presignedUrl: string // To be removed when deleting unused files
    }> {}

export interface GetMedicalDownloadPreSignedUrlResponseType
    extends Array<{
        fileName: string
        filePath: string
        fileBase64: string
        presignedUrl: string // To be removed when deleting unused files
    }> {}

export interface VerifyPhoneNumberOnSignUpResponseType {
    linkedWith: number
    mobileNumber: string
}

export interface RecoverAbhaGenerateMobileOtpApiResponseType {
    txnId: string
    message: string
    mobile: string
    token: string
    accounts: [{
        ABHANumber: string
        name: string
        preferredAbhaAddress:string | null
    }]
    tokens: {
        token?: string
        expiresIn?: number
        refreshToken?: string
        refreshExpiresIn?: string
    } | null
    firstName: string
    authType: string | null
    mobileNumberMatched: boolean
    abhaAddressList: string | null
    preferredAbhaAddress: string | null
    healthIdNumber: string | null
    preSignedUrl: string | null
    new: boolean
    ABHANumber: string | null
}

export interface RecoverAbhaVerifyMobileOtpApiResponseType
    extends RecoverAbhaGenerateMobileOtpApiResponseType {}

export interface RecoverAbhaVerifyUserApiResponseType
    extends RecoverAbhaGenerateMobileOtpApiResponseType {}
export interface GenerateAbhaByDemograpicSuccessResponseType
    extends AbhaCreationGenerateAadharOtpResponseTypeV2 {}

export interface GetAllUserLinkedWithPhoneNumberResponseType {
    linkedWith: number
    users: string[]
    mobileNumber: string
}

export interface GetUnlinkedCareContextResponseType {
    createdOn: string
    updatedOn: string
    createdBy: {
        yatriUserName: string
    }
    lastModifiedBy: {
        yatriUserName: string
    }
    id: string
    patientId: string
    documentPathId: string[]
    documentPath: string[]
    hiType: string
    documentsDescription: string
    abhaId: string | number
}
