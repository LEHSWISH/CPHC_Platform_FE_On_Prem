import axios from 'axios'
import { t } from 'i18next'
import { PayloadAction } from '@reduxjs/toolkit'
import { all, call, put, takeEvery } from 'redux-saga/effects'
import { loginApi } from '../../api'
import {
    UserAuthConfigType,
    loginYatri,
    setLoginYatriFailed,
    setLoginYatriSuccess,
} from '../slices/authSlice'
import { LoginApiPayloadType } from '../../../interface/ApiRequestPayoadTypes'
import { setFullPageLoader, setSnackBar } from '../slices/generalSlice'
import { LoginApiResponseType } from '../../../interface/ApiResponseTypes'
import { localStorageHelper } from '../../../utils/hooks/useLocalStorage'
import { LocalstorageKeysEnum } from '../../../enums/LocalStorageKeysEnum'

function* getYatriLoginAsync(
    action: PayloadAction<LoginApiPayloadType>,
): unknown {
    try {
        const res = yield call(loginApi, {
            password: action.payload.password,
            userName: action.payload.userName,
            redirectFromRegistration: action.payload.redirectFromRegistration,
            sessionId: action.payload.sessionId,
        })
        const data = res?.data as LoginApiResponseType
        yield put(
            setLoginYatriSuccess({
                ...data,
                userName: action.payload.userName,
            }),
        )
        localStorageHelper(LocalstorageKeysEnum.YATRI_AUTH_CONFIG).setItem({
            isGuestUserActive: false,
            primaryUserInfo: {
                token: data.token,
                userName: action.payload.userName,
            },
            guestUserInfo: null,
            sessionId: action.payload.sessionId
        } as UserAuthConfigType)

        yield put(
            setSnackBar({
                open: true,
                message: action?.payload?.redirectFromRegistration
                    ? 'eSwasthya Dham account created successfully' 
                    : 'Login successful',
                severity: 'success',
            }),
        )
        yield put(setFullPageLoader(true))
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data as LoginApiResponseType
            yield put(setLoginYatriFailed(data))
        } else {
            yield put(
                setLoginYatriFailed({
                    message: t('common_error_messages.something_went_wrong'),
                    token: null,
                    yatri: null,
                }),
            )
        }
        yield put(
            setSnackBar({
                open: true,
                message: t('common_error_messages.login_failed_invalid'),
                severity: 'error',
            }),
        )
        localStorageHelper(LocalstorageKeysEnum.YATRI_AUTH_CONFIG).removeItem()
    }
}

function* takeLoginAction() {
    yield takeEvery(loginYatri.type, getYatriLoginAsync)
}

export default function* authSagaRoot() {
    yield all([takeLoginAction()])
}
