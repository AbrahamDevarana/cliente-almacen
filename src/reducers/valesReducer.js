import { types } from '../types'


const initialState = {
    vales: [],
    detalleSalida: [],
    editedVale: null,
    isLoading: true,
    isLoadingDetalles: true,
    errors: null,
    created: false,
    updated: false,
    delivered: false,
    deleted: false,
    count: [],
    paginate: {}
}

// eslint-disable-next-line
export default (state = initialState, action) => {
    switch(action.type) {

        case types.GET_ALL_VALE:
        case types.GET_VALE:
        case types.CREATE_VALE:
        case types.CLOSE_VALE:
        case types.CLOSE_DETALLE:
        case types.DELIVER_VALE:
        case types.COUNT_VALE_SALIDA:
            return {
                ...state,
                isLoading: true,
                errors: null,
                editedVale: null,
                created: false,
                updated: false,
                delivered: false,
                deleted: false,
                isLoadingDetalles: false,
            }
        case types.GET_DETALLE_SALIDA:
            return {
                ...state,
                detalleSalida: [],
                isLoadingDetalles: true,
                errors: null,
                editedVale: null,
                created: false,
                updated: false,
                delivered: false,
                deleted: false,
            }

        case types.DELIVER_VALE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                delivered: true,
                
                vales: state.vales.map(vale => {
                    if(vale.id === action.payload.valeSalida.id) {
                        vale.statusVale = action.payload.valeSalida.statusVale
                    }
                    return vale
                }),
                detalleSalida: state.detalleSalida.map(detalle => {
                    if(detalle.id === action.payload.detalleSalida.id) {
                        detalle.status = action.payload.detalleSalida.status
                        detalle.cantidadEntregada = action.payload.detalleSalida.cantidadEntregada
                    }
                    return detalle
                })
            }

        case types.DELIVER_VALE_ERROR:    
            return {
                ...state,
                isLoading: false,
                errors: action.payload.message,
                delivered: false,
                // vales: state.vales.map(vale => ( vale.id === action.payload.valeSalida.id ? action.payload.valeSalida : vale )) ,
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
                vales: action.payload.rows,
                paginate: {
                    totalItem:action.payload.totalItem,
                    totalPages:action.payload.totalPages,
                    currentPage:action.payload.currentPage,
                },
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
                errors: null,
                created: true
            }

        case types.UPDATE_VALE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                vales: state.vales.map(vale => ( vale.id === action.payload.id ? action.payload : vale )),
                updated: true
            }

        case types.GET_ALL_VALE_ERROR:
        case types.GET_VALE_ERROR:
        case types.CREATE_VALE_ERROR:
        case types.UPDATE_VALE_ERROR:
        case types.CLOSE_VALE_ERROR:
        case types.CLOSE_DETALLE_ERROR:
        case types.GET_DETALLE_SALIDA_ERROR:
        case types.COUNT_VALE_SALIDA_ERROR:
            return {
                ...state,
                isLoading: false,
                isLoadingDetalles: false,
                errors: action.payload.message
            }
        case types.CLEAN_ERROR_STATE:
            return {
                ...state,
                errors: null
            }

        case types.CLOSE_VALE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                vales: state.vales.map( vale => ( vale.id === action.payload.valeSalida.id ? action.payload.valeSalida : vale ) ),
                updated: true
            }
        case types.CLOSE_DETALLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errors: null,
                deleted: true,
                vales: state.vales.map(vale => {
                    if(vale.id === action.payload.valeSalida.id) {
                        vale.statusVale = action.payload.valeSalida.statusVale
                    }
                    return vale
                }),
                detalleSalida: state.detalleSalida.map(detalle => {
                    if(detalle.id === action.payload.detalleSalida.id) {
                        detalle.status = action.payload.detalleSalida.status 
                    }
                    return detalle
                })
            }

        case types.COUNT_VALE_SALIDA_SUCCESS:
            return { 
                ...state,
                isLoading: false,
                errors: null,
                count: action.payload
            }
        

        case types.GET_DETALLE_SALIDA_SUCCESS:
            return {
                ...state,
                errors: null,
                isLoadingDetalles: false,
                detalleSalida: action.payload
            }


        default:
            return state
    }
}


