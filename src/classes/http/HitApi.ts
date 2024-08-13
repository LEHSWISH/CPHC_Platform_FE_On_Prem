/**
 * HitApi Class
 * 
 * This class provides a method to make API requests with customized configurations.
 * It processes the API URL based on certain conditions, generates the necessary 
 * request configuration, and handles the response and error callbacks.
 * 
 * For example on how to use you can check the index.ts file in src/services/api/index.ts file
 */


import axios, { isAxiosError } from 'axios'
import { t } from 'i18next'
import { environment } from '../../environments/environment'
import { IHitApi } from '../../interface/IHitApi'
import { AuthorizationType } from '../../enums/authorization/AuthorizationType'
import { RequestMethod } from '../../enums/RequestMethods'
import { store } from '../../services/store/store'
import { logoutYatri } from '../../services/store/slices/authSlice'
import { setSnackBar } from '../../services/store/slices/generalSlice'
import { BASIC_AUTH_TOKEN } from '../../utils/constants/constants'

export default class HitApi {
    static hitapi(apiParams: IHitApi) {
        let url: string = apiParams.url
        if (!apiParams.ignoreBaseUrl) {
            if (url.includes('user-service')) {
                url = environment.baseUrlUserService + url.replace('user-service', '').replace('/api', 'api')
            }
            else if (url.includes('abha-service')) {
                url = environment.baseUrlAbhaService + url.replace('abha-service', '').replace('/api', 'api')
            }
            else if (url.includes('health-service')) {
                url = environment.baseUrlHealthService + url.replace('health-service', '').replace('/api', 'api')
            }
            else if (url.includes('notification-service')) {
                url = environment.baseUrlNotificationService + url.replace('notification-service', '').replace('/api', 'api')
            }


        }
        const axiosConfig: object = generateConfig(apiParams)
        try {
            const response = axios({
                url: url,
                method: apiParams.requestMethod,
                data: apiParams.payload ? apiParams.payload : {},
                ...axiosConfig,
            })
                .then(apiResponse => {
                    if (typeof apiParams?.sucessFunction === 'function') {
                        apiParams?.sucessFunction(apiResponse)
                    }
                    return apiResponse
                })
                .catch(error => {
                    if (
                        isAxiosError(error) &&
                        `${error.response?.data?.message}`?.toLowerCase() ===
                        'JWT was expired or incorrect'?.toLowerCase()
                    ) {
                        store.dispatch(logoutYatri())
                        setTimeout(() => {
                            store.dispatch(
                                setSnackBar({
                                    message: t(
                                        'common_error_messages.token-expired',
                                    ),
                                    severity: 'warning',
                                    open: true,
                                }),
                            )
                        }, 0)
                    }
                    if (typeof apiParams?.errorFunction === 'function') {
                        apiParams.errorFunction(error.response)
                    } else {
                        return Promise.reject(error)
                    }
                })
            if (typeof apiParams?.endFunction === 'function') {
                response.finally(() => {
                    apiParams.endFunction && apiParams.endFunction()
                })
            }
            return response
        } catch (error: unknown) {
            console.error(error)
            return error
        }

        function generateConfig(apiArgs: IHitApi) {
            const headers: { [name: string]: string } = {}

            if (
                apiArgs?.config?.authorization ===
                AuthorizationType.BEARER_TOKEN
            ) {
                const token = store.getState().auth.yatri.token
                const sessionId = store.getState().auth.yatri.sessionId
                headers['Authorization'] = `Bearer ${token}`
                headers['x-session-id'] = `${sessionId}`
            } else if (apiArgs?.config?.authorization !== AuthorizationType.NO_AUTH && (url.includes(environment.baseUrlAbhaService) || url.includes(environment.baseUrlUserService) || url.includes(environment.baseUrlHealthService) || url.includes(environment.baseUrlNotificationService))) {
                headers['Authorization'] = `Basic ${BASIC_AUTH_TOKEN}`
            }

            if (url.includes(environment.baseUrlAbhaService) || url.includes(environment.baseUrlUserService) || url.includes(environment.baseUrlHealthService) || url.includes(environment.baseUrlNotificationService)) {
                headers['X-Organization-Id'] = `wish`
            }

            if (
                (apiArgs?.requestMethod === RequestMethod.GET ||
                    apiArgs?.requestMethod === RequestMethod.DELETE) &&
                apiArgs?.payload
            ) {
                headers['Content-Type'] = `application/json`
            }

            const config = {
                headers: {
                    ...headers,
                    ...(apiArgs?.config?.customHeaders
                        ? apiArgs?.config?.customHeaders
                        : {}),
                },
                body: apiArgs.payload,
            }

            return config
        }
    }
}
