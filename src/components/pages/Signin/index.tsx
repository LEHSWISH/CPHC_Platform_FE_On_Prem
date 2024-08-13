import './Signin.styles.scss'
import SigninForm from './SigninForm/SigninForm'
import Image1 from '../../../assets/Images/Char_Dham_Badrinath.png'
import Image2 from '../../../assets/Images/Gangotri banner 2.jpg'
import Image3 from '../../../assets/Images/Yamunotri_under banner image 1.jpg'
import Image4 from '../../../assets/Images/image 11 (1).png'
import Carousel from '../../shared/Carousel/Carousel'
function Signin() {
    const slides = [
        Image1,
        Image2,
        Image3,
        Image4
        // Add more slide URLs as needed
    ];
    return (
        <>
            <Carousel slides={slides} />
            <div className="signin-background">
                <div className="container-wrapper">
                    <div className="form-container">
                        <SigninForm />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signin