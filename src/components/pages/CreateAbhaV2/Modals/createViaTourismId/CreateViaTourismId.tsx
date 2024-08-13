import { useState } from 'react'
import './createViaTourismId.styles.scss'
import CardBackdrop from '../../../../shared/CardBackdrop/CardBackdrop'

import TourismIdForm, {
    TourismIdFormDataType,
} from './tourismIdForm/TourismIdForm'
import CreateByTourismIdFormTwo, {
    CreateByTourismIdFormTwoDataType,
} from './createByTourismIdFormTwo/CreateByTourismIdFormTwo'
import {
    GenerateAbhaByDemograpicSuccessResponseType,
    GetUserInfoByIDTP_ApiResponseType,
} from '../../../../../interface/ApiResponseTypes'
import { useAppDispatch } from '../../../../../utils/hooks/useAppDispatch'
import {
    loadYatriAllData,
    setAbhaCardDetails,
} from '../../../../../services/store/slices/yatriSlice'
import { useNavigate } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../enums/routingEnums'
import { fetchAbhaCard, fetchAbhaCardPdf } from '../../../../../services/api'

function CreateViaTourismId({
    shouldUseAbhaFlow = false,
}: {
    shouldUseAbhaFlow?: boolean
}) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [selectedStep, setSelectedStep] = useState<number>(0)
    const [{ responseDataFormOne }, setFormOneResponses] = useState<{
        formOneData: TourismIdFormDataType | null
        responseDataFormOne: GetUserInfoByIDTP_ApiResponseType | null
    }>({
        formOneData: null,
        responseDataFormOne: null,
    })

    const handleFormOneSubmitSuccess = (
        data: TourismIdFormDataType,
        responseBody: GetUserInfoByIDTP_ApiResponseType,
    ) => {
        setFormOneResponses({
            formOneData: data,
            responseDataFormOne: responseBody,
        })
        setSelectedStep(1)
    }

    const handleFormTwoSubmitSuccess = (
        formData?: CreateByTourismIdFormTwoDataType,
        responseData?: GenerateAbhaByDemograpicSuccessResponseType | void,
    ) => {
        dispatch(loadYatriAllData())
        if (shouldUseAbhaFlow && responseData && formData) {
            fetchAbhaCard({
                aadharNumber: formData.aadhaarNumber,
                abhaToken: responseData.tokens?.token,
                authType: responseData.authType,
            })
                .then()
                .catch()
            fetchAbhaCardPdf({
                aadharNumber: formData.aadhaarNumber,
                abhaToken: responseData.tokens?.token,
                authType: responseData.authType,
            })
                .then()
                .catch()
            dispatch(
                setAbhaCardDetails({
                    abhaCardImage: responseData.preSignedUrl,
                    abhaCardPdfUrl: responseData.preSignedUrl,
                    abhaNumber: responseData.ABHANumber,
                }),
            )
            navigate(`/${coreRoutesEnum.CREATE_ABHA}`, { replace: true })
        } else {
            navigate(-1)
        }
    }

    const onGoBackFormTwo = () => {
        setSelectedStep(0)
        setFormOneResponses({
            formOneData: null,
            responseDataFormOne: null,
        })
    }

    return (
        <CardBackdrop isOpenedByNavigation>
            <div className="create-abha-with-tourism-container">
                {selectedStep === 0 ? (
                    <TourismIdForm
                        shouldUseAbhaFlow={shouldUseAbhaFlow}
                        afterSubmitSuccess={handleFormOneSubmitSuccess}
                    />
                ) : (
                    <CreateByTourismIdFormTwo
                        shouldUseAbhaFlow={shouldUseAbhaFlow}
                        responseDataFormOne={responseDataFormOne}
                        afterSubmitSuccess={handleFormTwoSubmitSuccess}
                        onGoBack={onGoBackFormTwo}
                    />
                )}
            </div>
        </CardBackdrop>
    )
}

export default CreateViaTourismId
