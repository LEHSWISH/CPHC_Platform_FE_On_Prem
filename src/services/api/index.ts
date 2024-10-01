import { FAQ_URL } from './../../utils/constants/constants'
import { AxiosPromise } from 'axios'
import HitApi from '../../classes/http/HitApi'
import { ApiEndpointsEnum } from '../../enums/ApiEndPointsEnum'
import { RequestMethod } from '../../enums/RequestMethods'
import { AuthorizationType } from '../../enums/authorization/AuthorizationType'
import { TemplateKeyEnum } from '../../enums/AuthTemplateKeyEnum'
import {
    AbhaCreationGenerateAaadhaarOtpApiPayloadType,
    AbhaCreationGenerateMobileOtpPayloadType,
    AbhaCreationVerifyAadharOtpPayloadType,
    AbhaCreationVerifyMobileOtpPayloadType,
    GenerateAbhaByDemograpicAPIRequestType,
    LoginApiPayloadType,
    RecoverAbhaGenerateMobileOtpApiPayloadType,
    RecoverAbhaVerifyMobileOtpApiPayloadType,
    RecoverAbhaVerifyUserApiPayloadType,
    UpdateYartriDetailsPayloadType,
    SyncRecordsWithAbhaApiPayloadType,
    SendSupportEmailApiPayloadType,
} from '../../interface/ApiRequestPayoadTypes'
import {
    AbhaCreationGenerateAadharOtpResponseTypeV2,
    AbhaCreationGenerateMobileOtpResponseType,
    AbhaCreationVerifyAadharOtpResponseType,
    AbhaCreationVerifyMobileOtpResponseType,
    AbhaVerificationGenerateMobileOtpResponseType,
    AbhaVerificationVerifyMobileOtpResponseType,
    DistrictAllResponseType,
    GenerateAbhaByDemograpicSuccessResponseType,
    GetAllUserLinkedWithPhoneNumberResponseType,
    GetUnlinkedCareContextResponseType,
    GetUserInfoByIDTP_ApiResponseType,
    LoginApiResponseType,
    MedicalsReportsType,
    RecoverAbhaGenerateMobileOtpApiResponseType,
    RecoverAbhaVerifyMobileOtpApiResponseType,
    RecoverAbhaVerifyUserApiResponseType,
    RhfFacilityListType,
    StateAllResponseType,
    VerifyPhoneNumberOnSignUpResponseType,
    YatriAllDetailsResponseType,
} from '../../interface/ApiResponseTypes'

// hitting on continue button after getting otp
export const signUpApi = (args: {
    phoneNumber: string
    userName: string
    password: string
    otp: string
    licenseAgreement: boolean
    templateKey: TemplateKeyEnum
}) => {
    return HitApi.hitapi({
        url: 'user-service/api/v1/yatri/sign-up',
        payload: args,
        requestMethod: RequestMethod.POST,
    }) as AxiosPromise
}


export const requestOtpApi = (args: {
    userName: string
    phoneNumber: string
    templateKey: TemplateKeyEnum
}) => {
    return HitApi.hitapi({
        url: 'user-service/api/v1/yatri/send-otp',
        payload: args,
        requestMethod: RequestMethod.POST,
    }) as AxiosPromise
}
export const verifyUserName = (args: { userName: string }) => {
    return HitApi.hitapi({
        url: `user-service/api/v1/yatri/validate-user/${args.userName}`,
        requestMethod: RequestMethod.GET,
    }) as AxiosPromise
}

export const verifyPhoneNumberOnSignUp = (phoneNumber: string) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.VALIDATE_PHONE_NUMBER_SIGN_UP.replace(
            '{phoneNumber}',
            phoneNumber,
        ),
        requestMethod: RequestMethod.GET,
    }) as AxiosPromise<VerifyPhoneNumberOnSignUpResponseType>
}

export const loginApi = (args: LoginApiPayloadType) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.YATRI_LOGIN_POST,
        payload: args,
        requestMethod: RequestMethod.POST,
    }) as Promise<LoginApiResponseType | unknown>
}

export const allYatriDetailsApi = () => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.YATRI_GET_ALL_DETAILS_GET,
        requestMethod: RequestMethod.GET,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as Promise<YatriAllDetailsResponseType | unknown>
}

export const updateYatriDetailsApi = (
    payload: UpdateYartriDetailsPayloadType,
) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.YATRI_UPDATE_DETAILS_POST,
        requestMethod: RequestMethod.POST,
        payload,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as Promise<YatriAllDetailsResponseType | unknown>
}

export const AbhaVerificationGenerateMobileOtpApi = (healthid: string) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.ABHA_VERIFICATION_GENERATE_MOBILE_OTP_POST,
        payload: {
            healthid,
        },
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as Promise<AbhaVerificationGenerateMobileOtpResponseType | unknown>
}

export const AbhaVerificationVerifyMobileOtpApi = (payload: {
    otp: string
    txnId: string
}) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.ABHA_VERIFICATION_VERIFY_MOBILE_OTP_POST,
        payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as Promise<AbhaVerificationVerifyMobileOtpResponseType | unknown>
}

export const AbhaCreationGenerateAaadhaarOtpApi = (
    payload: AbhaCreationGenerateAaadhaarOtpApiPayloadType | string,
) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.ABHA_CREATION_GENERATE_AADHAAR_OTP_POST,
        payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise<AbhaCreationGenerateAadharOtpResponseTypeV2>
}

export const AbhaCreationVerifyAaadhaarOtpApi = (
    payload: AbhaCreationVerifyAadharOtpPayloadType,
) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.ABHA_CREATION_VERIFY_AADHAAR_OTP_POST,
        payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise<AbhaCreationVerifyAadharOtpResponseType>
}

export const AbhaCreationGenerateMobileOtpApi = (
    payload: AbhaCreationGenerateMobileOtpPayloadType,
) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.ABHA_CREATION_GENERATE_MOBLIE_OTP_POST,
        payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise<AbhaCreationGenerateMobileOtpResponseType>
}

export const AbhaCreationVerifyMobileOtpApi = (
    payload: AbhaCreationVerifyMobileOtpPayloadType,
) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.ABHA_CREATION_VERIFY_MOBILE_OTP_POST,
        payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise<AbhaCreationVerifyMobileOtpResponseType>
}

export const IdtpGetUserInfoApi = ({
    tourismPortalId,
}: {
    tourismPortalId: string
}) => {
    // >>> consent to be removed from here once backend changes are done and deployed
    return HitApi.hitapi({
        url: `${ApiEndpointsEnum.USER_INFO_BY_IDTP_GET}`
            .replace('{{id}}', tourismPortalId)
            .replace('{{consent}}', `${true}`),
        requestMethod: RequestMethod.GET,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise<GetUserInfoByIDTP_ApiResponseType>
}

export const resendOtpApi = (args: {
    userName: string
    phoneNumber: string
    templateKey: TemplateKeyEnum
}) => {
    return HitApi.hitapi({
        url: 'user-service/api/v1/yatri/resend-otp',
        payload: args,
        requestMethod: RequestMethod.POST,
    }) as AxiosPromise
}

export const getAllStateApi = () => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.RHF_GET_ALL_STATES,
        requestMethod: RequestMethod.GET,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise<StateAllResponseType>
}

export const getDistrictListApi = (stateCode: string) => {
    return HitApi.hitapi({
        url: `${ApiEndpointsEnum.RHF_GET_DISTRICT_LIST}`.replace(
            '{stateCode}',
            stateCode,
        ),
        requestMethod: RequestMethod.GET,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise<DistrictAllResponseType>
}

export const getRhfFacilityListApi = (payload: {
    stateCode: string
    districtCode: string
}) => {
    return HitApi.hitapi({
        url: `${ApiEndpointsEnum.RHF_GET_FACILITY_LIST}`
            .replace('{stateCode}', payload.stateCode)
            .replace('{districtCode}', payload.districtCode),
        requestMethod: RequestMethod.GET,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise<RhfFacilityListType>
}

export const forgetUsername = (payload: { phoneNumber: string }) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.FORGET_USERNAME}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.NOT_AUTHORIZED,
        },
    }) as AxiosPromise<RhfFacilityListType>
}
export const getMedicalReportApi = () => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.FETCH_MEDICAL_REPORT_GET,
        requestMethod: RequestMethod.GET,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise<MedicalsReportsType>
}

export const UpdateMedicalReportApi = (payload: MedicalsReportsType) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.UPDATE_MEDICAL_REPORT_POST,
        payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}

export const faqsData = () => {
    return HitApi.hitapi({
        url: FAQ_URL,
        requestMethod: RequestMethod.GET,
        ignoreBaseUrl: true,
    }) as AxiosPromise
}

export const validateUsernamePhoneNumber = (payload: {
    userName: string
    phoneNumber: string
}) => {
    return HitApi.hitapi({
        payload: payload,
        url: ApiEndpointsEnum.VALIDATE_USERNAME_PHONE_NUMBER,
        requestMethod: RequestMethod.POST,
    }) as AxiosPromise
}

export const linkViaAbhaNumberViaAbha = (payload: { ABHANumber: string }) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.LINK_VIA_ABHA_NUMBER_VIA_ABHA}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}
export const linkViaAbhaNumberViaAadhar = (payload: { ABHANumber: string }) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.LINK_VIA_ABHA_NUMBER_VIA_AADHAR}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}
export const linkViaAbhaAddressViaAbha = (payload: { healthid: string }) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.LINK_VIA_ABHA_ADDRESS_VIA_ABHA}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}
export const linkViaAbhaAddressViaAadhar = (payload: { healthid: string }) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.LINK_VIA_ABHA_ADDRESS_VIA_AADHAR}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}
export const linkViaPhoneNumber = (payload: { mobile: string }) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.LINK_VIA_PHONE_NUMBER}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}
export const linkViaPhoneNumberVerify = (payload: {
    otp: number | string
    txnId: number | string
}) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.LINK_VIA_PHONE_NUMBER_VERIFY}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}
export const linkViaPhoneNumberUserVerify = (payload: {
    txnId: number | string
    abhaToken: number | string
    ABHANumber: number | string
}) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.LINK_VIA_PHONE_NUMBER_USER_VERIFY}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}
export const linkViaAadhaarNumber = (payload: { aadhaar: string }) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.LINK_VIA_AADHAAR_NUMBER}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}
export const linkViaAadhaarNumberVerify = (payload: {
    otp: number | string
    txnId: number | string
}) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.LINK_VIA_AADHAAR_NUMBER_VERIFY}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}
export const linkViaABHAVerify = (payload: {
    otp: number | string
    txnId: number | string
}) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.LINK_VIA_ABHA_NUMBER_VERIFY}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}
export const linkViaABHAVerifyViaAadhar = (payload: {
    otp: number | string
    txnId: number | string
}) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.LINK_VIA_ABHA_NUMBER_VERIFY_VIA_AADHAR}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}

export const linkViaABHAAdressVerifyViaAadhar = (payload: {
    otp: number | string
    txnId: number | string
}) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.LINK_VIA_AABHA_ADDRESS_AADHAR_VERIFY}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}
export const linkViaAadharVerify = (payload: {
    otp: number | string
    txnId: number | string
}) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.LINK_VIA_AADHAR_VERIFY}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}
export const suggestionsApi = (payload: { txnId: number | string }) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.CREATE_ABHA_SUGGESTIONS}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}
export const createAbhaAddress = (payload: {
    txnId: number | string
    abhaAddress: string | null
    preferred: number
}) => {
    return HitApi.hitapi({
        url: `user-service/${ApiEndpointsEnum.CREATE_ABHA_ADDRESS}`,
        ignoreBaseUrl: false,
        payload: payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}

// export const generateMobileOtp = (payload: { aadhar: number | string, mobile: string | number }) => {
//     return HitApi.hitapi({
//         url: `user-service/${ApiEndpointsEnum.GENERATE_MOBILE_OTP_ABHA}`,
//         ignoreBaseUrl: false,
//         payload: payload,
//         requestMethod: RequestMethod.POST,
//         config: {
//             authorization: AuthorizationType.BEARER_TOKEN,
//         },
//     }) as AxiosPromise
// }
export const RecoverAbhaGenerateMobileOtpApi = (
    payload: RecoverAbhaGenerateMobileOtpApiPayloadType,
) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.RECOVER_ABHA_GENERATE_PHONE_NUMBER,
        payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise<RecoverAbhaGenerateMobileOtpApiResponseType>
}

export const RecoverAbhaVerifyMobileOtpApi = (
    payload: RecoverAbhaVerifyMobileOtpApiPayloadType,
) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.RECOVER_ABHA_VERIFY_PHONE_NUMBER,
        payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise<RecoverAbhaVerifyMobileOtpApiResponseType>
}

export const RecoverAbhaVerifyUserApi = (
    payload: RecoverAbhaVerifyUserApiPayloadType,
) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.RECOVER_ABHA_VERIFY_USER,
        payload,
        requestMethod: RequestMethod.POST,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise<RecoverAbhaVerifyUserApiResponseType>
}

export const getPostalPinCodeInfoAPI = (pincode: string) => {
    return HitApi.hitapi({
        url: `user-service/api/v1/utility/pinCode/${pincode}`,
        requestMethod: RequestMethod.GET,
        ignoreBaseUrl: false,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise<{
        district: null | string
        state: null | string
        city: null | string
    }>
}

export const generateAbhaByDemograpicAPI = (
    payload: GenerateAbhaByDemograpicAPIRequestType,
) => {
    return HitApi.hitapi({
        url: 'user-service/api/v1/abha/registration/auth-demo',
        requestMethod: RequestMethod.POST,
        ignoreBaseUrl: false,
        payload,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise<GenerateAbhaByDemograpicSuccessResponseType>
}

export const fetchAbhaCard = (payload: {
    abhaToken?: string | null
    authType?: string | null
    aadharNumber?: string | null
}) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.FETCH_ABHA_CARD,
        requestMethod: RequestMethod.POST,
        ignoreBaseUrl: false,
        payload,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}

export const fetchAbhaCardPdf = (payload: {
    abhaToken?: string | null
    authType?: string | null
    aadharNumber?: string | null
}) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.FETCH_ABHA_CARD_PDF,
        requestMethod: RequestMethod.POST,
        ignoreBaseUrl: false,
        payload,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}

export const getAllUserLinkedWithPhoneNumber = (phoneNumber: string) => {
    return HitApi.hitapi({
        url: `${ApiEndpointsEnum.GET_ALL_USER_LINKED_WITH_PHONE_NUMBER}`.replace(
            '{phoneNumber}',
            phoneNumber,
        ),
        requestMethod: RequestMethod.GET,
    }) as AxiosPromise<GetAllUserLinkedWithPhoneNumberResponseType>
}

export const getUnlinkedCareContextApi = (payload = {}) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.GET_UNLINKED_CARE_CONTEXT,
        requestMethod: RequestMethod.POST,
        ignoreBaseUrl: false,
        payload,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise<GetUnlinkedCareContextResponseType[]>
}

export const syncMedicalRecordsWithAbhaApi = (payload: SyncRecordsWithAbhaApiPayloadType) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.SYNC_RECORDS_WITH_ABHA,
        requestMethod: RequestMethod.POST,
        ignoreBaseUrl: false,
        payload,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}

export const saveAbhaDetails = (payload: {
    abhaToken?: string | null
}) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.SAVE_ABHA_DETAILS,
        requestMethod: RequestMethod.POST,
        ignoreBaseUrl: false,
        payload,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}

export const yatriSupportSendEmailWithBasicApi = (payload : SendSupportEmailApiPayloadType) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.SEND_SUPPORT_EMAIL,
        requestMethod: RequestMethod.POST,
        ignoreBaseUrl: false,
        payload,
    }) as AxiosPromise
}

export const yatriSupportSendEmailWithBearerApi = (payload : SendSupportEmailApiPayloadType) => {
    return HitApi.hitapi({
        url: ApiEndpointsEnum.SEND_SUPPORT_EMAIL,
        requestMethod: RequestMethod.POST,
        ignoreBaseUrl: false,
        payload,
        config: {
            authorization: AuthorizationType.BEARER_TOKEN,
        },
    }) as AxiosPromise
}
