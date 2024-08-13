import './ContactPage.styles.scss'
import ContactUs from './ContactUs'
import Image1 from '../../../assets/Images/Char_Dham_Badrinath.png'
import Image2 from '../../../assets/Images/Gangotri banner 2.jpg'
import Image3 from '../../../assets/Images/Yamunotri_under banner image 1.jpg'
import Carousel from '../../shared/Carousel/Carousel'
import { useNavigate } from 'react-router-dom'

const slides = [
    Image1,
    Image2,
    Image3,
]

function ContactPage() {
    const navigate = useNavigate()

    const handleBackNavigate = () => {
        navigate(-1)
    }

    return (
        <>
            <Carousel slides={slides} />
            <div className="contact-us-background">
                <div className="container-wrapper">
                    <div className="form-container">
                        <ContactUs goBack={handleBackNavigate} closeButton />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactPage
