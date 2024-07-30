import { FormGroup, TextField, useMediaQuery } from '@mui/material'
import { useFormik } from 'formik'
import CustomCheckboxContainer from '../../../shared/CustomCheckboxContainer/CustomCheckboxContainer'
import './FetchDocuments.scss'
import linkMedicalRecords from '../../../../services/api/linkMedicalRecordsM3'
import BackButtonWithTitle from '../../../shared/BackButtonWithTitle'
import { ChangeEvent, useState } from 'react'

function FetchDocuments(props: FetchDocumentsPropType) {
    const [showValidationMessage, setShowValidationMessage] = useState<boolean>(false)
    const isDesktop = useMediaQuery('(min-width: 480px)')
    const formik = useFormik({
        initialValues: {
            purposeOfRequest: 'Self Requested',
            healthInfoStart: '',
            healthInfoTo: '',
            consentExpiry: '',
            OPConsultation: false,
            DiagnosticReport: false,
            DischargeSummary: false,
            Prescription: false,
            ImmunizationRecord: false,
            HealthDocumentRecord: false,
            WellnessRecord: false,
        },
        validate: values => {
            const errors: any = {}

            if (!values.healthInfoStart) {
                errors.healthInfoStart = 'Health info from date is required'
            }

            if (!values.healthInfoTo) {
                errors.healthInfoTo = 'Health info to date is required'
            }

            // if (values.healthInfoStart && values.healthInfoTo) {
            //     const startDate = new Date(values.healthInfoStart)
            //     const endDate = new Date(values.healthInfoTo)

            //     if (startDate >= endDate) {
            //         errors.healthInfoTo = 'End date must be after start date'
            //     }
            // }
            if (!values.consentExpiry) {
                errors.consentExpiry = 'Required consent expiry'
            }
            if (values.consentExpiry) {
                const today = new Date()
                const consentExpiryDate = new Date(values.consentExpiry)

                if (consentExpiryDate < today) {
                    errors.consentExpiry =
                        'Consent expiry date can only be a future date'
                }
            }

            return errors
        },
        onSubmit: values => {
            const keysToExclude = [
                'purposeOfRequest',
                'consentExpiry',
                'healthInfoTo',
                'healthInfoStart',
            ]

            const areAllCheckboxesFalse = [
                values.OPConsultation,
                values.DiagnosticReport,
                values.DischargeSummary,
                values.Prescription,
                values.ImmunizationRecord,
                values.HealthDocumentRecord,
                values.WellnessRecord,
            ].every(val => val === false);
    
            if (areAllCheckboxesFalse) {
                setShowValidationMessage(true)
                return;
            }

            const filteredKeys = Object.entries(values)
                .filter(
                    ([key, val]) =>
                        !keysToExclude.includes(key) && val === true,
                )
                .map(entry => entry[0])
            const healthInfoTo =
                new Date().toISOString().split('T')[0] === values.healthInfoTo
                    ? new Date().toISOString()
                    : new Date(`${values.healthInfoTo}T23:59:59`).toISOString()

            linkMedicalRecords
                .sendRequest({
                    dataEraseAt: new Date(values.consentExpiry).toISOString(),
                    dateRange: {
                        from: new Date(values.healthInfoStart).toISOString(),
                        to: healthInfoTo,
                    },
                    hiTypes: filteredKeys,
                })
                .then(() => {
                    props.closeModal()
                })
                .catch(err => {
                    console.log(err)
                })
        },
    })

    const selectData = [
        {
            name: 'OPConsultation',
            label: 'OP Consultation',
            checked: formik.values.OPConsultation,
        },
        {
            name: 'DiagnosticReport',
            label: 'Diagnostic Reports',
            checked: formik.values.DiagnosticReport,
        },
        {
            name: 'DischargeSummary',
            label: 'Discharge Summary',
            checked: formik.values.DischargeSummary,
        },
        {
            name: 'Prescription',
            label: 'Prescription',
            checked: formik.values.Prescription,
        },
        {
            name: 'ImmunizationRecord',
            label: 'Immunization Record',
            checked: formik.values.ImmunizationRecord,
        },
        {
            name: 'HealthDocumentRecord',
            label: 'Health Document Record',
            checked: formik.values.HealthDocumentRecord,
        },
        {
            name: 'WellnessRecord',
            label: 'Wellness Record',
            checked: formik.values.WellnessRecord,
        },
    ]

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(event.target.name, event.target.checked);
        const checkboxNames = [
            'OPConsultation',
            'DiagnosticReport',
            'DischargeSummary',
            'Prescription',
            'ImmunizationRecord',
            'HealthDocumentRecord',
            'WellnessRecord',
        ];

        const anyChecked = checkboxNames.some((name: string) => {
            if (name === event.target.name) return event.target.checked;
            return formik.values[name as keyof FetchDocumentsFormValueType];
        });

        setShowValidationMessage(!anyChecked);
    };

    // const addOneDay = (dateStr: any) => {
    //     const date = new Date(dateStr);
    //     date.setDate(date.getDate() + 1);
    //     return date.toISOString().split('T')[0];
    // }

    return (
        <>
            <div className="fetch-documents">
                <span className="heading">
                    <span className="back-button-mobile-div">
                        <BackButtonWithTitle
                            onBack={() => props.setBtnPerform(false)}
                            backButtonChildElement={
                                <span className="backbutton">Back</span>
                            }
                        />
                    </span>
                    Fetch Records
                </span>
                <div className="fetch-document-paragraph">
                    <div className="paragraph">
                        Send request to your Personal Health Record app (e.g.
                        DigiLocker, Aarogya Setu) to view your linked medical
                        records.
                    </div>
                </div>
                <form
                    action=""
                    className="form"
                    onSubmit={formik.handleSubmit}
                    autoComplete="off"
                >
                    <div className="field-mobile-view">
                        <TextField
                            required
                            type="text"
                            label="Purpose of request"
                            id="purposeOfRequest"
                            name="purposeOfRequest"
                            className="textfield-width-update"
                            placeholder="Self Requested"
                            onBlur={formik.handleBlur}
                            // style={{
                            //     width: '45%'
                            // }}
                            onChange={formik.handleChange}
                            value={formik.values.purposeOfRequest}
                            // helperText={
                            //     ' '
                            // }
                            variant="standard"
                            margin="normal"
                            disabled
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                                style: { color: '#6C6969' },
                            }}
                        />
                        <TextField
                            required
                            type="date"
                            label="Consent Expiry"
                            id="consentExpiry"
                            name="consentExpiry"
                            className="textfield-width-update"
                            placeholder=""
                            inputProps={{
                                min: tomorrow.toISOString().split('T')[0], // Set min date to today + 1
                            }}
                            onChange={formik.handleChange}
                            helperText={
                                formik.touched.consentExpiry &&
                                formik.errors.consentExpiry
                            }
                            error={
                                !!(
                                    formik.touched.consentExpiry &&
                                    formik.errors.consentExpiry
                                )
                            }
                            onBlur={formik.handleBlur}
                            // style={{
                            //     width: '45%'
                            // }}

                            value={formik.values.consentExpiry}
                            variant="standard"
                            margin="normal"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                                style: { color: '#6C6969' },
                            }}
                        />
                    </div>
                    <div className="field">
                        <TextField
                            required
                            type="date"
                            label="Health info from"
                            id="healthInfoStart"
                            name="healthInfoStart"
                            className="textfield-width-update"
                            placeholder=""
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={
                                formik.touched.healthInfoStart &&
                                formik.errors.healthInfoStart
                            }
                            error={
                                !!(
                                    formik.touched.healthInfoStart &&
                                    formik.errors.healthInfoStart
                                )
                            }
                            value={formik.values.healthInfoStart}
                            // style={{
                            //     width: '45%',
                            // }}
                            variant="standard"
                            margin="normal"
                            // required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                                style: { color: '#6C6969' },
                            }}
                            inputProps={{
                                max: new Date().toISOString().split('T')[0],
                            }}
                        />
                        <TextField
                            required
                            type="date"
                            label="Health info to"
                            id="healthInfoTo"
                            name="healthInfoTo"
                            className="textfield-width-update"
                            placeholder=""
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={
                                formik.touched.healthInfoTo &&
                                formik.errors.healthInfoTo
                            }
                            error={
                                !!(
                                    formik.touched.healthInfoTo &&
                                    formik.errors.healthInfoTo
                                )
                            }
                            value={formik.values.healthInfoTo}
                            // style={{
                            //     width: '45%',
                            // }}
                            variant="standard"
                            margin="normal"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                                style: { color: '#6C6969' },
                            }}
                            inputProps={{
                                min: formik.values.healthInfoStart,
                                max: new Date().toISOString().split('T')[0],
                            }}
                        />
                    </div>
                    {/* <div className='field'> */}

                    {/* </div> */}
                    <label htmlFor="" className="health-info-heading">
                        {isDesktop
                            ? 'Document Type'
                            : 'Health information Type'}
                        <span className="asterik"> *</span>
                    </label>
                    <FormGroup className={`form-group`}>
                        {// isLoading ? (
                        //     <CircularProgress
                        //         sx={{ marginX: 'auto' }}
                        //         color="primary"
                        //         variant="indeterminate"
                        //     />
                        // ) :
                        selectData?.map(checkboxData => (
                            <CustomCheckboxContainer
                                key={checkboxData.name}
                                name={checkboxData.name}
                                label={checkboxData.label}
                                checked={!!checkboxData.checked}
                                onChange={handleCheckboxChange}
                            />
                        ))}
                    </FormGroup>
                    {showValidationMessage && (
                        <div className="checkbox-validation-message">
                            Please select atleast one Document Type
                        </div>
                    )}
                    <div className="c-btn">
                        <button type="submit" className="btn-req">
                            {' '}
                            Send Request
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export interface FetchDocumentsPropType {
    setBtnPerform: (val: boolean) => void
    closeModal: () => void
}

interface FetchDocumentsFormValueType {
    purposeOfRequest: string
    healthInfoStart: string
    healthInfoTo: string
    consentExpiry: string
    OPConsultation: boolean
    DiagnosticReport: boolean
    DischargeSummary: boolean
    Prescription: boolean
    ImmunizationRecord: boolean
    HealthDocumentRecord: boolean
    WellnessRecord: boolean
}

export default FetchDocuments
