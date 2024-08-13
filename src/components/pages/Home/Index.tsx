import { Outlet, useNavigate } from 'react-router-dom'
import Footer from '../../shared/Footer/Footer'
import FAQs from './FAQs/FAQs'
import HomeRightContainer from './HomeRightContainer/HomeRightContainer'
import PilgrimUserGuide from './PilgrimUserGuide/PilgrimUserGuider'
import YatriDetails from './YatriDetails/YatriDetails'
import './Index.scss'
import React, { useEffect } from 'react'
import { setFullPageLoader } from '../../../services/store/slices/generalSlice'
import { useAppDispatch } from '../../../utils/hooks/useAppDispatch'
import LocatorPin from '../../../assets/icons/locator-pin.svg'
import LeftVector from '../../../assets/icons/left-vector.svg'
import { coreRoutesEnum } from '../../../enums/routingEnums'

function Home() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(setFullPageLoader(false))
    }, [dispatch])

    const locateFacility = (event: React.MouseEvent) => {
        event.preventDefault()
        navigate(`/${coreRoutesEnum.LOCATE_MEDICAL_FACILITY}`, { state: { fromHomePage: true } });
    }

    return (
        <>
            <div className="home-outer-container">
                <div className="home-inner-container">
                    <div className="yatri-outer-container">
                        <YatriDetails />
                    </div>
                    <div className="home-right-outer-container">
                        <HomeRightContainer />
                    </div>
                    <div className="faq-outer-container">
                        <div className="container-wrapper">
                            <div className="locate-facility" onClick={locateFacility}>
                                <div className="locate-facility-inner">
                                    <img src={LocatorPin} alt="locator-pin" />
                                    <span>Locate Medical Facility</span>
                                </div>
                                <img src={LeftVector} alt="left-vector" className='left-vector' />
                            </div>
                            <FAQs />
                        </div>
                    </div>
                    <div className="pilgrim-outer-container">
                        <PilgrimUserGuide />
                    </div>
                </div>
                <Footer />
            </div>
            <Outlet />
        </>
    )
}

export default Home
