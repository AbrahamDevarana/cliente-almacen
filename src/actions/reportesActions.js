import moment from 'moment';
import clientAxios from '../config/axios';
import { types } from '../types';

export function getReportesAcumuladosAction(params){
    console.log(params);
    return async (dispatch) => {
        dispatch(getAllReportesRequest())
        await clientAxios.get('/reportes', {params})
            .then ( res => {
                dispatch(getAllReportesSuccess(res.data))
            }).catch( err => {
                console.log('Error getAllReportesAction', err.response);
                dispatch(getAllReportesError(err.response.data.message))
            } )
    }
}

const getAllReportesRequest = () => {
    return {
        type: types.GET_ALL_REPORTE
    }
}
const getAllReportesSuccess = payload => {
    return {
        type: types.GET_ALL_REPORTE_SUCCESS,
        payload
    }
}
const getAllReportesError = error => {
    return {
        type: types.GET_ALL_REPORTE_ERROR,
        payload: error
    }
}


export function getReportesGeneralAction(params){

    console.log(params);
    return async (dispatch) => {
        dispatch(getReporteGeneralRequest())
        await clientAxios.get('/reportes/general', {params})
            .then ( res => {
                dispatch(getReporteGeneralSuccess(res.data))
            }).catch( err => {
                console.log('Error getAllReportesAction', err.response);
                dispatch(getReporteGeneralError(err.response.data.message))
            } )
    }
}

const getReporteGeneralRequest = () => {
    return {
        type: types.GET_ALL_REPORTE
    }
}
const getReporteGeneralSuccess = payload => {
    return {
        type: types.GET_ALL_REPORTE_SUCCESS,
        payload
    }
}
const getReporteGeneralError = error => {
    return {
        type: types.GET_ALL_REPORTE_ERROR,
        payload: error
    }
}


export function generateReporteGeneralAction(params){
    params.isReport = false;
    return async (dispatch) => {
        dispatch(generateReporteRequest())
        await clientAxios.get('/reportes/export-reporte-general', {params})
            .then ( res => {
                dispatch(generateReporteSuccess(res.data))
            }).catch( err => {
                console.log('Error getAllReportesAction', err.response);
                dispatch(generateReporteError(err.response.data.message))
            } )
    }
}


export function generateReporteAcumuladoAction(params){
    params.isReport = false;
    return async (dispatch) => {
        dispatch(generateReporteRequest())
        await clientAxios.get('/reportes/export-reporte-acumulado', {params})
            .then ( res => {
                dispatch(generateReporteSuccess(res.data))
            }).catch( err => {
                console.log('Error getAllReportesAction', err.response);
                dispatch(generateReporteError(err.response.data.message))
            } )
    }
}

const generateReporteRequest = () => {
    return {
        type: types.GENERATE_REPORTE
    }
}

const generateReporteSuccess = payload => {
    return {
        type: types.GENERATE_REPORTE_SUCCESS,
        payload
    }
}

const generateReporteError = error => {
    return {
        type: types.GENERATE_REPORTE_ERROR,
        payload: error
    }
}


export function cleanGenerarReporteAction(){
    return (dispatch) => {
        dispatch({
            type: types.CLEAN_GENERAR_REPORTE
        })
    }
}



export function generarReportePdfGeneralAction(params) {
    params.isReport = true;
    return async (dispatch) => {
        dispatch(generarReportePdfRequest())
        await clientAxios.get('/reportes/export-reporte-general', {params,
            responseType: 'blob'
        }).then ( res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Reporte-${moment().format('DD-MM-YYYY-hh-mm')}.pdf`);
                document.body.appendChild(link);
                link.click();
                dispatch(generarReportePdfSuccess(res.data))
            }).catch( err => {
                console.log('Error getAllReportesAction', err.response);
                dispatch(generarReportePdfError(err.response.data.message))
            } )
    }
}

export function generarReportePdfAcumuladoAction(params) {

    params.isReport = true;

    return async (dispatch) => {
        dispatch(generarReportePdfRequest())
        await clientAxios.get('/reportes/export-reporte-acumulado', {params,  responseType: 'blob'})
            .then ( res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Reporte-${moment().format('DD-MM-YYYY-hh-mm')}.pdf`);
                document.body.appendChild(link);
                link.click();
                dispatch(generarReportePdfSuccess(res.data))
            }).catch( err => {
                console.log('Error getAllReportesAction', err.response);
                dispatch(generarReportePdfError(err.response.data.message))
            } )
    }
}

const generarReportePdfRequest = () => {
    return {
        type: types.GENERAR_REPORTE_PDF
    }
}

const generarReportePdfSuccess = payload => {
    return {
        type: types.GENERAR_REPORTE_PDF_SUCCESS,
        payload
    }
}

const generarReportePdfError = error => {
    return {
        type: types.GENERAR_REPORTE_PDF_ERROR,
        payload: error
    }
}



               