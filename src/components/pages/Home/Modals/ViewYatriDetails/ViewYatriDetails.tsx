import { useAppSelector } from '../../../../../utils/hooks/useAppSelector'
import './ViewYatriDetails.styles.scss'
import {
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material'

function ViewYatriDetails() {
    const yatriDetails = useAppSelector(
        state => state.yatri.yatriAllDetails.data?.yatriDetails,
    )

    return (
        <div className="yatri-details-container">
            <div className="yatri-details-title">Your Yatri details</div>
            <div className="form-fields">
                <TextField
                    type="text"
                    label="First Name"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your First Name"
                    value={yatriDetails?.firstName}
                    variant="standard"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                />
                <TextField
                    type="text"
                    label="Last Name"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your Last Name"
                    value={yatriDetails?.lastName}
                    variant="standard"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                />

                <TextField
                    type="email"
                    label="Email Address"
                    id="email"
                    name="email"
                    placeholder="Enter your Email Address"
                    value={yatriDetails?.emailId}
                    variant="standard"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                />
                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                        Gender
                    </FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        <FormControlLabel
                            value="female"
                            control={
                                <Radio
                                    checked={yatriDetails?.gender === 'Female'}
                                />
                            }
                            label="Female"
                        />
                        <FormControlLabel
                            value="male"
                            control={
                                <Radio
                                    checked={yatriDetails?.gender === 'Male'}
                                />
                            }
                            label="Male"
                        />
                        <FormControlLabel
                            value="other"
                            control={
                                <Radio
                                    checked={yatriDetails?.gender === 'Other'}
                                />
                            }
                            label="Other"
                        />
                    </RadioGroup>
                </FormControl>

                <TextField
                    type="text"
                    label="Date of Birth"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    placeholder="DD/MM/YYYY"
                    value={yatriDetails?.dateOfBirth}
                    variant="standard"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                />
                <div
                    style={{
                        width: '90%',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <TextField
                        type="text"
                        label="Tour Start Date"
                        id="tourStartDate"
                        name="tourStartDate"
                        placeholder="DD/MM/YYYY"
                        value={yatriDetails?.tourStartDate}
                        variant="standard"
                        margin="normal"
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <TextField
                        type="text"
                        label="Tour End Date"
                        id="tourEndDate"
                        name="tourEndDate"
                        placeholder="DD/MM/YYYY"
                        value={yatriDetails?.tourEndDate}
                        variant="standard"
                        margin="normal"
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <TextField
                        type="text"
                        label="Tour Duration"
                        id="tourDuration"
                        name="tourlDuration"
                        placeholder="0"
                        value={`${yatriDetails?.tourDuration} days`}
                        variant="standard"
                        margin="normal"
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ViewYatriDetails
