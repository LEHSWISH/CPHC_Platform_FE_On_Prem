import { AxiosPromise } from 'axios'
import HitApi from '../../classes/http/HitApi'
import {
    DeleteMedicalDocumentsPayloadType,
    GetMedicalDownloadPreSignedUrlPayloadType,
    GetMedicalUploadPreSignedUrlPayloadType,
} from '../../interface/ApiRequestPayoadTypes'
import { ApiEndpointsEnum } from '../../enums/ApiEndPointsEnum'
import { RequestMethod } from '../../enums/RequestMethods'
import { AuthorizationType } from '../../enums/authorization/AuthorizationType'
import { GetMedicalDownloadPreSignedUrlResponseType, GetMedicalUploadPreSignedUrlResponseType } from '../../interface/ApiResponseTypes'

const uploadMedicalCertificateAPI = {
    getMedicalDownloadPreSignedUrl: (
        payload: GetMedicalDownloadPreSignedUrlPayloadType,
    ) => {
        return HitApi.hitapi({
            url: ApiEndpointsEnum.GENERATE_YATRI_REPORT_DOWNLOAD_PRESIGNED_URL_POST,
            payload,
            requestMethod: RequestMethod.POST,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise<GetMedicalDownloadPreSignedUrlResponseType>
    },
    getMedicalUploadPreSignedUrl: (
        payload: GetMedicalUploadPreSignedUrlPayloadType,
    ) => {
        return HitApi.hitapi({
            url: ApiEndpointsEnum.GENERATE_YATRI_REPORT_UPLOAD_PRESIGNED_URL_POST,
            payload,
            requestMethod: RequestMethod.POST,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise<GetMedicalUploadPreSignedUrlResponseType>
    },

    deleteMedicalDocuments: (payload: DeleteMedicalDocumentsPayloadType) => {
        return HitApi.hitapi({
            url: ApiEndpointsEnum.DELETE_MEDICAL_DOCUMENT_DELETE,
            payload,
            requestMethod: RequestMethod.POST,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise
    },
    patchFileOnAwsPreSignedUrl: (payload: {
        file: File
        presignedUrl: string
    }) => {
        return HitApi.hitapi({
            url: payload.presignedUrl,
            ignoreBaseUrl: true,
            payload: payload.file,
            requestMethod: RequestMethod.PUT,
            config: {
                authorization: AuthorizationType.NOT_AUTHORIZED,
                customHeaders: {
                    'Content-Type': 'application/octet-stream',
                },
            },
        }) as AxiosPromise<GetMedicalUploadPreSignedUrlResponseType>
    },
}

export default uploadMedicalCertificateAPI
