/**
 * Main Application Component
 * 
 * This component sets up the main structure and behavior of the React application.
 * It initializes the router, manages authentication state, and conditionally renders
 * components such as the Contact Us button and the full-page loader. It also applies
 * global theming and error handling.
 */


import { useEffect, useMemo, useState } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'

import './App.css'
import './styles/styles.scss'
import routes from './routes'
import ErrorBoundary from './components/shared/ErrorBoundary'
import Snackbar from './components/shared/Snackbar'
import { useAppDispatch } from './utils/hooks/useAppDispatch'
import { loadYatriAuthData } from './services/store/slices/authSlice'
import { loadYatriAllData } from './services/store/slices/yatriSlice'
import { useAppSelector } from './utils/hooks/useAppSelector'
import FullPageLoader from './components/shared/FullPageLoader'
import muiCustomtheme from './utils/muiCustomtheme'
import ContactUsFloatingButton from './components/shared/ContactUsFloatingButton/ContactUsFloatingButton'

const router = createBrowserRouter(routes)

function App() {
    const dispatch = useAppDispatch()
    const { token, userName, loading } = useAppSelector(s => s.auth.yatri)
    const loader=useAppSelector(s=>s.general.fullPageLoader)
    const [contactButton, setContactButton] = useState<boolean>(false)
    const isAuthenticated = useMemo(
        () =>
            typeof token === 'string' &&
            typeof userName === 'string' &&
            token.length > 0 &&
            userName.length > 0,
        [token, userName],
    )

    useEffect(() => {
        dispatch(loadYatriAuthData())
    }, [dispatch, userName])

    useEffect(() => {
        if (typeof userName === 'string') {
            dispatch(loadYatriAllData())
        }
    }, [userName, dispatch])

    useEffect(() => {
        if (isAuthenticated && !loading) {
            setContactButton(true)
        } else {
            setContactButton(false)
        }
    }, [loading, isAuthenticated])

    return (
        <ThemeProvider theme={muiCustomtheme}>
            <CssBaseline />
            <ErrorBoundary>
                <RouterProvider router={router} />
                <Snackbar />
                {contactButton&&<ContactUsFloatingButton />}
                {loader&&<FullPageLoader/>}
            </ErrorBoundary>
        </ThemeProvider>
    )
}

export default App
