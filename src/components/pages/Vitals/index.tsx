import { useEffect, useMemo, useRef, useState } from 'react'
import { coreRoutesEnum } from '../../../enums/routingEnums'
import { useNavigate } from 'react-router-dom'
import './index.styles.scss'
import LeftVector from '../../../assets/icons/left-vector.svg'
import ProfileIcon from '../../../assets/icons/profileIcon.svg'
import heartIcon from '../../../assets/icons/heart.svg'
import lowValueIcon from '../../../assets/icons/low-value-icon.svg'
import NormalValueIcon from '../../../assets/icons/normal-value-icon.svg'
import HighValueIcon from '../../../assets/icons/high-value-icon.svg'
import spO2Normal from '../../../assets/icons/spo2_normal_icon.svg'
import spO2SeekAdvice from '../../../assets/icons/spo2_seek_advice.svg'
import InfoIcon from '../../../assets/icons/Vector.svg'
import bpIcon from '../../../assets/icons/bp-icon.svg'
import heartRateIcon from '../../../assets/icons/heart-rate-icon.svg'
import temperatureIcon from '../../../assets/icons/temperature-icon.svg'
import bloodSugarIcon from '../../../assets/icons/blood-sugar-icon.svg'
import SPO2Icon from '../../../assets/icons/sp-o2-icon.svg'
import vitalsLogo from '../../../assets/Images/vitalsIcon.svg'
import { useAppSelector } from '../../../utils/hooks/useAppSelector'
import useAuthorizationStatus from '../../../utils/hooks/useAuthorizationStatus'
import Footer from '../../shared/Footer/Footer'
// import FormControlLabel from '@mui/material/FormControlLabel'
// import FormControl from '@mui/material/FormControl'
// import FormLabel from '@mui/material/FormLabel'
// import { Radio, RadioGroup } from '@mui/material'
import FullPageLoader from '../../shared/FullPageLoader'
import vitalsAPI from '../../../services/api/vitalsAPI'
import { RiskType } from '../../../enums/vitals/RiskType'
import thumsUp from '../../../assets/icons/ThumbsUp.svg'
import thumsDown from '../../../assets/icons/ThumbsDown.svg'

function Vitals() {
    const isInitialDataLoadedRef = useRef(false)
    const [isDataAvailable, setIsDataAvailable] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [result, setResult] = useState<any>({})
    const navigate = useNavigate()
    const yatriData = useAppSelector(s => {
        return s.yatri.yatriAllDetails.data
    })
    const { isYatriAuthLoading, isYatriAuthorized } = useAuthorizationStatus()
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

    useEffect(() => {
        if (
            !isInitialDataLoadedRef.current &&
            !isYatriAuthLoading &&
            isYatriAuthorized
        ) {
            isInitialDataLoadedRef.current = true
            vitalsAPI
                .getVitalsRecords()
                .then(response => {
                    setIsDataAvailable(true)
                    setResult(response.data)
                    setIsLoading(false)
                })
                .catch(() => {
                    setIsDataAvailable(false)
                    setIsLoading(false)
                })
        }
    }, [isYatriAuthLoading, isYatriAuthorized])

    if (isLoading) {
        return <FullPageLoader />
    }

    return (
        <>
            <div className="vitals-wrapper">
                <div className="breadcrumbs">
                    <span
                        onClick={() => {
                            navigate(`${coreRoutesEnum.HOME}`)
                        }}
                    >
                        eSwasthya Dham
                    </span>{' '}
                    <img src={LeftVector} className="left-vector" alt="" />{' '}
                    <span className="active-breadcrumb">Vitals</span>
                </div>
                <div className="section-one">
                    <div className="yatri-outer-container">
                        <div className="yatriDetails">
                            <div className="profile-detail">
                                {(result &&
                                    result.status === RiskType.HIGH_RISK) ||
                                result.status ===
                                    RiskType.HIGH_RISK_FIT_TO_TRAVEL ||
                                result.status ===
                                    RiskType.HIGH_RISK_NOT_FIT_TO_TRAVEL ? (
                                    <>
                                        <p className="high-risk">
                                            <img src={heartIcon} alt="" />
                                            High Risk
                                        </p>
                                    </>
                                ) : null}

                                <img src={ProfileIcon} alt="" />
                                <h2 className="profile-heading">
                                    {yatriData?.yatriDetails
                                        ? yatriData?.yatriDetails?.fullName
                                        : '-'}
                                </h2>
                                <p className="profile-completion">
                                    {progressPercentage}% Completed
                                </p>
                            </div>
                            <div className="details-section">
                                <div className="details">
                                    <p>Height</p>
                                    {result?.height ? (
                                        <p>
                                            {result?.height}
                                            {result?.heightUnits}
                                        </p>
                                    ) : (
                                        <p>-</p>
                                    )}
                                </div>

                                <div className="details">
                                    <p>Weight</p>
                                    {result?.weight ? (
                                        <p>
                                            {result?.weight}
                                            {result?.weightUnits}
                                        </p>
                                    ) : (
                                        <p>-</p>
                                    )}
                                </div>
                                <div className="details">
                                    <p>BMI (Body Mass Index)</p>
                                    {result?.bmi ? (
                                        <p>
                                            {result?.bmi}
                                            kg/m2
                                        </p>
                                    ) : (
                                        <p>-</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="vital-right-section">
                        <div className="vitals-heading">
                            <div>
                                <img src={vitalsLogo} alt="vitals" />
                            </div>
                            <p className="vital-text">Vitals</p>
                            {result &&
                            result.status ===
                                RiskType.HIGH_RISK_FIT_TO_TRAVEL ? (
                                <>
                                    <p className="fit-to-travel">
                                        <img src={thumsUp} alt="" />
                                        <p>Fit to travel</p>
                                    </p>
                                </>
                            ) : result.status ===
                              RiskType.HIGH_RISK_NOT_FIT_TO_TRAVEL ? (
                                <>
                                    <p className="unfit-to-travel">
                                        <img src={thumsDown} alt="" />
                                        <p>Unfit to travel</p>
                                    </p>
                                </>
                            ) : null}
                        </div>
                        <p className="vital-description">
                            Upgrade Your Char Dham Pilgrimage Experience by
                            Monitoring Your Health in Real-Time with Our
                            Comprehensive App for a Smooth and Uninterrupted
                            Journey
                        </p>

                        {/* <div className="radio-button-section">
                            <FormControl>
                                <FormLabel
                                    id="demo-row-radio-buttons-group-label"
                                    className="radio-group-type"
                                >
                                    Display the vitals collected via
                                </FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                >
                                    <FormControlLabel
                                        value="medicalRelifPoint"
                                        control={<Radio />}
                                        label="Medical Relif Point"
                                    />

                                    <FormControlLabel
                                        value="disabled"
                                        disabled
                                        control={<Radio />}
                                        label="IOT wearable"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div> */}
                    </div>
                </div>
                <div className="section-one-mobile">
                    <div className="vitals-heading">
                        {(result && result.status === RiskType.HIGH_RISK) ||
                        result.status === RiskType.HIGH_RISK_FIT_TO_TRAVEL ||
                        result.status ===
                            RiskType.HIGH_RISK_NOT_FIT_TO_TRAVEL ? (
                            <>
                                <p className="high-risk">
                                    <img src={heartIcon} alt="" />
                                    High Risk
                                </p>
                            </>
                        ) : null}
                        <div className="logo">
                            <img src={vitalsLogo} alt="vitals" />
                        </div>
                        <p className="vital-text-mobile">Vitals</p>
                    </div>
                    {result &&
                    result.status === RiskType.HIGH_RISK_FIT_TO_TRAVEL ? (
                        <>
                            <p className="fit-to-travel">
                                <img src={thumsUp} alt="" />
                                <p>Fit to travel</p>
                            </p>
                        </>
                    ) : result.status ===
                      RiskType.HIGH_RISK_NOT_FIT_TO_TRAVEL ? (
                        <>
                            <p className="unfit-to-travel">
                                <img src={thumsDown} alt="" />
                                <p>Unfit to travel</p>
                            </p>
                        </>
                    ) : null}
                    <div className="vitals-bottom">
                        <div className="details-section">
                            <div className="details">
                                <p>Height</p>
                                {result?.height ? (
                                    <p>
                                        {result?.height}
                                        {result?.heightUnits}
                                    </p>
                                ) : (
                                    <p>-</p>
                                )}
                            </div>

                            <div className="details">
                                <p>Weight</p>
                                {result?.weight ? (
                                    <p>
                                        {result?.weight}
                                        {result?.weightUnits}
                                    </p>
                                ) : (
                                    <p>-</p>
                                )}
                            </div>
                            <div className="details">
                                <p>BMI (Body Mass Index)</p>
                                {result?.bmi ? (
                                    <p>
                                        {result?.bmi}
                                        kg/m2
                                    </p>
                                ) : (
                                    <p>-</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* <div className="radio-button-section">
                        <FormControl>
                            <FormLabel
                                id="demo-row-radio-buttons-group-label"
                                className="radio-group-type"
                            >
                                Display the vitals collected via
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel
                                    value="medicalRelifPoint"
                                    control={<Radio />}
                                    label="Medical Relif Point"
                                />

                                <FormControlLabel
                                    value="disabled"
                                    disabled
                                    control={<Radio />}
                                    label="IOT wearable"
                                />
                            </RadioGroup>
                        </FormControl>
                    </div> */}
                </div>
                {isDataAvailable ? (
                    <div className="section-two">
                        {/* Blood Pressure */}
                        <div className="data-card">
                            <div className="data-wrapper">
                                <div className="data-image">
                                    <img src={bpIcon} alt="blood-pressure" />
                                </div>
                                <div className="data-values">
                                    <div>
                                        <p className="vitals-type">
                                            Blood Pressure
                                        </p>
                                        <p className="vitals-type-measure-unit">
                                            SYS/DIA
                                        </p>
                                    </div>
                                    <div>
                                        <p className="vitals-value">
                                            {result?.bloodPressureFullValue}
                                        </p>
                                        <p className="vitals-type-measure-unit">
                                            mmHg
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="scale-value-wrapper">
                                <div>
                                    <div className="low-normal-high">
                                        <img src={lowValueIcon} alt="low" /> Low
                                    </div>
                                    <p className="range-value">Below 90/60</p>
                                </div>
                                <div>
                                    <div className="low-normal-high">
                                        <img
                                            src={NormalValueIcon}
                                            alt="normal"
                                        />{' '}
                                        Normal
                                    </div>
                                    <p className="range-value">
                                        90/60 - 140/90
                                    </p>
                                </div>
                                <div>
                                    <div className="low-normal-high">
                                        <img src={HighValueIcon} alt="high" />{' '}
                                        High
                                    </div>
                                    <p className="range-value">Above 140/90</p>
                                </div>
                            </div>
                        </div>
                        {/* Heart Rate */}
                        <div className="data-card">
                            <div className="data-wrapper">
                                <div className="data-image">
                                    <img src={heartRateIcon} alt="heart-rate" />
                                </div>
                                <div className="data-values">
                                    <div>
                                        <p className="vitals-type">
                                            Heart Rate
                                        </p>
                                        <p className="vitals-type-measure-unit">
                                            beats per minute
                                        </p>
                                    </div>
                                    <div>
                                        <p className="vitals-value">
                                            {result?.heartRate}
                                        </p>
                                        <p className="vitals-type-measure-unit">
                                            bpm
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="scale-value-wrapper">
                                <div>
                                    <div className="low-normal-high">
                                        {' '}
                                        <img src={lowValueIcon} alt="low" /> Low
                                    </div>
                                    <p className="range-value">Below 60</p>
                                </div>
                                <div>
                                    <div className="low-normal-high">
                                        <img
                                            src={NormalValueIcon}
                                            alt="normal"
                                        />{' '}
                                        Normal
                                    </div>
                                    <p className="range-value">60-100</p>
                                </div>
                                <div>
                                    <div className="low-normal-high">
                                        {' '}
                                        <img
                                            src={HighValueIcon}
                                            alt="high"
                                        />{' '}
                                        High
                                    </div>
                                    <p className="range-value">Above 100</p>
                                </div>
                            </div>
                        </div>
                        {/* SpO2 */}
                        <div className="data-card">
                            <div className="data-wrapper">
                                <div className="data-image">
                                    <img src={SPO2Icon} alt="SpO2" />
                                </div>
                                <div className="data-values">
                                    <div>
                                        <p className="vitals-type">SpO2</p>
                                        <p className="vitals-type-measure-unit">
                                            Oxygen Saturation
                                        </p>
                                    </div>
                                    <div>
                                        <p className="vitals-value">
                                            {result?.spo2}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="scale-value-wrapper">
                                <div>
                                    <div className="low-normal-high">
                                        <img
                                            src={spO2Normal}
                                            alt="normal"
                                            className="spo2-icons"
                                        />
                                        Normal
                                    </div>
                                    <p className="range-value">96% and above</p>
                                </div>
                                <div>
                                    <div className="low-normal-high">
                                        <img
                                            src={spO2SeekAdvice}
                                            alt="seek advice"
                                            className="spo2-icons"
                                        />
                                        Seek advice
                                    </div>
                                    <p className="range-value">94% and less</p>
                                </div>
                            </div>
                        </div>
                        {/* Temperature */}
                        <div className="data-card">
                            <div className="data-wrapper">
                                <div className="data-image">
                                    <img
                                        src={temperatureIcon}
                                        alt="temperature"
                                    />
                                </div>
                                <div className="data-values">
                                    <div>
                                        <p className="vitals-type">
                                            Temperature
                                        </p>
                                        <p className="vitals-type-measure-unit">
                                            Body Temperature
                                        </p>
                                    </div>
                                    <div>
                                        <p className="vitals-value">
                                            {result?.temperature}{' '}
                                            <span>
                                                &#176;{result?.temperatureUnits}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="scale-value-wrapper">
                                <div>
                                    <div className="low-normal-high">
                                        {' '}
                                        <img src={lowValueIcon} alt="low" /> Low
                                    </div>
                                    <p className="range-value">Below 97.8°F</p>
                                </div>
                                <div>
                                    <div className="low-normal-high">
                                        <img
                                            src={NormalValueIcon}
                                            alt="normal"
                                        />{' '}
                                        Normal
                                    </div>
                                    <p className="range-value">97.8 - 99.1°F</p>
                                </div>
                                <div>
                                    <div className="low-normal-high">
                                        {' '}
                                        <img
                                            src={HighValueIcon}
                                            alt="high"
                                        />{' '}
                                        High
                                    </div>
                                    <p className="range-value">Above 99.1°F</p>
                                </div>
                            </div>
                        </div>
                        {/* Blood Sugar */}
                        <div className="data-card">
                            <div className="data-wrapper">
                                <div className="data-image">
                                    <img
                                        src={bloodSugarIcon}
                                        alt="blood-sugar"
                                    />
                                </div>
                                <div className="data-values">
                                    <div>
                                        <p className="vitals-type">
                                            Blood Sugar
                                        </p>
                                        <p className="vitals-type-measure-unit">
                                            Blood Glucose
                                        </p>
                                    </div>
                                    <div>
                                        <p className="vitals-value">
                                            {result?.bloodSugar}
                                        </p>
                                        <p className="vitals-type-measure-unit">
                                            mg/dl
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="scale-value-wrapper">
                                <div>
                                    <div className="low-normal-high">
                                        {' '}
                                        &nbsp;
                                    </div>
                                    <p className="range-value">FBS</p>
                                    <p className="range-value">PP</p>
                                </div>
                                <div>
                                    <div className="low-normal-high">
                                        {' '}
                                        <img src={lowValueIcon} alt="low" /> Low
                                    </div>
                                    <p className="range-value">Below 70</p>
                                    <p className="range-value">Below 80</p>
                                </div>
                                <div>
                                    <div className="low-normal-high">
                                        <img
                                            src={NormalValueIcon}
                                            alt="normal"
                                        />{' '}
                                        Normal
                                    </div>
                                    <p className="range-value">70-100</p>
                                    <p className="range-value">80-130</p>
                                </div>
                                <div>
                                    <div className="low-normal-high">
                                        {' '}
                                        <img
                                            src={HighValueIcon}
                                            alt="high"
                                        />{' '}
                                        High
                                    </div>
                                    <p className="range-value">Above 100</p>
                                    <p className="range-value">Above 130</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="section-two">
                        <div className="no-data-found-wrapper">
                            <img
                                src={InfoIcon}
                                alt="info-icon"
                                className="info-icon"
                            />
                            <p className="no-data-text">No data found</p>
                            <p className="no-data-description">
                                To display your vitals here, please visit
                                medical relief point.
                            </p>
                        </div>
                    </div>
                )}

                <Footer />
            </div>
        </>
    )
}

export default Vitals
