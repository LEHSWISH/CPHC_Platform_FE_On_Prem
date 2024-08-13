import './LinkedAbha.styles.scss'
import GreenCheck from '../../../../../assets/icons/GreenCheck.svg'
import { useAppSelector } from '../../../../../utils/hooks/useAppSelector'

function AbhaLinked() {
    const abhaId: string =
        useAppSelector(
            state => state?.yatri?.yatriAllDetails?.data?.abhaNumber,
        ) || 'XXXX'

    return (
        <>
            <div className="abha-linked-container">
                <div className="green-check">
                    <img src={GreenCheck} />
                </div>
                <div className="card-title">ABHA</div>
                <p className="card-description">
                    ABHA number is a 14 digit number that will uniquely identify
                    you as a participant in India’s digital healthcare
                    ecosystem.
                </p>
                <p className="abha-linked">
                    Your ABHA account is linked with eSwasthya Dham.
                </p>
                <div className="mask-abha">
                    ABHA Number -
                    <span>&nbsp; XX XXXX XXXX {abhaId.slice(-4)}</span>
                </div>
            </div>
        </>
    )
}

export default AbhaLinked
