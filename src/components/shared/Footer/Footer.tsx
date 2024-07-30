import './Footer.scss'
import WishLogo from '../../../assets/Images/wish-logo.svg'
import { NavLink } from 'react-router-dom'
import { coreRoutesEnum } from '../../../enums/routingEnums'

function Footer(props: FooterPropsType) {
    return (
        <div className="footer-container">
            {props.variant === 'typeTwo' ? (
                <div className="contact-us">
                    Need help? &nbsp;
                    <NavLink
                        className="navigate"
                        to={`/${coreRoutesEnum.CONTACT_US}`}
                    >
                        Contact Us
                    </NavLink>
                </div>
            ) : (
                <div className="empty-div"></div> //Taken empty div for aligning logo to the right side.
            )}
            <div className="footer">
                <img src={WishLogo} alt="wish-foundation-logo" />
            </div>
        </div>
    )
}

interface FooterPropsType {
    variant?: string
}

export default Footer
