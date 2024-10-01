import './SigninPasswordForm.styles.scss'
import UttarakhandGovtLogo from '../../../../../assets/icons/UttarakhandGovtLogo1.svg'
import NhmLogo from '../../../../../assets/icons/NhmLogo1.svg'
import {
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import { NavLink } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../enums/routingEnums'
import { useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import * as Yup from 'yup'
import { loginYatri } from '../../../../../services/store/slices/authSlice'
import { useRef, useEffect } from 'react'
import { useAppSelector } from '../../../../../utils/hooks/useAppSelector'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../../../../utils/hooks/useAppDispatch'
import { encryptPassword, generateUUID } from '../../../../../utils/HelperFunctions'
import bcrypt from 'bcryptjs'
import Footer from '../../../../shared/Footer/Footer'

function SigninPasswordForm({
    selection,
    setStep,
    onlyOneUserExist,
}: SigninPasswordFormPropType) {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const resErrorRef = useRef<boolean>(false)

    const {
        yatri: { error, loading },
    } = useAppSelector(s => s.auth)

    const { t } = useTranslation()

    const validationSchema = Yup.object({
        password: Yup.string().required('Please enter your password'),
    })

    const formik = useFormik({
        initialValues: {
            password: '',
        },
        onSubmit: async values => {
            const hashedPassword = bcrypt.hashSync(values.password,import.meta.env.VITE_API_PASSWORD_SALT) // hash created previously created upon sign up
            const timeStamp = new Date().toISOString()
            const password=`${timeStamp}%${hashedPassword}`
            const encryptedPassword=encryptPassword(password)?.toString()
            // const plainPassword = values.password;
            const sessionId = generateUUID()
            const payload: any = {
                userName: selection,
                password: encryptedPassword,
                // password: plainPassword,
                sessionId: sessionId,
            }
            if (loading) return
            dispatch(loginYatri(payload))
            resErrorRef.current = false
        },
        validateOnBlur: true,
        validationSchema,
    })
    useEffect(() => {
        if (error && !resErrorRef.current) {
            if (error === 'Bad credentials') {
                formik.setFieldError(
                    'password',
                    t('common_error_messages.wrong_password'),
                )
            } else {
                formik.setFieldError(
                    'password',
                    t('common_error_messages.wrong_username'),
                )
            }
            resErrorRef.current = true
        }
    }, [error, formik, t])

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault()
    }
    const dispatch = useAppDispatch()

    return (
        <div className="signin-passwordform-container">
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
                    <p>Enter your Password</p>
                    <div className="username-display">
                        <div className="username-detail">
                            Username - <span>{selection}</span>
                        </div>
                        {!onlyOneUserExist && (
                            <a
                                href="#"
                                onClick={() => setStep(2)}
                                className="change-link"
                            >
                                Change
                            </a>
                        )}
                    </div>
                </div>
                <div className="form-fields">
                    <div className="password-container">
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            id="password"
                            name="password"
                            placeholder="Enter your Password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={formik.errors.password}
                            error={!!formik.errors.password}
                            value={formik.values.password}
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
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                                handleMouseDownPassword
                                            }
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <NavLink
                            className="nav-forgot-password"
                            to={`/${coreRoutesEnum.RESET_PASSWORD}`}
                        >
                            Forgot Password?
                        </NavLink>
                    </div>
                </div>
                <button
                    className="continue-button"
                    type="submit"
                    disabled={loading}
                >
                    Log in &nbsp;
                    {loading && (
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
            <Footer variant="typeTwo" />
        </div>
    )
}

interface SigninPasswordFormPropType {
    selection: string
    setStep: (val: number) => void
    onlyOneUserExist: boolean
}

export default SigninPasswordForm
