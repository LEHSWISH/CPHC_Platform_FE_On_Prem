import './RecoverAbhaForm.styles.scss'
import arrowLeftSvgIcon from '../../../../../assets/icons/arrow-left.svg'
import {
    Checkbox,
    CircularProgress,
    FormHelperText,
    TextField,
} from '@mui/material'
import CardBackdrop from '../../../../shared/CardBackdrop/CardBackdrop'
import TermsAndConditions from '../CreateViaAadhaar/AadhaarIdForm/TermsAndConditions'
import backNavigate from '../../../../../assets/icons/backNavigate.svg'
import { useState } from 'react'
import { useFormik } from 'formik'
import OtpVerification from './OtpVerification/OtpVerification'
import { useNavigate } from 'react-router-dom'
import { RecoverAbhaGenerateMobileOtpApi } from '../../../../../services/api'
import { isAxiosError } from 'axios'
import { useDispatch } from 'react-redux'
import { setSnackBar } from '../../../../../services/store/slices/generalSlice'

function RecoverAbhaForm() {
    const [notChecked, setNotChecked] = useState<boolean>(false)
    const [phoneNumberFocused, setPhoneNumberFocused] = useState<string>('')
    const [resendOtpData, setResendOtpData] = useState<ResendOtpDataDataType>({
        txnId: '',
        mobile: '',
        message: '',
    })
    const [termsModalOpen, setTermsModalOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [authenticationSuccess, setAuthenticationSuccess] =
        useState<boolean>(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
            phoneNumber: '',
            termsAccepted: false,
        },
        onSubmit: values => {
            if (
                isLoading ||
                values.phoneNumber === '' ||
                values.phoneNumber.length !== 10
            ) {
                return
            }

            if (!values.termsAccepted) {
                setNotChecked(true)
                return
            }

            setIsLoading(true)
            RecoverAbhaGenerateMobileOtpApi({
                mobile: values.phoneNumber,
                consent: values.termsAccepted,
            })
                .then(res => {
                    setResendOtpData({
                        txnId: res?.data.txnId,
                        mobile: values.phoneNumber,
                        message: res?.data.message,
                    })
                    setAuthenticationSuccess(true)
                })
                .catch(err => {
                    let message = 'Something went wrong, Please try again'
                    if (isAxiosError(err) && err.response?.data?.errorDetails) {
                        const errorDetails = JSON.parse(
                            err.response?.data?.errorDetails,
                        )
                        message = errorDetails.error.message
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
                })
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

    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.checked) {
            setNotChecked(false)
        } else {
            setNotChecked(true)
        }
        formik.handleChange(event)
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

    const handleTermsModal = () => {
        setTermsModalOpen(true)
    }

    const handleAcceptTerms = () => {
        formik.setFieldValue('termsAccepted', true)
        setTermsModalOpen(false)
    }

    return !authenticationSuccess ? (
        <div className="recover-form-container">
            <div className="recover-abha-head">
                <img
                    src={arrowLeftSvgIcon}
                    alt="back"
                    onClick={() => navigate(-1)}
                />
                <div className="back-btn" onClick={() => navigate(-1)}>
                    <img src={backNavigate} alt="back" />
                    <div>
                        <span>Back</span>
                    </div>
                </div>
                <span>Recover ABHA Number</span>
            </div>
            <div className="recover-abha-body">
                <div className="recover-abha-description">
                    Enter your phone number which you have provided for
                    communication regarding ABHA
                </div>
                <form onSubmit={formik.handleSubmit} autoComplete="off">
                    <TextField
                        type="text"
                        label="Phone Number"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter your phone number"
                        onChange={handlePhoneNumberChange}
                        onBlur={handlePhoneNumberBlur}
                        value={formik.values.phoneNumber}
                        helperText={phoneNumberFocused}
                        error={!!phoneNumberFocused}
                        variant="standard"
                        required
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <div className="terms-policy">
                        <Checkbox
                            name="termsAccepted"
                            className="terms-checkbox"
                            checked={formik.values.termsAccepted as boolean}
                            onChange={handleCheckboxChange}
                            sx={{
                                '&.Mui-checked': {
                                    color: '#331895',
                                },
                            }}
                        />
                        <p>
                            I agree to the&nbsp;
                            <span onClick={handleTermsModal}>
                                Terms & conditions
                            </span>
                        </p>
                        {termsModalOpen && (
                            <CardBackdrop
                                setClose={() => setTermsModalOpen(false)}
                            >
                                <TermsAndConditions
                                    setTerms={handleAcceptTerms}
                                    backNavigate={() =>
                                        setTermsModalOpen(false)
                                    }
                                    initialConsent={formik.values.termsAccepted}
                                />
                            </CardBackdrop>
                        )}
                    </div>
                    {notChecked ? (
                        <FormHelperText
                            children="Please agree to policies to proceed."
                            error={true}
                        ></FormHelperText>
                    ) : (
                        <></>
                    )}
                    <button className="get-otp-button" type="submit">
                        Continue &nbsp;
                        {isLoading && (
                            <CircularProgress
                                color="inherit"
                                variant="indeterminate"
                                size={'1em'}
                            />
                        )}
                    </button>
                </form>
            </div>
        </div>
    ) : (
        <OtpVerification
            resendData={resendOtpData}
            backNavigate={() => setAuthenticationSuccess(false)}
        />
    )
}

export interface ResendOtpDataDataType {
    txnId: string
    mobile: string
    message: string
}

export default RecoverAbhaForm
