import { types } from '../types'


const initialState = {
    actividades: [],
    isLoading: false,
    errors: null,
    editedActividad: null,
    created: false,
    updated: false,
    deleted: false,
}

// eslint-disable-next-line
export default (state = initialState, action) => {
    switch (action.type) {
        case types.GET_ALL_ACTIVIDAD:
        case types.GET_ACTIVIDAD:
        case types.CREATE_ACTIVIDAD:
        case types.UPDATE_ACTIVIDAD:
        case types.DELETE_ACTIVIDAD:
            return {
                ...state,
                isLoading: true,
                errors: null,
                editedActividad: null,
                created: false,
                updated: false,
                deleted: false,
            }
        case types.GET_ALL_ACTIVIDAD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                actividades: action.payload,
                editedActividad: null
            }

        case types.GET_ACTIVIDAD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                editedActividad: action.payload
            }

        case types.CREATE_ACTIVIDAD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                actividades: [...state.actividades, action.payload],
                created: true
            }
        case types.CLEAN_ERROR_STATE:
            return {
                ...state,
                errors: null
            }
        case types.UPDATE_ACTIVIDAD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                actividades: state.actividades.map(actividad => actividad.id === action.payload.id ? action.payload : actividad),
                updated: true,
                editedActividad: null,
            }
        
        case types.DELETE_ACTIVIDAD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                actividades: state.actividades.filter(actividad => actividad.id !== action.payload.id),
                deleted: true,
            }

        case types.DELETE_ACTIVIDAD_ERROR:
        case types.UPDATE_ACTIVIDAD_ERROR:    
        case types.CREATE_ACTIVIDAD_ERROR:
        case types.GET_ACTIVIDAD_ERROR:
        case types.GET_ALL_ACTIVIDAD_ERROR:
            return {
                ...state,
                isLoading: false,
                errors: action.payload
            }
        default:
            return state
    }
}