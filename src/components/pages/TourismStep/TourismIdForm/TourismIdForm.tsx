import { FormHelperText, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useState } from 'react'
import InfoIcon from '../../../../assets/icons/Vector.svg'
import { NavLink } from 'react-router-dom'
import { isAxiosError } from 'axios'
import {
    DefaultAuthenticatedRedirectRoute,
    coreRoutesEnum,
} from '../../../../enums/routingEnums'
import {
    GetUserInfoByIDTP_ApiErrorResponseType,
    GetUserInfoByIDTP_ApiResponseType,
} from '../../../../interface/ApiResponseTypes'
import { useTranslation } from 'react-i18next'
import { IdtpGetUserInfoApi } from '../../../../services/api'
import { setSnackBar } from '../../../../services/store/slices/generalSlice'
import { useAppDispatch } from '../../../../utils/hooks/useAppDispatch'

interface TourismIdFormPropTypes {
    setTourismPortalId: (v: string) => void
    setSelectedValue: (v: string) => void
    setUserInfoByIDTP: (v: GetUserInfoByIDTP_ApiResponseType) => void
}

function TourismIdForm({
    setTourismPortalId,
    setUserInfoByIDTP,
    setSelectedValue,
}: TourismIdFormPropTypes) {
    const { t } = useTranslation()
    const dispatch=useAppDispatch()
    const [notEntered, setNotEntered] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const formik = useFormik({
        initialValues: {
            tourismPortalId: '',
        },
        onSubmit: values => {
            if (isLoading) {
                return
            }
            if (!values.tourismPortalId) {
                setNotEntered('Please enter your tourism portal ID.')
                return
            }
            setIsLoading(true)
            IdtpGetUserInfoApi({tourismPortalId: values.tourismPortalId})
                .then(r => {
                    setUserInfoByIDTP(r.data)
                    setTourismPortalId(values.tourismPortalId)
                    setSelectedValue('manual')
                })
                .catch(e => {
                    if (isAxiosError(e)) {
                        const errorResponse = e.response
                            ?.data as GetUserInfoByIDTP_ApiErrorResponseType

                        setNotEntered(
                            errorResponse?.message ||
                                t('common_error_messages.incorrect_idtp'),
                        )
                    }
                })
                .finally(() => setIsLoading(false))
        },
    })
    return (
        <>
            <form className="create-abha-form" onSubmit={formik.handleSubmit}>
                <div className="form-fields">
                    <TextField
                        type="text"
                        label="Tourism Portal Id"
                        id="tourismPortalId"
                        name="tourismPortalId"
                        placeholder="Enter your Tourism Portal ID"
                        onChange={formik.handleChange}
                        value={formik.values.tourismPortalId}
                        error={!!notEntered}
                        variant="standard"
                        margin="normal"
                        required
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    {notEntered && (
                        <FormHelperText
                            children={notEntered}
                            error={!!notEntered}
                        ></FormHelperText>
                    )}
                </div>
                <div className="not-abha-div">
                    <span className="not-abha-text">
                        <img src={InfoIcon} alt="" onClick={()=>{
                        dispatch(
                            setSnackBar({
                                open: true,
                                message: 'Please check the SMS on the phone number you used for the registration of Char Dham on the tourism portal. like 1',
                                severity: 'success',
                            }),
                        )
                    }}/>
                    </span>
                    <a className="create-abha-button" onClick={()=>{
                        dispatch(
                            setSnackBar({
                                open: true,
                                message: 'Please check the SMS on the phone number you used for the registration of Char Dham on the tourism portal. like 1',
                                severity: 'success',
                            }),
                        )
                    }}>
                        Where to find registration ID for tourism portal?
                    </a>
                </div>
                <button className="link-abha-button" type="submit">
                    Continue
                </button>
                <div className="signup-route">
                    <NavLink to={DefaultAuthenticatedRedirectRoute}>
                        Skip for Later
                    </NavLink>
                </div>
                <div className="signup-route">
                    <NavLink to={coreRoutesEnum.YATRA_DETAIL}>Back</NavLink>
                </div>
            </form>
        </>
    )
}

export default TourismIdForm
