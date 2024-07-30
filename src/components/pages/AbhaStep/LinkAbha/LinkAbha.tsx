import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormHelperText, TextField } from '@mui/material'
import { FormikHelpers, useFormik } from 'formik'
import './LinkAbha.scss'
import { coreRoutesEnum } from '../../../../enums/routingEnums'
import { linkAbhaFormSchema } from '../../../../utils/constants/validations'
import { useTranslation } from 'react-i18next'
import {
    AbhaVerificationGenerateMobileOtpApi,
    AbhaVerificationVerifyMobileOtpApi,
} from '../../../../services/api'
import {
    AbhaVerificationGenerateMobileOtpErrorResponseType,
    AbhaVerificationGenerateMobileOtpResponseType,
} from '../../../../interface/ApiResponseTypes'
import { useDispatch } from 'react-redux'
import { setSnackBar } from '../../../../services/store/slices/generalSlice'
import axios, { AxiosResponse } from 'axios'
import AbhaLinkOtpForm, { AbhaLinkOtpFormValueType } from './AbhaLinkOtpForm'
import { loadYatriAllData } from '../../../../services/store/slices/yatriSlice'

interface LinkAbhaPropType {
    setSelectedStep: (step: number) => void
}

function LinkAbha({ setSelectedStep }: LinkAbhaPropType) {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [txnId, setTxnId] = useState<null | string>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isOtpForm, setIsOtpForm] = useState<boolean>(false)

    const handleOnSubmitAbha = () => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        AbhaVerificationGenerateMobileOtpApi(
            formik.values.abhaId.replace(
                /(\d{2})(\d{4})(\d{4})(\d{4})/,
                '$1-$2-$3-$4',
            ),
        )
            .then(
                (
                    r: AbhaVerificationGenerateMobileOtpResponseType | unknown,
                ) => {
                    const response =
                        r as AxiosResponse<AbhaVerificationGenerateMobileOtpResponseType>
                    setTxnId(response?.data?.txnId)
                    setIsOtpForm(true)
                },
            )
            .catch(e => {
                if (axios.isAxiosError(e)) {
                    const response = e?.response
                        ?.data as AbhaVerificationGenerateMobileOtpErrorResponseType

                    let message = response?.errorDetails?.details?.[0]
                        ?.message as string
                    message = message?.includes('Invalid credentials. ')
                        ? t('common_error_messages.invalid-abha')
                        : message
                    if (isOtpForm) {
                        dispatch(
                            setSnackBar({
                                open: true,
                                message,
                                severity: 'error',
                            }),
                        )
                    } else {
                        formik.setFieldError('abhaId', message)
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

    const handleOnSubmitOtp = (
        value: AbhaLinkOtpFormValueType,
        actions: FormikHelpers<AbhaLinkOtpFormValueType>,
    ) => {
        setIsLoading(true)
        AbhaVerificationVerifyMobileOtpApi({
            otp: value.otp,
            txnId: `${txnId}`,
        })
            .then(() => {
                navigate(`/${coreRoutesEnum.YATRA_DETAIL}`)
                dispatch(loadYatriAllData())
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

    const formik = useFormik({
        initialValues: {
            abhaId: '',
        },
        validateOnBlur: true,
        validationSchema: linkAbhaFormSchema({ t }),
        onSubmit: handleOnSubmitAbha,
    })

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        formik.setFieldValue(name, value.replace(/[^\d]/g, '').slice(0, 14))
    }

    return (
        <div className="link-abha-container">
            <h2 className="create-abha-heading">
                Link or Create Ayushman Bharat Health Account - ABHA Number
            </h2>
            {isOtpForm ? (
                <AbhaLinkOtpForm
                    abhaNumber={formik.values.abhaId}
                    changeAbha={() => {
                        setIsOtpForm(false)
                        setTxnId(null)
                    }}
                    onResend={handleOnSubmitAbha}
                    onSubmit={handleOnSubmitOtp}
                    skipForLater={() => setSelectedStep(3)}
                />
            ) : (
                <>
                    <p className="abha-description">
                        ABHA number is a 14 digit number that will uniquely
                        identify you as a participant in India’s digital
                        healthcare ecosystem. ABHA number will establish a
                        strong and trustable identity for you that will be
                        accepted by healthcare providers and payers across the
                        country.
                    </p>
                    <form
                        className="create-abha-form"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="form-fields">
                            <TextField
                                type="text"
                                label="ABHA Number"
                                id="abhaId"
                                name="abhaId"
                                placeholder="Enter your ABHA number"
                                onChange={handleNumberChange}
                                value={formik.values.abhaId}
                                error={!!formik.errors.abhaId}
                                variant="standard"
                                margin="normal"
                                required
                                fullWidth
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                            <FormHelperText error={!!formik.errors.abhaId}>
                                {formik.errors.abhaId || ' '}
                            </FormHelperText>
                        </div>
                        <div className="not-abha-div">
                            <span className="not-abha-text">
                                Don’t have ABHA number?
                            </span>
                            <a
                                className="create-abha-button"
                                onClick={() => setSelectedStep(2)}
                            >
                                Create ABHA
                            </a>
                        </div>
                        <button className="link-abha-button" type="submit">
                            Link your ABHA number
                        </button>

                        <div className="signup-route">
                            <a
                                className="link"
                                onClick={() => setSelectedStep(3)}
                            >
                                Skip for Later
                            </a>
                        </div>
                    </form>
                </>
            )}
        </div>
    )
}

export default LinkAbha
