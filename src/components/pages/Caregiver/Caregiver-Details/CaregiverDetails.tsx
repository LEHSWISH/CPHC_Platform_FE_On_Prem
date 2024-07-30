import { CareProviderAndRecipientListResponseType } from '../../../../services/api/careGiverAPI'
import CareTakee from './CareTakee/CareTakee'
import './CaregiverDetails.scss'
import CareGiver from './MyCareGiver/CareGiver'

function CaregiverDetails({
    careProviderAndRecipientData,
    refreshAllStatus,
}: {
    careProviderAndRecipientData: CareProviderAndRecipientListResponseType | null
    refreshAllStatus: () => void
}) {
    return (
        <>
            {careProviderAndRecipientData?.careGiver?.length ? (
                <CareGiver
                    careProviderAndRecipientData={careProviderAndRecipientData}
                    refreshAllStatus={refreshAllStatus}
                />
            ) : careProviderAndRecipientData?.careGiverRecipient?.length ? (
                <div className="care-tak">
                    <CareTakee
                        careProviderAndRecipientData={
                            careProviderAndRecipientData
                        }
                        refreshAllStatus={refreshAllStatus}
                    />
                </div>
            ) : (
                <div className='no-care-giver-recipient-container'>
                    <div className="blank">
                        <div className="child-1">
                            <div className="top">
                                <p>My Caregiver </p>
                            </div>
                            <div className="middle">
                                <p> or </p>
                            </div>
                            <div className="bottom">
                                <p>Care Recipient</p>
                            </div>
                        </div>
                        <div className="child-2-details">
                            <p>
                                Information will be reflected after accepting
                                the requests
                            </p>
                        </div>
                    </div>
                    <div className="none"></div>
                </div>
            )}
        </>
    )
}

export default CaregiverDetails
