import './ComingSoon.styles.scss'
import ComingSoonImage from '../../../assets/Images/Background_Welcome_Page.svg'

function ComingSoon() {
    return (
        <div className="coming-soon-outer-container">
            <div className="coming-soon-inner-container">
                <p className="title">e-Swasthya Dham</p>
                <p className="sub-title">
                    Get ready to embark on a journey to wellness!
                </p>
                <p className="message">Coming Soon...</p>
            </div>
            <div className="img-container">
                <img src={ComingSoonImage} alt="temple-background" />
            </div>
        </div>
    )
}

export default ComingSoon
