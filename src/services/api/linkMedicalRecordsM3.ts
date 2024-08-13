import { AxiosPromise } from 'axios'
import HitApi from '../../classes/http/HitApi'
import { ApiEndpointsEnum } from '../../enums/ApiEndPointsEnum'
import { RequestMethod } from '../../enums/RequestMethods'
import { AuthorizationType } from '../../enums/authorization/AuthorizationType'

const linkMedicalRecords = {
    getConsentDb: (
        payload:object
    ) => {
        return HitApi.hitapi({
            url: ApiEndpointsEnum.FETCH_CONSENT_DB,
            payload,
            requestMethod: RequestMethod.POST,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise
    },
    getConsentWithId: (
        payload: {
            consentIds : string[]
        },
    ) => {
        return HitApi.hitapi({
            url: ApiEndpointsEnum.FETCH_CONSENT_WITH_ID,
            payload,
            requestMethod: RequestMethod.POST,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise
    },

    sendRequest: (payload: {
        dateRange: {
            from: string,
            to: string
        },
        dataEraseAt: string,
        hiTypes:string[]
    }) => {
        return HitApi.hitapi({
            url: ApiEndpointsEnum.SEND_CONSENT_REQUEST,
            payload,
            requestMethod: RequestMethod.POST,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise
    },
    getFhirBundle: (hipId:string) => {
        return HitApi.hitapi({
            url: ApiEndpointsEnum.FETCH_FHIR_BUNDLE.replace('{hipId}',hipId),
            requestMethod: RequestMethod.GET,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise
    },
}

export default linkMedicalRecords
