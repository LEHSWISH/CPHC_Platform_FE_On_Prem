import './SigninV2.styles.scss'
import Image1 from '../../../assets/Images/Char_Dham_Badrinath.png'
import Image2 from '../../../assets/Images/Gangotri banner 2.jpg'
import Image3 from '../../../assets/Images/Yamunotri_under banner image 1.jpg'
import Carousel from '../../shared/Carousel/Carousel'
import SigninFormV2 from './SigninFormV2'

function SigninV2() {
    const slides = [
        Image1,
        Image2,
        Image3,
        // Add more slide URLs as needed
    ];
    return (
        <>
            <Carousel slides={slides} />
            <div className="signin-background">
                <div className="container-wrapper">
                    <div className="form-container">
                        <SigninFormV2 />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SigninV2