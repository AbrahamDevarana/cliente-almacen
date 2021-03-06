import clientAxios from '../config/axios';
import { types } from '../types';

export function createValeAction(vale){
    return async (dispatch) => {
        dispatch(createValeRequest())
        await clientAxios.post('/vales', vale)
            .then ( res => {
                dispatch(createValeSuccess(res.data.valeSalida))
            }).catch( err => {
                console.log('Error createValeAction', err.response);
                dispatch(createValeError(err.response.data))
            } )
    }
}

const createValeRequest = () => {
    return {
        type: types.CREATE_VALE
    }
}
const createValeSuccess = payload => {
    return {
        type: types.CREATE_VALE_SUCCESS,
        payload
    }
}
const createValeError = error => {
    return {
        type: types.CREATE_VALE_ERROR,
        payload: error
    }
}


export function getAllValesAction(){
    return async (dispatch) => {
        dispatch(getAllValesRequest())
        await clientAxios.get('/vales')
            .then ( res => {
                dispatch(getAllValesSuccess(res.data.valeSalida))
            }).catch( err => {
                console.log('Error getAllValesAction', err.response);
                dispatch(getAllValesError(err.response.data))
            } )
    }
}
const getAllValesRequest = () => {
    return {
        type: types.GET_ALL_VALE
    }
}
const getAllValesSuccess = payload => {
    return {
        type: types.GET_ALL_VALE_SUCCESS,
        payload
    }
}
const getAllValesError = error => {
    return {
        type: types.GET_ALL_VALE_ERROR,
        payload: error
    }
}

export function deliverValeAction(vale){
    return async (dispatch) => {
        dispatch(deliverValeRequest())
        await clientAxios.post('/vales/deliver', vale)
            .then ( res => {
                dispatch(deliverValeSuccess(res.data))
            }).catch( err => {
                console.log('Error deliverValeAction', err.response);
                dispatch(deliverValeError(err.response.data))
            } )
    }
}


const deliverValeRequest = () => {
    return {
        type: types.DELIVER_VALE
    }
}
const deliverValeSuccess = payload => {
    return {
        type: types.DELIVER_VALE_SUCCESS,
        payload
    }
}
const deliverValeError = error => {
    return {
        type: types.DELIVER_VALE_ERROR,
        payload: error
    }
}

export function searchValeAction(params){
    return async (dispatch) => {
        dispatch(getAllValesRequest())
        await clientAxios.get('/vales/search', {params})
            .then ( res => {
                dispatch(getAllValesSuccess(res.data.valeSalida))
            }).catch( err => {
                console.log('Error getAllValesAction', err.response);
                dispatch(getAllValesError(err.response.data))
            } )
    }
}

export function closeValeAction(vale){
    return async (dispatch) => {
        dispatch(closeValeRequest())
        await clientAxios.post('/vales/closeVale', vale)
            .then ( res => {
                dispatch(closeValeSuccess(res.data))
            }).catch( err => {
                console.log('Error closeValeAction', err.response);
                dispatch(closeValeError(err.response.data))
            } )
    }
}

export function cancelValeAction(vale){
    return async (dispatch) => {
        dispatch(closeValeRequest())
        await clientAxios.post('/vales/cancelVale', vale)
            .then ( res => {
                dispatch(closeValeSuccess(res.data))
            }).catch( err => {
                console.log('Error cancelValeAction', err.response);
                dispatch(closeValeError(err.response.data))
            } )
    }
}

export function cancelDetalleAction(vale){
    return async (dispatch) => {
        dispatch(closeDetalleRequest())
        await clientAxios.post('/vales/cancelDetalle', vale)
            .then ( res => {
                dispatch(closeDetalleSuccess(res.data))
            }).catch( err => {
                console.log('Error cancelDetalleAction', err.response);
                dispatch(closeDetalleError(err.response.data))
            } )
    }
}

export function completeValeSalida(vale){
    return async (dispatch) => {
        dispatch(closeValeRequest())
        await clientAxios.post('/vales/completeVale', vale)
            .then ( res => {
                dispatch(closeValeSuccess(res.data))
            }).catch( err => {
                console.log('Error completeValeSalida', err.response.data);
                dispatch(closeValeError(err.response.data))
            } )
    }
}

const closeValeRequest = () => {
    return {
        type: types.CLOSE_VALE
    }
}
const closeValeSuccess = payload => {
    return {
        type: types.CLOSE_VALE_SUCCESS,
        payload
    }
}
const closeValeError = error => {
    return {
        type: types.CLOSE_VALE_ERROR,
        payload: error
    }
}

const closeDetalleRequest = () => {
    return {
        type: types.CLOSE_DETALLE
    }
}
const closeDetalleSuccess = payload => {
    return {
        type: types.CLOSE_DETALLE_SUCCESS,
        payload
    }
}
const closeDetalleError = error => {
    return {
        type: types.CLOSE_DETALLE_ERROR,
        payload: error
    }
}
