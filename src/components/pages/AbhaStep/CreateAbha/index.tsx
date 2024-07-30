import { useState } from 'react'
import { FormikHelpers } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import CreateAbhaForm, { CreateAbhaFormValueType } from './CreateAbhaForm'
import './createAbha.style.scss'
import AbhaOtpForm, { CreateAbhaOtpFormValueType } from './AbhaOtpForm'
import {
    AbhaCreationGenerateAaadhaarOtpApi,
    AbhaCreationGenerateMobileOtpApi,
    AbhaCreationVerifyAaadhaarOtpApi,
    AbhaCreationVerifyMobileOtpApi,
} from '../../../../services/api'
import axios, { AxiosResponse } from 'axios'
import {
    AbhaCreationGenerateAadharOtpErrorResponseType,
    AbhaCreationGenerateAadharOtpResponseType,
} from '../../../../interface/ApiResponseTypes'
import { setSnackBar } from '../../../../services/store/slices/generalSlice'
import { loadYatriAllData } from '../../../../services/store/slices/yatriSlice'
import { useAppDispatch } from '../../../../utils/hooks/useAppDispatch'
import { coreRoutesEnum } from '../../../../enums/routingEnums'

interface CreateAbhaPropType {
    setSelectedStep?: (step: number) => void
}

const CreateAbha = ({ setSelectedStep }: CreateAbhaPropType) => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [isOtpAaadharForm, setIsOtpAaadharForm] = useState(false)
    const [isOtpMobileForm, setIsOtpMobileForm] = useState(false)
    const [txnId, setTxnId] = useState<null | string>(null)
    const [, setAbhaNumber] = useState('')
    const [userInputData, setUserInputData] = useState({
        aadharNumber: '',
        phoneNumber: '',
    })
    const navigate = useNavigate()

    const onSubmitForm = (
        values: CreateAbhaFormValueType,
        actions: FormikHelpers<CreateAbhaFormValueType>,
    ) => {
        if (isLoading) {
            return
        }
        setUserInputData(values)
        handleOnSubmitForm(actions)
    }

    const handleOnSubmitForm = (
        actions?: FormikHelpers<CreateAbhaFormValueType>,
    ) => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        AbhaCreationGenerateAaadhaarOtpApi(userInputData.aadharNumber)
            .then((r: AbhaCreationGenerateAadharOtpResponseType | unknown) => {
                const response =
                    r as AxiosResponse<AbhaCreationGenerateAadharOtpResponseType>
                dispatch(
                    setSnackBar({
                        open: true,
                        message: response?.data?.message,
                        severity: 'success',
                    }),
                )
                setTxnId(response?.data?.txnId)
                setIsOtpAaadharForm(true)
            })
            .catch(e => {
                if (axios.isAxiosError(e)) {
                    const response = e?.response
                        ?.data as AbhaCreationGenerateAadharOtpErrorResponseType

                    const message =
                        response?.code === 'USR010'
                            ? t('common_error_messages.invalid-aadhar')
                            : response.message
                    if (isOtpAaadharForm) {
                        dispatch(
                            setSnackBar({
                                open: true,
                                message,
                                severity: 'error',
                            }),
                        )
                    } else {
                        actions?.setFieldError('aadharNumber', message)
                    }
                } else {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: t(
                                'common_error_messages.something_went_wrong',
                            ),
                            severity: 'error',
                        }),
                    )
                }
            })
            .finally(() => setIsLoading(false))
    }

    const handleOnSubmitAadharOtp = (
        value: CreateAbhaOtpFormValueType,
        actions: FormikHelpers<CreateAbhaOtpFormValueType>,
    ) => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        AbhaCreationVerifyAaadhaarOtpApi({
            mobile: userInputData.phoneNumber,
            otp: value.otp,
            txnId: `${txnId}`,
        })
            .then(r => {
                setAbhaNumber(r?.data?.ABHANumber as string)
                generateMobileOtp(true)
            })
            .catch(e => {
                if (axios.isAxiosError(e)) {
                    actions.setFieldError(
                        'otp',
                        t('common_error_messages.otp-invalid'),
                    )
                } else {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: t(
                                'common_error_messages.something_went_wrong',
                            ),
                            severity: 'error',
                        }),
                    )
                }
            })
            .finally(() => setIsLoading(false))
    }

    const generateMobileOtp = (doNotCheckLoading = false) => {
        if (isLoading && !doNotCheckLoading) {
            return
        }
        return AbhaCreationGenerateMobileOtpApi({
            mobile: userInputData.phoneNumber,
            txnId: `${txnId}`,
        })
            .then(r => {
                setIsOtpAaadharForm(false)
                setIsOtpMobileForm(true)
                dispatch(
                    setSnackBar({
                        open: true,
                        message: r?.data?.message,
                        severity: 'success',
                    }),
                )
            })
            .catch(() => {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: t(
                            'common_error_messages.something_went_wrong',
                        ),
                        severity: 'error',
                    }),
                )
            })
    }

    const handleOnSubmitMobileOtp = (
        value: CreateAbhaOtpFormValueType,
        actions: FormikHelpers<CreateAbhaOtpFormValueType>,
    ) => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        AbhaCreationVerifyMobileOtpApi({
            otp: value.otp, txnId: `${txnId}`,
            mobile: ''
        })
            .then(() => {
                navigate(`/${coreRoutesEnum.YATRA_DETAIL}`)
                dispatch(loadYatriAllData())
                dispatch(
                    setSnackBar({
                        open: true,
                        message: t(
                            'pilgrim.onboarding.create_abha_page.abha_create_link_success',
                        ),
                        severity: 'success',
                    }),
                )
            })
            .catch(e => {
                if (axios.isAxiosError(e)) {
                    actions.setFieldError(
                        'otp',
                        t('common_error_messages.otp-invalid'),
                    )
                } else {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: t(
                                'common_error_messages.something_went_wrong',
                            ),
                            severity: 'error',
                        }),
                    )
                }
            })
            .finally(() => setIsLoading(false))
    }

    const handleChangeNumber = () => {
        setIsOtpAaadharForm(false)
        setIsOtpMobileForm(false)
        setUserInputData({ aadharNumber: '', phoneNumber: '' })
    }

    return (
        <div className="create-abha-container">
            <h2 className="view-title">
                {t('pilgrim.onboarding.create_abha_page.title')}
            </h2>
            {isOtpAaadharForm || isOtpMobileForm ? (
                <AbhaOtpForm
                    onResend={
                        isOtpAaadharForm
                            ? handleOnSubmitForm
                            : generateMobileOtp
                    }
                    onSubmit={
                        isOtpAaadharForm
                            ? handleOnSubmitAadharOtp
                            : handleOnSubmitMobileOtp
                    }
                    phoneNumber={userInputData.phoneNumber}
                    aadharNumber={userInputData.aadharNumber}
                    isOtpAaadharForm={isOtpAaadharForm}
                    changeNumber={handleChangeNumber}
                    otpFieldDescriptionText={
                        isOtpAaadharForm
                            ? t(
                                  'pilgrim.onboarding.create_abha_page.otp_description_aadhar',
                              )
                            : t(
                                  'pilgrim.onboarding.create_abha_page.otp_description_phone',
                                  {
                                      number: `${userInputData.phoneNumber}`.slice(
                                          -4,
                                      ),
                                  },
                              )
                    }
                    setSelectedStep={setSelectedStep}
                />
            ) : (
                <CreateAbhaForm
                    onSubmit={onSubmitForm}
                    setSelectedStep={setSelectedStep}
                />
            )}
        </div>
    )
}

export default CreateAbha
