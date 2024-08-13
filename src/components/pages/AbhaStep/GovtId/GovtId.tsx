import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FormikHelpers, useFormik } from 'formik'
import { isAxiosError } from 'axios'
import {
    CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import './GovtId.styles.scss'
import { DefaultAuthenticatedRedirectRoute } from '../../../../enums/routingEnums'
import { useAppDispatch } from '../../../../utils/hooks/useAppDispatch'
import { useAppSelector } from '../../../../utils/hooks/useAppSelector'
import { setFullPageLoader, setSnackBar } from '../../../../services/store/slices/generalSlice'
import { updateYatriDetailsApi } from '../../../../services/api'
import { loadYatriAllData } from '../../../../services/store/slices/yatriSlice'

interface GovtIdFormValueType {
    governmentIdType: string
    governmentId: string
}

// >>> commented for stage 1
// interface GovtIdPropType {
//     setSelectedStep?: (step: number) => void
// }

function GovtId(
) {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(setFullPageLoader(false))
    }, [dispatch])
    const phoneNumber =
        useAppSelector(s => s.yatri.yatriAllDetails.data?.phoneNumber) || ''
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [idValueErrorMessage, setIdValueErrorMessage] = useState('')
    const [idTypeErrorMessage, setIdTypeErrorMessage] = useState('')
    const [notSelectedIdType, setNotSelectedIdType] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const documentTypes = [
        // {
        //     key: 'Aadhar Card',
        //     value: 'AADHAR_CARD',
        //     validationRegex: new RegExp('^[2-9]\\d{3}\\d{4}\\d{4}$'),
        //     invalidMessage: 'Invalid Aadhaar number. Please try again',
        // },
        {
            key: 'PAN Card',
            value: 'PAN_CARD',
            validationRegex: new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
            invalidMessage: 'Invalid PAN card number. Please try again',
        },
        {
            key: 'Passport',
            value: 'PASSPORT',
            validationRegex: new RegExp('^[A-PR-WY-Z][1-9]\\d\\d{4}[1-9]$'),
            invalidMessage: 'Invalid Passport. Please try again',
        },
        {
            key: 'Voter ID Card',
            value: 'VOTER_ID_CARD',
            validationRegex: [
                new RegExp('^[A-Z]{3}\\d{7}$'),
                new RegExp('^[A-Z]{3}[0-9]{7}$'),
            ],
            invalidMessage: 'Invalid Voter ID number. Please try again',
        },
        {
            key: 'Driving License',
            value: 'DRIVING_LICENSE',
            validationRegex: new RegExp(
                '^(([A-Z]{2}[0-9]{2})|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$',
            ),
            invalidMessage: 'Invalid Driving License number. Please try again',
        },
    ]

    const handleIdBlur = () => {
        if (formik.values.governmentId === '') {
            setIdValueErrorMessage(
                `Please enter ${formik.values.governmentIdType.replace(/_/g, ' ')} number.`,
            )
        } else {
            if (formik.values.governmentIdType) {
                const docInfo = documentTypes.find(
                    val => val.value === formik.values.governmentIdType,
                )
                if (docInfo && docInfo.validationRegex) {
                    if (Array.isArray(docInfo.validationRegex)) {
                        if (
                            docInfo.validationRegex?.length &&
                            !docInfo.validationRegex?.every(reg => {
                                return reg.test(formik.values.governmentId)
                            })
                        ) {
                            setIdValueErrorMessage(docInfo.invalidMessage)
                            return
                        }
                    } else if (
                        !docInfo.validationRegex.test(
                            formik.values.governmentId,
                        )
                    ) {
                        setIdValueErrorMessage(docInfo.invalidMessage)
                        return
                    }
                }
            }
            setIdValueErrorMessage('')
        }
    }

    const handleIdTypeBlur = () => {
        if (formik.values.governmentIdType === '') {
            setNotSelectedIdType(true)
            setIdTypeErrorMessage('Please select government ID type.')
        } else {
            setNotSelectedIdType(false)
            setIdTypeErrorMessage('')
        }
        idValueErrorMessage && handleIdBlur()
    }

    const onSubmit = (
        values: GovtIdFormValueType,
        actions: FormikHelpers<GovtIdFormValueType>,
    ) => {
        if (idValueErrorMessage || notSelectedIdType || isLoading) {
            return
        } else if (!idValueErrorMessage && !notSelectedIdType) {
            if (values.governmentId === '' && values.governmentIdType === '') {
                return
            } else if (!phoneNumber?.length) {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: t(
                            'common_error_messages.something_went_wrong',
                        ),
                        severity: 'error',
                    }),
                )
                return
            } else {
                setIsLoading(true)
                updateYatriDetailsApi({
                    ...values,
                    phoneNumber,
                })
                    .then(() => {
                        dispatch(
                            setSnackBar({
                                open: true,
                                message:
                                    'Government ID registered successfully.',
                                severity: 'success',
                            }),
                        )
                        dispatch(loadYatriAllData())
                        navigate(`/${DefaultAuthenticatedRedirectRoute}`)
                    })
                    .catch(err => {
                        if (isAxiosError(err) && err.response?.data?.message) {
                            actions.setFieldError(
                                'governmentId',
                                err.response?.data?.message,
                            )
                        } else {
                            dispatch(
                                setSnackBar({
                                    open: true,
                                    message: t(
                                        'common_error_messages.something_went_wrong',
                                    ),
                                    severity: 'error',
                                }),
                            )
                        }
                    })
                    .finally(() => setIsLoading(false))
            }
        }
    }

    const formik = useFormik({
        initialValues: {
            governmentIdType: '',
            governmentId: '',
        },
        onSubmit,
    })
    return (
        <div className="govt-id-container">
            <h2 className="govt-id-heading">
                Provide your Government Identification
            </h2>
            <p className="govt-id-description">
                Before embarking on your sacred journey, ensure a smooth start
                by obtaining your Government ID. This unique identifier is your
                key to streamlined registration, helping us prioritize your
                safety and well-being throughout the Char Dham Yatra.
            </p>
            <form className="govt-id-form" onSubmit={formik.handleSubmit} autoComplete='off'>
                <div className="form-fields">
                    <FormControl>
                        <InputLabel
                            id="governmentIdTypeLabel"
                            htmlFor="governmentIdType"
                            shrink={true}
                            variant='standard'
                            error={notSelectedIdType}
                        >
                            Government ID type{' '}
                            <span style={{ color: '#d32f2f' }}>*</span>
                        </InputLabel>
                        <Select
                            label="Government ID Type"
                            id="governmentIdType"
                            name="governmentIdType"
                            onChange={formik.handleChange}
                            onBlur={handleIdTypeBlur}
                            value={formik.values.governmentIdType}
                            error={notSelectedIdType}
                            variant="standard"
                            required
                            fullWidth
                            displayEmpty
                        >
                            <MenuItem disabled value="">
                                Select government ID type
                            </MenuItem>
                            {documentTypes.map(option => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.key}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText sx={{ color: '#d32f2f;' }}>
                            {idTypeErrorMessage}
                        </FormHelperText>
                    </FormControl>
                    <TextField
                        type="text"
                        label="Government ID"
                        id="governmentId"
                        name="governmentId"
                        placeholder="Enter your government ID"
                        onChange={formik.handleChange}
                        onBlur={handleIdBlur}
                        value={formik.values.governmentId}
                        error={
                            !!idValueErrorMessage ||
                            !!formik.errors.governmentId
                        }
                        helperText={
                            idValueErrorMessage || formik.errors.governmentId
                        }
                        variant="standard"
                        margin="normal"
                        required
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </div>
                <button className="submit-button" type="submit">
                    Submit &nbsp;
                    {isLoading && (
                        <CircularProgress
                            color="inherit"
                            variant="indeterminate"
                            size={'1em'}
                        />
                    )}
                </button>
            </form>
            {/* commented for stage 1
            <a
                className="link-abha-route"
                onClick={() => setSelectedStep && setSelectedStep(1)}
            >
                Back to link ABHA
            </a> */}
        </div>
    )
}

export default GovtId
