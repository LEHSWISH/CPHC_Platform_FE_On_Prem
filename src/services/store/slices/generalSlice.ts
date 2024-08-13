import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AlertColor, SnackbarOrigin } from '@mui/material'

interface SnackBarPayloadType {
    open: boolean
    message: string | null
    autoHideDuration?: number
    severity: AlertColor
    anchorOrigin?: SnackbarOrigin | null
}

interface GeneralState {
    snackbar: SnackBarPayloadType,
    fullPageLoader:boolean
}

const initialState: GeneralState = {
    snackbar: {
        open: false,
        message: null,
        autoHideDuration: 6000,
        severity: 'info',
        anchorOrigin: null,
    },
    fullPageLoader:false
}

export const generalSlice = createSlice({
    name: 'GENERAL',
    initialState,
    reducers: {
        setSnackBar: (state, action: PayloadAction<SnackBarPayloadType>) => {
            state.snackbar.open = action.payload.open
            state.snackbar.message = action.payload.message
            state.snackbar.severity = action.payload.severity
            state.snackbar.autoHideDuration =
                action.payload.autoHideDuration || 6000
            state.snackbar.anchorOrigin = action.payload.anchorOrigin || null
        },
        setFullPageLoader:(state,action:PayloadAction<boolean>)=>{
            state.fullPageLoader=action.payload
        }
    },
})

export const { setSnackBar,setFullPageLoader } = generalSlice.actions

export default generalSlice.reducer
