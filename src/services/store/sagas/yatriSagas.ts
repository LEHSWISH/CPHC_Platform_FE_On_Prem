import { PayloadAction } from '@reduxjs/toolkit'
import { t } from 'i18next'
import { all, call, put, takeEvery } from 'redux-saga/effects'
import { allYatriDetailsApi } from '../../api'
import { setFullPageLoader, setSnackBar } from '../slices/generalSlice'
import { YatriAllDetailsResponseType } from '../../../interface/ApiResponseTypes'
import {
    loadYatriAllData,
    showYatriAllDataFailed,
    showYatriAllDataSuccess,
} from '../slices/yatriSlice'

function* getYatriAllDataAsync(
    action: PayloadAction<{ isShowFullScreenLoader?: string } | void>,
): unknown {
    if (action?.payload?.isShowFullScreenLoader) {
        yield put(setFullPageLoader(true))
    }
    try {
        const res = yield call(allYatriDetailsApi)
        const data = res?.data as YatriAllDetailsResponseType
        yield put(showYatriAllDataSuccess(data))
    } catch (error) {
        yield put(showYatriAllDataFailed())
        yield put(
            setSnackBar({
                open: true,
                message: t('common_error_messages.something_went_wrong'),
                severity: 'error',
            }),
        )
    } finally {
        if (action?.payload?.isShowFullScreenLoader) {
            yield put(setFullPageLoader(false))
        }
    }
}

function* takeGetYatriAllDataAction() {
    yield takeEvery(loadYatriAllData.type, getYatriAllDataAsync)
}

export default function* yatriSagaRoot() {
    yield all([takeGetYatriAllDataAction()])
}
