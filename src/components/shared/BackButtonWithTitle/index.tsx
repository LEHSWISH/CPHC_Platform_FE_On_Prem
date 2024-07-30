import { ChevronLeft } from '@mui/icons-material'
import { Button } from '@mui/material'
import './back-button-with-title.scss'

const BackButtonWithTitle = ({
    onBack,
    titleElement,
    backButtonChildElement = 'Back',
}: {
    onBack: () => void
    titleElement?: React.ReactNode
    backButtonChildElement?: React.ReactNode
}) => {
    return (
        <div className="back-button-wrapper-container">
            <div className="back-button-div">
                <Button
                    className="back-button"
                    variant="contained"
                    color="inherit"
                    startIcon={<ChevronLeft />}
                    onClick={onBack}
                >
                    {backButtonChildElement}
                </Button>
            </div>
            {titleElement && (
                <div className="title-container">{titleElement}</div>
            )}
        </div>
    )
}

export default BackButtonWithTitle
