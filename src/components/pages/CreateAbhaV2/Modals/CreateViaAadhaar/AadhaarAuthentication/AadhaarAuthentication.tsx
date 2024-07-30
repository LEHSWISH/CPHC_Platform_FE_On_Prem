import { useEffect, useState } from 'react'
import './AadhaarAuthentication.styles.scss'
import arrowLeftSvgIcon from '../../../../../../assets/icons/arrow-left.svg'
import { CircularProgress, InputAdornment, TextField } from '@mui/material'
import { useFormik } from 'formik'
import CardBackdrop from '../../../../../shared/CardBackdrop/CardBackdrop'
import OtpVerification from './OtpVerification'
import AbhaExists from './AbhaExists/AbhaExists'
import PhoneNumberMatched from './PhoneNumberMatched/PhoneNumberMatched'
import {
    AbhaCreationGenerateAaadhaarOtpApi,
    AbhaCreationGenerateMobileOtpApi,
    AbhaCreationVerifyAaadhaarOtpApi,
    fetchAbhaCard,
    fetchAbhaCardPdf,
    saveAbhaDetails,
} from '../../../../../../services/api'
import { NavLink } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../../enums/routingEnums'
import { useAppDispatch } from '../../../../../../utils/hooks/useAppDispatch'
import { setAbhaCardDetails } from '../../../../../../services/store/slices/yatriSlice'
import { isAxiosError } from 'axios'
import { setSnackBar } from '../../../../../../services/store/slices/generalSlice'
import { UpdateOtpResendDataDataType } from '../CreateViaAadhaar'
import BackButtonWithTitle from '../../../../../shared/BackButtonWithTitle'

function AadhaarAuthentication({
    backNavigation,
    setSelectedStep,
    txnId,
    openAbhaCard,
    otpResendData,
    setTransfertxnId,
    responseData,
    aadharEncryptedValue
}: AadhaarAuthenticationPropType) {
    const [phoneNumberFocused, setPhoneNumberFocused] = useState<string>('')
    const [otpFocused, setOtpFocused] = useState<string>('')
    const [abhaAccountExists, setAbhaAccountExists] = useState<boolean>(false)
    const [phoneNumberMatched, setPhoneNumberMatched] = useState<boolean>(false)
    const [authenticationSuccess, setAuthenticationSuccess] =
        useState<boolean>(false)
    const [transactionId, setTransactionId] = useState<string>(txnId)
    const [timer, setTimer] = useState<number>(59)
    const [started, setStarted] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [resetButtonDisabled, setResetButtonDisabled] =
        useState<boolean>(true)
    const maskedNumberMessage = otpResendData?.message
    const handleBackNavigation = () => {
        backNavigation(0)
    }
    const dispatch = useAppDispatch()

    useEffect(() => {
        let intervalId: any

        if (started) {
            setResetButtonDisabled(true)
            intervalId = setInterval(() => {
                setTimer(() => {
                    if (timer <= 0) {
                        setResetButtonDisabled(false)
                        clearInterval(intervalId)
                    }
                    return timer > 0 ? timer - 1 : 0
                })
            }, 1000)
        }

        setTransfertxnId(transactionId)
        // Cleanup function to clear the interval when the component unmounts or when timer is stopped
        return () => {
            clearInterval(intervalId)
            setResetButtonDisabled(false)
        }
    }, [started, timer])

    const errorCatch = (err: unknown) => {
        let message = 'Something went wrong, Please try again'
        if (isAxiosError(err) && err.response?.data?.errorDetails) {
            try {
                const errorDetails = JSON.parse(
                    err.response?.data?.errorDetails,
                )
                if (errorDetails.message) {
                    message = errorDetails.message
                }
            } catch (err) { /* empty */ }
        } else if (
            isAxiosError(err) &&
            err.response?.data?.message
        ) {
            message = err.response?.data?.message
        }
        dispatch(
            setSnackBar({
                open: true,
                message,
                severity: 'error',
            }),
        )
    }

    const formik = useFormik({
        initialValues: {
            otp: '',
            phoneNumber: '',
        },
        onSubmit: async values => {
            if (isLoading || values.otp === '' || values.otp.length !== 6) {
                return
            }

            if (values.phoneNumber === '' || values.phoneNumber.length !== 10) {
                return
            }

            setIsLoading(true)
            await AbhaCreationVerifyAaadhaarOtpApi({
                otp: values.otp,
                txnId: transactionId,
                mobile: values.phoneNumber,
            })
                .then(async res => {
                    /**
                        MN : true, isnew: true (createAddress) - check
                        MN: true, isNew : false (card) - caution
                        MN: false, isNew: true (mobileOtp, CreateAddress) 
                        MN: false, iseNew: false (mobileOtp, card) -caution
                    */
                    const sendResponse = { ...res }

                    saveAbhaDetails({
                        abhaToken:res.data.tokens?.token || ''
                    }).then(()=>{}).catch(()=>{})

                    if (res.data.mobileNumberMatched && !res.data.new) {
                        setAbhaAccountExists(true)
                        dispatch(
                            setAbhaCardDetails({
                                abhaCardImage: res.data.preSignedUrl,
                                abhaCardPdfUrl: res.data.preSignedUrl,
                                abhaNumber: res.data.ABHANumber,
                            }),
                        )
                        fetchAbhaCard({
                            abhaToken: res.data.tokens?.token || '',
                            authType: res.data.authType,
                            aadharNumber: otpResendData.aadhaar,
                        })
                            .then(() => {})
                            .catch(() => {})

                        fetchAbhaCardPdf({
                            abhaToken: res.data.tokens?.token || '',
                            authType: res.data.authType,
                            aadharNumber: otpResendData.aadhaar,
                        })
                            .then(() => {})
                            .catch(() => {})
                    } else if (!res.data.mobileNumberMatched && !res.data.new) {
                        await AbhaCreationGenerateMobileOtpApi({
                            mobile: formik.values.phoneNumber,
                            txnId: transactionId,
                        })
                            .then(() => {
                                setAbhaAccountExists(true)
                                setAuthenticationSuccess(true)
                            })
                            .catch(errorCatch)
                    } else if (res.data.mobileNumberMatched && res.data.new) {
                        // setAuthenticationSuccess(false)
                        setSelectedStep()
                        responseData({
                            ...sendResponse,
                            aadharNumber: otpResendData.aadhaar,
                        })
                    } else if (!res.data.mobileNumberMatched && res.data.new) {
                        //full flow
                        responseData({
                            ...sendResponse,
                            aadharNumber: otpResendData.aadhaar,
                        })
                        await AbhaCreationGenerateMobileOtpApi({
                            mobile: formik.values.phoneNumber,
                            txnId: transactionId,
                        })
                            .then(() => {
                                setAbhaAccountExists(false)
                                setAuthenticationSuccess(true)
                            })
                            .catch(errorCatch)
                    }
                })
                .catch(errorCatch)
                .finally(() => setIsLoading(false))
        },
    })

    const handlePhoneNumberChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = event.target
        if (name === 'phoneNumber') {
            // Allow only digits
            const onlyNumbers = value.replace(/[^0-9]/g, '')
            // If first digit not from 6-9, give empty string, else allow up to 12 digits
            const validNumber =
                onlyNumbers.length === 0 || /^[6-9]/.test(onlyNumbers)
                    ? onlyNumbers.slice(0, 10)
                    : ''
            formik.setFieldValue(name, validNumber)
        } else {
            formik.handleChange(event)
        }
    }

    const handlePhoneNumberBlur = (
        event: React.FocusEvent<HTMLInputElement>,
    ) => {
        const phoneNumber = event.target.value
        if (phoneNumber === '') {
            setPhoneNumberFocused('Please enter your phone number')
        } else if (phoneNumber.length !== 10) {
            setPhoneNumberFocused('Please enter a valid phone number')
        } else {
            setPhoneNumberFocused('')
        }
    }

    const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        if (name === 'otp') {
            // Allow only digits
            const onlyNumbers = value.replace(/[^0-9]/g, '').slice(0, 6)
            formik.setFieldValue(name, onlyNumbers)
        } else {
            formik.handleChange(event)
        }
    }

    const handleOtpBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const otp = event.target.value
        if (otp === '') {
            setOtpFocused('Please enter OTP to continue')
        } else if (otp.length !== 6) {
            setOtpFocused('Please enter a valid OTP')
        } else {
            setOtpFocused('')
        }
    }

    const startTimer = () => {
        if (!resetButtonDisabled) {
            setResetButtonDisabled(true)
            setTimer(59)
            setStarted(true)
            AbhaCreationGenerateAaadhaarOtpApi({
                aadhaar: aadharEncryptedValue,
                consent: true,
            })
                .then(res => {
                    setTransactionId(res.data.txnId)
                })
                .catch(err => {
                    let message = 'Something went wrong, Please try again'
                    if (isAxiosError(err) && err.response?.data?.message) {
                        message = err.response?.data?.message
                    }
                    dispatch(
                        setSnackBar({
                            open: true,
                            message,
                            severity: 'error',
                        }),
                    )
                })
                .finally(() => setIsLoading(false))
        }
    }

    const handleUpdateStep = () => {
        setSelectedStep()
    }

    const formatTimer = () => {
        const minutes = Math.floor(timer / 60)
        const remainingSeconds = timer % 60
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
        const formattedSeconds =
            remainingSeconds < 10
                ? `0${remainingSeconds}`
                : `${remainingSeconds}`
        return `${formattedMinutes}:${formattedSeconds}`
    }

    return !authenticationSuccess ? (
        <div className="aadhaar-authentication-container">
            <div className="aadhar-authentication-header">
                <div className="step-count-div">
                    <div className="back-button-mobile-div">
                        <BackButtonWithTitle
                            onBack={handleBackNavigation}
                            backButtonChildElement={
                                <span className="backbutton">Back</span>
                            }
                        />
                    </div>
                    <div className="step-text-div">Step 2 of 3</div>
                </div>
            </div>
            <div className="aadhaar-head">
                <img
                    src={arrowLeftSvgIcon}
                    alt="back"
                    onClick={handleBackNavigation}
                />
                <span>Aadhaar Authentication</span>
            </div>
            <div className="aadhaar-body">
                <form onSubmit={formik.handleSubmit} autoComplete="off">
                    <div className="otp-field-container">
                        <div className="otp-field-heading">
                            {maskedNumberMessage}
                        </div>
                        <div className="otp-field">
                            <TextField
                                type="text"
                                className="otp-field-textfield"
                                label="OTP"
                                id="otp"
                                name="otp"
                                placeholder="- - - - - -"
                                onChange={handleOtpChange}
                                onBlur={handleOtpBlur}
                                value={formik.values.otp}
                                helperText={otpFocused}
                                error={!!otpFocused}
                                variant="standard"
                                margin="normal"
                                required
                                fullWidth
                                sx={{ maxWidth: '50%' }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                        <div className="resend-div">
                            <span className="resend-text">
                                Resend OTP in {formatTimer()}
                            </span>
                            <a
                                className={`resend-button ${resetButtonDisabled ? 'disabled' : ''}`}
                                onClick={startTimer}
                            >
                                Resend
                            </a>
                        </div>
                    </div>
                    <div className="abha-communication-container">
                        <div className="abha-communication-heading">
                            Enter your phone number for communication regarding
                            ABHA
                        </div>
                        <TextField
                            type="text"
                            className="phone-textfield"
                            label="Phone Number"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder={'Enter your phone number'}
                            onChange={handlePhoneNumberChange}
                            onBlur={handlePhoneNumberBlur}
                            value={formik.values.phoneNumber}
                            helperText={phoneNumberFocused}
                            error={!!phoneNumberFocused}
                            variant="standard"
                            required
                            fullWidth
                            sx={{ maxWidth: '50%' }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        +91
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <button className="verify-continue-button" type="submit">
                        Verify & Continue &nbsp;
                        {isLoading && (
                            <CircularProgress
                                color="inherit"
                                variant="indeterminate"
                                size={'1em'}
                            />
                        )}
                    </button>
                    {abhaAccountExists && (
                        <CardBackdrop
                            showClose={true}
                            setClose={() => setAbhaAccountExists(false)}
                        >
                            <AbhaExists openAbhaCard={openAbhaCard} />
                        </CardBackdrop>
                    )}
                    {phoneNumberMatched && (
                        <CardBackdrop
                            showClose={true}
                            setClose={() => setPhoneNumberMatched(false)}
                        >
                            <PhoneNumberMatched />
                        </CardBackdrop>
                    )}
                    <div className="existing-abha-number">
                        <span className="abha-text">
                            Already have ABHA?
                        </span>
                        <NavLink
                            to={`/${coreRoutesEnum.LINK_ABHA}`}
                            className="link-abha"
                        >
                            Link ABHA
                        </NavLink>
                    </div>
                </form>
            </div>
        </div>
    ) : (
        <OtpVerification
            txnId={transactionId}
            phoneNumber={formik.values.phoneNumber}
            updateSelectedStep={handleUpdateStep}
            exist={abhaAccountExists}
            openAbhaCard={openAbhaCard}
            aadharNumber={otpResendData.aadhaar}
            backNavigation={setAuthenticationSuccess}
        />
    )
}

interface AadhaarAuthenticationPropType {
    backNavigation: (step: number) => void
    setSelectedStep: () => void
    txnId: string
    openAbhaCard: () => void
    otpResendData: UpdateOtpResendDataDataType
    responseData: (res: any) => void
    setTransfertxnId: (res: string) => void
    aadharEncryptedValue:string
}

export default AadhaarAuthentication
