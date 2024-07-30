import './MedicalRecordsNull.scss'
import AbhaCardLoader from '../../../shared/AbhaCardCreateLoader/AbhaCardLoader'
function MedicalRecordsNull() {
    return (
        <>
            <div className="parent--1">
            <div className="view-my-req">
                    <a href="/">View my request</a>
                  </div>
                <div className="medical-records-null">
                    <div className="loader1">
                        <div className="circular-task-component">
                            <AbhaCardLoader />
                        </div>
                        <div className="loader1-heading">
                          <h1>No Data Found</h1>
                            No medical record found with the health provider
                        </div>
                    </div>
                </div>

                <div className='parent--2'>
                      <div className="button">
                        <span>View Medical Declaration</span>
                      </div>
                      <div className="back-link">
                        <a href="/"><span>Back to Health Providers</span></a>
                      </div>
                </div>
            </div>
        </>
    )
}

export default MedicalRecordsNull
