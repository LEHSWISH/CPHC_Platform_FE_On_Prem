import { Stepper, Step, StepLabel, Box, Tooltip } from '@mui/material'

function SharedVerticalStepper(props: SharedVerticalStepperProps) {
    const stepperCustomStyles = {
        height: '100%',
        width: '100%',
        '& .Mui-active': {
            color: 'rgba(51, 24, 159, 1)',
            fontSize: '24px',
            '&.MuiStepIcon-root': {
                borderRadius: '50%',
                border: '2px solid white',
                color: 'rgba(51, 24, 159, 1)',
                boxShadow: '0px 0px 5px 0px rgba(51, 24, 159, 0.35)',
            },
            '& .MuiStepConnector-line': {
                marginRight: '1px',
                borderColor: 'rgba(51, 24, 159, 0.5)',
                borderWidth: '2px',
                borderRadius: '2px',
            },
        },
        '& .Mui-completed': {
            color: 'rgba(51, 125, 56, 1)',
            fontSize: '24px',
            '& .MuiStepIcon-root': {
                color: 'rgba(51, 125, 56, 1)',
                border: '2px solid white',
                borderRadius: '50%',
                boxShadow: '0px 0px 5px 0px rgba(51, 125, 56, 0.35)',
            },
            '& .MuiStepConnector-line': {
                marginRight: '1px',
                borderColor: 'rgba(51, 125, 56, 1)',
                borderWidth: '2px',
                borderRadius: '2px',
            },
        },
        '& .Mui-disabled': {
            color: 'rgba(108, 105, 105, 0.5)',
            fontSize: '24px',
            '& .MuiStepIcon-root': {
                color: 'rgba(108, 105, 105, 0.5)',
                border: '2px solid white',
                borderRadius: '50%',
                boxShadow: '0px 0px 5px 0px rgba(108, 105, 105, 0.35)',
            },
            '& .MuiStepConnector-line': {
                marginRight: '1px',
                borderColor: 'rgba(108, 105, 105, 0.5)',
                borderWidth: '2px',
                borderRadius: '2px',
            },
        },
    }

    return (
        <Box sx={stepperCustomStyles}>
            <Stepper activeStep={props.activeStep} orientation="vertical">
                {props.steps.map((label: string, index: number) => (
                    <Step key={index}>
                        <StepLabel>
                            <Tooltip title={label}>
                                <span style={{fontSize: '14px'}}>{label}</span>
                            </Tooltip>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    )
}

export default SharedVerticalStepper

interface SharedVerticalStepperProps {
    steps: Array<string>
    activeStep: number
}
