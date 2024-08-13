import { localStorageHelper } from './../../../utils/hooks/useLocalStorage'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { LoginApiResponseType } from '../../../interface/ApiResponseTypes'
import { LoginApiPayloadType } from '../../../interface/ApiRequestPayoadTypes'
import { LocalstorageKeysEnum } from '../../../enums/LocalStorageKeysEnum'

interface UserAuthConfigInfoType {
    token: string
    userName: string
}

export interface UserAuthConfigType {
    isGuestUserActive: boolean
    primaryUserInfo: UserAuthConfigInfoType | null
    guestUserInfo: UserAuthConfigInfoType | null
    sessionId: string | null
}

interface AuthState {
    yatri: {
        res: LoginApiResponseType | unknown
        token: string | null
        userName: string | null
        loading: boolean
        error: string | null
        sessionId?: string | null
    }
    config: UserAuthConfigType
}

const initialState: AuthState = {
    yatri: {
        res: null,
        token: null,
        userName: null,
        loading: true,
        error: null,
        sessionId: null,
    },
    config: {
        isGuestUserActive: false,
        primaryUserInfo: null,
        guestUserInfo: null,
        sessionId: null
    },
}

export const authSlice = createSlice({
    name: 'AUTH',
    initialState,
    reducers: {
        logoutYatri: state => {
            state.yatri = {
                res: null,
                token: null,
                userName: null,
                loading: false,
                error: null,
                sessionId: null,
            }
            localStorageHelper(
                LocalstorageKeysEnum.YATRI_AUTH_CONFIG,
            ).removeItem()
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        loginYatri: (state, _action: PayloadAction<LoginApiPayloadType>) => {
            state.yatri = {
                res: null,
                token: null,
                userName: null,
                loading: true,
                error: null,
                sessionId: _action?.payload?.sessionId,
            }
        },
        setLoginYatriSuccess: (
            state,
            action: PayloadAction<{ userName: string } & LoginApiResponseType>,
        ) => {
            state.yatri = {
                res: action.payload,
                token: action.payload.token,
                userName: action.payload.userName,
                error: null,
                loading: false,
                sessionId: state.yatri.sessionId,
            }
        },
        setLoginYatriFailed: (
            state,
            action: PayloadAction<LoginApiResponseType>,
        ) => {
            state.yatri = {
                res: action.payload,
                token: null,
                userName: null,
                loading: false,
                error: action?.payload?.message || null,
                sessionId: null,
            }
        },
        loadYatriAuthData: state => {
            const config: UserAuthConfigType | undefined = localStorageHelper(
                LocalstorageKeysEnum.YATRI_AUTH_CONFIG,
            ).getItem()
            if (config && config?.primaryUserInfo?.token && config?.sessionId) {
                state.config = config
                state.yatri.sessionId = config.sessionId
                if (config.isGuestUserActive && config.guestUserInfo?.token) {
                    state.yatri.token = config.guestUserInfo?.token
                    state.yatri.userName = config.guestUserInfo.userName
                } else {
                    state.yatri.token = config.primaryUserInfo?.token
                    state.yatri.userName = config.primaryUserInfo.userName
                }
            } else {
                localStorageHelper(
                    LocalstorageKeysEnum.YATRI_AUTH_CONFIG,
                ).removeItem()
            }
            state.yatri.loading = false
        },
        switchToGuestUser: (
            state,
            action: PayloadAction<{ userName: string; token: string }>,
        ) => {
            const {
                payload: { token, userName },
            } = action

            const newConfigState: UserAuthConfigType = {
                isGuestUserActive: true,
                sessionId: state.yatri.sessionId!,
                guestUserInfo: {
                    token: token,
                    userName: userName,
                },
                primaryUserInfo: {
                    token: state.yatri.token!,
                    userName: state.yatri.userName!
                },
            }

            state = {
                ...state,
                yatri: {
                    error: null,
                    loading: false,
                    res: null,
                    token: token,
                    userName: userName,
                    sessionId: state.yatri.sessionId
                },
                config: newConfigState,
            }

            localStorageHelper(LocalstorageKeysEnum.YATRI_AUTH_CONFIG).setItem(
                newConfigState,
            )
            window.location.reload()
        },
        switchToMainUser: state => {
            const newConfigState: UserAuthConfigType = {
                ...state.config,
                isGuestUserActive: false,
                guestUserInfo: null,
            }

            state = {
                ...state,
                yatri: {
                    error: null,
                    loading: false,
                    res: null,
                    token: state.config.primaryUserInfo?.token || null,
                    userName: state.config.primaryUserInfo?.userName || null,
                    sessionId: state.config.sessionId
                },
                config: newConfigState,
            }
            localStorageHelper(LocalstorageKeysEnum.YATRI_AUTH_CONFIG).setItem(
                newConfigState,
            )
            window.location.reload()
        },
    },
})

export const {
    loginYatri,
    setLoginYatriFailed,
    setLoginYatriSuccess,
    loadYatriAuthData,
    logoutYatri,
    switchToGuestUser,
    switchToMainUser,
} = authSlice.actions

export default authSlice.reducer
