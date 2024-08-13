import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loadYatriAllData } from '../../../services/store/slices/yatriSlice'
import CardBackdrop from '../../shared/CardBackdrop/CardBackdrop'
import MedicalDeclarationV2 from '../MedicalDeclarationV2/MedicalDeclarationV2'

const MedicalDeclarationWrapper = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    return (
        <CardBackdrop isOpenedByNavigation>
            <MedicalDeclarationV2
                onSaveAndContinueSuccess={() => {
                    dispatch(loadYatriAllData())
                    navigate(-1)
                }}
                setIsShowMedicalDeclarationModal={() => {
                    navigate(-1)
                }}
            />
        </CardBackdrop>
    )
}

export default MedicalDeclarationWrapper
