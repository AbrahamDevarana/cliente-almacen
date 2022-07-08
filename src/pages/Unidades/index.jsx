
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';

import { useEffect, useRef, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllUnidadesAction } from '../../actions/unidadActions';

const Unidades = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ dataSource, setDataSource ] = useState([]);
    const {unidades} = useSelector(state => state.unidades);
    const {isLoading} = useSelector(state => state.unidades);

    useEffect(() => {
        dispatch(getAllUnidadesAction())

        setDataSource(
            unidades.map( (item, i) => (
				{ key: i, acciones:item.id, ...item}
            )
        ))
    // eslint-disable-next-line
    }, [])

    useEffect(() => {
        
            setDataSource(
                unidades.map( (item, i) => (
					{ key: i, acciones:item.id, ...item }
                ))
		)
    },[unidades])


    /// Table
    
    // eslint-disable-next-line no-unused-vars
    const [searchText, setSearchText] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    
    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        setSearchText('');
        confirm();
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div
            style={{
              padding: 8,
            }}
          >
            <Input
              ref={searchInput}
              placeholder={`Buscar ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: 'block',
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Buscar
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters, confirm)}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Limpiar
              </Button>
            </Space>
          </div>
        ),
        onFilter: (value, record) =>
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        }
        
    });

    const columns = [
        {
          title: 'Nombre',
          dataIndex: 'nombre',
          key: 'nombre',
          sorter: (a, b) => a.nombre.localeCompare(b.nombre),
          ...getColumnSearchProps('nombre'),
        },
        {
          title: 'Nombre Corto',
          dataIndex: 'nombreCorto',
          key: 'nombreCorto',
          sorter: (a, b) => a.nombre.localeCompare(b.nombre),
          ...getColumnSearchProps('nombreCorto'),
        },
        {
          title: 'Estatus',
          dataIndex: 'status',
          key: 'status',
          sorter: (a, b) => a.nombre.localeCompare(b.nombre),
          ...getColumnSearchProps('status'),
          render: (text, record) => ( record.status ? 'Activo' : 'Inactivo' ),
        },
        
        {
            title: 'Acciones',
            dataIndex: 'acciones',
            key: 'acciones',
            render: (id) => <div><Button type='warning' onClick={ () => navigate(`${id}`) }> <EditOutlined className='font-bold text-lg'/> </Button> <Button type='danger' onClick={ () => navigate(`${id}`) }> <DeleteOutlined className='font-bold text-lg'/> </Button> </div>,
            width: 200,
        }
        
    ];

    return ( 
    <>
        <div className='py-10 flex justify-between'>
            <h1 className='text-dark text-2xl'> Unidades </h1>
            <Button type='primary' onClick={() => navigate('create')} className='block ml-auto'>Agregar Nuevo Usuario</Button>
        </div>
        <Table columns={columns} dataSource={dataSource} loading={isLoading} showSorterTooltip={false}/>
    </>
    );
}
 
export default Unidades;