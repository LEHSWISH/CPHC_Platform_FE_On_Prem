import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { CircularProgress, TextField } from '@mui/material'
import './tourismIdForm.styles.scss'
import InfoIcon from '../../../../../../assets/icons/Vector.svg'
import { createAbhaViaTourismIdvalidationSchema } from '../../../../../../utils/constants/validations'
import { IdtpGetUserInfoApi } from '../../../../../../services/api'
import { setSnackBar } from '../../../../../../services/store/slices/generalSlice'
import { useAppDispatch } from '../../../../../../utils/hooks/useAppDispatch'
import { isAxiosError } from 'axios'
import { GetUserInfoByIDTP_ApiResponseType } from '../../../../../../interface/ApiResponseTypes'
import { NavLink, useNavigate } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../../enums/routingEnums'
import { useAppSelector } from '../../../../../../utils/hooks/useAppSelector'
import { loadYatriAllData } from '../../../../../../services/store/slices/yatriSlice'
import FindTourismId from '../findTourismId/FindTourismId'
import CardBackdrop from '../../../../../shared/CardBackdrop/CardBackdrop'
import BackButtonWithTitle from '../../../../../shared/BackButtonWithTitle'

export interface TourismIdFormDataType {
    tourismPortalId: string
}

const initialValues: TourismIdFormDataType = {
    tourismPortalId: '',
}

function TourismIdForm({
    afterSubmitSuccess,
    shouldUseAbhaFlow,
}: TourismIdFormPropType) {
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useAppDispatch()
    const idtpId = useAppSelector(
        s => s.yatri.yatriAllDetails?.data?.tourismUserInfo?.idtpId,
    )
    const isLoadingYatriAllDetails = useAppSelector(
        s => s.yatri.yatriAllDetails.loading,
    )

    const [findTourism, setFindTourism] = useState<boolean>(false)
    const formik = useFormik({
        initialValues,
        onSubmit: async values => {
            if (isLoading) return
            setIsLoading(true)
            return IdtpGetUserInfoApi(values)
                .then(res => {
                    afterSubmitSuccess(values, res.data)
                    dispatch(loadYatriAllData())
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
        validateOnBlur: true,
        validationSchema: createAbhaViaTourismIdvalidationSchema,
    })

    useEffect(() => {
        if (
            !isLoadingYatriAllDetails &&
            idtpId?.length &&
            !formik.values.tourismPortalId
        ) {
            formik.setFieldValue('tourismPortalId', idtpId)
        }
    }, [idtpId, isLoadingYatriAllDetails, formik])

    const findRegistrationId = () => {
        setFindTourism(true)
    }
    const navigate = useNavigate()
    return (
        <>
            <div className="tourism-id-form-container">
                <div className="heading">
                    <span className="home-button-mobile">
                        <BackButtonWithTitle
                            onBack={() => {
                                navigate(`${coreRoutesEnum.CREATE_ABHA}`)
                            }}
                            backButtonChildElement={
                                <span className="backbutton">Back</span>
                            }
                        />
                    </span>
                    {shouldUseAbhaFlow
                        ? 'Enter Tourism Portal ID'
                        : 'Provide Tourism Portal ID'}
                </div>
                <div className="body">
                    <div className="description-text">
                        {shouldUseAbhaFlow
                            ? `Get your ABHA (Ayushman Bharat Health Account) for a smooth Char Dham Yatra using your IDTP with simple clicks. Enjoy personalized help, updates, and safety on your spiritual journey. Remember to secure your ID for easy portal access before you start.`
                            : `Your Tourism ID is your key to a seamless pilgrimage experience! Registering with this unique identifier ensures personalized assistance, timely updates, and a secure journey as you embark on the sacred Char Dham Yatra. Don't forget to obtain your Tourism ID for hassle-free registration into the portal before setting out on this spiritual adventure.`}
                    </div>
                    <div className="description-box-for-mobile">
                        <p className="description-text-for-mobile">
                            Enter Tourism Portal ID to Generate ABHA Number
                        </p>
                    </div>
                    <form onSubmit={formik.handleSubmit} autoComplete="off">
                        <TextField
                            className="field"
                            type="text"
                            label="Tourism Portal ID"
                            id="tourismPortalId"
                            name="tourismPortalId"
                            placeholder="Enter your Tourism Portal ID"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.tourismPortalId}
                            helperText={formik.errors.tourismPortalId}
                            error={!!formik.errors.tourismPortalId}
                            variant="standard"
                            required
                            disabled={isLoading || !!idtpId?.length}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <span
                            className="info-link-text"
                            onClick={findRegistrationId}
                        >
                            <img src={InfoIcon} alt="" />
                            Where to find registration ID for tourism portal?
                        </span>
                        {findTourism && (
                            <CardBackdrop
                                showClose={true}
                                setClose={() => setFindTourism(false)}
                            >
                                <FindTourismId />
                            </CardBackdrop>
                        )}
                        <button className="submit-button" type="submit">
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
                    {shouldUseAbhaFlow && (
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
                    )}
                </div>
            </div>
        </>
    )
}

interface TourismIdFormPropType {
    afterSubmitSuccess: (
        formValues: TourismIdFormDataType,
        responseData: GetUserInfoByIDTP_ApiResponseType,
    ) => void
    shouldUseAbhaFlow: boolean
}

export default TourismIdForm
