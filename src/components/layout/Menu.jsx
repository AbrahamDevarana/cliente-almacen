import { Menu} from "antd";
import { SettingOutlined, AppstoreOutlined, LogoutOutlined,UserOutlined, ProfileOutlined  } from '@ant-design/icons';
import { useNavigate, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
import { hasPermission, groupPermission} from "../../utils/hasPermission";
import { useSelector } from "react-redux";
import Loading from "../Elements/Loading";
import { useState } from "react";


export default function LayoutMenu ({collapsed, setCollapsed, hiddeable}) {

    const { userPermission, isLoading } = useSelector(state => state.permisos);
    const [openKeys, setOpenKeys] = useState(['sub1']);
    
    function getItem(label, key, icon, children, type) {
        return {
          key,
          icon,
          children,
          label,
          type,
        };
    }
	const location = useLocation()
	const navigate = useNavigate()
    const url = location.pathname


	const validateCollapsed = () => {
        if(!hiddeable) setCollapsed(!collapsed)
	}

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          setOpenKeys(keys);
        } else {
          setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
      };
    
    const rootSubmenuKeys = ['sub1', 'sub2', 'sub3'];
    const items = [
	getItem('Inicio', '/', <AppstoreOutlined />),
    groupPermission( userPermission, ['crear vales', 'ver vales', 'ver vale' ]) ?
        getItem('Vales', 'sub1', <LogoutOutlined />, [
            hasPermission(userPermission, 'crear vales') ? getItem('Generar', '/vales-salida/nuevo') : null,
            groupPermission(userPermission, ['ver vales', 'ver vale']) ? getItem('Consultar', '/vales-salida') : null,
            getItem('Préstamos', '/prestamos'),
            getItem('Reportes', '/reportes')
        ]) 
    : null,
    groupPermission( userPermission, ['crear bitacora']) ?
        getItem('Bitácora', 'sub2', <ProfileOutlined />,
        [
            getItem('Generar', '/bitacora/form'),
            getItem('Consultar', '/bitacora'),
        ] )  
    : null,
    groupPermission( userPermission, ['ver usuarios', 'ver roles', 'ver insumos', 'ver obras', 'ver niveles', 'ver zonas', 'ver actividades', 'ver personal', 'ver permisos']) ?
        getItem('Gestión', 'sub3', <SettingOutlined />, [
            groupPermission( userPermission, ['ver usuarios', 'ver roles']) ?
                getItem('Usuarios', 'subsub1', <UserOutlined />, [
                    hasPermission(userPermission, 'ver usuarios') ? getItem('Usuarios', '/usuarios'): null,
                    hasPermission(userPermission, 'ver roles') ? getItem('Roles', '/roles') : null,
                    hasPermission(userPermission, 'ver permisos') ? getItem('Permisos', '/permisos') : null,
                ], 'group')
            : null,
            groupPermission( userPermission, ['ver insumos', 'ver obras', 'ver niveles', 'ver zonas', 'ver actividades', 'ver personal']) ?
                getItem('Generales', 'subsub2', <UserOutlined />, [
                    hasPermission(userPermission, 'ver insumos') ? getItem('Insumos', '/insumos') : null,
                    hasPermission(userPermission, 'ver etapas') ? getItem('Etapas', '/etapas') : null,
                    hasPermission(userPermission, 'ver obras') ? getItem('Obras', '/obra') : null,
                    hasPermission(userPermission, 'ver niveles') ? getItem('Niveles', '/niveles') : null,
                    hasPermission(userPermission, 'ver zonas') ? getItem('Zonas', '/zonas') : null,
                    hasPermission(userPermission, 'ver actividades') ? getItem('Actividades', '/actividades') : null,
                    hasPermission(userPermission, 'ver personal') ? getItem('Destajistas', '/personal') : null,
                    hasPermission(userPermission, 'ver proyectos') ? getItem('Proyectos', '/proyectos') : null,
                    hasPermission(userPermission, 'ver empresas') ? getItem('Empresas', '/empresas') : null,
                ], 'group')
            : null,
        ])
    : null,

        
    ];

    if(isLoading) return <Loading />

    return (
        <Menu
			className="layout__menu overflow-y-auto overflow-x-hidden"
            style={{ height: 'calc(100vh - 80px)', }}
			mode="inline"
			items={items}
			onClick={ (item) =>  { navigate(item.key);  }}
			onSelect={ () =>  validateCollapsed()}
			defaultSelectedKeys={[`${url}`]}
            onOpenChange={onOpenChange}
            openKeys={openKeys}
        />
    )
    
};
