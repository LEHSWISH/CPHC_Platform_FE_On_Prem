import download from '../../../../../../../assets/icons/download.svg'
import { convertBase64ToFile } from '../../../../../../../utils/HelperFunctions'
import './HipData.scss'
function HipData(props: HipDataType) {
    return (
        <div className="content">
            <div className="parent-2">
                <div className="child-1">
                    <div className="hospital-name">
                        <span>{props?.hipData?.title || `Document ${props.i + 1} `}</span>

                    </div>
                    <div className='date-1'>{props.hipData.creation?.split('T')[0]?.split('-')?.reverse()?.join('-')}</div>
                </div>
                <div className="child-2">
                    <div className="uploaded">
                        <span className='text'>Uploaded on:</span>
                        <span className='date'>{props.hipData.creation?.split('T')[0]?.split('-')?.reverse()?.join('-')}</span>
                    </div>

                    <div className="view">
                        <a href={`data:${props.hipData.contentType};base64,${props.hipData.data}`} target='_blank'>View</a>
                    </div>
                    <div className="download" onClick={() => {
                        convertBase64ToFile(props.hipData.data, props?.hipData?.title || `Document ${props.i + 1} `, props?.hipData?.contentType)
                    }}>
                        <img src={download} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}
export interface HipDataType {
    hipData: {
        contentType: string,
        creation?: string,
        data?: string
        language?: string,
        title?: string
    },
    i: number
}
export default HipData