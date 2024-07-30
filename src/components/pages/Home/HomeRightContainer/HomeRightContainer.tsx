import './HomeRightContainer.scss'
import ServicesCard from '../ServicesCard/ServicesCard'
import AbhaImage from '../../../../assets/Images/abhaImageHome.svg'
import MedicalServicesIcon from '../../../../assets/Images/medical_services.svg'
import VitalsIcon from '../../../../assets/Images/vitalsIcon.svg'
import { useAppSelector } from '../../../../utils/hooks/useAppSelector'
import CardBackdrop from '../../../shared/CardBackdrop/CardBackdrop'
import { useState } from 'react'
import AbhaPending from '../../CreateAbhaV2/Modals/AbhaPending/AbhaPending'
import { useNavigate } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../enums/routingEnums'

function HomeRightContainer() {
    const yatriData = useAppSelector(state => {
        return state.yatri.yatriAllDetails.data
    })
    const navigate = useNavigate()
    const [abhaPendingModal, setabhaPendingModal] = useState<boolean>(false)

    const closeAbhaModal = () => setabhaPendingModal(false)
    {/* Commmented this if asked to revert it back */}
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         if (
    //             yatriData?.yatriDetails &&
    //             !yatriDataIsLoading &&
    //             !isYatriAuthLoading &&
    //             yatriData?.abhaUserDetails === null &&
    //             !location.pathname.includes('create-abha')
    //         ) {
    //             setabhaPendingModal(true)
    //         }
    //     }, 10000)
    //     return () => clearTimeout(timer)
    // }, [
    //     yatriData?.abhaUserDetails,
    //     location,
    //     yatriDataIsLoading,
    //     isYatriAuthLoading,
    //     yatriData?.yatriDetails,
    // ])
    const openMedicalCertificateModal = () => navigate(`/${coreRoutesEnum.MEDICAL_RECORDS}`)

    return (
        <>
            {abhaPendingModal ? (
                <CardBackdrop
                    showClose={false}
                    setClose={() => closeAbhaModal()}
                >
                    <AbhaPending callClose={closeAbhaModal} />
                </CardBackdrop>
            ) : (
                <div className="home-right">
                    <h2 className="welcome-text">Welcome to eSwasthya Dham!</h2>
                    <p className="home-description">Experience a Swasth Satark and Safal Yatra with our dedicated health support in every turn. Your wellness is our priority.
                    </p>
                    <div className="services-text">Services</div>
                    <div className="services">
                        <ServicesCard
                            heading="ABHA"
                            imageUrl={AbhaImage}
                            text="Ayushman Bharat Health Account"
                            // status={
                            //     yatriData?.abhaUserDetails?.abhaVerified
                            //         ? 'Linked'
                            //         : 'Pending'
                            // }
                            status={
                                yatriData?.abhaUserDetails
                                    ? 'Linked'
                                    : 'Pending'
                            }
                            onClickFunction={() => {
                                setabhaPendingModal(false)
                                navigate(`/${coreRoutesEnum.CREATE_ABHA}`)
                            }}
                        />
                        {/* Commment this for future coming soon feature */}
                        {/* {abhaIdModal && (
                    <CardBackdrop setClose={closeAbhaModal}>
                        {!yatriData?.abhaNumber ? (
                            <div className="abhaModalContainer">
                                <LinkedAbha />
                            </div>
                        ) : (
                            <CreateAbha />
                        )}
                    </CardBackdrop>
                )} */}
                        <ServicesCard
                            heading="Medical Records"
                            imageUrl={MedicalServicesIcon}
                            text="Upload medical records"
                            status={
                                yatriData?.documentsPath?.length
                                    ? 'Linked'
                                    : 'Pending'
                            }
                            onClickFunction={openMedicalCertificateModal}
                        />
                        <ServicesCard
                            heading="Vitals"
                            imageUrl={VitalsIcon}
                            text="Vitals will be reflected after completion of your check-up at the base center"
                            onClickFunction={() => {
                                navigate(`/${coreRoutesEnum.VITALS}`)
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default HomeRightContainer
