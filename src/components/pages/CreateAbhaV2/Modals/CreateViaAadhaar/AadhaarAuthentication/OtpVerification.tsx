import { useEffect, useState } from 'react'
import './OtpVerification.styles.scss'
import { CircularProgress, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { NavLink } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../../enums/routingEnums'
import { AbhaCreationGenerateMobileOtpApi, AbhaCreationVerifyMobileOtpApi, fetchAbhaCard, fetchAbhaCardPdf, saveAbhaDetails } from '../../../../../../services/api'
import { setAbhaCardDetails } from '../../../../../../services/store/slices/yatriSlice'
import { useAppDispatch } from '../../../../../../utils/hooks/useAppDispatch'
import CardBackdrop from '../../../../../shared/CardBackdrop/CardBackdrop'
import AbhaExists from './AbhaExists/AbhaExists'
import { isAxiosError } from 'axios'
import { setSnackBar } from '../../../../../../services/store/slices/generalSlice'
import BackButtonWithTitle from '../../../../../shared/BackButtonWithTitle'

function OtpVerification({
    updateSelectedStep,
    txnId,
    phoneNumber,
    openAbhaCard,
    exist,
    aadharNumber,
    backNavigation,
}: OtpVerificationPropType) {
    // const navigate = useNavigate()
    const [timer, setTimer] = useState<number>(59)
    const [started, setStarted] = useState<boolean>(true)
    const [otpFocused, setOtpFocused] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [abhaAccountExists, setAbhaAccountExists] = useState<boolean>(false)
    const [resetButtonDisabled, setResetButtonDisabled] =
        useState<boolean>(true)
    const maskedNumber = phoneNumber.slice(-4)
    const dispatch=useAppDispatch()

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

        // Cleanup function to clear the interval when the component unmounts or when timer is stopped
        return () => {
            clearInterval(intervalId)
            setResetButtonDisabled(false)
        }
    }, [started, timer])

    const formik = useFormik({
        initialValues: {
            otp: '',
        },
        onSubmit: values => {
            if(isLoading || values.otp === '' || values.otp.length !== 6) {
                return
            }

            setIsLoading(true)
            AbhaCreationVerifyMobileOtpApi({ mobile:phoneNumber,otp: values.otp, txnId: txnId })
                .then(res => {
                    if(!exist)
                        updateSelectedStep()
                    else {
                        fetchAbhaCard({
                            abhaToken:res.data.tokens?.token || '',
                            authType:res.data.authType,
                            aadharNumber: aadharNumber
                        }).then(()=>{})
                        .catch(()=>{})
                        fetchAbhaCardPdf({
                            abhaToken:res.data.tokens?.token || '',
                            authType:res.data.authType,
                            aadharNumber: aadharNumber
                        }).then(()=>{})
                        .catch(()=>{})
                        saveAbhaDetails({
                            abhaToken:res.data.tokens?.token || ''
                        }).then(()=>{}).catch(()=>{})

                        dispatch(
                            setAbhaCardDetails({
                                abhaCardImage: res.data.preSignedUrl,
                                abhaCardPdfUrl: res.data.preSignedUrl,
                                abhaNumber: res.data.ABHANumber,
                            }),
                        )
                        setAbhaAccountExists(true)
                        // navigate(`/${coreRoutesEnum.CREATE_ABHA}`)
                    }
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
        },
    })

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
            setIsLoading(true)
            AbhaCreationGenerateMobileOtpApi({
                mobile: phoneNumber,
                txnId: txnId,
            })
                .then(() => {
                    setResetButtonDisabled(true)
                    setTimer(59)
                    setStarted(true)
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
    const handleBackNavigation = ()=>{
        backNavigation(false)
    }

    return (
        <>
            <div className="otp-verification-container">
            <div className='step-count-div'>
                    <div className='back-button-mobile-div'>
                    <BackButtonWithTitle onBack={handleBackNavigation} backButtonChildElement={<span className='backbutton'>Back</span>} />
                    </div>
                    <div className='step-text-div'>
                    Step 2 of 3
                    </div>
                </div>
                <div className="otp-verification-head">OTP Verification</div>
                <div className="otp-verification-body">
                    <div className="otp-verification-description">
                        Great! your aadhaar authentication is done.
                    </div>
                    <form onSubmit={formik.handleSubmit} autoComplete='off'>
                        <div className="otp-field-container">
                            <div className="otp-field-heading">
                                Enter the OTP sent on XXXXXX{maskedNumber}
                            </div>
                            <div className="otp-field">
                                <TextField
                                    type="text"
                                    className='textfield'
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
                                        shrink: true
                                    }}
                                />
                            </div>
                            <div
                                className="resend-div"
                            >
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
                        <button className="get-otp-button" type="submit">
                            Verify & Continue &nbsp;
                            {isLoading && (
                                <CircularProgress
                                    color="inherit"
                                    variant="indeterminate"
                                    size={'1em'}
                                />
                            )}
                        </button>
                        {abhaAccountExists && openAbhaCard && (
                            <CardBackdrop
                                showClose={true}
                                setClose={() => setAbhaAccountExists(false)}
                            >
                                <AbhaExists openAbhaCard={openAbhaCard} />
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
        </>
    )
}

interface OtpVerificationPropType {
    backNavigation: (value: boolean) => void
    updateSelectedStep: () => void
    txnId: string,
    phoneNumber: string
    openAbhaCard?: ()=>void
    exist:boolean
    aadharNumber?: string
}

export default OtpVerification
