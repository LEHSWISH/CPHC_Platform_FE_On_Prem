import RecoverWithAbhaNumber from './RecoverWithAbhaNumber/RecoverWithAbhaNumber'
import './RecoverUsername.scss'
import UttarakhandGovtLogo from '../../../assets/icons/Uttarakhand gov.svg'
import NhmLogo from '../../../assets/icons/NHM.svg'
import { Divider, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import Image1 from '../../../assets/Images/Char_Dham_Badrinath.png'
import Image2 from '../../../assets/Images/Gangotri banner 2.jpg'
import Image3 from '../../../assets/Images/Yamunotri_under banner image 1.jpg'
import Image4 from '../../../assets/Images/image 11 (1).png'
import Carousel from '../../shared/Carousel/Carousel'
import Footer from '../../shared/Footer/Footer'
import RecoverWithGovernmentId from './RecoverWithGovernmentId/RecoverWithGovernmentId'
import { useState } from 'react'
import { useFormik } from 'formik'
import { NavLink } from 'react-router-dom'
import { coreRoutesEnum } from '../../../enums/routingEnums'
import HitApi from '../../../classes/http/HitApi'
import { RequestMethod } from '../../../enums/RequestMethods'
import { ApiEndpointsEnum } from '../../../enums/ApiEndPointsEnum'
import { useDispatch } from 'react-redux'
import { setSnackBar } from '../../../services/store/slices/generalSlice'
function RecoverUsername() {
    const slides = [
        Image1,
        Image2,
        Image3,
        Image4,
        // Add more slide URLs as needed
    ]

    const [selectedValue, setSelectedValue] = useState<string>('abhaNumber')
    const [userNameRecovered, setUserNameRecovered] = useState<boolean>(false)
    const [maskNumber, setMaskNumber] = useState<string>('3210')
    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
            idOption: '',
        },
        onSubmit: () => {
            //
        },
    })

    const handleUserNameRecovered = (values?: any) => {
        setMaskNumber(values.phoneNumber.slice(-4))
        HitApi.hitapi({
            url: `${ApiEndpointsEnum.FORGET_USERNAME}`,
            payload: values,
            requestMethod: RequestMethod.POST,
            ignoreBaseUrl: false,
            sucessFunction: response => {
                if (response.status === 200) {
                    setUserNameRecovered(true)
                }
            },
            errorFunction: (error: any) => {
                const message = error?.data?.message
                dispatch(
                    setSnackBar({
                        open: true,
                        message,
                        severity: 'error',
                    }),
                )
            },
        })
    }

    const handleSelectionChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.name === 'governmentId') {
            setSelectedValue('governmentId')
            formik.setFieldValue('idOption', '')
        } else {
            setSelectedValue('abhaNumber')
            formik.setFieldValue('idOption', '')
        }
    }

    return (
        <>
            <Carousel slides={slides} />
            <div className="recover-username-background">
                <div className="container-wrapper">
                    <div className="form-container">
                        <div className="recover-username-container">
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
                            <div className="recover-username-form">
                                {userNameRecovered ? (
                                    <>
                                        <h2 className="recover-username-heading">
                                            Username Recovered
                                        </h2>
                                        <p className="recover-username-description">
                                            Your username has been sent on your
                                            registered phone number XXXXXX
                                            {maskNumber}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="recover-username-heading">
                                            Recover Username
                                        </h2>
                                        {selectedValue === 'abhaNumber' ? (
                                            <p className="recover-username-description">
                                                Please enter your ABHA number
                                                and phone number. We will then
                                                send an OTP to recover your
                                                username.
                                            </p>
                                        ) : (
                                            <p className="recover-username-description">
                                                Please enter your Government ID
                                                and phone number. We will then
                                                send an OTP to recover your
                                                username.{' '}
                                            </p>
                                        )}
                                        <RadioGroup
                                            row
                                            className="radio-group"
                                            name="idOption"
                                            defaultValue="abhaNumber"
                                        >
                                            <FormControlLabel
                                                name="abhaNumber"
                                                value="abhaNumber"
                                                label="ABHA Number"
                                                checked={
                                                    selectedValue ===
                                                    'abhaNumber'
                                                }
                                                control={
                                                    <Radio
                                                        onChange={
                                                            handleSelectionChange
                                                        }
                                                    />
                                                }
                                                sx={{
                                                    fontSize: '1.06rem',
                                                    fontWeight: '400',
                                                    lineHeight: '19px',
                                                    color: 'rgba(105, 105, 105, 1)',
                                                }}
                                            />
                                            <FormControlLabel
                                                name="governmentId"
                                                value="governmentId"
                                                checked={
                                                    selectedValue ===
                                                    'governmentId'
                                                }
                                                label="Government ID"
                                                control={
                                                    <Radio
                                                        onChange={
                                                            handleSelectionChange
                                                        }
                                                    />
                                                }
                                                sx={{
                                                    fontSize: '1.06rem',
                                                    fontWeight: '400',
                                                    lineHeight: '19px',
                                                    color: 'rgba(105, 105, 105, 1)',
                                                }}
                                            />
                                        </RadioGroup>
                                        {selectedValue === 'abhaNumber' ? (
                                            <RecoverWithAbhaNumber
                                                onSuccess={
                                                    handleUserNameRecovered
                                                }
                                            />
                                        ) : (
                                            <RecoverWithGovernmentId
                                                onSuccess={
                                                    handleUserNameRecovered
                                                }
                                            />
                                        )}
                                    </>
                                )}
                                <div className="login-route">
                                    <NavLink
                                        className="navigate"
                                        to={`/${coreRoutesEnum.LOG_IN}`}
                                    >
                                        Back to Login
                                    </NavLink>
                                </div>
                            </div>
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RecoverUsername
