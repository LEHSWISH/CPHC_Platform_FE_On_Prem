import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './WelcomePage.styles.scss'
import Image1 from '../../../assets/Images/Char_Dham_Badrinath.png'
import Image2 from '../../../assets/Images/Gangotri banner 2.jpg'
import Image3 from '../../../assets/Images/Yamunotri_under banner image 1.jpg'
import welcomeImage from '../../../assets/Images/welcome-image.png'
import Carousel from '../../shared/Carousel/Carousel'
import { Divider, TextField } from '@mui/material'
import { useFormik } from 'formik'
import {
    setFullPageLoader,
    setSnackBar,
} from '../../../services/store/slices/generalSlice'
import { useAppDispatch } from '../../../utils/hooks/useAppDispatch'
import { useAppSelector } from '../../../utils/hooks/useAppSelector'
import * as Yup from 'yup'
import { UpdateYartriDetailsPayloadType } from '../../../interface/ApiRequestPayoadTypes'
import { updateYatriDetailsApi } from '../../../services/api'
import { loadYatriAllData } from '../../../services/store/slices/yatriSlice'
import { DefaultAuthenticatedRedirectRoute } from '../../../enums/routingEnums'
import { isAxiosError } from 'axios'

function WelcomePage() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const fullPageLoader = useAppSelector(s => s.general.fullPageLoader)
    const fullNamePreSaved = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.yatriDetails?.fullName,
    )
    const phoneNumber =
        useAppSelector(s => s.yatri.yatriAllDetails.data?.phoneNumber) || ''
    const slides = [
        Image1,
        Image2,
        Image3,
        // Add more slide URLs as needed
    ]

    const validationSchema = Yup.object({
        fullName: Yup.string().required('Please enter your full name'),
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        const newValue = value.replace(/[^a-zA-Z\s]/g, '')
        formik.setFieldValue( name, newValue, true)
    }

    useEffect(() => {
        dispatch(setFullPageLoader(false))
    }, [dispatch])

    useEffect(() => {
        if (fullNamePreSaved?.length) {
            navigate(`/${DefaultAuthenticatedRedirectRoute}`, {
                replace: true,
            })
        }
    }, [fullNamePreSaved, navigate])

    const formik = useFormik({
        initialValues: {
            fullName: '',
        },
        onSubmit: values => {
            if (fullPageLoader) {
                return
            }

            const payload: UpdateYartriDetailsPayloadType = {
                yatriDetails: {
                    fullName: values.fullName,
                },
                phoneNumber: phoneNumber,
            }

            dispatch(setFullPageLoader(true))
            updateYatriDetailsApi(payload)
                .then(() => {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: 'Full name added successfully',
                            severity: 'success',
                        }),
                    )
                    dispatch(loadYatriAllData())
                    navigate(`/${DefaultAuthenticatedRedirectRoute}`, {
                        replace: true,
                    })
                })
                .catch((err) => {
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
                .finally(() => dispatch(setFullPageLoader(false)))
        },
        validateOnBlur: true,
        validationSchema,
    })
    return (
        <>
            <Carousel slides={slides} />
            <div className="welcomepage-background">
                <div className="container-wrapper">
                    <div className="form-container">
                        <div className="welcomepage-inner-container">
                            <div className="welcome-header">Namaste!</div>
                            <div className="welcome-message">
                                Welcome to eSwasthya Dham - your one-stop companion
                                for health-infused travel adventures.
                            </div>
                            <div className="welcome-image">
                                <img src={welcomeImage} alt="welcome-image" />
                            </div>
                            <div className="divider-block">
                                <Divider>
                                    <span>Let’s Begin</span>
                                </Divider>
                            </div>
                            <form
                                className="signin-form"
                                onSubmit={formik.handleSubmit}
                                autoComplete="off"
                            >
                                <div className="form-description">
                                    Personalize your experience by entering your
                                    name
                                </div>
                                <div className="fullname-container">
                                    <TextField
                                        type="text"
                                        label="Full Name"
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        onChange={handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.errors.fullName}
                                        error={!!formik.errors.fullName}
                                        value={formik.values.fullName}
                                        variant="standard"
                                        required
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                                <button
                                    className="started-button"
                                    type="submit"
                                >
                                    Let’s get started
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WelcomePage
