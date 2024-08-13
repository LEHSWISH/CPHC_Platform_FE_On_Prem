import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { CircularProgress, FormGroup } from '@mui/material'
import './MedicalDeclaration.styles.scss'
import CustomCheckboxContainer from '../../../../../shared/CustomCheckboxContainer/CustomCheckboxContainer'
import {
    UpdateMedicalReportApi,
    getMedicalReportApi,
} from '../../../../../../services/api'
import { setSnackBar } from '../../../../../../services/store/slices/generalSlice'
import { HealthFormValuesType } from '../../../../../../interface/medicalCertificate/HealthFormValuesType'
import BackButtonWithTitle from '../../../../../shared/BackButtonWithTitle'

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
            UpdateMedicalReportApi(values)
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
    })

    useEffect(() => {
        !isInitialDataLoadedRef.current &&
            (() => {
                isInitialDataLoadedRef.current = true
                getMedicalReportApi()
                    .then(r => {
                        formik.setValues(r?.data)
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
    }, [dispatch, formik, t])

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
        <div className="medical-declaration-container">
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
            <div className="medical-query">
                Do you have an existing illness or medical history?
            </div>
            <div className="chose-from">
                Please choose from the options if any health issues apply to
                you. This will help us make your journey smooth.
            </div>
            <form className="form-container" onSubmit={formik.handleSubmit}>
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
