
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Table } from 'antd';
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteProyectoAction, getProyectosAction } from '../../actions/proyectosActions';
import openNotificationWithIcon from '../../hooks/useNotification';
import { cleanErrorAction } from '../../actions/globalActions';
import { groupPermission, hasPermission } from '../../utils/hasPermission';
import Forbidden from '../../components/Elements/Forbidden';

const Proyectos = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { proyectos, isLoading, errors, deleted} = useSelector(state => state.proyectos);
    const { userPermission } = useSelector(state => state.permisos);
    
    useEffect(() => {

        dispatch(getProyectosAction())
        //  clean state
        return () => {
            dispatch(cleanErrorAction())
        }
    // eslint-disable-next-line
    }, [])

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
        },
        {
            title: 'Clave',
            dataIndex: 'clave',
        }, 
        {
            title: 'Estatus',
            render: (record) => record.status ? 'Activo' : 'Inactivo',
        },
        
        {
            title: 'Acciones',
            render: (render) => 
            <div className='flex justify-around'> 
                { hasPermission(userPermission, 'editar proyectos') ? <Button type='icon-warning' onClick={ () => navigate(`${render.id}`) }> <EditOutlined className='text-xl'/> </Button>  : null } 
                {
                    hasPermission(userPermission, 'eliminar proyectos') ? 
                <Popconfirm placement='topRight' onConfirm={ () => handleDelete(render.id) } title="Deseas eliminar este elemento ?"> 
                    <Button type='icon-danger'> <DeleteOutlined className='text-xl'/> </Button> 
                </Popconfirm> : null
                }
            </div>,
            width: groupPermission(userPermission, ['editar proyectos', 'eliminar proyectos']) ? 100 : 0,
            className: groupPermission(userPermission, ['editar proyectos', 'eliminar proyectos']) ? 'block' : 'hidden',
        }
        
    ];

	const handleDelete = (id) => {
        dispatch(deleteProyectoAction(id))
	}

    useEffect(() => {
        displayAlert()
        // eslint-disable-next-line
    }, [errors, deleted])

    const displayAlert = () => {
        if(errors){
            openNotificationWithIcon('error', errors)
            dispatch( cleanErrorAction() )            
        }
        if(deleted){
            openNotificationWithIcon('success', 'El proyecto se ha desactivado correctamente')
        }
    }

    const handleSearchByName = (e) => {
        const search = e.target.value
        dispatch( getProyectosAction({search}) )
    }


    if(!hasPermission(userPermission, 'ver proyectos')) return <Forbidden />

    return ( 
    <>
        <div className='py-2 flex justify-end'>          
        {
            hasPermission(userPermission, 'crear proyectos') ?
            <Button type='icon-secondary-new' onClick={() => navigate('create')} className="md:flex hidden fixed right-10 lg:bottom-8 bottom-28 z-50"><PlusCircleOutlined className='py-1'/></Button>
            : null 
        }
        </div>
        <div className='pb-3 flex justify-end'>
            <Input type="text" 
                style={{ width : '250px'}} 
                onChange={ e => handleSearchByName(e) }
                allowClear
                suffix={<SearchOutlined />}
                placeholder="Buscar"
                // value={filtros.busqueda}
                name="busqueda"
            />
        </div>
        <Table scroll={{ x: 'auto'}}  columns={columns} dataSource={proyectos} loading={isLoading} showSorterTooltip={false} rowKey={ record => record.id } />
    </>
    );
}
 
export default Proyectos;