
import { BellOutlined, CheckCircleOutlined, FileTextOutlined, PieChartOutlined, PlusCircleOutlined, StopOutlined } from '@ant-design/icons';
import { cancelDetalleAction, cancelValeAction, closeValeAction, completeValeSalida, deliverValeAction, getAllValesAction, getCountValeSalidaAction, searchValeAction } from '../../actions/valeActions';
import { BsInfoCircle } from 'react-icons/bs'
import { Button, Table, Tag, Modal, Input, Badge, Avatar, Image, Tooltip, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { getColumnSearchProps } from '../../hooks/useFilter'
import { nanoid } from 'nanoid'
import '../../assets/scss/showVale.scss'
import ekIcon from "../../assets/img/Original-EK.png"
import ekIcon2 from "../../assets/img/Original-EK2.png"
import openNotificationWithIcon from '../../hooks/useNotification';
import moment from 'moment';
import { hasPermission } from '../../utils/hasPermission';
import Forbidden from '../../components/Elements/Forbidden';
// import { ResizableTitle } from "../../utils/resizableTable";

const ValesSalida = () => {

    const { TextArea } = Input;
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { vales, errors, delivered, updated, isLoading, count, deleted } = useSelector( state => state.vales )
    const { userAuth } = useSelector( state => state.auth )
    const { userPermission } = useSelector(state => state.permisos);
    const [ tableReady , setTableReady ] = useState(false)
    const [ dataSource, setDataSource ] = useState([]);
    const [ dataNestedSource, setDataNestedSource ] = useState([])
    const [ validarCantidad, setValidarCantidad ] = useState(true)
    const [activeExpRow, setActiveExpRow] = useState();
    const [ loadedColumn , setLoad ] = useState(false)
    const [ displayComentarios, setComentarios ] = useState('')
    const [ displayInsumo, setDisplayInsumo ] = useState({ })
    
    const [ visible, setVisible] = useState({
            entrega: false,
            cancelar: false,
            cerrar: false,
            enktrl:false,
            comentarios:false,
            insumoInfo:false
    });
	
    const [ entrega, setEntrega ] = useState({
        id: 0,
        valeSalidaId: 0,
        insumoId: 0,
        cantidadEntregada: 0,
        type: 1,
        comentarios: null
    })

    const [ cancel, setCancel ] = useState({
        type: 0,
        comentarios: '',
        id:0
    })

    const [ enkontrol, setEnkontrol ] = useState({
        salidaEnkontrol: '',
        id:0
    })

    const showModal = (props) => {
        setVisible(props);
    };
    
    const hideModal = () => {
        setVisible(false);
        setValidarCantidad(true)
        setEntrega({
            id: 0,
            valeSalidaId: 0,
            insumoId: 0,
            cantidadEntregada: 0,
            comentarios: '',
            type: 1
        })
    };
    ;
    const actionColumn = {
        title: 'Acciones',
        dataIndex: 'statusValue',
        key: `statusVale`,
        className:"text-center",
        render: (text, record) => (
            <div>
                { 
                    record.statusVale === 1 ? 
                    <div className='flex justify-center text-center'>
                        { hasPermission(userPermission, '/editar-vales') ? 
                            <Tooltip title="Entrega Completa" placement='topRight'>
                                <Button type='icon-primary' className='icon' onClick={ () => handleEntrega(record, 3)}> <CheckCircleOutlined className='ml-0 align-middle text-xl' /> </Button>
                            </Tooltip> 
                            : null
                        }
                        {
                            hasPermission(userPermission, '/eliminar-vales') ? 
                            <Tooltip title="Cancelar Entrega" placement='topRight'>
                                <Button type='icon-danger' className='icon' onClick={() => handleCancel(1, record.id)}> <StopOutlined className='ml-0 align-middle text-xl' /> </Button> 
                            </Tooltip>
                            : null
                        }
                    </div> : 
                   record.statusVale === 3 || record.statusVale === 4  ? 
                    <>
                        { hasPermission(userPermission, '/editar-vales') ? 
                        <Tooltip title="Registro Enkontrol" placement='topRight'>
                            <Button type='icon-warning' className='icon' onClick={()=> handleClose(record.id)}> 
                                <img src={ekIcon} alt="sa" width={16} className="py-0.5" />
                            </Button>
                        </Tooltip>
                        : null
                        }
                    </>
                    : 
                   <div className="h-6">
                        { record.salidaEnkontrol || record.comentarios || record.salidaEnkontrol !== null || record.comentarios !== null ? 
                            <Tooltip title="Ver Información" placement='topRight'>
                                <Button type='icon-danger'><BsInfoCircle className='text-xl' onClick={() => { setComentarios(record); showModal({...visible, comentarios: true}); }}/></Button> 
                            </Tooltip>
                            : null 
                        }
                    </div>
                }
            </div>
        ),
        width: '8%'
    }

    useEffect(() => {
            dispatch(getAllValesAction())
            dispatch(getCountValeSalidaAction())
        // eslint-disable-next-line
    }, [])
    
    useEffect(() => {
		setDataSource(
			vales.map( (item, i) => (
				{ 
                    key: i, 
                    residente:`${item.user.nombre} ${item.user.apellidoPaterno}`,
                    residentePicture: item.user.picture,
                    personalInfo: `${item.personal.nombre} ${item.personal.apellidoPaterno}`,
                    actividadInfo: item.actividad.nombre,
                    aciones:item.id, 
                    ...item 
                }
			))
		)

        if((hasPermission(userPermission, '/editar-vales') || hasPermission(userPermission, '/eliminar-vales') ) && !loadedColumn ){
            setLoad(true)
            setColumns([...columns, actionColumn])
        }

        setTableReady(true)
        // eslint-disable-next-line
    }, [vales])

    const [columns, setColumns] = useState([
        {
            title: 'Folio',
            dataIndex: 'id',
            key: `id-${nanoid()}`,
            responsive: ['lg'],
            sorter: (a, b) => a.id - b.id,
            ...getColumnSearchProps('id'),
            width: '5%'
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: `fecha-${nanoid()}`,
            ...getColumnSearchProps('fecha'),
            responsive: ['lg'],
            width: '5%',
            render: (text, record) => (
                <div>
                    { moment(record.fecha).format('D MMM') }
                </div>
            ),
        },
        {
            title: 'Fase',
            dataIndex: 'statusVale',
            key: `statusVale-${nanoid()}`,
            width: '5%',
            className: 'text-center',
            render: (text, record) => (
            record.statusVale === 1 || record.statusVale === 2? 
                <div className='flex items-center justify-end'>
                    <Badge color={'green'}  className="align-middle justify-center items-center text-center mx-auto" />
                    <p className='text-xs w-16 hidden sm:block'> Abierto </p>
                </div>
            :
            record.statusVale === 3 || record.statusVale === 4 || record.statusVale === 5? 
                <div className='flex items-center justify-end'>
                    <Badge color={'red'}  className="align-middle justify-center items-center text-center mx-auto" />
                    <p className='text-xs w-16 hidden sm:block'> Cerrado </p>
                </div>
            :
            record.statusVale === 7 || record.statusVale === 6 ? 
                <div className='flex items-center justify-end'>
                    <Badge color={'orange'}  className="align-middle justify-center items-center text-center mx-auto" />
                    <p className='text-xs w-16 hidden sm:block'> Registrado </p>
                </div>
            : ''
            ),
        },
        {
            title: 'Estatus',
            dataIndex: 'statusVale',
            key: 'statusVale',
            render: (text, record, index) => ( 
                <div className='w-full justify-center text-center flex'>
                { 
                    record.statusVale === 1 ? <Tag className='m-auto w-full' key={nanoid(4)} color="blue">Nuevo</Tag> :
                    record.statusVale === 2 ? <Tag className='m-auto w-full' key={nanoid(4)} color="orange">Parcial</Tag> :
                    record.statusVale === 3 ? <Tag className='m-auto w-full' key={nanoid(4)} color="orange">Parcial</Tag> :
                    record.statusVale === 4 ? <Tag className='m-auto w-full' key={nanoid(4)} color="green">Entregado</Tag> :
                    record.statusVale === 5 ? <Tag className='m-auto w-full' key={nanoid(4)} color="red">Cancelado</Tag> :
                    record.statusVale === 6 ? <Tag className='m-auto w-full' key={nanoid(4)} color="orange">Parcial</Tag> :
                    record.statusVale === 7 ? <Tag className='m-auto w-full' key={nanoid(4)} color="green">Entregado</Tag> :
                    null
                }
            </div>
            ),
            filters: [
                { 
                    text: 'Por Entregar',
                    value: 1
                },
                { 
                    text: 'Parcial Abierto',
                    value: 2
                },
                { 
                    text: 'Parcial Cerrado',
                    value: 6
                },
                { 
                    text: 'Entregado',
                    value: 4
                },
                { 
                    text: 'Cancelado',
                    value: 5
                },
                { 
                    text: 'Enkontrol',
                    value: 7
                },
            ],
            onFilter: (value, record) => record.statusVale === value,
            width: '5%'
        },
        {
            title: 'Solicitante',
            dataIndex: 'residente',
            responsive: ['lg'],
            key: `residente-${nanoid()}`,
            sorter: (a, b) => a.residente.localeCompare(b.residente),
            ...getColumnSearchProps('residente'),
            // width: 450,
            render: (text, record) => (
                <div className='flex flex-row items-center'>
                    <Avatar crossOrigin='anonymous' src={ <Image src={record.residentePicture} /> || '' } />
                    <p className='ml-4'> { record.residente} </p>
                </div>
            ),
            width: '25%'
        },
        {
            title: 'Lider',
            dataIndex: 'personalInfo',
            key: `personalInfo-${nanoid()}`,
            ellipsis: true,
            sorter: (a, b) => a.personalInfo.localeCompare(b.personalInfo),
            ...getColumnSearchProps('personalInfo'),
            width: '22%',
        },
        {
            title: 'Actividad',
            dataIndex: 'actividadInfo',
            key: `actividadInfo-${nanoid()}`,
            ellipsis: true,
            sorter: (a, b) => a.actividadInfo.localeCompare(b.actividadInfo),
            ...getColumnSearchProps('actividadInfo'),
            width: '25%',
        },
        
    ])  

    const expandedRowRender = (record, index, indent, expanded) => {

        if(expanded){
            setDataNestedSource( record.detalle_salidas )
        }
    
        const columns = [
            {
                title: 'Enkontrol',
                dataIndex: 'insumo',
                key: `clave-${nanoid()}`,
                render: item =>  item.claveEnk,
                responsive: ['lg'],
                width: '7%'
            },
            {
                title: 'Estatus',
                dataIndex: 'acciones',
                key: `acciones-${nanoid()}`,
                render: (text, record, index) => (
                    record.status === 1 ?
                    <Tag color="blue" className='w-full text-center'> Nuevo </Tag>
                    : record.status === 2 ? <Tag key={index} className='w-full text-center' color="orange">Parcial</Tag> 
                    : record.status === 6 ? <Tag key={index} className='w-full text-center' color="volcano">Parcial</Tag>
                    : record.status === 3 ? <Tag key={index} className='w-full text-center' color="green">Entregado</Tag> 
                    : record.status === 4 ? <Tag key={index} className='w-full text-center' color="red">Cancelado</Tag>
                    : record.status === 5 ? <Tag key={index} className='w-full text-center' color="magenta">Cerrado</Tag>
                    : null
                ),
                width: '6%'
            },
            {
                title: 'Nombre',
                dataIndex: 'insumo',
                key: `nombre-${nanoid()}`,
                render: item => item.nombre,
                ellipsis: true,
                width: '39%'
            },
            {
                title: 'U.Medida',
                dataIndex: 'insumo',
                key: `unidad-${nanoid()}`,
                render: item => item.unidadMedida,
                width: '10%',
                responsive: ['lg']
            },
            {
                title: 'Solicitado',
                dataIndex: 'cantidadSolicitada',
                key: `cantidadSolicitada-${nanoid()}`,
                render: item => Number(item),
                width: '10%'
            },
            {
                title: 'Entregado',
                dataIndex: 'cantidadEntregada',
                key: `cantidadEntregada-${nanoid()}`,
                render: item => Number(item),
                width: '10%',
                responsive: ['lg']
            },
            {
                title: 'Pendiente',
                dataIndex: 'detalle_salidas',
                key: `detalle_salidas-${nanoid()}`,
                render: (text, record) => (record.cantidadSolicitada - record.cantidadEntregada ),
                width: '10%'
            },
            {
                // Detalle Estatus / Acciones
                title: 'Acciones',
                dataIndex: 'acciones',
                key: `acciones-${nanoid()}`,
                render: (text, record, index) => (
                    hasPermission(userPermission, '/editar-vales') || hasPermission(userPermission, '/eliminar-vales') ?
                        record.status === 1 || record.status === 2?
                        <div key={index} className="flex justify-center">
                            {
                                hasPermission(userPermission, '/editar-vales') ? 
                                <>
                                    <Tooltip placement='topRight' title="Entrega Completa"><Button className="icon" htmlType='button' onClick={ () => handleEntrega(record, 1) } type='icon-primary'> <CheckCircleOutlined className='align-middle text-xl' /> </Button></Tooltip>
                                    <Tooltip placement='topRight' title="Entrega Parcial"><Button className="icon" htmlType='button' onClick={ () => handleEntrega(record, 2) } type='icon-warning'> <PieChartOutlined className='align-middle text-xl' /> </Button> </Tooltip>
                                </>
                                : null
                            }
                            {
                                hasPermission(userPermission, '/eliminar-vales') ? 
                                <Tooltip placement='topRight' title="Cancelar Insumo"> <Button className="icon" htmlType='button' onClick={ () => handleCancel(2, record.id) } type='icon-danger'> <StopOutlined className='align-middle text-xl' /> </Button> </Tooltip>
                                : null
                            }
                        </div>
                        : 
                        <div className="flex justify-center h-6" key={index}> 
                       
                        <Button type='icon-warning' onClick={ () => { setDisplayInsumo(record); showModal({...visible, insumoInfo: true}); } } htmlType='button' className='icon'><BsInfoCircle className='text-xl align-middle' /> </Button>
                        
                        </div>
                    : null
                ),
                width: hasPermission(userPermission, '/editar-vales') || hasPermission(userPermission, '/eliminar-vales') ? '8%': 0,
                className: hasPermission(userPermission, '/editar-vales') || hasPermission(userPermission, '/eliminar-vales') ? 'block' : 'hidden',
            },
 
        ]
        return <Table bordered key={record => record.id + nanoid()} scroll={{ x: 'auto' }} columns={columns} dataSource={dataNestedSource} pagination={false} rowKey={nanoid()}  className="nestedTable"/>
    }

    const handleEntrega = (record, type) => {

        setEntrega({
            ...entrega,
            id: record.id,
            valeSalidaId: record.valeSalidaId,
            insumoId: record.insumoId,
            type: type,
            cantidadEntregada: type === 1? Number(record.cantidadSolicitada) - Number(record.cantidadEntregada) : Number(entrega.cantidadEntregada),
            cantidadSolicitada: Number(record.cantidadSolicitada)
        })


        showModal({
            entrega: true,
            cancelar: false,
            cerrar: false,
            enktrl: false,
            comentarios: false,
            insumoInfo: false
        })

    }

    const handleCancel = (type, id) => {
        showModal ({
            entrega: false,
            cancelar: true,
            cerrar: false,
            enktrl: false,
            comentarios: false
        })

        setCancel({
            ...cancel,
            type,
            id
        })
    }

    const handleClose = (id) =>{
        showModal ({
            entrega: false,
            cancelar: false,
            cerrar: false,
            enktrl: true,
            comentarios: false,
            insumoInfo: false
        })

        setEnkontrol({
            ...enkontrol,
            id
        })
    }

    const handleSubmitClose = () => {
        dispatch(closeValeAction(enkontrol))
    }

    const handleSubmitCancel = () => {
        if (cancel.type === 1 ) {
            dispatch(cancelValeAction(cancel))
        }
        if( cancel.type === 2){
            dispatch(cancelDetalleAction(cancel))
        }
    }

    const handleSubmit = () => {
        if(entrega.type === 3){
            dispatch(completeValeSalida(entrega))
        }else{ 
            dispatch(deliverValeAction(entrega))
        }
    }

    useEffect(() => {
        displayAlert()
        // eslint-disable-next-line
    }, [errors, delivered, updated, deleted])

    const displayAlert = () => {
        if(errors){
            openNotificationWithIcon('error', errors)
        }
        if(delivered){
            openNotificationWithIcon('success', 'Se ha guardado correctamente')
            setEntrega({
                id: 0,
                valeSalidaId: 0,
                insumoId: 0,
                cantidadEntregada: 0,
                comentarios: '',
                type: 1
            })
            hideModal()
        }
        if(updated){
            openNotificationWithIcon('success', 'Se ha guardado correctamente')
            setCancel({
                type: 0,
                comentarios: '',
                id:0
            })
            hideModal()
        }
        if(deleted){
            openNotificationWithIcon('success', 'Se ha cancelado correctamente')
            setCancel({
                type: 0,
                comentarios: '',
                id:0
            })
            hideModal()
         }
    }

    const handleChange = (e) => {
        const { value } = e.target
        setEntrega({ 
            ...entrega, 
            cantidadEntregada: Number(value)
        })
    
        if( (entrega.cantidadSolicitada - buscarEntregado(entrega.valeSalidaId, entrega.id))  < value ){
            setValidarCantidad(false)
        } else {
            setValidarCantidad(true)
        }
    }

    const buscarEntregado = (valeSalidaId, id) => {
        const [{detalle_salidas}] = vales.filter( item => item.id === valeSalidaId)
        const [result] = detalle_salidas.filter( item => item.id === id)
   
        return result.cantidadEntregada
    }


    if(!hasPermission(userPermission, '/ver-vales') && !isLoading ) return <Forbidden/>
    if( !tableReady ) return <Spin tip='Cargando...' size='large' className='mt-5 mx-auto'/>

    return ( 
        <>
            {
                hasPermission(userPermission, '/crear-vales') ?
                <Button type='icon-secondary-new' onClick={() => navigate('nuevo')} className="fixed right-3 bottom-8 hidden lg:block z-50 items-center"><PlusCircleOutlined /></Button>
                : null 
            }
                <div className="lg:grid hidden grid-cols-4 gap-10 py-5 ">
                    <div className="p-1 sm:p-5 shadow-md bg-white rounded-sm col-span-1 cursor-pointer" onClick={ () => dispatch(searchValeAction()) }>
                        <div className="flex sm:justify-between justify-center flex-wrap gap-x-5">
                            <div className="text-white bg-gradient-to-tr from-dark to-dark-lighter sm:w-16 sm:h-16 w-12 h-12 -mt-10 p-4 rounded-md shadow align-middle flex">
                                <div className="text-base sm:text-3xl  w-full justify-center flex m-auto">
                                    <FileTextOutlined className='align-middle'/>
                                </div>
                            </div>
                                <div className="sm:text-right text-center sm:py-0 pt-2">
                                <p className="text-custom-dark2 font-light sm:text-base text-sm">Todos</p>
                                <h1 className="lg:text-2xl text-lg text-custom-dark">{count.todos}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="p-1 sm:p-5 shadow-md bg-white rounded-sm col-span-1 cursor-pointer" onClick={ () => dispatch(searchValeAction( {statusVale: 1} )) }>
                        <div className="flex sm:justify-between justify-center flex-wrap gap-x-5">
                            <div className="text-white bg-gradient-to-tr from-info to-info-lighter sm:w-16 sm:h-16 w-12 h-12 -mt-10 p-4 rounded-md shadow align-middle flex">
                                <div className="text-base sm:text-3xl w-full justify-center flex m-auto">
                                    <BellOutlined className='align-middle'/>
                                </div>
                            </div>
                                <div className="sm:text-right text-center sm:py-0 pt-2">
                                <p className="text-custom-dark2 font-light sm:text-base text-sm">Nuevos</p>
                                <h1 className="lg:text-2xl text-lg text-custom-dark">{count.nuevo}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="p-1 sm:p-5 shadow-md bg-white rounded-sm col-span-1 cursor-pointer" onClick={ () => dispatch(searchValeAction( {statusVale: 2} )) }>
                        <div className="flex sm:justify-between justify-center flex-wrap gap-x-5">
                            <div className="text-white bg-gradient-to-tr from-warning to-warning-lighter sm:w-16 sm:h-16 w-12 h-12 -mt-10 p-4 rounded-md shadow align-middle flex">
                                <div className="text-base sm:text-3xl  w-full justify-center flex m-auto">
                                    <PieChartOutlined className='align-middle'/>
                                </div>
                            </div>
                                <div className="sm:text-right text-center sm:py-0 pt-2">
                                <p className="text-custom-dark2 font-light sm:text-base text-sm">Parciales</p>
                                <h1 className="lg:text-2xl text-lg text-custom-dark">{count.parcialAbierto}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="p-1 sm:p-5 shadow-md bg-white rounded-sm col-span-1 cursor-pointer" onClick={ () => dispatch(searchValeAction({statusVale: 4})) }>
                        <div className="flex sm:justify-between justify-center flex-wrap gap-x-5">
                            <div className="text-white bg-gradient-to-tr from-primary to-primary-lighter sm:w-16 sm:h-16 w-12 h-12 -mt-10 p-5 rounded-md shadow align-middle flex">
                                <div className="text-base sm:text-3xl  w-full justify-center flex m-auto">
                                    <img src={ekIcon2} alt="" />
                                </div>
                            </div>
                                <div className="sm:text-right text-center sm:py-0 pt-2">
                                <p className="text-custom-dark2 font-light sm:text-base text-sm">Sin Registro EK</p>
                                <h1 className="lg:text-2xl text-lg text-custom-dark">{count.entregado}</h1>
                            </div>
                        </div>
                    </div>
                </div>               
           
           { tableReady ?
            <Table 
            className='tableVales' 
            loading={isLoading} 
            render={true}
            scroll={{ x: 'auto' }} 
            key={record => record.id}
            columns={columns} 
            dataSource={dataSource} 
            expandable={{
                expandedRowRender, 
                defaultExpandedRowKeys: ['0'], 
                expandedRowKeys: activeExpRow,
                rowExpandable: (record) => true,
                onExpand: (expanded, record) => {
                    const keys = [];
                    if (expanded) {
                    keys.push(record.key);
                    }
                    setActiveExpRow(keys);
                }
            }}

            />
            :null }

            <Modal
                title={`${entrega.type === 1 ? 'Entrega Completa' : 'Entrega Parcial' }`}
                visible={visible.entrega}
                onOk={ () => handleSubmit() }
                onCancel={ hideModal }
                okText="Enviar"
                cancelText="Cancelar"
                okButtonProps={{ disabled: !validarCantidad }}
            >
                {
                    entrega.type === 1 ?
                    <>
                        <p> Estás seguro que has entregado esto? </p>
                        <p>No se podrá modificar después</p>
                    </>
                    :
                    entrega.type === 2 ?
                    <>
                        <p>Estás seguro que harás una entrega parcial, solo tienes este día para completar la entrega. </p>
                        <label>Cúantos entregarás?</label>
                        <Input className='my-3' type="number" value={entrega.cantidadEntregada} name="cantidadEntrega" onChange={ handleChange } status={ !validarCantidad ? 'error' : null }/>
                       {/* <label htmlFor="">Explica por qué?</label>
                        <Input className='my-3' type="text" value={entrega.comentarios} name="comentarios" onChange={ (e) => setEntrega({ ...entrega, comentarios: e.target.value  }) }  /> */}
                        <span className='py-2 text-danger'>
                            { !validarCantidad ? 
                                `No puede ser mayor a ${ entrega.cantidadSolicitada - buscarEntregado(entrega.valeSalidaId, entrega.id) } `
                            : null }
                        </span>
                    </>
                    : 
                    entrega.type === 3 ?
                    <>
                        <p> Estás seguro que se ha entregado todos los insumos del vale? </p>
                        <p>No se podrá modificar después</p>
                    </>
                    : null
                }
            </Modal>

            <Modal
                title="Cancelación de Vale"
                visible={visible.cancelar}
                onOk={ () => handleSubmitCancel() }
                onCancel={hideModal}
                okText="Enviar"
                cancelText="Cancelar"
                okButtonProps={{ disabled: !cancel.comentarios }}
                >
                    {
                        userAuth && userAuth.tipoUsuario_id === 3 ?
                        <p>No se entregará <span className='font-bold'>NINGÚN</span> insumo, explica porqué </p>
                        :
                        <p>Estás seguro que quieres cancelar este insumo? Añade algún comentario </p>
                    }
                    <TextArea className='my-3' value={cancel.comentarios} onChange={ (e) => setCancel({ ...cancel,  comentarios: e.target.value})}/>
            </Modal> 

            <Modal
                title="Registro de vale"
                visible={visible.enktrl}
                onOk={ () => handleSubmitClose() }
                onCancel={hideModal}
                okText="Enviar"
                cancelText="Cancelar"
                okButtonProps={{ disabled: !enkontrol.salidaEnkontrol }}
                >
                    <p>Ingresa el folio de enkontrol una vez generado</p>
                    <Input type="text" className='my-3' value={enkontrol.salidaEnkontrol} onChange={ (e) => setEnkontrol({ ...enkontrol,  salidaEnkontrol: e.target.value})} />
            </Modal>

            <Modal 
                visible={visible.comentarios}
                onCancel={hideModal}
                footer={false}
            > 
                {displayComentarios.id ?
                <>
                    <div className='inline-flex pb-5'>
                        <p className='pr-2'>Estatus:</p>
                        { 
                        displayComentarios.statusVale === 1 ? <Tag className='m-auto w-full' key={nanoid(4)} color="blue">Nuevo</Tag> :
                        displayComentarios.statusVale === 2 ? <Tag className='m-auto w-full' key={nanoid(4)} color="orange">Parcial</Tag> :
                        displayComentarios.statusVale === 3 ? <Tag className='m-auto w-full' key={nanoid(4)} color="orange">Parcial</Tag> :
                        displayComentarios.statusVale === 4 ? <Tag className='m-auto w-full' key={nanoid(4)} color="green">Entregado</Tag> :
                        displayComentarios.statusVale === 5 ? <Tag className='m-auto w-full' key={nanoid(4)} color="red">Cancelado</Tag> :
                        displayComentarios.statusVale === 6 ? <Tag className='m-auto w-full' key={nanoid(4)} color="orange">Parcial</Tag> :
                        displayComentarios.statusVale === 7 ? <Tag className='m-auto w-full' key={nanoid(4)} color="green">Entregado</Tag> :
                        null }
                    </div>
                    <h2> Folio: </h2>
                    <p className='font-bold'> {displayComentarios.id } </p>
                    <h2> Actividad: </h2>
                    <p className='font-bold'> {displayComentarios.actividadInfo } </p>
                    { displayComentarios.comentarios ? 
                        <> 
                            <h2> Comentarios: </h2>
                            <p className='font-bold'> {displayComentarios.comentarios } </p> 
                        </>
                    : 
                    null }
                    { displayComentarios.salidaEnkontrol ? 
                        <> 
                            <h2> Folio de salida Enkontrol: </h2>
                            <p className='font-bold'> {displayComentarios.salidaEnkontrol } </p> 
                        </>
                    : 
                    null }

                </>
                : null
                }
            </Modal>

            <Modal
                visible={visible.insumoInfo}
                onCancel={hideModal}
                footer={false}
            >
                <div>
                    {displayInsumo.insumo ? 
                    <>
                        <div className='inline-flex pb-5'>
                        <p className='pr-2'>Estatus:</p>
                        {  
                            displayInsumo.status === 1 ?<Tag className='text-center' color="blue"> Nuevo </Tag> :
                            displayInsumo.status === 2 ?<Tag className='text-center' color="orange">Parcial</Tag>  :
                            displayInsumo.status === 3 ? <Tag className='text-center' color="green">Entregado</Tag>  :
                            displayInsumo.status === 4 ? <Tag className='text-center' color="red">Cancelado</Tag> :
                            displayInsumo.status === 5 ? <Tag className='text-center' color="magenta">Cerrado</Tag> :
                            displayInsumo.status === 6 ? <Tag className='text-center' color="volcano">Parcial</Tag>
                        : null
                        }
                        </div>
                        <h2> Insumo: </h2>
                        <p className='font-bold'> { displayInsumo.insumo.nombre } </p>
                        <h2> Unidad:  </h2>
                        <p className='font-bold'>{ displayInsumo.insumo.unidadMedida }</p>
                        <h2> Cantidad Solicitada: </h2>
                        <p className='font-bold text-dark'>{ Number(displayInsumo.cantidadSolicitada) }</p>
                        <h2> Cantidad Entregada: </h2>
                        <p className='font-bold text-green-500'>{ Number(displayInsumo.cantidadEntregada) }</p>
                        <h2> Cantidad Pendiente: </h2>
                        <p className='font-bold text-red-500'>{ Number(displayInsumo.cantidadSolicitada) - Number(displayInsumo.cantidadEntregada) }</p>
                        {
                            displayInsumo.comentarios?
                            <> 
                                <h2> Observaciones: </h2>
                                <p>{ displayInsumo.comentarios }</p>
                            </>
                        : null }   
                    </>
                : null }
                </div>                
            </Modal>
        </>    
    );
}
 
export default ValesSalida;