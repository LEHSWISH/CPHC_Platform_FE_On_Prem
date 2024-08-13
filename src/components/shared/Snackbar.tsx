import { useCallback } from 'react'
import { Alert, Snackbar as MuiSnackbar } from '@mui/material'
import { useAppSelector } from '../../utils/hooks/useAppSelector'
import { useAppDispatch } from '../../utils/hooks/useAppDispatch'
import { setSnackBar } from '../../services/store/slices/generalSlice'

const Snackbar = () => {
    const { open, message, autoHideDuration, severity, anchorOrigin } =
        useAppSelector(s => s.general.snackbar)
    const dispatch = useAppDispatch()

    const handleClose = useCallback(
        (_event: React.SyntheticEvent | Event, reason?: string) => {
            if (reason === 'clickaway') {
                return
            }

            dispatch(
                setSnackBar({
                    open: false,
                    message: null,
                    severity: 'info',
                }),
            )
        },
        [dispatch],
    )

    return (
        <MuiSnackbar
            open={open}
            autoHideDuration={autoHideDuration}
            anchorOrigin={
                anchorOrigin || { horizontal: 'center', vertical: 'top' }
            }
            onClose={handleClose}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </MuiSnackbar>
    )
}

export default Snackbar
