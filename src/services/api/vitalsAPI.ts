import { AxiosPromise } from 'axios'
import HitApi from '../../classes/http/HitApi'
import { ApiEndpointsEnum } from '../../enums/ApiEndPointsEnum'
import { RequestMethod } from '../../enums/RequestMethods'
import { AuthorizationType } from '../../enums/authorization/AuthorizationType'
import { RiskType } from '../../enums/vitals/RiskType'

const vitalsAPI = {
    getVitalsRecords: () => {
        return HitApi.hitapi({
            url: ApiEndpointsEnum.FETCH_USER_VITALS,
            requestMethod: RequestMethod.GET,
            ignoreBaseUrl: false,
            config: {
                authorization: AuthorizationType.BEARER_TOKEN,
            },
        }) as AxiosPromise<VitalResponseType>
    },
}

export default vitalsAPI

type VitalResponseType = {
        systolicBp: string
        diastolicBp: string
        meanBp: string
        heartRate: string
        spo2: string
        temperature: string
        temperatureUnits: string
        temperatureSource: string
        ecg: string
        height: string
        heightUnits: string
        weight: string
        weightUnits: string
        bloodSugar: string
        location: string
        bmi: string
        status: RiskType
        fullName: string
        consultationId: string
        bloodPressureFullValu: string
}
