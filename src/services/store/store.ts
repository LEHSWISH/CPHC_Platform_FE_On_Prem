/**
 * Redux Store Configuration
 * 
 * This file sets up the Redux store for the application. It combines reducers,
 * applies middleware, and integrates Redux-Saga for handling side effects.
 * The store is the central hub for managing the application's state.
 */


import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import generalReducer from './slices/generalSlice'
import rootSaga from './sagas'
import authReducer from './slices/authSlice'
import yatriSlice from './slices/yatriSlice'

const sagaMiddleware = createSagaMiddleware()
const middleware = [sagaMiddleware]

export const store = configureStore({
    reducer: {
        general: generalReducer,
        auth: authReducer,
        yatri: yatriSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(middleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
