
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Table } from 'antd';

import { useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cleanErrorAction } from '../../actions/globalActions';
import { deleteUsuarioAction, getAllUsuariosAction } from '../../actions/usuarioActions';
import Forbidden from '../../components/Elements/Forbidden';
import { getColumnSearchProps } from '../../hooks/useFilter'
import openNotificationWithIcon from '../../hooks/useNotification';
import { groupPermission, hasPermission } from '../../utils/hasPermission';

const Usuarios = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ dataSource, setDataSource ] = useState([]);
    const {usuarios, isLoading, errors, deleted} = useSelector(state => state.usuarios);
    const { userPermission } = useSelector(state => state.permisos);

    useEffect(() => {
        dispatch(getAllUsuariosAction())
    // eslint-disable-next-line
    }, [])

    useEffect(() => {
		setDataSource(
			usuarios.map( (item, i) => (
				{ key: i, acciones:item.id, rol: item.role.nombre, ...item }
			))
		)
    },[usuarios])


	const handleDelete = (id) => {
		dispatch(deleteUsuarioAction(id))
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
            openNotificationWithIcon('success', 'El usuario se ha eliminado')
        }
    }


    const columns = [
        {
          title: 'Nombre',
          dataIndex: 'nombre',
          key: 'nombre',
          sorter: (a, b) => a.nombre.localeCompare(b.nombre),
          ...getColumnSearchProps('nombre'),
        },
        {
          title: 'Apellido Paterno',
          dataIndex: 'apellidoPaterno',
          key: 'apellidoPaterno',
          sorter: (a, b) => a.nombre.localeCompare(b.nombre),
          ...getColumnSearchProps('apellidoPaterno'),
        },
        {
          title: 'Apellido Materno',
          dataIndex: 'apellidoMaterno',
          key: 'apellidoMaterno',
          sorter: (a, b) => a.nombre.localeCompare(b.nombre),
          ...getColumnSearchProps('apellidoMaterno'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.nombre.localeCompare(b.nombre),
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Rol Usuario',
            dataIndex: 'rol',
            key: 'rol',
            sorter: (a, b) => a.nombre.localeCompare(b.nombre),
            ...getColumnSearchProps('rol'),
        },
        {
            title: 'Puesto',
            dataIndex: 'puesto',
            key: 'puesto',
            sorter: (a, b) => a.nombre.localeCompare(b.nombre),
            ...getColumnSearchProps('puesto'),
        },
        {
            title: 'Acciones',
            dataIndex: 'acciones',
            key: 'acciones',
            render: (id) => 
            <div className='flex justify-around'> 
                { hasPermission(userPermission, '/editar-usuarios') ? <Button type='warning' onClick={ () => navigate(`${id}`) }> <EditOutlined className='font-bold text-lg'/> </Button>  : null } 
                {
                    hasPermission(userPermission, '/eliminar-usuarios') ? 
                <Popconfirm placement='topRight' onConfirm={ () => handleDelete(id) } title="Deseas eliminar este elemento ?"> 
                    <Button type='danger'> <DeleteOutlined className='font-bold text-lg'/> </Button> 
                </Popconfirm> : null
                }
			</div>,
            width: groupPermission(userPermission, ['/editar-usuarios', '/eliminar-usuarios']) ? 150 : 0,
            className: groupPermission(userPermission, ['/editar-usuarios', '/eliminar-usuarios']) ? 'block' : 'hidden',
        }
        
    ];

    if(!hasPermission(userPermission, '/ver-usuarios') && !isLoading ) return <Forbidden/>

    return ( 
    <>
		<h1 className='text-dark text-xl text-center font-medium'>Usuarios</h1>
        <div className='py-2 flex justify-end'>          
        {
            hasPermission(userPermission, '/crear-usuarios') ?
            <Button type='primary' onClick={() => navigate('create')}>Agregar Nuevo Usuario</Button>
            : null 
        }
        </div>
        <Table columns={columns} dataSource={dataSource} loading={isLoading} showSorterTooltip={false}/>
    </>
    );
}
 
export default Usuarios;