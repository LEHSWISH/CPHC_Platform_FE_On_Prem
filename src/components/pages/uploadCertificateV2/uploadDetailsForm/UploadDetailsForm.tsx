import {
    Button,
    Checkbox,
    Chip,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    IconButton,
    TextField,
    Tooltip,
} from '@mui/material'
import { useFormik } from 'formik'
import GppGoodIcon from '@mui/icons-material/GppGood'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import './uploadDetailsForm.style.scss'
import closeSvgIcon from '../../../../assets/icons/Close.svg'
import { FileDetailsType } from '../../../../interface/medicalCertificate/FileDetailsType'
import { uploadDetailsFormvalidationSchema } from '../../../../utils/constants/validations'

interface medicalDocumentType {
    documentType: string
    label: string
    info: string
}

const medicalDocument: medicalDocumentType[] = [
    {
        documentType: 'DiagnosticReport',
        label: 'Diagnostic Report Record',
        info: 'The Clinical Artifact represents diagnostic reports including Radiology and Laboratory reports that can be shared across the health ecosystem.',
    },
    {
        documentType: 'DischargeSummary',
        label: 'Discharge Summary Record',
        info: 'Clinical document used to represent the discharge summary record for ABDM HDE data set.',
    },
    {
        documentType: 'HealthDocumentRecord',
        label: 'Health Document Record',
        info: 'The Clinical Artifact represents the unstructured historical health records as a single of multiple Health Record Documents generally uploaded by the patients through the Health Locker and can be shared across the health ecosystem.',
    },
    {
        documentType: 'ImmunizationRecord',
        label: 'Immunization Record',
        info: 'The Clinical Artifact represents the Immunization records with any additional documents such as vaccine certificate, the next immunization recommendations, etc. This can be further shared across the health ecosystem.',
    },
    {
        documentType: 'OPConsultation',
        label: 'OP Consult Record',
        info: 'The Clinical Artifact represents the outpatient visit consultation note which may include clinical information on any OP examinations, procedures along with medication administered, and advice that can be shared across the health ecosystem.',
    },
    {
        documentType: 'Prescription',
        label: 'Prescription Record',
        info: 'The Clinical Artifact represents the medication advice to the patient in compliance with the Pharmacy Council of India (PCI) guidelines, which can be shared across the health ecosystem.',
    },
    {
        documentType: 'WellnessRecord',
        label: 'Wellness Record',
        info: 'The Clinical Artifact represents regular wellness information of patients typically through the Patient Health Record (PHR) application covering clinical information such as vitals, physical examination, general wellness, women wellness, etc., that can be shared across the health ecosystem.',
    },
]

export interface UploadDetailsFormDataType {
    documentType: string
    hospitalLabName: string
    visitPurpose: string
    consent: boolean
}

const initialValues = {
    documentType: '',
    hospitalLabName: '',
    visitPurpose: '',
    consent: false,
}

interface UploadDetailsFormPropType {
    filesToBeUploadedList: FileDetailsType[]
    disabled?: boolean
    onBack: () => void
    onSubmit: (formData: UploadDetailsFormDataType) => void
    onDiscard: (i: number, isSaved?: boolean) => void
    fileValidationMessage?: string
}

const UploadDetailsForm = ({
    filesToBeUploadedList,
    disabled = false,
    onBack,
    onSubmit,
    onDiscard,
    fileValidationMessage,
}: UploadDetailsFormPropType) => {
    const {
        values,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        errors,
        touched,
    } = useFormik({
        initialValues,
        onSubmit,
        validationSchema: uploadDetailsFormvalidationSchema,
    })

    return (
        <div className="upload-details-form">
            <div className="card">
                <div className="card-title">Selected files</div>
                {filesToBeUploadedList.map((el, index) => {
                    const indexNumber = index + 1
                    return (
                        <div className="file-row-item" key={indexNumber}>
                            <div className="text">
                                {indexNumber}
                                {'. '}
                                {el.fileName}
                            </div>
                            <div className="icon-buttons-container">
                                <IconButton
                                    aria-label="discard"
                                    size="small"
                                    onClick={() => onDiscard(index)}
                                    disabled={disabled}
                                >
                                    <img src={closeSvgIcon} />
                                </IconButton>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="card">
                <div className="card-title">
                    Select document type <span className="asterisk">*</span>
                </div>

                <div className="chips-container">
                    {medicalDocument?.map((item, index) => {
                        return (
                            <Chip
                                key={index}
                                className={
                                    item.documentType === values.documentType
                                        ? 'selected'
                                        : ''
                                }
                                label={item.label}
                                variant="outlined"
                                onClick={() => {
                                    setFieldValue(
                                        'documentType',
                                        item?.documentType,
                                        true,
                                    )
                                }}
                                deleteIcon={
                                    <Tooltip
                                        title={item.info}
                                        placement="bottom"
                                        key={index}
                                    >
                                        <InfoOutlinedIcon color="primary" />
                                    </Tooltip>
                                }
                                onDelete={() => {}}
                            />
                        )
                    })}
                </div>
                <FormHelperText
                    className="validation-message"
                    children={touched.documentType && errors.documentType}
                    error={touched.documentType && !!errors.documentType}
                ></FormHelperText>
            </div>
            <div className="card">
                <div className="card-title">Document details<span className="asterisk">*</span></div>
                <div className="form-field-pair">
                    <TextField
                        disabled={disabled}
                        className="field"
                        type="text"
                        label="Hospital/Lab name"
                        id="hospitalLabName"
                        name="hospitalLabName"
                        placeholder="Enter Hospital/Lab name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.hospitalLabName}
                        helperText={
                            touched.hospitalLabName && errors.hospitalLabName
                        }
                        error={
                            touched.hospitalLabName && !!errors.hospitalLabName
                        }
                        variant="standard"
                        required
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        autoComplete="off"
                    />
                    <TextField
                        disabled={disabled}
                        className="field"
                        type="text"
                        label="Visit Purpose"
                        id="visitPurpose"
                        name="visitPurpose"
                        placeholder="E.g. Eye check-up, cough & cold"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.visitPurpose}
                        helperText={touched.visitPurpose && errors.visitPurpose}
                        error={touched.visitPurpose && !!errors.visitPurpose}
                        variant="standard"
                        required
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        autoComplete="off"
                    />
                </div>
            </div>
            <div className="card green">
                <GppGoodIcon className="good-icon" fontSize="large" />
                <div className="info">
                    <div className="text-1">
                        Your health data is 100% secure
                    </div>
                    <div className="text-2">
                        It is encrypted and cannot be shared without your
                        permission.
                    </div>
                </div>
            </div>

            <FormGroup className='checkbox-text'>
                <FormControlLabel 
                    required
                    control={
                        <Checkbox
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.consent}
                            name="consent"
                        />
                    }
                    label="I consent to share my above information with eSwasthya Dham"
                />
                <FormHelperText
                    className="validation-message"
                    children={touched.consent && errors.consent}
                    error={touched.consent && !!errors.consent}
                ></FormHelperText>
            </FormGroup>
            {fileValidationMessage && (
                <FormHelperText
                    className="validation-message"
                    children={fileValidationMessage}
                    error={true}
                ></FormHelperText>
            )}
            <div className="button-container">
                <Button
                    variant="contained"
                    className="white-button"
                    onClick={onBack}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    className="blue-button"
                    onClick={() => handleSubmit()}
                >
                    Upload & Submit
                </Button>
            </div>
        </div>
    )
}

export default UploadDetailsForm
