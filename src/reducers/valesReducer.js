import { types } from '../types'


const initialState = {
    vales: [],
    editedVale: null,
    isLoading: true,
    errors: null
}

export default (state = initialState, action) => {
    switch(action.type) {

        case types.GET_ALL_VALE:
        case types.GET_VALE:
        case types.CREATE_VALE:
            return {
                ...state,
                isLoading: true,
                errors: null,
                editedVale: null
            }
        
        case types.UPDATE_VALE:
            return {
                ...state,
                isLoading: true,
                errors: null,
            }

        case types.GET_ALL_VALE_SUCCESS:
            return {
                ...state,
                vales: action.payload,
                isLoading: false,
                errors: null
            }
        
        case types.GET_VALE_SUCCESS:
            return {
                ...state,
                editedVale: action.payload,
                isLoading: false,
                errors: null
            }

        case types.CREATE_VALE_SUCCESS:
            return {
                ...state,
                vales: [...state.vales, action.payload],
                isLoading: false,
                errors: null
            }

        case types.UPDATE_VALE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
            }

        case types.GET_ALL_VALE_ERROR:
        case types.GET_VALE_ERROR:
        case types.CREATE_VALE_ERROR:
        case types.UPDATE_VALE_ERROR:
            return {
                ...state,
                isLoading: false,
                errors: action.payload
            }

        default:
            return state
    }
}

