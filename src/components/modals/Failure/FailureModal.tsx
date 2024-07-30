import Caution from '../../../assets/icons/Caution.svg'
import CardModal, { CardModalPropTypes } from '../../shared/CardModal/CardModal'
import '../Failure/FailureModal.styles.scss'

interface FailureModalPropTypes extends Omit<CardModalPropTypes, 'children'> {
    headingText: string
    descriptionText: string
}

function FailureModal({
    headingText,
    descriptionText,
    ...restProps
}: FailureModalPropTypes) {
    return (
        <CardModal {...restProps}>
            <div className="failure-modal-container">
                <div className="caution-logo">
                    <img src={Caution} />
                </div>
                {headingText && (
                    <div className="failure-alert">{headingText}</div>
                )}
                {descriptionText && (
                    <div className="failure-message">{descriptionText}</div>
                )}
            </div>
        </CardModal>
    )
}

export default FailureModal
