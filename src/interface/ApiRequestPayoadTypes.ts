export interface LoginApiPayloadType {
    userName: string
    password: string
    redirectFromRegistration?: boolean
    sessionId?: string
}

export interface AbhaCreationGenerateAaadhaarOtpApiPayloadType {
    aadhaar: string
    consent: boolean
}
export interface AbhaCreationVerifyAadharOtpPayloadType {
    otp: string
    txnId: string
    mobile: string
}

export interface AbhaCreationGenerateMobileOtpPayloadType {
    txnId: string
    mobile: string
}

export interface AbhaCreationVerifyMobileOtpPayloadType {
    mobile: number | string
    txnId: string
    otp: string
}

export interface UpdateYartriDetailsPayloadType {
    phoneNumber: string
    otp?: string
    templateKey?: string
    licenseAggreement?: boolean
    // >>> keys related to upload documents
    documentType?: string
    hospitalLabName?: string
    visitPurpose?: string
    documentsPath?: Array<{
        fileName: string
        filePath: string
        createdOn?: string
        lastUpdatedOn?: string
    }>
    // >>>
    governmentIdType?: string
    governmentId?: string
    idtpId?: string
    yatriDetails?: {
        fullName?: string
        firstName?: string
        lastName?: string
        emailId?: string
        gender?: string
        dateOfBirth?: string
        tourStartDate?: string
        tourEndDate?: string
        tourDuration?: number
        address?: string
        pinCode?: string
        state?: string
        district?: string
        phoneNumber?: string
    }
    medicalsReports?: {
        heartDisease?: boolean
        hypertension?: boolean
        respiratoryDiseaseOrAsthma?: boolean
        diabetesMellitus?: boolean
        epilepsyOrAnyNeurologicalDisorder?: boolean
        kidneyOrUrinaryDisorder?: boolean
        cancer?: boolean
        migraineOrPersistentHeadache?: boolean
        anyAllergies?: boolean
        disorderOfTheJointsOrMusclesArthritisGout?: boolean
        anyMajorSurgery?: boolean
    }
}

export interface GetMedicalDownloadPreSignedUrlPayloadType
    extends Array<{
        fileName: string
        filePath: string
    }> {}

export interface GetMedicalUploadPreSignedUrlPayloadType
    extends Array<{
        fileName: string
        fileBase64?: string
    }> {}

export interface DeleteMedicalDocumentsPayloadType
    extends GetMedicalDownloadPreSignedUrlPayloadType {}

export interface RecoverAbhaGenerateMobileOtpApiPayloadType {
    mobile: string
    consent: boolean
}

export interface RecoverAbhaVerifyMobileOtpApiPayloadType {
    txnId: string
    otp: string
}

export interface RecoverAbhaVerifyUserApiPayloadType {
    txnId: string
    abhaToken: string
    ABHANumber: string
}

export interface GenerateAbhaByDemograpicAPIRequestType {
    aadharNumber: string
    dateOfBirth: string
    gender: string
    stateCode: string
    districtCode: string
    name: string
    mobileNumber: string
    consent: boolean
}

export interface SyncRecordsWithAbhaApiPayloadType {
    visitPurpose: string
    documentsPathEntity: {
        id: string
        fileName: string
        filePath: string
        createdOn: string
        updatedOn: string
        medicalDocumentType: string
        hospitalLabName: string
        visitPurpose: string
        careContextId: string
    }[],
    documentType: string
    careContextId: string
}
export interface SendSupportEmailApiPayloadType {
    subject: string
    messageBody: string
    phoneNumber: string
    name: string
    emailTo: string[]
    bcc: string[]
    fileName?: string | undefined
    attachFiles?: (string | undefined)[]
}
