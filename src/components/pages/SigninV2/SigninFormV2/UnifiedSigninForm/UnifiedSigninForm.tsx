import './UnifiedSigninForm.styles.scss'
import UttarakhandGovtLogo from '../../../../../assets/icons/UttarakhandGovtLogo1.svg'
import NhmLogo from '../../../../../assets/icons/NhmLogo1.svg'
import { CircularProgress, Divider, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { NavLink } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../enums/routingEnums'
import { useState } from 'react'
import * as Yup from 'yup'
import { getAllUserLinkedWithPhoneNumber } from '../../../../../services/api'
import { GetAllUserLinkedWithPhoneNumberResponseType } from '../../../../../interface/ApiResponseTypes'
import { setSnackBar } from '../../../../../services/store/slices/generalSlice'
import { useAppDispatch } from '../../../../../utils/hooks/useAppDispatch'
import { isAxiosError } from 'axios'
import { decryptUsername } from '../../../../../utils/HelperFunctions'
import Footer from '../../../../shared/Footer/Footer'
import useAddToHomeScreenPrompt from '../../../../../utils/hooks/useAddToHomeScreenPrompt'

function UnifiedSigninForm({
    setResponse,
    setSelection,
    updateStep,
    setIsOnlyUserExist,
}: UnifiedSigninFormPropsType) {
    useAddToHomeScreenPrompt()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const handleSubmit = (values: { userNameOrPhoneNumber: string }) => {
        const inputValue = values.userNameOrPhoneNumber
        if (/^[0-9]+$/.test(inputValue)) {
            if (isLoading) {
                return
            }

            setIsLoading(true)
            const decryptedUserNames:string[]=[]
            getAllUserLinkedWithPhoneNumber(inputValue)
                .then(res => {
                    if(res.data.linkedWith > 0) {

                        res.data.users.forEach((username)=>{
                            decryptedUserNames.push(decryptUsername(username).toString().trim())
                        })
                        res.data.users=decryptedUserNames
                        setResponse(res.data)
                    }
                    if (res.data.linkedWith == 1) {
                        setIsOnlyUserExist(true)
                        updateStep(3)
                        setSelection(res.data.users[0])
                    } else if (res.data.linkedWith == 0) {
                        formik.setFieldError(
                            'userNameOrPhoneNumber',
                            'User does not exist, please enter valid phone number.',
                        )
                    } else {
                        updateStep(2)
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
                .finally(() => {
                    setIsLoading(false)
                })
        } else {
            setSelection(inputValue)
            setIsOnlyUserExist(true)
            updateStep(3)
        }
    }

    const validationSchema = Yup.object({
        userNameOrPhoneNumber: Yup.string().required(
            'Please enter your username or phone number',
        ),
    })

    const formik = useFormik({
        initialValues: {
            userNameOrPhoneNumber: '',
        },
        onSubmit: handleSubmit,
        validateOnBlur: true,
        validationSchema,
    })

    return (
        <div className="unified-signinform-container">
            <div className="page-logo">
                <img
                    src={UttarakhandGovtLogo}
                    alt="Uttrakhand Simply Heaven!"
                />
                <Divider orientation="vertical" variant="middle" flexItem />
                <img
                    src={NhmLogo}
                    className="nhm-image"
                    alt="Uttrakhand Simply Heaven!"
                />
            </div>
            <form
                className="signin-form"
                onSubmit={formik.handleSubmit}
                autoComplete="off"
            >
                <div className="signin-description">
                    <p>Log in to eSwasthya Dham</p>
                </div>
                <div className="form-fields">
                    <div className="username-container">
                        <TextField
                            type="text"
                            label="Username or Phone Number"
                            id="userNameOrPhoneNumber"
                            name="userNameOrPhoneNumber"
                            placeholder="Enter your username or phone number"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={formik.errors.userNameOrPhoneNumber}
                            error={!!formik.errors.userNameOrPhoneNumber}
                            value={formik.values.userNameOrPhoneNumber}
                            variant="standard"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        {/* <NavLink
                            className="nav-forgot-password"
                            to={`/${coreRoutesEnum.FORGOT_USERNAME}`}
                        >
                            Forgot Username?
                        </NavLink> */}
                    </div>
                </div>
                <button
                    className="continue-button"
                    type="submit"
                    disabled={isLoading}
                >
                    Continue &nbsp;
                    {isLoading && (
                        <CircularProgress
                            color="inherit"
                            variant="indeterminate"
                            size={'1em'}
                        />
                    )}
                </button>
                <div className="signup-route">
                    <p>Don't have an account?</p>
                    <NavLink
                        className="navigate"
                        to={`/${coreRoutesEnum.SIGN_UP}`}
                    >
                        Sign up
                    </NavLink>
                </div>
            </form>
            <div className="advisory">
                Learn about your &nbsp;
                <a
                    href={'../../../../../Iconic-Advisory.pdf'}
                    target="_blank"
                    className="advisory-link"
                >
                    Yatra Do’s and Dont’s
                </a>
            </div>
            <Footer variant="typeTwo" />
        </div>
    )
}

interface UnifiedSigninFormPropsType {
    updateStep: (step: number) => void
    setResponse: (val: GetAllUserLinkedWithPhoneNumberResponseType) => void
    setSelection: (val: string) => void
    setIsOnlyUserExist: (val: boolean) => void
}

export default UnifiedSigninForm
