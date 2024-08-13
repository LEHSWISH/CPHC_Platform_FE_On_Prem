import { Stepper, Step, StepLabel, Box} from '@mui/material'

function SharedStepper(props: SharedStepperProps) {
    const stepperCustomStyles = {
        width: '100%',
        height: '5rem',
        '& .Mui-active': {
            color: 'rgba(51, 24, 159, 1)',
            '&.MuiStepIcon-root': {
                fontSize: '28px',
                borderRadius: '50%',
                border: '4px solid white',
                color: 'rgba(51, 24, 159, 1)',
                boxShadow: '0px 0px 5px 0px rgba(51, 24, 159, 0.35)',
            },
            '& .MuiStepConnector-line': {
                borderColor: 'rgba(51, 24, 159, 1)',
                borderWidth: '1px',
                borderStyle: 'dashed',
            },
        },
        '& .Mui-completed': {
            color: 'rgba(51, 125, 56, 1)',
            '& .MuiStepIcon-root': {
                fontSize: '28px',
                color: 'rgba(51, 125, 56, 1)',
                border: '4px solid white',
                borderRadius: '50%',
                boxShadow: '0px 0px 5px 0px rgba(51, 125, 56, 0.35)',
            },
            '& .MuiStepConnector-line': {
                borderColor: 'rgba(51, 24, 159, 1)',
                borderWidth: '1px',
                borderStyle: 'dashed'
            },
        },
        '& .Mui-disabled': {
            color: 'rgba(108, 105, 105, 0.5)',
            top: '11px',
            '& .MuiStepIcon-root': {
                fontSize: '28px',
                color: 'rgba(108, 105, 105, 0.5)',
                border: '4px solid white',
                borderRadius: '50%',
                boxShadow: '0px 0px 5px 0px rgba(108, 105, 105, 0.35)',
            },
            '& .MuiStepConnector-line': {
                borderColor: 'rgba(51, 24, 159, 1)',
                borderWidth: '1px',
                borderStyle: 'dashed'
            },
        },
    }

    // const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
    //     ['& .Mui-active']: {
    //       ['& .MuiStepConnector-line']: {
    //         backgroundImage: `
    //           repeating-linear-gradient(
    //             0deg,
    //             ${theme.palette.primary.main}, // Dot color
    //             ${theme.palette.primary.main} 2px, // Dot width
    //             transparent 2px,
    //             transparent 10px // Gap width, adjust as needed
    //           )`,
    //         backgroundSize: '2px 20px', // Adjust the height to match the desired line thickness
    //         backgroundRepeat: 'repeat-x',
    //         backgroundPosition: 'center',
    //         height: '2px', // Adjust to control the thickness of the dotted line
    //       },
    //     },
    //     ['& .Mui-completed']: {
    //         ['& .MuiStepConnector-line']: {
    //         backgroundImage: `
    //           repeating-linear-gradient(
    //             0deg,
    //             red, // Dot color
    //             yellow 2px, // Dot width
    //             transparent 2px,
    //             transparent 10px // Gap width, adjust as needed
    //           )`,
    //         backgroundSize: '2px 20px', // Adjust the height to match the desired line thickness
    //         backgroundRepeat: 'repeat-x',
    //         backgroundPosition: 'center',
    //         height: '2px', // Adjust to control the thickness of the dotted line
    //       },
    //     },
    //   }));
      

    // const theme = createTheme({
    //     components: {
    //         MuiStepConnector: {
    //             styleOverrides: {
    //                 line: {
    //                     // Target the line
    //                     borderColor: 'rgba(51, 24, 159, 1)',
    //                     borderWidth: '1px',
    //       borderStyle: 'dotted', // Set the line to be dotted
    //       borderRadius: '0', // Change the line color
    //                 },
    //             },
    //         },
    //     },
    // })

    return (
        // <ThemeProvider theme={theme}>
            <Box 
            sx={stepperCustomStyles}
            >
                <Stepper activeStep={props.activeStep} alternativeLabel 
                    // connector={<CustomStepConnector />}
                >
                    {props.steps.map((label: string) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        // </ThemeProvider>
    )
}

export default SharedStepper

interface SharedStepperProps {
    steps: Array<string>
    activeStep: number
}
