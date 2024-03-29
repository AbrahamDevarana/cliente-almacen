import { Form, Input, Select, Button } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams} from "react-router-dom";
import { getActividadAction, updateActividadAction } from "../../actions/actividadActions";
import { cleanErrorAction } from "../../actions/globalActions";
import Forbidden from "../../components/Elements/Forbidden";
import Loading from "../../components/Elements/Loading";
import openNotificationWithIcon from "../../hooks/useNotification";
import { hasPermission } from "../../utils/hasPermission";

const EditEmpresa = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id} = useParams()
    const [form] = Form.useForm();
    const { Option } = Select;
    const { TextArea } = Input;

    const { errors, editedActividad, isLoading, updated } = useSelector(state => state.actividades);
    const { userPermission } = useSelector(state => state.permisos);

    const [actividad, setActividad] = useState({
        nombre: "",
        descripcion: "",
        status: "",
    });

    useEffect(() =>{
        if(!editedActividad){
            dispatch(getActividadAction(id))
        }
        setActividad({...editedActividad})
        form.setFieldsValue({...editedActividad})
    // eslint-disable-next-line
    },[editedActividad])

    const handleChange = (e) => {
        setActividad({
            ...actividad,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = () => {
        dispatch(updateActividadAction(actividad));
    }

    useEffect(() => {
        displayAlert()
        // eslint-disable-next-line
    }, [errors, updated])

    const displayAlert = () => {
        if(errors){
            openNotificationWithIcon('error', errors)
            dispatch( cleanErrorAction() )
        }
        if(updated){
            openNotificationWithIcon('success', 'La actividad ha sido actualizado correctamente')
            navigate('/actividades')
        }
    }
    if(!hasPermission(userPermission, 'editar actividades') && !isLoading ) return <Forbidden/>
    if(isLoading) return <Loading />
    return ( 
        <Form
            className="max-w-screen-md mx-auto"
            onFinish={handleSubmit}
            layout="vertical"
            onChange={handleChange}
            form={form}
        >
            <Form.Item
                label="Nombre"
                name="nombre"
                rules={[
                    { required: true, message: "Debes ingresar un nombre" },
                ]}
                hasFeedback
            >
                <Input name="nombre" />
            </Form.Item>
            <Form.Item
                label="Descripción"
                name="descripcion"
                rules={[
                    { required: true, message: "Debes ingresar una descripción" },
                ]}
                hasFeedback
            >
                <TextArea name="descripcion"/>
            </Form.Item>
            <Form.Item
                name="status"
                rules={[
                    { required: true, message: "Debes seleccionar un estatus" },
                ]}
                hasFeedback
            >
                <Select placeholder="Selecciona un estatus" name="status" onChange={ (value) => { setActividad({...actividad, status:value})} }>
                    <Option value={true}>Activo</Option>
                    <Option value={false}>Inactivo</Option> 
                </Select>
            </Form.Item>

            <Form.Item className="py-5">
                <div className="flex justify-between">
                    <Button type="default" onClick={ () => navigate(-1)}>
                        Cancelar
                    </Button>  
                    <Button type="ghost" htmlType="submit">
                        Guardar
                    </Button>  
                </div>
            </Form.Item>

        </Form>
     );
}
 
export default EditEmpresa;