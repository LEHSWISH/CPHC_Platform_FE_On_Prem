/**
 * Protected Routes
 * 
 * This file will check if a user is on a protected route and they are authenticated or not.
 * In case user is not authenticated they will be redirected to the Login Page.
 * In case user has signed up but not provided their full name they will be redirected to the Welcome Page.
 */


import { Outlet, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../utils/hooks/useAppSelector'
import {
    DefaultUnAuthenticatedRedirectRoute,
    coreRoutesEnum,
} from '../../enums/routingEnums'
import { useEffect, useMemo } from 'react'

const ProtectedRoute = () => {
    const navigate = useNavigate()
    const { token, userName, loading } = useAppSelector(s => s.auth.yatri)
    const yatriAllDetailsIsLoading = useAppSelector(
        s => s.yatri.yatriAllDetails.loading,
    )
    const yatriAllDetailsData = useAppSelector(
        s => s.yatri.yatriAllDetails.data,
    )

    const isAuthenticated = useMemo(
        () =>
            typeof token === 'string' &&
            typeof userName === 'string' &&
            token.length > 0 &&
            userName.length > 0,
        [token, userName],
    )

    useEffect(() => {
        if (!isAuthenticated && !loading) {
            navigate(DefaultUnAuthenticatedRedirectRoute)
        }
    }, [loading, isAuthenticated, navigate])

    useEffect(() => {
        if (
            isAuthenticated &&
            !loading &&
            !yatriAllDetailsIsLoading &&
            yatriAllDetailsData !== null &&
            !yatriAllDetailsData?.yatriDetails?.fullName
        ) {
            navigate(`/${coreRoutesEnum.WELCOME}`)
        }
    }, [
        isAuthenticated,
        loading,
        navigate,
        yatriAllDetailsData,
        yatriAllDetailsIsLoading,
    ])

    return <Outlet />
}

export default ProtectedRoute
