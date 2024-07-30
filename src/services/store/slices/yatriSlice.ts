import { Action, PayloadAction, createSlice } from '@reduxjs/toolkit'
import { t } from 'i18next'
import { YatriAllDetailsResponseType } from '../../../interface/ApiResponseTypes'

interface LogoutAction extends Action {}
function isLogoutAction(action: Action): action is LogoutAction {
    return action.type.includes('logout')
}

interface YatriState {
    yatriAllDetails: {
        data: YatriAllDetailsResponseType | null
        res: YatriAllDetailsResponseType | null
        loading: boolean
        error: string | null
    }
    abhaCardDetails: {
        abhaCardImage: string | null
        abhaCardPdfUrl: string | null
        abhaNumber?: string | null
        fileBase64?:string | null
    }

}

const initialState: YatriState = {
    yatriAllDetails: {
        data: null,
        res: null,
        loading: false,
        error: null,
    },
    abhaCardDetails: {
        abhaCardImage: null,
        abhaCardPdfUrl: null,
        abhaNumber: null,
        fileBase64: null
    }
}

export const yatriSlice = createSlice({
    name: 'YATRI',
    initialState,
    reducers: {
        showYatriAllDataSuccess: (
            state,
            action: PayloadAction<YatriAllDetailsResponseType>,
        ) => {
            state.yatriAllDetails = {
                res: action.payload,
                data: action.payload,
                error: null,
                loading: false,
            }
        },
        showYatriAllDataFailed: state => {
            state.yatriAllDetails = {
                res: null,
                data: null,
                error: t('common_error_messages.something_went_wrong'),
                loading: false,
            }
        },
        loadYatriAllData: (
            state,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            _action: PayloadAction<{ isShowFullScreenLoader: boolean } | undefined>,
        ) => {
            state.yatriAllDetails = {
                data: state.yatriAllDetails.data,
                res: null,
                error: null,
                loading: true,
            }
        },
        setAbhaCardDetails: (
            state,
            action: PayloadAction<{
                abhaCardImage?: string | null
                abhaCardPdfUrl?: string | null
                abhaNumber?: string | null
            }>,
        ) => {
            state.abhaCardDetails = {
                abhaCardImage: action.payload.abhaCardImage?action.payload.abhaCardImage : state.abhaCardDetails.abhaCardImage,
                abhaCardPdfUrl: action.payload.abhaCardPdfUrl ?action.payload.abhaCardPdfUrl :state.abhaCardDetails.abhaCardPdfUrl,
                abhaNumber: action?.payload?.abhaNumber ?action?.payload?.abhaNumber:state.abhaCardDetails.abhaNumber,
            }
        },
    },
    extraReducers: builder => {
        builder.addMatcher(isLogoutAction, (state) => {
            state = initialState
            return state
        })
    },
})

export const {
    showYatriAllDataSuccess,
    showYatriAllDataFailed,
    loadYatriAllData,
    setAbhaCardDetails
} = yatriSlice.actions

export default yatriSlice.reducer
