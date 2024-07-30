import React, { useState } from 'react'
import './AadhaarIdForm.styles.scss'
import { useFormik } from 'formik'
import {
    Checkbox,
    CircularProgress,
    FormHelperText,
    IconButton,
    InputAdornment,
    TextField,
} from '@mui/material'
import CardBackdrop from '../../../../../shared/CardBackdrop/CardBackdrop'
import TermsAndConditions from './TermsAndConditions'
import { AbhaCreationGenerateAaadhaarOtpApi } from '../../../../../../services/api'
import { NavLink, useNavigate } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../../enums/routingEnums'
import { isAxiosError } from 'axios'
import { setSnackBar } from '../../../../../../services/store/slices/generalSlice'
import { useDispatch } from 'react-redux'
import BackButtonWithTitle from '../../../../../shared/BackButtonWithTitle'

import { convertAadharCardNumber } from '../../../../../../utils/HelperFunctions'
import { Visibility, VisibilityOff } from '@mui/icons-material'
function AadhaarIdForm({
    formData,
    setUpdatedFormData,
    updateTxnId,
    updateOtpResendData,
    getEncryptedAadhar
}: AadhaarIdFormPropType) {
    const [aadhaarNumberFocused, setAadhaarNumberFocused] = useState<string>('')
    const [termsModalOpen, setTermsModalOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isAadharNumberHidden, setIsAadharNumberHidden] =
    useState<boolean>(true)
    const toggleAadharNumber = () => setIsAadharNumberHidden(!isAadharNumberHidden)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: formData,
        onSubmit: values => {
            if (
                isLoading ||
                values.aadhaarNumber === '' ||
                values.aadhaarNumber.length !== 12
            ) {
                return
            }

            const encryptedAadharNumber = convertAadharCardNumber(
                values.aadhaarNumber,
            ).toString()
            getEncryptedAadhar(encryptedAadharNumber)
            setIsLoading(true)
            AbhaCreationGenerateAaadhaarOtpApi({
                aadhaar: encryptedAadharNumber,
                consent: values.termsAccepted,
            })
                .then(res => {
                    updateTxnId(res.data.txnId)
                    setUpdatedFormData({
                        aadhaarNumber: values.aadhaarNumber,
                        termsAccepted: values.termsAccepted,
                    })
                    updateOtpResendData({
                        aadhaar: values.aadhaarNumber,
                        message: res?.data.message,
                    })
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

    const handleAadhaarChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = event.target
        if (name === 'aadhaarNumber') {
            // Allow only digits
            const onlyNumbers = value.replace(/[^0-9]/g, '')
            // If first digit not from 2-9, give empty string, else allow up to 12 digits
            const validNumber =
                onlyNumbers.length === 0 || /^[2-9]/.test(onlyNumbers)
                    ? onlyNumbers.slice(0, 12)
                    : ''
            formik.setFieldValue(name, validNumber)
        } else {
            formik.handleChange(event)
        }
    }

    const handleAadhaarNumberBlur = (
        event: React.FocusEvent<HTMLInputElement>,
    ) => {
        const aadhaarNumber = event.target.value
        if (aadhaarNumber === '') {
            setAadhaarNumberFocused('Please enter Aadhaar Number')
        } else if (aadhaarNumber.length !== 12) {
            setAadhaarNumberFocused('Please enter a valid Aadhaar Number')
        } else {
            setAadhaarNumberFocused('')
        }
    }

    const handleTermsModal = () => {
        setTermsModalOpen(true)
    }

    const handleAcceptTerms = () => {
        formik.setFieldValue('termsAccepted', true)
        setTermsModalOpen(false)
    }

    return (
        <>
            <div className="aadhaar-id-form-container">
                <div className="step-count-div">
                    <div className="back-button-mobile-div">
                        <BackButtonWithTitle
                            backButtonChildElement={
                                <span className="backbutton">Back</span>
                            }
                            onBack={() => {
                                navigate(`${coreRoutesEnum.CREATE_ABHA}`)
                            }}
                        />
                    </div>
                    <div className="step-text-div">Step 1 of 3</div>
                </div>
                <div className="aadhaar-head">Enter Aadhaar Number</div>
                <div className="aadhaar-body">
                    <div className="aadhaar-description">
                        Aadhaar verification allows you to start using your ABHA
                        instantly
                    </div>
                    <form onSubmit={formik.handleSubmit} autoComplete="off">
                        <TextField
                            type={!isAadharNumberHidden ? 'text' : 'password'} 
                            className="aadhaar-number"
                            label="Aadhaar Number"
                            id="aadhaarNumber"
                            name="aadhaarNumber"
                            placeholder="Enter your Aadhaar number"
                            onChange={handleAadhaarChange}
                            onBlur={handleAadhaarNumberBlur}
                            value={formik.values.aadhaarNumber}
                            helperText={aadhaarNumberFocused}
                            error={!!aadhaarNumberFocused}
                            variant="standard"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={toggleAadharNumber}
                                        >
                                            {isAadharNumberHidden ? (
                                                <VisibilityOff fontSize="small"  />
                                            ) : (
                                                <Visibility fontSize="small"  />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ maxWidth: '50%' }}
                        />
                        <div className="terms-policy">
                            <Checkbox
                                required
                                name="termsAccepted"
                                className="terms-checkbox"
                                checked={formik.values.termsAccepted as boolean}
                                onChange={formik.handleChange}
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
                        {formik.errors.termsAccepted ? (
                            <FormHelperText
                                children="Please agree to policies to proceed."
                                error={true}
                            ></FormHelperText>
                        ) : (
                            <></>
                        )}
                        <button className="get-otp-button" type="submit">
                            Get OTP &nbsp;
                            {isLoading && (
                                <CircularProgress
                                    color="inherit"
                                    variant="indeterminate"
                                    size={'1em'}
                                />
                            )}
                        </button>
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

interface AadhaarIdFormPropType {
    formData: AadhaarIdFormDataType
    updateTxnId: (value: string) => void
    updateOtpResendData: (data: OtpResendData) => void
    setUpdatedFormData: (data: AadhaarIdFormDataType) => void
    getEncryptedAadhar:(value:string)=>void
}

export interface AadhaarIdFormDataType {
    aadhaarNumber: string
    termsAccepted: boolean
}

interface OtpResendData {
    aadhaar: string
    message: string
}

export default AadhaarIdForm
