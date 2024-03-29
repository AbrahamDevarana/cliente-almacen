
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Table } from 'antd';

import { useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cleanErrorAction } from '../../actions/globalActions';
import { deleteRoleAction, getAllRolesAction } from '../../actions/roleActions';
import Forbidden from '../../components/Elements/Forbidden';
import openNotificationWithIcon from '../../hooks/useNotification';
import { groupPermission, hasPermission } from '../../utils/hasPermission';

const Roles = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {roles, isLoading, errors, deleted} = useSelector(state => state.roles);
    const { userPermission } = useSelector(state => state.permisos);

    useEffect(() => {
        dispatch(getAllRolesAction())
    // eslint-disable-next-line
    }, [])




    const columns = [
        {
            title: 'Nombre',
            render: (text, record) => <span>{record.nombre}</span>,
            
        },
        {
            title: 'Descripcion',
            render: (text, record) => <span>{record.descripcion}</span>,    
        },
        
        {
            title: 'Acciones',
            render: (text, record) =>
            <div className='flex justify-around'> 
                { hasPermission(userPermission, 'editar roles') ? <Button type='icon-warning' onClick={ () => navigate(`${record.id}`) }> <EditOutlined className='text-xl'/> </Button>  : null } 
                {
                    hasPermission(userPermission, 'eliminar roles') ? 
                <Popconfirm placement='topRight' onConfirm={ () => handleDelete(record.id) } title="Deseas eliminar este elemento ?"> 
                    <Button type='icon-danger'> <DeleteOutlined className='text-xl'/> </Button> 
                </Popconfirm> : null
                }
			</div>,
            width: groupPermission(userPermission, ['editar roles', 'eliminar roles']) ? 100 : 0,
            className: groupPermission(userPermission, ['editar roles', 'eliminar roles']) ? 'block' : 'hidden',
        }
        
    ];

	const handleDelete = (id) => {
		dispatch(deleteRoleAction(id))
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
            openNotificationWithIcon('success', 'El rol se ha eliminado')
        }
    }

    const handleSearchByName = (e) => {
        const search = e.target.value
        dispatch( getAllRolesAction({search}) )
    }

    if(!hasPermission(userPermission, 'ver roles') && !isLoading ) return <Forbidden/>

    return ( 
    <>
            <div className='py-2 flex justify-end'>          
            {
                hasPermission(userPermission, 'crear roles') ?
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
        <Table scroll={{ x: 'auto'}}  columns={columns} dataSource={roles} loading={isLoading} showSorterTooltip={false} rowKey={ record => record.id }/>
    </>
    );
}
 
export default Roles;