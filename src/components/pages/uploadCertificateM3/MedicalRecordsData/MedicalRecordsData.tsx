import './MedicalRecordsData.scss'
import Hospitals from './HospitalCards/Hospitals'
import Refresh from '../../../../assets/icons/refresh.svg'
import { Divider } from '@mui/material'
import leftArrow from '../../../../assets/icons/left Vector Black .svg'
import { useNavigate } from 'react-router-dom'
import { nestedRoutePathsEnum } from '../../../../enums/routingEnums'
import AbhaCardLoader from '../../../shared/AbhaCardCreateLoader/AbhaCardLoader'

function MedicalRecordsData({ data, loaderState = true, refresh=false, refreshData}: MedicalRecordsDataProps) {
    const navigate = useNavigate()

    const hospSet = new Set();
    const uniqueHospData = data?.filter((artefact: any) => {
        const duplicate = hospSet.has(artefact.hipName);
        hospSet.add(artefact.hipName);
        return !duplicate;
    });

    return (
        <>
            <div
                className="my-req"
                onClick={() => navigate(`${nestedRoutePathsEnum.MY_REQUESTS}`)}
            >
                <div className="Heading">
                    <span>My Request</span>
                    <div className="red-dot-1"></div>
                </div>
                <img src={leftArrow} alt="" />
            </div>
            <div className="medical-records-data">
                <div className="top-parent">
                    <div className="left">
                        <span className="heading">
                            Registered Health Providers
                        </span>
                    </div>
                    <div className="right">
                        <div className="first">
                            <div className="req">
                                <span
                                    onClick={() =>
                                        navigate(
                                            `${nestedRoutePathsEnum.MY_REQUESTS}`,
                                        )
                                    }
                                >
                                    {' '}
                                    My Requests
                                </span>
                            </div>
                            <div className="red-dot"></div>
                        </div>

                        <Divider
                            orientation="vertical"
                            variant="fullWidth"
                            flexItem
                        />

                        <div className="second" onClick={() => refreshData(true)}>
                            <img src={Refresh} alt="reload-svg" className={refresh ? 'rotating' : ''} />
                            <span>Refresh</span>
                        </div>
                    </div>
                </div>

                {loaderState ? (
                    <div className="loader">
                        <div className="circular-task-component">
                            <AbhaCardLoader />
                        </div>
                        <div className="loader-info">
                            Please wait while we fetch your data.
                        </div>
                    </div>
                ) : (
                    <div className="records-data">
                        {uniqueHospData &&
                            uniqueHospData.map((value: any, index: number) => {
                                return <Hospitals data={value} key={index} />
                            })}
                    </div>
                )}
            </div>
        </>
    )
}

interface MedicalRecordsDataProps {
    refreshData: (value: boolean) => void
    data: any
    refresh: boolean
    loaderState: boolean
}

export default MedicalRecordsData
