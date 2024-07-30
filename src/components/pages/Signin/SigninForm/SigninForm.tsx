import './SigninForm.styles.scss'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import Footer from '../../../shared/Footer/Footer'
import { sha256 } from 'crypto-hash'

import {
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    TextField,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useAppDispatch } from '../../../../utils/hooks/useAppDispatch'
import { useAppSelector } from '../../../../utils/hooks/useAppSelector'
import UttarakhandGovtLogo from '../../../../assets/icons/Uttarakhand gov.svg'
import NhmLogo from '../../../../assets/icons/NHM.svg'
import { NavLink } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../enums/routingEnums'
import { loginYatri } from '../../../../services/store/slices/authSlice'
import HitApi from '../../../../classes/http/HitApi'
import { RequestMethod } from '../../../../enums/RequestMethods'
import { setSnackBar } from '../../../../services/store/slices/generalSlice'
import { ApiEndpointsEnum } from '../../../../enums/ApiEndPointsEnum'
import { generateUUID } from '../../../../utils/HelperFunctions'

function SigninForm() {
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const resErrorRef = useRef<boolean>(false)
    const {
        yatri: { error, loading },
    } = useAppSelector(s => s.auth)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault()
    }

    const formik = useFormik({
        initialValues: {
            userName: '',
            password: '',
        },
        onSubmit: async values => {
            if (loading) return
            const hashedPassword = await sha256(values.password)
            const timeStamp = new Date().toISOString()
            const pass = `${timeStamp}%${hashedPassword}`
            let encryptedPassword
            await HitApi.hitapi({
                url: ApiEndpointsEnum.PASSWORD_ENCRYPTION,
                requestMethod: RequestMethod.POST,
                payload: { keyToEncrypt: pass },
                ignoreBaseUrl: false,
                sucessFunction: response => {
                    encryptedPassword = response?.data
                },
                errorFunction: () => {
                    setSnackBar({
                        open: true,
                        message: t(
                            'common_error_messages.something_went_wrong',
                        ),
                        severity: 'error',
                    })
                },
            })
            const sessionId = generateUUID()
            const payload: any = {
                userName: values.userName,
                password: encryptedPassword,
                sessionId: sessionId,
            }
            dispatch(loginYatri(payload))
            resErrorRef.current = false
        },
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
                    'userName',
                    t('common_error_messages.wrong_username'),
                )
            }
            resErrorRef.current = true
        }
    }, [error, formik, t])

    return (
        <div className="signin-container">
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
                    <p>Log in</p>
                    <h2>Welcome Back!!</h2>
                </div>
                <div className="form-fields">
                    <div className="username-container">
                        <TextField
                            type="text"
                            label="Username"
                            id="userName"
                            name="userName"
                            placeholder="Enter your unique username"
                            onChange={formik.handleChange}
                            value={formik.values.userName}
                            variant="standard"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={!!formik.errors.userName}
                            helperText={formik.errors.userName}
                        />
                        {/* <NavLink
                            className="nav-forgot-password"
                            to={`/${coreRoutesEnum.FORGOT_USERNAME}`}
                        >
                            Forgot Username?
                        </NavLink> */}
                    </div>
                    <div className="password-container">
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            variant="standard"
                            required
                            fullWidth
                            error={!!formik.errors.password}
                            helperText={formik.errors.password}
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
                    className="signin-button"
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
            <Footer />
        </div>
    )
}

export default SigninForm
