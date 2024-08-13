import { useState } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { TabProps, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import { coreRoutesEnum } from '../../../enums/routingEnums'
import './medicalRecordsEntryPoint.style.scss'
import Footer from '../../shared/Footer/Footer'
import Breadcrumb from '../../shared/breadCrumb/Breadcrumb'
import UploadCertificate from '../uploadCertificateV2/UploadCertificate'
import CardBackdrop from '../../shared/CardBackdrop/CardBackdrop'
import { useAppDispatch } from '../../../utils/hooks/useAppDispatch'
import { loadYatriAllData } from '../../../services/store/slices/yatriSlice'
import FetchCertificates from '../uploadCertificateM3/FetchCertificates'
import { useMediaQuery } from '@mui/material'
import BackButtonWithTitle from '../../shared/BackButtonWithTitle'
import { useAppSelector } from '../../../utils/hooks/useAppSelector'
import MedicalDeclarationV2 from '../../modals/MedicalDeclarationV2/MedicalDeclarationV2'

interface ConditionalTooltipTabProps extends TabProps {
    label: string
    tooltipTitle: string
    disabled: boolean
}

function ConditionalTooltipTab({
    label,
    tooltipTitle,
    disabled,
    ...tabProps
}: ConditionalTooltipTabProps) {
    return (
        <Tooltip title={tooltipTitle} disableHoverListener={!disabled}>
            <div>
                {' '}
                <Tab
                    label={
                        <Typography
                            color={disabled ? 'textSecondary' : 'inherit'}
                            fontSize={'1.3rem'}
                            fontWeight={500}
                            lineHeight={'23px'}
                            sx={{
                                fontSize: {
                                    xs: '0.93rem', // For mobile and small devices
                                    md: '1.3rem', // For desktops
                                },
                            }}
                        >
                            {label}
                        </Typography>
                    }
                    {...tabProps}
                    disabled={disabled}
                    style={{ pointerEvents: disabled ? 'none' : 'auto' }}
                />
            </div>
        </Tooltip>
    )
}

enum LocationName {
    HOSP_DETAILS = '/medical-records/hosp-details',
    MY_REQUESTS = '/medical-records/my-requests',
}
const MedicalRecordsEntryPoint = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [tabValue, setTabValue] = useState(0)
    const [isShowTabs, setIsShowTabs] = useState(true)

    const [isShowMedicalDeclarationModal, setIsShowMedicalDeclarationModal] =
        useState<boolean>(false)

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
    }
    const isDesktop = useMediaQuery('(min-width: 480px)')
    const location = useLocation()
    const loc = location.pathname

    const yatriData = useAppSelector(state => {
        return state.yatri.yatriAllDetails.data
    })

    return (
        <div className="medical-records-container">
            {loc.includes(LocationName.HOSP_DETAILS) ? (
                <>
                    <Breadcrumb
                        clickableListItems={[
                            {
                                label: 'eSwasthya Dham',
                                onClick: () =>
                                    navigate(`/${coreRoutesEnum.HOME}`),
                            },
                            {
                                label: 'Medical Records',
                                onClick: () =>
                                    navigate(
                                        `/${coreRoutesEnum.MEDICAL_RECORDS}`,
                                    ),
                            },
                            { label: 'Paytm' },
                        ]}
                    />
                    <Outlet />
                </>
            ) : loc.includes(LocationName.MY_REQUESTS) ? (
                <>
                    <Outlet />
                </>
            ) : (
                <>
                    <Breadcrumb
                        clickableListItems={[
                            {
                                label: 'eSwasthya Dham',
                                onClick: () =>
                                    navigate(`/${coreRoutesEnum.HOME}`),
                            },
                            { label: 'Medical Records' },
                        ]}
                    />
                    <div className="medical-records-title">
                        <span className="home-button-div">
                            <BackButtonWithTitle
                                backButtonChildElement={
                                    <span className="home-button">Home</span>
                                }
                                onBack={() =>
                                    navigate(`/${coreRoutesEnum.HOME}`)
                                }
                            />
                        </span>
                        Medical Records
                    </div>
                    {isShowMedicalDeclarationModal && (
                        <CardBackdrop
                            showClose={false}
                            setClose={() =>
                                setIsShowMedicalDeclarationModal(false)
                            }
                        >
                            <MedicalDeclarationV2
                                setIsShowMedicalDeclarationModal={
                                    setIsShowMedicalDeclarationModal
                                }
                                onSaveAndContinueSuccess={() => {
                                    setIsShowMedicalDeclarationModal(false)
                                    dispatch(loadYatriAllData())
                                }}
                            />
                        </CardBackdrop>
                    )}
                    {isShowTabs && (
                        <Tabs
                            value={tabValue}
                            onChange={handleChange}
                            centered
                            className="tabs-parent"
                        >
                            <Tab
                                label={
                                    isDesktop
                                        ? 'Upload Medical Records'
                                        : 'Upload Records'
                                }
                                className="upload-tab"
                            />
                            
                            <ConditionalTooltipTab
                                label={
                                    isDesktop
                                        ? 'My Medical Records'
                                        : 'My Medical Records'
                                }
                                className="my-medical-tab"
                                disabled={!yatriData?.abhaUserDetails}
                                tooltipTitle="Please link your Abha to view records."
                            />
                        </Tabs>
                    )}
                    {tabValue === 0 && (
                        <UploadCertificate
                            isShowTabs={isShowTabs}
                            setIsShowTabs={setIsShowTabs}
                            setIsShowMedicalDeclarationModal={
                                setIsShowMedicalDeclarationModal
                            }
                        />
                    )}
                    {tabValue === 1 && <FetchCertificates />}
                    <Footer />
                </>
            )}
        </div>
    )
}

export default MedicalRecordsEntryPoint
