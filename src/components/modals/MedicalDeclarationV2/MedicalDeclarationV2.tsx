import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import {
    CircularProgress,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material'
import './MedicalDeclarationV2.styles.scss'
import * as Yup from 'yup'
import { HealthFormValuesType } from '../../../interface/medicalCertificate/HealthFormValuesType'
import { useAppSelector } from '../../../utils/hooks/useAppSelector'
import CustomCheckboxContainer from '../../shared/CustomCheckboxContainer/CustomCheckboxContainer'
import { UpdateMedicalReportApi, getMedicalReportApi, updateYatriDetailsApi } from '../../../services/api'
import { setSnackBar } from '../../../services/store/slices/generalSlice'
import BackButtonWithTitle from '../../shared/BackButtonWithTitle'

const initialValues: HealthFormValuesType = {
    heartDisease: false,
    hypertension: false,
    respiratoryDiseaseOrAsthma: false,
    diabetesMellitus: false,
    tuberculosis: false,
    epilepsyOrAnyNeurologicalDisorder: false,
    kidneyOrUrinaryDisorder: false,
    cancer: false,
    migraineOrPersistentHeadache: false,
    anyAllergies: false,
    disorderOfTheJointsOrMusclesArthritisGout: false,
    anyMajorSurgery: false,
    noneOfTheAbove: false,
    dateOfBirth: '',
    gender: '',
}

interface MedicalDeclarationPropTypes {
    setIsShowMedicalDeclarationModal: (val: boolean) => void
    onSaveAndContinueSuccess: () => void
}

function MedicalDeclaration({
    setIsShowMedicalDeclarationModal,
    onSaveAndContinueSuccess,
}: MedicalDeclarationPropTypes) {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const isInitialDataLoadedRef = useRef(false)
    const [isLoading, setIsLoading] = useState(true)
    const yatriDetails = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.yatriDetails,
    )
    const abhaUserDetails = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.abhaUserDetails,
    )
    const tourismUserDetails = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.tourismUserInfo,
    )
    const phoneNumber =
        useAppSelector(s => s.yatri.yatriAllDetails.data?.phoneNumber) || ''

    const validationSchema = Yup.object({
        dateOfBirth: Yup.date().required('Please enter your date of birth')
        .min(
            new Date('1899-12-31'),
            'Date of Birth cannot be before 1st January 1900',
        )
        .max(
            new Date(),
            'Date of Birth cannot be in the future'
        ),
        gender: Yup.string().required('Please select your gender'),
    })

    const formik = useFormik({
        initialValues: initialValues,
        validate: values => {
            const errors: { [k: string]: string | null } = {}
            const checkedValueList = Object.values(values).filter(
                value => value === true,
            )
            if (checkedValueList.length === 0) {
                errors.noneOfTheAbove = 'Atleast one field is mandatory'
            }
            return errors
        },
        onSubmit: values => {
            setIsLoading(true)
            const { dateOfBirth, gender, ...diseaseData } = values
            Promise.all([
                updateYatriDetailsApi({
                    phoneNumber: phoneNumber,
                    yatriDetails: {
                        dateOfBirth: dateOfBirth
                            ?.split('-')
                            ?.reverse()
                            ?.join('/'),
                        gender: gender,
                    },
                }),
                UpdateMedicalReportApi(diseaseData),
            ])
                .then(() => {
                    onSaveAndContinueSuccess && onSaveAndContinueSuccess()
                })
                .catch(() => {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: t(
                                'common_error_messages.something_went_wrong',
                            ),
                            severity: 'error',
                        }),
                    )
                })
                .finally(() => {
                    setIsLoading(false)
                })
        },
        validateOnBlur: true,
        validationSchema,
    })

    useEffect(() => {
        !isInitialDataLoadedRef.current &&
            (() => {
                isInitialDataLoadedRef.current = true
                getMedicalReportApi()
                    .then(r => {
                        const newValues = {
                            ...formik.values,
                            ...r?.data,
                            dateOfBirth:
                                abhaUserDetails?.dateOfBirth
                                    ?.split('/')
                                    ?.reverse()
                                    ?.join('-') ||
                                yatriDetails?.dateOfBirth
                                    ?.split('/')
                                    ?.reverse()
                                    ?.join('-') ||
                                '',
                            gender:
                                abhaUserDetails?.gender ||
                                yatriDetails?.gender ||
                                '',
                        }
                        formik.setValues(newValues)
                    })
                    .catch(() => {
                        dispatch(
                            setSnackBar({
                                open: true,
                                message: t(
                                    'common_error_messages.something_went_wrong',
                                ),
                                severity: 'error',
                            }),
                        )
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            })()
    }, [
        t,
        dispatch,
        formik,
        yatriDetails?.gender,
        abhaUserDetails?.gender,
        yatriDetails?.dateOfBirth,
        abhaUserDetails?.dateOfBirth,
    ])

    const selectData = [
        {
            name: 'heartDisease',
            label: 'Heart Disease or Cholesterol',
            checked: formik.values.heartDisease,
        },
        {
            name: 'hypertension',
            label: 'Hypertension',
            checked: formik.values.hypertension,
        },
        {
            name: 'respiratoryDiseaseOrAsthma',
            label: 'Respiratory Disease or Asthma',
            checked: formik.values.respiratoryDiseaseOrAsthma,
        },
        {
            name: 'diabetesMellitus',
            label: 'Diabetes mellitus',
            checked: formik.values.diabetesMellitus,
        },
        {
            name: 'tuberculosis',
            label: 'Tuberculosis',
            checked: formik.values.tuberculosis,
        },
        {
            name: 'epilepsyOrAnyNeurologicalDisorder',
            label: 'Epilepsy or any neurological disorder',
            checked: formik.values.epilepsyOrAnyNeurologicalDisorder,
        },
        {
            name: 'kidneyOrUrinaryDisorder',
            label: 'Kidney or urinary Disorder',
            checked: formik.values.kidneyOrUrinaryDisorder,
        },
        {
            name: 'cancer',
            label: 'Cancer (Any kind)',
            checked: formik.values.cancer,
        },
        {
            name: 'migraineOrPersistentHeadache',
            label: 'Migraine or persistent headache',
            checked: formik.values.migraineOrPersistentHeadache,
        },
        {
            name: 'anyAllergies',
            label: 'Any Allergies',
            checked: formik.values.anyAllergies,
        },
        {
            name: 'disorderOfTheJointsOrMusclesArthritisGout',
            label: 'Disorder of the joints or muscles, arthritis, gout',
            checked: formik.values.disorderOfTheJointsOrMusclesArthritisGout,
        },
        {
            name: 'anyMajorSurgery',
            label: 'Any Major Surgery',
            checked: formik.values.anyMajorSurgery,
        },
        {
            name: 'noneOfTheAbove',
            label: 'None of the above',
            checked: formik.values.noneOfTheAbove,
        },
    ]

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'noneOfTheAbove') {
            const updatedValues = selectData.reduce((acc: any, curr) => {
                acc[curr.name] = false // Sets all fields to false
                return acc
            }, {})
            formik.setValues({
                dateOfBirth: formik.values.dateOfBirth,
                gender: formik.values.gender,
                ...updatedValues,
                noneOfTheAbove: event.target.checked,
            })
        } else {
            formik.setValues(
                {
                    ...formik.values,
                    noneOfTheAbove: false,
                    [event.target.name]: event.target.checked,
                },
                true,
            )
        }
    }

    return (
        <div className="medical-declarationV2-container">
            <div className="modal-title">
                <span className="home-button-div">
                    <BackButtonWithTitle
                        backButtonChildElement={
                            <span className="home-button">Home</span>
                        }
                        onBack={() => {
                            setIsShowMedicalDeclarationModal(false)
                        }}
                    />
                </span>
                Medical Declaration
            </div>
            <div className="declaration-message">
                In case you have any medical history, keep us informed. Your
                health is our priority.
            </div>
            <form className="form-container" onSubmit={formik.handleSubmit}>
                <div className="declaration-personal-details">
                    <TextField
                        disabled
                        required
                        className="field"
                        type="text"
                        label="Full Name"
                        id="fullName"
                        name="fullName"
                        value={yatriDetails?.fullName || ''}
                        variant="standard"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        disabled={!!abhaUserDetails}
                        required
                        className="field"
                        type="date"
                        label="Date of Birth"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formik.values.dateOfBirth}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            !!(
                                formik.touched.dateOfBirth &&
                                formik.errors.dateOfBirth
                            )
                        }
                        helperText={
                            formik.touched.dateOfBirth &&
                            formik.errors.dateOfBirth
                        }
                        variant="standard"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            max: new Date().toISOString().split('T')[0],
                            min: '1900-01-01',
                        }}
                    />
                    <RadioGroup
                        name="gender"
                        className="field radio-group"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <FormLabel>
                            Gender <span className="asterik">*</span>
                        </FormLabel>
                        <FormControlLabel
                            value="Female"
                            control={
                                <Radio
                                    disabled={
                                        !!(
                                            abhaUserDetails ||
                                            tourismUserDetails?.gender
                                        )
                                    }
                                />
                            }
                            label="Female"
                        />
                        <FormControlLabel
                            value="Male"
                            control={
                                <Radio
                                    disabled={
                                        !!(
                                            abhaUserDetails ||
                                            tourismUserDetails?.gender
                                        )
                                    }
                                />
                            }
                            label="Male"
                        />
                        <FormControlLabel
                            value="Other"
                            control={
                                <Radio
                                    disabled={
                                        !!(
                                            abhaUserDetails ||
                                            tourismUserDetails?.gender
                                        )
                                    }
                                />
                            }
                            label="Other"
                        />
                        {formik.touched.gender && formik.errors.gender && (
                            <FormHelperText
                                sx={{
                                    color: 'rgba(199, 65, 58, 1)',
                                }}
                            >
                                {formik.errors.gender}
                            </FormHelperText>
                        )}
                    </RadioGroup>
                </div>

                <div className="choose-from">
                    Please choose from the options if any health issues apply to
                    you. This will help us make your journey smooth.
                </div>

                <FormGroup
                    className={`form-group ${(isLoading && 'flex-important') || ''}`}
                >
                    {isLoading ? (
                        <CircularProgress
                            sx={{ marginX: 'auto' }}
                            color="primary"
                            variant="indeterminate"
                        />
                    ) : (
                        selectData?.map(checkboxData => (
                            <CustomCheckboxContainer
                                key={checkboxData.name}
                                name={checkboxData.name}
                                label={checkboxData.label}
                                checked={!!checkboxData.checked}
                                onChange={handleChange}
                            />
                        ))
                    )}
                </FormGroup>
                <div className="form-container-error">
                    <div className="form-container-error-inside">
                        {formik.errors.noneOfTheAbove}
                    </div>
                </div>
                <button className="submit-declaration-button" type="submit">
                    Save & Next
                </button>
            </form>
        </div>
    )
}

export default MedicalDeclaration
