
import { BellOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, PieChartOutlined, PlusCircleOutlined, ShrinkOutlined, StopOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, DatePicker, Image, Input, Pagination, Select, Table, Tag, Tooltip } from "antd";
import moment from "moment";
import { nanoid } from "nanoid";
import { createRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllValesAction, getCountValeSalidaAction, getDetalleSalidaAction } from "../../actions/valeActions";
import { groupPermission, hasPermission } from "../../utils/hasPermission";
import ekIcon2 from "../../assets/img/Original-EK2.png"
import ekIcon from "../../assets/img/Original-EK.png"
import { BsInfoCircle } from "react-icons/bs";

const ValesSalidaNew = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { RangePicker } = DatePicker;

    const { userPermission, isLoading:isLoadingPermisos } = useSelector(state => state.permisos);
    const { vales, isLoading, paginate, count, detalleSalida, isLoadingDetalles } = useSelector( state => state.vales )

    const [ displayComentarios, setComentarios ] = useState('')
    const [ dataSource, setDataSource ] = useState([])
    const [ loadedColumn , setLoad ] = useState(false)
    const [ current, setCurrent ] = useState(1)
    const [ tableReady , setTableReady ] = useState(false)
    const [ activeExpRow, setActiveExpRow] = useState();
    const [ dataNestedSource, setDataNestedSource ] = useState([])
    const [ filter, setFilter ]  = useState({
        search: '',
        page: 0,
        limit: 10,
        status: [],
        dateInit: '',
        dateEnd: ''
    })

    
    useEffect(() => {
        dispatch(getCountValeSalidaAction())
        dispatch(getAllValesAction(filter))
        setCurrent(current)
    }, [filter])

    useEffect(() => {
        let result = []

        // if(hasPermission(userPermission, 'entregar vales') && !isLoadingPermisos){
        //     result = vales.filter( item => 
        //         item.detalle_salidas.every( item => item.prestamo?.status !== 1 ) ?? item ).filter( item => item.detalle_salidas.length > 0).map( (item, i) => (
        //             { 
        //                 key: i, 
        //                 residente:`${item.user.nombre} ${item.user.apellidoPaterno}`,
        //                 residentePicture: item.user.picture,
        //                 personalInfo: `${item.personal.nombre} ${item.personal.apellidoMaterno? `(${item.personal.apellidoMaterno})` : '' } ${item.personal.apellidoPaterno}`,
        //                 actividadInfo: item.actividad.nombre,
        //                 aciones:item.id, 
        //                 ...item 
        //             }
        //     ))
        // }else{
            result = vales.map( (item, i) => (
                    { 
                        key: i, 
                        residente:`${item.user.nombre} ${item.user.apellidoPaterno}`,
                        residentePicture: item.user.picture,
                        personalInfo: `${item.personal.nombre} ${item.personal.apellidoPaterno}`,
                        actividadInfo: item.actividad.nombre,
                        aciones:item.id, 
                        esPrestamo: item,
                        ...item 
                    }
            ))
        // }
        

		setDataSource( result )

        if((groupPermission(userPermission, ['entregar vales', 'registrar vales', 'eliminar vales', 'ver vales']) ) && !loadedColumn ){
            setLoad(true)
            setColumns([...columns, actionColumn])
        }
        setTableReady(true)
    }, [vales, userPermission])

    const actionColumn = {
        title: 'Acciones',
        dataIndex: 'statusValue',
        key: `statusVale`,
        className:"",
        render: (text, record) => (
            <div>
                
                { 
                    record.statusVale === 1 ? 
                    <div className='flex justify-start'>
                        { hasPermission(userPermission, 'entregar vales') ? 
                            <Tooltip title="Entrega Completa" placement='topRight'>
                                <Button type='icon-primary' className='icon' onClick={ () => handleEntrega(record, 3)}> <CheckCircleOutlined className='ml-0 align-middle text-xl' /> </Button>
                            </Tooltip> 
                            : null
                        }
                        {
                            hasPermission(userPermission, 'eliminar vales') ? 
                            <Tooltip title="Cancelar Entrega" placement='topRight'>
                                <Button type='icon-danger' className='icon' onClick={() => handleCancel(1, record.id)}> <StopOutlined className='ml-0 align-middle text-xl' /> </Button> 
                            </Tooltip>
                            : null
                        }
                    </div> : 
                   record.statusVale === 3 || record.statusVale === 4  ? 
                    <>
                        { hasPermission(userPermission, 'registrar vales') ? 
                        <Tooltip title="Registrar Enkontrol" placement='topRight'>
                            <Button type='icon-warning' className='icon' onClick={()=> handleClose(record.id)}> 
                                <img src={ekIcon} alt="sa" width={16} className="py-0.5" />
                            </Button>
                        </Tooltip>
                        : null
                        }
                    </>
                    : 
                   <div className="h-6 justify-start flex">
                        { record.salidaEnkontrol || record.comentarios  ? 
                            <Tooltip title="Ver Información" placement='topRight'>
                                <Button type='icon-danger' className='px-2' onClick={() => { setComentarios(record); showModal({...visible, comentarios: true}); }}><BsInfoCircle className='text-xl'/></Button> 
                            </Tooltip>
                            : null 
                        }
                    </div>
                }
            </div>
        ),
        width: '8%'
    }

    const [columns, setColumns] = useState([
        {
            title: 'Folio',
            dataIndex: 'id',
            responsive: ['lg'],
            width: '5%'
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
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
            render: (text, record, index) => ( 
                        <div className='w-full justify-center text-center flex relative'>
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
                        {/* { record.detalle_salidas.map( item => item.prestamo?.status === 1 ).some(item => item === true) && record.statusVale === 1 ? 
                            <Tooltip title="En proceso de aprobación">
                                <Badge className='absolute -right-2 -top-2' count={<ClockCircleOutlined style={{ color: '#f5222d' }} /> } />
                            </Tooltip>
                            : 
                            null
                        }  */}
                        </div>
                        
            ),
            width: '5%'
        },
        {
            title: 'Solicitante',
            dataIndex: 'residente',
            responsive: ['lg'],
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
            ellipsis: true,
            width: '22%',
        },
        {
            title: 'Actividad',
            dataIndex: 'actividadInfo',
            ellipsis: true,
            width: '25%',
        },
        
    ]) 


    // * Pagination y Filtros
    const handleLoadVales = (page, limit) => {
        setFilter({
            ...filter,
            page: page,
            limit: 10,
        })
    }
    const handleSearchByStatus = (value) => {
        setFilter({
            ...filter,
            status: value,
            page: 1
        })
    }

    const handleSearchByText = (e) => {
        e.preventDefault() 
        const {value} = e.target
        if(value.length > 2){
            setFilter({
                ...filter,
                search: value,
                page: 1
            })
        }else if(value.length === 0){
            handleCleanSearch()
        }

    }

    const handleSearchByDate = (value, dateString) => {
        if ((dateString[0] !== '' && dateString[1] !== '')){
            setFilter({
                ...filter,
                page: 1,
                dateInit: dateString[0],
                dateEnd: dateString[1]
            })
        }else if (dateString[0] === '' && dateString[1] === ''){
            handleCleanSearch()
        }
    }

    const handleCleanSearch = () => {
        setFilter({
            search: '',
            page: 0,
            limit: 10,
            status: [],
            dateInit: '',
            dateEnd: ''
        })
    }

    // * End Pagination

    // ? Acciones

    const handleEntrega = () =>{}
    const handleCancel = () =>{}
    const handleClose = () =>{}
    
    
    // ? End Acciones


    // TODO Inicio Modales

    const showModal = (props) => {};

    const [ visible, setVisible] = useState({
        entrega: false,
        cancelar: false,
        cerrar: false,
        enktrl:false,
        comentarios:false,
        insumoInfo:false
    })

    // TODO FIN Modales


    // Table Actions
    const expandedRowRender = (record, index, indent, expanded) => {
        
        if(expanded){
            setDataNestedSource( detalleSalida )
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
                    // record.prestamo.status !== 1 ?
                        record.status === 1 ? <Tag key={index} className='w-full text-center' color="blue"> Nuevo </Tag>
                        : record.status === 2 ? <Tag key={index} className='w-full text-center' color="orange">Parcial</Tag> 
                        : record.status === 6 ? <Tag key={index} className='w-full text-center' color="volcano">Parcial</Tag>
                        : record.status === 3 ? <Tag key={index} className='w-full text-center' color="green">Entregado</Tag> 
                        : record.status === 4 ? <Tag key={index} className='w-full text-center' color="red">Cancelado</Tag>
                        : record.status === 5 ? <Tag key={index} className='w-full text-center' color="magenta">Cerrado</Tag>
                        : null
                    // : <Tag key={index} className='w-full text-center' color="red"> Sin Aprobar </Tag>
                ),
                width: '6%'
            },
            {
                title: 'Nombre',
                dataIndex: 'insumo',
                key: `nombre-${nanoid()}`,
                // render: item => item.nombre,
                render: (text, record) => (
                    <div className='flex items-center align-middle' key={record.id}>
                        { record.prestamo? 
                            <Tooltip  title={ `Prestamo de ${record.prestamo.residente.nombre} ${record.prestamo.residente.apellidoPaterno}` }><ShrinkOutlined className="mx-1 text-blue-500" /></Tooltip>
                            : null 
                        }
                        { record.insumo.nombre }
                    </div>
                ),
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
                    record.status === 1 || record.status === 2?
                    <div key={index} className="inline-flex">
                        {
                            hasPermission(userPermission, 'entregar vales') ? 
                            <>
                                <Tooltip placement='topRight' title="Entrega Completa"><Button className="icon" htmlType='button' onClick={ () => handleEntrega(record, 1) } type='icon-primary'> <CheckCircleOutlined className='align-middle text-xl' /> </Button></Tooltip>
                                <Tooltip placement='topRight' title="Entrega Parcial"><Button className="icon" htmlType='button' onClick={ () => handleEntrega(record, 2) } type='icon-warning'> <PieChartOutlined className='align-middle text-xl' /> </Button> </Tooltip>
                            </>
                            : null
                        }
                        {
                            hasPermission(userPermission, 'eliminar vales') ? 
                            <Tooltip placement='topRight' title="Cancelar Insumo"> <Button className="icon" htmlType='button' onClick={ () => handleCancel(2, record.id) } type='icon-danger'> <StopOutlined className='align-middle text-xl' /> </Button> </Tooltip>
                            : null
                        }
                    </div>
                    :  
                    <div className="flex justify-start h-6" key={index}> 
                        {/* <Button type='icon-warning' onClick={ () => { setDisplayInsumo(record); showModal({...visible, insumoInfo: true}); } } htmlType='button' className='icon'><BsInfoCircle className='text-xl align-middle' /> </Button> */}
                    </div>

                ),
            },
 
        ]

        if(!isLoadingDetalles){  
            return <Table render={true} bordered key={record => record.id } scroll={{ x: 'auto' }} columns={columns} dataSource={dataNestedSource} pagination={false} className="nestedTable"/>
        }

    }
    

    return ( 

        <>
            { hasPermission(userPermission, 'crear vales') ?
            //  Validamos Permiso para Crear Vale
                    <Button type='icon-secondary-new' onClick={() => navigate('nuevo')} className="lg:flex hidden fixed right-10 lg:bottom-8 bottom-28 z-50"><PlusCircleOutlined className='py-1'/></Button>
            : null 
            // Fin Validación Permiso Para Crear Vale
            }


            <div className="lg:grid hidden grid-cols-4 gap-10 py-5 ">
                <div className="p-1 sm:p-5 shadow-md bg-white rounded-sm col-span-1 cursor-pointer" onClick={ () => handleCleanSearch() }>
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
                <div className="p-1 sm:p-5 shadow-md bg-white rounded-sm col-span-1 cursor-pointer" onClick={ () => handleSearchByStatus([1]) }>
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
                <div className="p-1 sm:p-5 shadow-md bg-white rounded-sm col-span-1 cursor-pointer" onClick={ () => handleSearchByStatus( [2] )  }>
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
                <div className="p-1 sm:p-5 shadow-md bg-white rounded-sm col-span-1 cursor-pointer" onClick={ () => handleSearchByStatus( [3, 4] ) }>
                    <div className="flex sm:justify-between justify-center flex-wrap gap-x-5">
                        <div className="text-white bg-gradient-to-tr from-primary to-primary-lighter sm:w-16 sm:h-16 w-12 h-12 -mt-10 p-5 rounded-md shadow align-middle flex">
                            <div className="text-base sm:text-3xl  w-full justify-center flex m-auto">
                                <img src={ekIcon2} alt="" />
                            </div>
                        </div>
                            <div className="sm:text-right text-center sm:py-0 pt-2">
                            <p className="text-custom-dark2 font-light sm:text-base text-sm">Sin Registro EK</p>
                            <h1 className="lg:text-2xl text-lg text-custom-dark">{count.entregado + count.parcialCerrado}</h1>
                        </div>
                    </div>
                </div>
            </div> 
            <div className='inline-flex items-center pb-3 w-full'>
                <p>Filtros: </p>
                <Input type="text" 
                    placeholder='Escribe para filtrar' 
                    className='mx-3' 
                    style={{ width : '250px'}} 
                    onChange={ handleSearchByText } 
                />
                <RangePicker showToday={true}  className="mx-3" style={{ width : '350px'}} onCalendarChange={ (value, dateString) => {handleSearchByDate(value, dateString); } }/>         
                <Select
                    mode="multiple"
                    allowClear
                    className='mx-3'
                    style={{
                        width: '360px',
                    }}
                    placeholder="Filtrar Por Estatus"
                    maxTagCount= 'responsive'
                    onChange={ (e) => {handleSearchByStatus(e)}}
                    showSearch={false}
                    >
                    <Select.Option key={1} value={1}> Nuevo </Select.Option>
                    <Select.Option key={2} value={2}> Parcial Abierto </Select.Option>
                    <Select.Option key={6} value={6}> Parcial Cerrado </Select.Option>
                    <Select.Option key={4} value={4}> Entregado </Select.Option>
                    <Select.Option key={5} value={5}> Cancelado </Select.Option>
                    <Select.Option key={7} value={7}> Enkontrol </Select.Option>
                </Select>       
            </div> 


            {
                tableReady? 
                <>
                <Table 
                    className='tableVales' 
                    loading={isLoading}
                    pagination={false}
                    render={true}
                    scroll={{ x: 'auto' }} 
                    columns={columns}
                    dataSource={dataSource}
                    rowKey={ record => record.id } 
                    expandable={{
                        expandedRowRender, 
                        expandedRowKeys: activeExpRow,
                        rowExpandable: (record) => true,
                        onExpand: (expanded, record) => {       
                            // Al expandir la fila, se obtiene el detalle de la orden
                            if(expanded){
                                dispatch( getDetalleSalidaAction({'id':record.id}) )
                                setActiveExpRow([record.id]);
                            }else{
                                setActiveExpRow([]);
                            }
                        }
                    }}
                />
                <Pagination 
                    total={(paginate.totalItem)} 
                    current={paginate.currentPage} 
                    pageSize={10} 
                    onChange={handleLoadVales} 
                    className="w-auto py-4 max-w-max ml-auto"
                />
                </>
            : null }
        </> 
    );
}
 
export default ValesSalidaNew;