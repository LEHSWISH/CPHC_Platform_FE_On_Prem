import { CareProviderAndRecipientListResponseType } from '../../../../../services/api/careGiverAPI'

import './CareTakee.scss'
import CareTakeeRowItem from './CareTakeeRowItem'

function CareTakee({
    careProviderAndRecipientData,
    refreshAllStatus,
}: {
    careProviderAndRecipientData: CareProviderAndRecipientListResponseType
    refreshAllStatus: () => void
}) {
    return (
        <>
            <div className="care-takee">
                <div className="care-takee-hedings">
                    <h1>Care Recipient</h1>
                    <p>Select the Recipient to view their Dashboard</p>
                </div>

                <div className="care-takee-cards">
                    {careProviderAndRecipientData?.careGiverRecipient?.map(
                        recipientData => {
                            return (
                                <CareTakeeRowItem
                                    key={recipientData.id}
                                    recipientData={recipientData}
                                    refreshAllStatus={refreshAllStatus}
                                />
                            )
                        },
                    )}
                </div>
            </div>
        </>
    )
}

export default CareTakee
