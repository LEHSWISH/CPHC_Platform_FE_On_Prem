import Footer from '../../shared/Footer/Footer'
// import ServicesCard from '../Home/ServicesCard/ServicesCard'
import { useState } from 'react'
import './index.styles.scss'
import UttarakhandSimplyHeavenLogo from '../../../assets/Images/uttarakhand-simply-heaven-logo.png'
import AadharLogo from '../../../assets/Images/aadhar.svg'
import ChooseAbhaCard from './ChooseAbhaCreateCard/ChooseAbhaCard'
import { Outlet, useNavigate } from 'react-router-dom'
import {
    coreRoutesEnum,
    nestedRoutePathsEnum,
} from '../../../enums/routingEnums'
import LeftVector from '../../../assets/icons/left-vector.svg'
import InfoIcon from '../../../assets/icons/Vector.svg'
import CreateViaAadhaar from './Modals/CreateViaAadhaar/CreateViaAadhaar'
import CardBackdrop from '../../shared/CardBackdrop/CardBackdrop'
import AbhaCardDetails from './AbhaCardDetails/AbhaCardDetails'
import { useAppSelector } from '../../../utils/hooks/useAppSelector'
import AbhaInfo from './Modals/AbhaInfo/AbhaInfo'
import { useAppDispatch } from '../../../utils/hooks/useAppDispatch'
import { loadYatriAllData } from '../../../services/store/slices/yatriSlice'
import BackButtonWithTitle from '../../shared/BackButtonWithTitle'
// import RegisteredUserLinkAbha from '../../modals/RegisteredUserLinkAbhaModal/RegisteredUserLinkAbha'

function CreateAbhaNumber() {
  const dispatch = useAppDispatch()
  const [createViaAadhaarModal, setCreateViaAadhaarModal] =
    useState<boolean>(false)
  const [abhaCardCreated, setAbhaCardCreated] = useState<boolean>(false)
  const openAbhaCard = () => {
    setAbhaCardCreated(true)
    dispatch(loadYatriAllData())
  }
  const [abhaInfo, setAbhaInfo] = useState<boolean>(false)
  const [stepForCreateAbha, setStepForCreateAbha] = useState<number>(0)
  const navigate = useNavigate()
  const abhaUserDetails = useAppSelector(s => s.yatri.yatriAllDetails.data?.abhaUserDetails)

  const handleCurrentStep = (step: number) => {
    // Updating step to toggle close button visibility
    setStepForCreateAbha(step)
  }

  return (
    <>
      <div className="create-abha-v2">
        <div className="breadcrumbs"><span onClick={() => {
          navigate(`${coreRoutesEnum.HOME}`)
        }}>eSwasthya Dham</span> <img src={LeftVector} className='left-vector' alt="" /> <span className='active-breadcrumb'>ABHA</span></div>
        {!abhaCardCreated && !abhaUserDetails ? (
          <>
            <div className="create-abha-number">
              <h2 className="heading"><span className="home-button-mobile" > 
            <BackButtonWithTitle onBack={() => {
          navigate(`${coreRoutesEnum.HOME}`)
        }} backButtonChildElement={<span className='backbutton'>Home</span>}/>
            </span>Create ABHA</h2>
              <p className="description">
                Please choose one of the below option to start with the
                creation of your ABHA
              </p>
              <div className="choose-container">
                {/* <div className="each-card"> */}
                <ChooseAbhaCard
                  imageUrl={AadharLogo}
                  heading="Aadhaar"
                  text="Create your ABHA using Aadhaar"
                  secondaryText=' '
                  action="Create"
                  onClickFunction={() =>
                    setCreateViaAadhaarModal(true)
                  }
                ></ChooseAbhaCard>
                {createViaAadhaarModal && (
                  <CardBackdrop
                    setClose={() => setCreateViaAadhaarModal(false)}
                    showClose={stepForCreateAbha === 0 ? true : false}
                  >
                    <CreateViaAadhaar currentStep={handleCurrentStep} openAbhaCard={openAbhaCard} onClose={() => setCreateViaAadhaarModal(false)} />
                  </CardBackdrop>
                )}
                <ChooseAbhaCard
                  imageUrl={UttarakhandSimplyHeavenLogo}
                  heading="Tourism Portal ID"
                  text="Create your ABHA using Tourism Portal ID"
                  secondaryText='(Demographic authentication)'
                  action="Create"
                  onClickFunction={() => {
                    navigate(`${nestedRoutePathsEnum.CREATE_ABHA_WITH_TP_ID}`)
                  }}
                ></ChooseAbhaCard>
                {/* </div> */}
              </div>
              <div className="already-have-abha">
                Already have ABHA? <span className='link-abha' onClick={() => {
                  navigate(`/${coreRoutesEnum.LINK_ABHA}`)
                }}>Link ABHA</span>
              </div>
              <div className="know-more-about-abha">
                <img src={InfoIcon} className='abha-info-icon' alt=""  onClick={() => setAbhaInfo(true)}/>
                Know more about ABHA
              </div>
              {abhaInfo && (
                <CardBackdrop setClose={() => setAbhaInfo(false)}>
                  <AbhaInfo />
                </CardBackdrop>
              )}
            </div>
          </>
      //   ) : abhaUserDetails && abhaUserDetails?.abhaVerified ? (
      //     <AbhaCardDetails />
      //   )  : (
      //     <CardBackdrop
      //     isOpenedByNavigation={true}
      // >
      //     <RegisteredUserLinkAbha />
      // </CardBackdrop>
      //   )}
      ) : (
        <AbhaCardDetails />
      )}
      <Footer />
      </div>
      <Outlet />
    </>
  )
}

export default CreateAbhaNumber
