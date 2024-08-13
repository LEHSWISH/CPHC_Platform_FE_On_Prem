import {
    Accordion as MuiAccordion,
    AccordionDetails,
    AccordionSummary,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
    styled,
    AccordionProps,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import './ViewTripDetails.styles.scss'
import { useAppSelector } from '../../../../../utils/hooks/useAppSelector'
import CardBackdrop from '../../../../shared/CardBackdrop/CardBackdrop'

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

function ViewTripDetails() {
    const yatriDetails = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.yatriDetails,
    )

    return (
        <CardBackdrop isOpenedByNavigation>
            <div className="view-trip-details-container">
                <div className="heading">Yatri details</div>
                <div className="body">
                    <form>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                Personal details
                            </AccordionSummary>
                            <AccordionDetails className="accordion-details">
                                <TextField
                                    disabled
                                    className="field"
                                    type="text"
                                    label="Full Name"
                                    id="fullName"
                                    name="fullName"
                                    value={yatriDetails?.fullName || ''}
                                    variant="standard"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                                <TextField
                                    disabled
                                    className="field"
                                    type="date"
                                    label="Date of Birth"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={
                                        yatriDetails?.dateOfBirth
                                            ?.split('/')
                                            ?.reverse()
                                            ?.join('-') || ''
                                    }
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                                <RadioGroup
                                    value={yatriDetails?.gender || ''}
                                    name="gender"
                                    className="field radio-group"
                                >
                                    <FormLabel>Gender</FormLabel>
                                    <FormControlLabel
                                        value="Female"
                                        disabled
                                        control={<Radio />}
                                        label="Female"
                                    />
                                    <FormControlLabel
                                        value="Male"
                                        disabled
                                        control={<Radio />}
                                        label="Male"
                                    />
                                    <FormControlLabel
                                        value="Other"
                                        disabled
                                        control={<Radio />}
                                        label="Other"
                                    />
                                </RadioGroup>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                Contact details
                            </AccordionSummary>

                            <AccordionDetails className="accordion-details">
                                <TextField
                                    disabled
                                    className="field"
                                    type="email"
                                    label="Email Address"
                                    id="email"
                                    name="email"
                                    value={yatriDetails?.emailId || ''}
                                    variant="standard"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </AccordionDetails>
                        </Accordion>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                Address
                            </AccordionSummary>
                            <AccordionDetails className="accordion-details">
                                <TextField
                                    disabled
                                    className="field"
                                    type="text"
                                    label="Address"
                                    id="address"
                                    name="address"
                                    value={yatriDetails?.address || ''}
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                                <TextField
                                    disabled
                                    className="field"
                                    type="text"
                                    label="Pincode"
                                    id="pincode"
                                    name="pincode"
                                    value={yatriDetails?.pinCode || ''}
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    inputMode="numeric"
                                />
                                <TextField
                                    disabled
                                    className="field"
                                    type="text"
                                    label="District"
                                    id="district"
                                    name="district"
                                    value={yatriDetails?.district || ''}
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                                <TextField
                                    disabled
                                    className="field"
                                    type="text"
                                    label="State"
                                    id="state"
                                    name="state"
                                    value={yatriDetails?.state || ''}
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </AccordionDetails>
                        </Accordion>
                        <Accordion defaultExpanded className="accordion-4">
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                Tour details
                            </AccordionSummary>

                            <AccordionDetails className="accordion-details">
                                <TextField
                                    disabled
                                    className="field three"
                                    type="date"
                                    label="Tour Start Date"
                                    id="tourStartDate"
                                    name="tourStartDate"
                                    value={
                                        yatriDetails?.tourStartDate
                                            ?.split('/')
                                            ?.reverse()
                                            ?.join('-') || ''
                                    }
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                                <TextField
                                    disabled
                                    className="field three"
                                    type="date"
                                    label="Tour End Date"
                                    id="tourEndDate"
                                    name="tourEndDate"
                                    value={
                                        yatriDetails?.tourEndDate
                                            ?.split('/')
                                            ?.reverse()
                                            ?.join('-') || ''
                                    }
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                                <TextField
                                    disabled
                                    className="field three"
                                    type="text"
                                    label="Tour Duration"
                                    id="tourDuration"
                                    name="tourDuration"
                                    value={yatriDetails?.tourDuration || ''}
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </AccordionDetails>
                        </Accordion>
                    </form>
                </div>
            </div>
        </CardBackdrop>
    )
}

export default ViewTripDetails
