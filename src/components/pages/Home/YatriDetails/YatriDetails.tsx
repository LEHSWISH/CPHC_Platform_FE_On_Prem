import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import { IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import ProfileIcon from '../../../../assets/icons/profileIcon.svg'
import './YatriDetais.scss'
import { useAppSelector } from '../../../../utils/hooks/useAppSelector'
import { useEffect, useMemo, useState } from 'react'
import {
    coreRoutesEnum,
    homeNestedRoutesEnum,
} from '../../../../enums/routingEnums'

function YatriDetails() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const yatriData = useAppSelector(s => {
        return s.yatri.yatriAllDetails.data
    })
    const isGuestUserActive = useAppSelector(s => {
        return s.auth.config.isGuestUserActive
    })
    const [isPhoneNumberHidden, setIsPhoneNumberHidden] =
        useState<boolean>(true)
    const [isTourismPortalHidden, setIsTourismPortalHidden] =
        useState<boolean>(true)
    const openViewYatriDetailModal = () => {
        navigate(
            `/${coreRoutesEnum.HOME}/${homeNestedRoutesEnum.VIEW_YATRA_DETAILS}`,
        )
    }

    const openMedicalDeclarationModal = () => {
        navigate(
            `/${coreRoutesEnum.HOME}/${homeNestedRoutesEnum.MEDICAL_DECLARATION}`,
        )
    }

    const togglePhoneNumber = () => setIsPhoneNumberHidden(!isPhoneNumberHidden)
    const toggleTourismPortal = () =>
        setIsTourismPortalHidden(!isTourismPortalHidden)
    const [progressPercentage, setProgressPercentage] = useState(0)
    const formData: any = useMemo(
        () => ({
            governmentId: yatriData?.governmentId,
            yatriDetails: yatriData?.yatriDetails?.fullName,
            register: yatriData?.userName,
            abhaUserDetails: yatriData?.abhaUserDetails,
            idtpDetails: yatriData?.tourismUserInfo,
            medicalReport: yatriData?.medicalsReports,
        }),
        [
            yatriData?.governmentId,
            yatriData?.userName,
            yatriData?.yatriDetails?.fullName,
            yatriData?.abhaUserDetails,
            yatriData?.tourismUserInfo,
            yatriData?.medicalsReports,
        ],
    )

    useEffect(() => {
        // Function to calculate progress percentage
        const calculateProgress = () => {
            const percentages: { [key: string]: number } = {
                register: 10,
                yatriDetails: 15,
                abhaUserDetails: 25,
                idtpDetails: 25,
                medicalReport: 25,
            }

            let totalPercentage: number = 0

            for (const key in percentages) {
                if (formData?.[key] !== null) {
                    totalPercentage += percentages[key]
                }
            }
            setProgressPercentage(totalPercentage)
        }

        calculateProgress() // Initial calculation
    }, [formData]) // Dependency array ensures useEffect runs when formData changes
    return (
        <>
            <div className="yatriDetails">
                <div className="profile-detail">
                    {/* 
                        --> needed Later
                        <p className="high-risk">
                        <img src={heartIcon} alt="" />
                        High Risk
                    </p> */}
                    <img src={ProfileIcon} alt="" />
                    <h2 className="profile-heading">
                        {yatriData?.yatriDetails?.fullName || '-'}
                        {isGuestUserActive && '(Child)'}
                    </h2>
                    <p className="profile-completion">
                        {progressPercentage}% Completed
                    </p>
                </div>
                <div className="details-section">
                    <div className="details">
                        <p>Username</p>
                        <p> {yatriData?.userName}</p>
                    </div>
                    <div className="details">
                        <p>Phone number</p>
                        <div className="masked">
                            <p>{`+91 ${isPhoneNumberHidden ? t('mask.phone', { number: yatriData?.phoneNumber?.slice(-4) }) : yatriData?.phoneNumber}`}</p>
                            <IconButton onClick={togglePhoneNumber}>
                                {isPhoneNumberHidden ? (
                                    <VisibilityOff fontSize="small" />
                                ) : (
                                    <Visibility fontSize="small" />
                                )}
                            </IconButton>
                        </div>
                    </div>
                    <div className="details">
                        <p>Tourism Portal ID</p>
                        {!yatriData?.tourismUserInfo?.idtpId && (
                            <span className="status-pending">Pending</span>
                        )}
                        <div className="masked">
                            {yatriData?.tourismUserInfo?.idtpId ? (
                                <>
                                    <p>{` ${isTourismPortalHidden ? t('mask.tourism-portal-id', { number: `${yatriData?.tourismUserInfo?.idtpId}`.slice(-4) }) : yatriData?.tourismUserInfo?.idtpId}`}</p>
                                    <IconButton onClick={toggleTourismPortal}>
                                        {isTourismPortalHidden ? (
                                            <VisibilityOff fontSize="small" />
                                        ) : (
                                            <Visibility fontSize="small" />
                                        )}
                                    </IconButton>
                                </>
                            ) : (
                                <NavLink
                                    to={`/${coreRoutesEnum.HOME}/${homeNestedRoutesEnum.CREATE_ABHA_WITH_TP_ID}`}
                                >
                                    Add
                                </NavLink>
                            )}
                        </div>
                    </div>
                    <div className="details">
                        <p>Medical Declaration</p>
                        <div
                            style={{
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                color: '#33189F',
                            }}
                            onClick={openMedicalDeclarationModal}
                        >
                            View
                        </div>
                    </div>
                </div>

                <div className="details-section">
                    <div className="details">
                        <p>Yatri Details</p>
                        <div
                            style={{
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                color: '#33189F',
                            }}
                            onClick={openViewYatriDetailModal}
                        >
                            View
                        </div>
                    </div>
                </div>
                {/* <div className="details-section">
                    <div className="details">
                        <p>RFID</p>
                        <p>dh3487dy83</p>
                    </div>
                    <div className="details">
                        <p>IOT ID</p>
                        <p>8393898329</p>
                    </div>
                </div> */}
            </div>
        </>
    )
}

export default YatriDetails
