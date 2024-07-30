import { RequestMethod } from '../enums/RequestMethods'
import { IHitApiConfig } from './IHitApiConfig'

export interface IHitApi {
    baseUrl?: string
    requestId?: string
    url: string
    ignoreBaseUrl?: boolean
    requestMethod: RequestMethod
    config?: IHitApiConfig
    payload?: unknown
    sucessFunction?: (response: any) => void
    errorFunction?: (error: Error) => void
    endFunction?: () => void
}
