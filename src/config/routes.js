
import Public from "../layouts/layoutPublic"
import Private from "../layouts/layoutPrivate"


import Login from "../pages/Auth/Login"
import Home from "../pages/Home"
import LoginSuccess from "../pages/Auth/LoginSuccess"
import LoginError from "../pages/Auth/LoginError"
import ValesSalida from "../pages/Vales"
import CreateValesSalida from "../pages/Vales/create"
import Error404 from "../pages/Error404"
import Usuarios from "../pages/Usuarios"
import CreateUsuario from "../pages/Usuarios/create"
import EditUsuario from "../pages/Usuarios/edit"
import Roles from "../pages/Roles"
import CreateRoles from "../pages/Roles/create"
import EditRoles from "../pages/Roles/edit"
import Niveles from "../pages/Niveles"
import CreateNiveles from "../pages/Niveles/create"
import Zonas from "../pages/Zonas"
import CreateZonas from "../pages/Zonas/create"
import EditZonas from "../pages/Zonas/edit"
import Actividades from "../pages/Actividades"
import CreateActividades from "../pages/Actividades/create"
import EditActividades from "../pages/Actividades/edit"
import EditNiveles from "../pages/Niveles/edit"
import Obras from "../pages/Obras"
import CreateObra from "../pages/Obras/create"
import EditObra from "../pages/Obras/edit"
import Personal from "../pages/Personal"
import CreatePersonal from "../pages/Personal/create"
import EditPersonal from "../pages/Personal/edit"
import Insumos from "../pages/Insumos"
import EditInsumos from "../pages/Insumos/edit"
import CreateInsumos from "../pages/Insumos/create"
import Prestamos from "../pages/Prestamos"
import Reportes from "../pages/Reportes"
import Bitacora from "../pages/Bitacora"
import FormBitacora from "../pages/Bitacora/form"
import Etapas from "../pages/Etapas"
import CreateEtapas from "../pages/Etapas/create"
import editEtapas from "../pages/Etapas/edit"
import Permisos from "../pages/Permisos"
import CreatePermisos from "../pages/Permisos/create"
import EditPermisos from "../pages/Permisos/edit"
import Empresa from "../pages/Empresa"
import CreateEmpresa from "../pages/Empresa/create"
import EditEmpresa from "../pages/Empresa/edit"
import LayoutLoad from "../layouts/layoutLoad"
import Proyectos from "../pages/Proyectos"
import CreateProyectos from "../pages/Proyectos/create"
import EditProyectos from "../pages/Proyectos/edit"



const routesPublic = [
    {
        path: '/login',
        layout: Public,
        component: Login
    },
    {
        path: "/success",
        layout: LayoutLoad,
        component: LoginSuccess,
    },
    {
        path: "/error",
        layout: Public,
        component: LoginError,
    }
]

const routesPrivate = [
    {
        path: '/',
        layout: Private,
        component: Home
    },
    {
        path: '/usuarios',
        layout: Private,
        component: Usuarios
    },
    {
        path: '/usuarios/create',
        layout: Private,
        component: CreateUsuario
    },
    {
        path: '/usuarios/:id',
        layout: Private,
        component: EditUsuario
    },
    {
        path: '/roles',
        layout: Private,
        component: Roles
    },
    {
        path: '/roles/create',
        layout: Private,
        component: CreateRoles
    },
    {
        path: '/roles/:id',
        layout: Private,
        component: EditRoles
    },
    {
        path: '/niveles',
        layout: Private,
        component: Niveles
    },
    {
        path: '/niveles/create',
        layout: Private,
        component: CreateNiveles
    },
    {
        path: '/niveles/:id',
        layout: Private,
        component: EditNiveles
    },
    {
        path: '/obra',
        layout: Private,
        component: Obras
    },
    {
        path: '/obra/create',
        layout: Private,
        component: CreateObra
    },
    {
        path: '/obra/:id',
        layout: Private,
        component: EditObra
    },
    {
        path: '/zonas',
        layout: Private,
        component: Zonas
    },
    {
        path: '/zonas/create',
        layout: Private,
        component: CreateZonas
    },
    {
        path: '/zonas/:id',
        layout: Private,
        component: EditZonas
    },
    {
        path: '/actividades',
        layout: Private,
        component: Actividades
    },
    {
        path: '/actividades/create',
        layout: Private,
        component: CreateActividades
    },
    {
        path: '/actividades/:id',
        layout: Private,
        component: EditActividades
    },
    {
        path: '/vales-salida',
        layout: Private,
        component: ValesSalida
    },
    {
        path: '/vales-salida/nuevo',
        layout: Private,
        component: CreateValesSalida
    },
    {
        path: '/personal',
        layout: Private,
        component: Personal
    },
    {
        path: '/personal/create',
        layout: Private,
        component: CreatePersonal
    },
    {
        path: '/personal/:id',
        layout: Private,
        component: EditPersonal
    },

    {
        path: '/insumos',
        layout: Private,
        component: Insumos
    },
    {
        path: '/insumos/create',
        layout: Private,
        component: CreateInsumos
    },
    {
        path: '/insumos/:id',
        layout: Private,
        component: EditInsumos
    },
    {
        path: '/prestamos',
        layout: Private,
        component: Prestamos
    },
    {
        path: '/reportes',
        layout: Private,
        component: Reportes
    },
    {   
        path: '/bitacora/form/:id',
        layout: Private,
        component: FormBitacora
    },
    {   
        path: '/bitacora/form',
        layout: Private,
        component: FormBitacora
    },
    {   
        path: '/bitacora',
        layout: Private,
        component: Bitacora
    },
    {   
        path: '/bitacora/:uid',
        layout: Private,
        component: Bitacora
    },
    {
        path: '/etapas',
        layout: Private,
        component: Etapas
    },
    {
        path: '/etapas/create',
        layout: Private,
        component: CreateEtapas
    },
    {
        path: '/etapas/:id',
        layout: Private,
        component: editEtapas
    },
    {
        path: '/permisos',
        layout: Private,
        component: Permisos
    },
    {
        path: '/permisos/create',
        layout: Private,
        component: CreatePermisos
    },
    {
        path: '/permisos/:id',
        layout: Private,
        component: EditPermisos
    },
    {
        path: '/empresas',
        layout: Private,
        component: Empresa
    },
    {
        path: '/empresas/create',
        layout: Private,
        component: CreateEmpresa
    },
    {
        path: '/empresas/:id',
        layout: Private,
        component: EditEmpresa
    },
    {
        path: '/proyectos',
        layout: Private,
        component: Proyectos
    },
    {
        path: '/proyectos/create',
        layout: Private,
        component: CreateProyectos
    },
    {
        path: '/proyectos/:id',
        layout: Private,
        component: EditProyectos
    },
    {
        path: "*",
        layout: Private,
        component: Error404,
    }
]


const routes = [...routesPrivate, ...routesPublic]

export default routes