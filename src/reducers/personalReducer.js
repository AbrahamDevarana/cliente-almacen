import { types } from '../types'


const initialState = {
    personal: [],
    editedPersonal: null,
    isLoading: true,
    errors: null
}

// eslint-disable-next-line
export default (state = initialState, action) => {
    switch(action.type) {

        case types.GET_ALL_PERSONAL:
        case types.GET_PERSONAL:
        case types.CREATE_PERSONAL:
        case types.UPDATE_PERSONAL:
        case types.DELETE_PERSONAL:
            return {
                ...state,
                isLoading: true,
                errors: null,
                editedPersonal: null
            }
        case types.GET_ALL_PERSONAL_SUCCESS:
            return {
                ...state,
                personal: action.payload,
                isLoading: false,
                errors: null
            }
        
        case types.GET_PERSONAL_SUCCESS:
            return {
                ...state,
                editedPersonal: action.payload,
                isLoading: false,
                errors: null
            }

        case types.CREATE_PERSONAL_SUCCESS:
            return {
                ...state,
                personal: [...state.personal, action.payload],
                isLoading: false,
                errors: null
            }

        case types.UPDATE_PERSONAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                editedPersonal: null,
                personal: state.personal.map(item => ( item.id === action.payload.id ? action.payload : item ))
            }
            
        case types.DELETE_PERSONAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                personal: state.personal.filter(item => item.id !== action.payload.id)
            }
        
        case types.UPDATE_PERSONAL_ERROR:
        case types.DELETE_PERSONAL_ERROR:
        case types.GET_ALL_PERSONAL_ERROR:
        case types.GET_PERSONAL_ERROR:
        case types.CREATE_PERSONAL_ERROR:
            return {
                ...state,
                errors: action.payload,
                isLoading: false
            }
            
        default:
            return state
    }
}