import { AxiosPromise } from 'axios'
import HitApi from '../../classes/http/HitApi'
import { RequestMethod } from '../../enums/RequestMethods'
import { ApiEndpointsEnum } from '../../enums/ApiEndPointsEnum'
import { AuthorizationType } from '../../enums/authorization/AuthorizationType'
const careGiverAPI = {
    sendRequest: (userName: string) => {
        return HitApi.hitapi({
            url: ApiEndpointsEnum.CARE_GIVER_SEND_REQUEST_POST.replace(
                '{userName}',
                userName,
            ),
            requestMethod: RequestMethod.POST,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise
    },
    viewRequests: () => {
        return HitApi.hitapi({
            url: ApiEndpointsEnum.CARE_GIVER_VIEW_REQUEST_GET,
            requestMethod: RequestMethod.GET,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise<ViewCareGiverRequestsApiResponseType>
    },
    respondRequestStatus: ({
        status,
        userName,
    }: {
        status: CareGiverRequestStatusPayloadType
        userName: string
    }) => {
        return HitApi.hitapi({
            url: ApiEndpointsEnum.CARE_GIVER_RESPOND_REQUEST_STATUS_POST.replace(
                '{status}',
                status,
            ).replace('{userName}', userName),
            requestMethod: RequestMethod.POST,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise
    },
    getToken: (userName: string) => {
        return HitApi.hitapi({
            url: ApiEndpointsEnum.CARE_GIVER_GET_TOKEN_POST.replace(
                '{userName}',
                userName,
            ),
            requestMethod: RequestMethod.POST,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise<CareGiverGetTokenApiResponseType>
    },
    removeRecipient: (userName: string) => {
        return HitApi.hitapi({
            url: ApiEndpointsEnum.CARE_GIVER_REMOVE_RECIPIENT_POST.replace(
                '{userName}',
                userName,
            ),
            requestMethod: RequestMethod.POST,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise
    },
    getCareProviderAndRecipient: () => {
        return HitApi.hitapi({
            url: ApiEndpointsEnum.CARE_GIVER_RECIPIENT_GET,
            requestMethod: RequestMethod.GET,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise<CareProviderAndRecipientListResponseType>
    },
    removeCareProvider: () => {
        return HitApi.hitapi({
            url: ApiEndpointsEnum.CARE_GIVER_REMOVE_POST,
            requestMethod: RequestMethod.POST,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise
    },
    getAllUserLinkedWithPhoneNumber: (phoneNumber: string) => {
        return HitApi.hitapi({
            url: `${ApiEndpointsEnum.CARE_GIVER_ALL_USER_LINKED_WITH_PHONE_NUMBER_GET}`.replace(
                '{phoneNumber}',
                phoneNumber,
            ),
            requestMethod: RequestMethod.GET,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise<CareGiverGetAllUserLinkedWithPhoneResponseType>
    },
}

export default careGiverAPI

export type CareGiverRequestStatusPayloadType = 'ACCEPT' | 'REJECT'
export type CareGiverRequestStatusType = 'ACCEPTED' | 'REJECTED' | 'PENDING'
export type HealthStatusType =
    | 'HIGH_RISK'
    | 'HIGH_RISK_FIT_TO_TRAVEL'
    | 'HIGH_RISK_NOT_FIT_TO_TRAVEL'
    | 'LOW_RISK'
    | 'MEDIUM_RISK'

export interface ViewCareGiverRequestsApiResponseTypeItem {
    userName: string
    phoneNumber: string
    requestStatus: CareGiverRequestStatusType
}

export interface ViewCareGiverRequestsApiResponseType {
    careGiverRequests: ViewCareGiverRequestsApiResponseTypeItem[]
}

export interface CareProviderItemType {
    id: string
    userName: string
    phoneNumber: string
    fullName: string
    status: HealthStatusType | null
}

export interface CareRecipientItemType {
    id: string
    userName: string
    phoneNumber: string
    fullName: string
    status: HealthStatusType | null
}

export interface CareProviderAndRecipientListResponseType {
    careGiver: CareProviderItemType[]
    careGiverRecipient: CareRecipientItemType[]
}

export interface CareGiverGetTokenApiResponseType {
    token: string
    yatri: null
    message: string
}

export interface CareGiverGetAllUserLinkedWithPhoneResponseType
    extends Array<{
        userName: string
        fullName?: string
    }> {}
