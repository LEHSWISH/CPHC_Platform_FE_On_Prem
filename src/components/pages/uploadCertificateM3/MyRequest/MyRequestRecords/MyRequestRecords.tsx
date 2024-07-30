import {
    Accordion as MuiAccordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    styled,
    AccordionProps,
    Chip,
    Chip as MuiChip,
    ChipProps,
    Tooltip,
} from '@mui/material'
import './MyRequestRecords.scss'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Declined, Granted, Initiated, Revoked } from '../../../../shared/Icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import useAuthorizationStatus from '../../../../../utils/hooks/useAuthorizationStatus'
import linkMedicalRecords from '../../../../../services/api/linkMedicalRecordsM3'
import FullPageLoader from '../../../../shared/FullPageLoader'
import { isAxiosError } from 'axios'
import { setSnackBar } from '../../../../../services/store/slices/generalSlice'
import { useDispatch } from 'react-redux'

interface CustomChipProps extends ChipProps {
    chipColor?: string
}

const CustomChip = styled(({ chipColor, ...otherProps }: CustomChipProps) => (
    <MuiChip {...otherProps} />
))(({ chipColor }) => ({
    ...(chipColor && {
        height: '28px',
        border: `1px solid ${chipColor}`,
        '& .MuiChip-deleteIcon': {
            color: chipColor,
            '&:hover': {
                color: chipColor,
            },
        },
        '& .MuiChip-label': {
            marginInline: '0px !important',
            color: `${chipColor} !important`,
            fontSize: '11px !important',
            lineHeight: '13px !important',
            paddingLeft: '4px',
        },
    }),
}))

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
    border: `1px solid rgba(51, 24, 159, 0.1)`,
    borderRadius: '1rem',
    '&:not(:last-child)': {
        marginTop: 15,
    },
    '&::before': {
        display: 'none',
    },
}))
const medicalDocument = [
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
function MyRequestRecord() {
    const [data, setData] = useState<any>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const dispatch = useDispatch()
    const { isYatriAuthLoading, isYatriAuthorized } = useAuthorizationStatus()
    const isDataInitializedFirstTimeRef = useRef(false)

    function formatDate(dateString: string) {
        const date = new Date(dateString)
        const day = date.getDate()
        const month = date.getMonth() + 1 // getMonth() returns 0-11
        const year = date.getFullYear().toString().slice(-2) // Get last 2 digits of year

        // Convert numbers to strings and pad single digits with leading zero
        const dayString = day < 10 ? '0' + day : day
        const monthString = month < 10 ? '0' + month : month

        return `${dayString}/${monthString}/${year}`
    }

    const getData = useCallback(() => {
        linkMedicalRecords
            .getConsentDb({})
            .then(res => {
                setData(res.data)
                setIsLoading(false)
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
                setIsLoading(false)
            })
    }, [dispatch])

    useEffect(() => {
        if (
            !isDataInitializedFirstTimeRef.current &&
            !isYatriAuthLoading &&
            isYatriAuthorized
        ) {
            isDataInitializedFirstTimeRef.current = true
            getData()
        }
    }, [getData, isYatriAuthLoading, isYatriAuthorized])

    const chipSelect = (status: string) => {
        switch (status.toUpperCase()) {
            case 'GRANTED':
                return (
                    <CustomChip
                        className="granted"
                        icon={<Granted />}
                        label="Granted"
                        chipColor="rgba(51, 125, 56, 1)"
                        variant="outlined"
                        sx={{ paddingLeft: '10px' }}
                    />
                )

            case 'DENIED':
                return (
                    <CustomChip
                        className="declined"
                        icon={<Declined />}
                        label="Declined"
                        chipColor="rgba(199, 65, 58, 1)"
                        variant="outlined"
                        sx={{ paddingLeft: '10px' }}
                    />
                )

            case 'REVOKED':
                return (
                    <CustomChip
                        className="revoked"
                        icon={<Revoked />}
                        label="Revoked"
                        chipColor="rgba(108, 105, 105, 1)"
                        variant="outlined"
                        sx={{ paddingLeft: '10px' }}
                    />
                )

            case 'INITIATED':
                return (
                    <CustomChip
                        className="initiated"
                        icon={<Initiated />}
                        label="Request initiated"
                        chipColor="rgba(255, 180, 42, 1)"
                        variant="outlined"
                        sx={{ paddingLeft: '10px' }}
                    />
                )

            default:
                return <></>
        }
    }

    return (
        <>
            {isLoading ? (
                <FullPageLoader />
            ) : (
                data.map((consent: any) =>
                        <Accordion
                            key={consent.id}
                            sx={{
                                borderRadius: '12px',
                                marginBottom: '16px',
                                background: 'white',
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <div className="request-record-container">
                                    <div className="request-row-one">
                                        Request ID:{' '}
                                        <span>{consent.id}</span>
                                        <div className="customChip">
                                            {chipSelect(consent.status)}
                                        </div>
                                    </div>
                                    <div className="request-row-two">
                                        <div className="document-duration">
                                            Document duration:{' '}
                                            <span>
                                                {formatDate(consent.dateFrom)}{' '}
                                                - {formatDate(consent.dateTo)}
                                            </span>
                                        </div>
                                        <Divider
                                            className="divider"
                                            orientation="vertical"
                                            variant="fullWidth"
                                            flexItem
                                        />
                                        <div className="consent-expiry">
                                            Consent Expiry:{' '}
                                            <span>
                                                {formatDate(
                                                    consent.dataEraseAt,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails className="accordian-details">
                                <div className="request-row-three">
                                    Document type:{' '}
                                    {consent.hiTypes.map((type: string) => {
                                        const chipData = medicalDocument.find(
                                            element =>
                                                element.documentType === type,
                                        )
                                        return (
                                            <Chip
                                                key={type}
                                                className="chip"
                                                label={chipData?.label || type}
                                                variant="outlined"
                                                deleteIcon={
                                                    <Tooltip
                                                        title={
                                                            chipData?.info ||
                                                            type
                                                        }
                                                        placement="bottom"
                                                        key={type}
                                                    >
                                                        <InfoOutlinedIcon color="primary" />
                                                    </Tooltip>
                                                }
                                                onDelete={() => {}}
                                            />
                                        )
                                    })}
                                </div>
                            </AccordionDetails>
                        </Accordion>
                )
            )}
        </>
    )
}
export default MyRequestRecord
