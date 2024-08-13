import { useAppSelector } from './useAppSelector'

const useAuthorizationStatus = () => {
    const isYatriAuthLoading = useAppSelector(s => s.auth.yatri.loading)
    const token = useAppSelector(s => s.auth.yatri.token)

    return {
        isYatriAuthLoading,
        isYatriAuthorized: !!token,
    }
}

export default useAuthorizationStatus
