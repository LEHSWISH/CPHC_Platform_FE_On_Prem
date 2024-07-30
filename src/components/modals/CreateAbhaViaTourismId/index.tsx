import { useState } from 'react'
import './CreateAbhaViaTourismId.styles.scss'
import { useAppDispatch } from '../../../utils/hooks/useAppDispatch'
import { useNavigate } from 'react-router-dom'
import { GenerateAbhaByDemograpicSuccessResponseType, GetUserInfoByIDTP_ApiResponseType } from '../../../interface/ApiResponseTypes'
import { loadYatriAllData, setAbhaCardDetails } from '../../../services/store/slices/yatriSlice'
import { fetchAbhaCard, fetchAbhaCardPdf } from '../../../services/api'
import { coreRoutesEnum } from '../../../enums/routingEnums'
import CardBackdrop from '../../shared/CardBackdrop/CardBackdrop'
import AbhaViaTourismIdForm, { AbhaViaTourismIdFormDataType } from './AbhaViaTourismIdForm/AbhaViaTourismIdForm'
import AbhaViaTourismDetailsForm, { AbhaViaTourismDetailsFormDataType } from './AbhaViaTourismDetailsForm/AbhaViaTourismDetailsForm'

function CreateAbhaViaTourismId () {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [selectedStep, setSelectedStep] = useState<number>(0)
    const [{ responseDataFormOne }, setFormOneResponses] = useState<{
        formOneData: AbhaViaTourismIdFormDataType | null
        responseDataFormOne: GetUserInfoByIDTP_ApiResponseType | null
    }>({
        formOneData: null,
        responseDataFormOne: null,
    })

    const handleFormOneSubmitSuccess = (
        data: AbhaViaTourismIdFormDataType,
        responseBody: GetUserInfoByIDTP_ApiResponseType,
    ) => {
        setFormOneResponses({
            formOneData: data,
            responseDataFormOne: responseBody,
        })
        setSelectedStep(1)
    }

    const handleFormTwoSubmitSuccess = (
        formData?: AbhaViaTourismDetailsFormDataType,
        responseData?: GenerateAbhaByDemograpicSuccessResponseType | void,
    ) => {
        dispatch(loadYatriAllData())
        if (responseData && formData) {
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
            <div className="create-abha-via-tourism-container">
                {selectedStep === 0 ? (
                    <AbhaViaTourismIdForm
                        afterSubmitSuccess={handleFormOneSubmitSuccess}
                    />
                ) : (
                    <AbhaViaTourismDetailsForm
                        responseDataFormOne={responseDataFormOne}
                        afterSubmitSuccess={handleFormTwoSubmitSuccess}
                        onGoBack={onGoBackFormTwo}
                    />
                )}
            </div>
        </CardBackdrop>
    )
}

export default CreateAbhaViaTourismId