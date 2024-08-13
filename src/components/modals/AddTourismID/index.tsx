import { useState } from 'react'
import './AddTourismID.styles.scss'
import {
    GetUserInfoByIDTP_ApiResponseType,
} from '../../../interface/ApiResponseTypes'
import { useNavigate } from 'react-router-dom'
import { loadYatriAllData } from '../../../services/store/slices/yatriSlice'
import { useAppDispatch } from '../../../utils/hooks/useAppDispatch'
import CardBackdrop from '../../shared/CardBackdrop/CardBackdrop'
import TourismIdFormV2, { TourismIdFormV2DataType } from './TourismIdFormV2/TourismIdFormV2'
import TourismIdProfileDetails from './TourismIdProfileDetails/TourismIdProfileDetails'

function AddTourismID() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [selectedStep, setSelectedStep] = useState<number>(0)
    const [{ formOneData, responseDataFormOne }, setFormOneResponses] = useState<{
        formOneData: TourismIdFormV2DataType | null
        responseDataFormOne: GetUserInfoByIDTP_ApiResponseType | null
    }>({
        formOneData: null,
        responseDataFormOne: null,
    })

    const handleFormOneSubmitSuccess = (
        data: TourismIdFormV2DataType,
        responseBody: GetUserInfoByIDTP_ApiResponseType,
    ) => {
        setFormOneResponses({
            formOneData: data,
            responseDataFormOne: responseBody,
        })
        setSelectedStep(1)
    }

    const handleFormTwoSubmitSuccess = () => {
        dispatch(loadYatriAllData())
        navigate(-1)
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
            <div className="add-tourism-id-container">
                {selectedStep === 0 ? (
                    <TourismIdFormV2
                        afterSubmitSuccess={handleFormOneSubmitSuccess}
                    />
                ) : (
                    <TourismIdProfileDetails
                        tourismId={formOneData}
                        responseDataFormOne={responseDataFormOne}
                        afterSubmitSuccess={handleFormTwoSubmitSuccess}
                        onGoBack={onGoBackFormTwo}
                    />
                )}
            </div>
        </CardBackdrop>
    )
}

export default AddTourismID
