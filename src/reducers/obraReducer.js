import { types } from '../types'


const initialState = {
    obra: [],
    isLoading: true,
    errors: null,
    editedObra: null,
    created: false,
    updated: false,
    deleted: false,
}

// eslint-disable-next-line
export default (state = initialState, action) => {
    switch (action.type) {
        case types.GET_ALL_OBRA:
        case types.GET_OBRA:
        case types.CREATE_OBRA:
        case types.UPDATE_OBRA:
        case types.DELETE_OBRA:
            return {
                ...state,
                isLoading: true,
                errors: null,
                editedObra: null,
                created: false,
                updated: false,
                deleted: false,
            }
        case types.GET_ALL_OBRA_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                obra: action.payload,
                editedObra: null,
            }
        case types.GET_OBRA_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                editedObra: action.payload
            }
        case types.CREATE_OBRA_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                obra: [...state.obra, action.payload],
                created: true
            }
        case types.UPDATE_OBRA_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                obra: state.obra.map(obra => ( obra._id === action.payload._id ? action.payload : obra )),
                updated: true,
                editedObra: null,
            }
        case types.DELETE_OBRA_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                obra: state.obra.filter(obra => obra.id !== action.payload.id),
                deleted: true
            }
        case types.GET_ALL_OBRA_ERROR:
        case types.GET_OBRA_ERROR:
        case types.CREATE_OBRA_ERROR:
        case types.UPDATE_OBRA_ERROR:
        case types.DELETE_OBRA_ERROR:

            return {
                ...state,
                isLoading: false,
                errors: action.payload
            }

        case types.CLEAN_ERROR_STATE:
            return {
                ...state,
                errors: null
        }
        default:
            return state
    }
}