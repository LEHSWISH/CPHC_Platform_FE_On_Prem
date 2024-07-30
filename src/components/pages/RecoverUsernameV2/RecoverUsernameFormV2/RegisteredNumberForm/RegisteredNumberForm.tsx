import './RegisteredNumberForm.styles.scss'

import UttarakhandGovtLogo from '../../../../../assets/icons/UttarakhandGovtLogo1.svg'
import NhmLogo from '../../../../../assets/icons/NhmLogo1.svg'
import {
    CircularProgress,
    Divider,
    InputAdornment,
    TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import { NavLink } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../enums/routingEnums'
import Footer from '../../../../shared/Footer/Footer'
import { useState } from 'react'
import * as Yup from 'yup'
import OTPVerificationForm from './OTPVerificationForm'

function RegisteredNumberForm(props: RegisteredNumberFormPropsType) {
    const [isLoading] = useState<boolean>(false)
    const [openOTPVerification, setOpenOTPVerification] =
        useState<boolean>(false)

    const validationSchema = Yup.object({
        phoneNumber: Yup.string()
            .required('Please enter your phone number')
            .length(10, 'Phone number length should be 10 digits'),
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

    const formik = useFormik({
        initialValues: {
            phoneNumber: '',
        },
        onSubmit: () => {
            setOpenOTPVerification(true)
        },
        validateOnBlur: true,
        validationSchema,
    })

    return (
        <>
            {!openOTPVerification ? (
                <div className="registered-numberform-container">
                    <div className="page-logo">
                        <img
                            src={UttarakhandGovtLogo}
                            alt="Uttrakhand Simply Heaven!"
                        />
                        <Divider
                            orientation="vertical"
                            variant="middle"
                            flexItem
                        />
                        <img
                            src={NhmLogo}
                            className="nhm-image"
                            alt="Uttrakhand Simply Heaven!"
                        />
                    </div>
                    <form
                        className="recover-form"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="recover-description">
                            <h2>Recover Username</h2>
                            <p>
                                Please enter your phone number. We will then
                                send an OTP to recover your username.
                            </p>
                        </div>
                        <div className="form-fields">
                            <div className="phonenumber-container">
                                <TextField
                                    type="text"
                                    label="Phone Number"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    placeholder={'Enter your phone number'}
                                    onChange={handlePhoneNumberChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.phoneNumber}
                                    helperText={formik.errors.phoneNumber}
                                    error={!!formik.errors.phoneNumber}
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                +91
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </div>
                        <button
                            className="otp-button"
                            type="submit"
                            disabled={isLoading}
                        >
                            Send OTP &nbsp;
                            {isLoading && (
                                <CircularProgress
                                    color="inherit"
                                    variant="indeterminate"
                                    size={'1em'}
                                />
                            )}
                        </button>
                        <div className="signin-route">
                            <NavLink
                                className="navigate"
                                to={`/${coreRoutesEnum.LOG_IN}`}
                            >
                                Back to Login
                            </NavLink>
                        </div>
                    </form>
                    <Footer />
                </div>
            ) : (
                <OTPVerificationForm
                    phoneNumber={formik.values.phoneNumber}
                    updateStep={props.updateStep}
                />
            )}
        </>
    )
}

interface RegisteredNumberFormPropsType {
    updateStep: (step: number) => void
}

export default RegisteredNumberForm
