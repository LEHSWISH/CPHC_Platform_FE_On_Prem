import { AuthorizationType } from '../enums/authorization/AuthorizationType'

export interface IHitApiConfig {
    authorization: AuthorizationType
    customHeaders?: { [name: string]: string }
    responseType?: 'json' | 'blob'
}
