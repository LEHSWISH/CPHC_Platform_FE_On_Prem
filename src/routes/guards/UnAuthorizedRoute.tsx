/**
 * Unauthorized Routes
 * 
 * This file will check if a user is on an Unauthrized route and authenticated or not.
 * In case the user is authenticated and is on signup page they will be redirected to Welcome Page.
 * In case user is authenticated and not on signup page they will be redirected to the Home Page.
 */


import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../utils/hooks/useAppSelector'
import { DefaultAuthenticatedRedirectRoute, coreRoutesEnum } from '../../enums/routingEnums'
import { useEffect, useMemo } from 'react'

const UnAuthorizedRoute = () => {
    const { token, userName, loading } = useAppSelector(s => s.auth.yatri)
    const navigate = useNavigate()
    const location=useLocation()
    const isAuthenticated = useMemo(
        () =>
            typeof token === 'string' &&
            typeof userName === 'string' &&
            token.length > 0 &&
            userName.length > 0,
        [token, userName],
    )
    useEffect(() => {
        if (isAuthenticated && !loading) {
            if(location.pathname===`/${coreRoutesEnum.SIGN_UP}`){
                navigate(`/${coreRoutesEnum.WELCOME}`)
            }else{
            navigate(DefaultAuthenticatedRedirectRoute)
            }
        }
    }, [loading, isAuthenticated, navigate, location.pathname])

    return <Outlet />
}

export default UnAuthorizedRoute
