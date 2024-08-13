import { all } from 'redux-saga/effects'
import authSagaRoot from './authSagas'
import yatriSagaRoot from './yatriSagas'

export default function* rootSaga() {
    yield all([authSagaRoot(), yatriSagaRoot()])
}
