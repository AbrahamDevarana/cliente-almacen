import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const Acciones = () => {
    const navigate = useNavigate()
    return ( 
        <div className="flex m-auto flex-col h-full">
            <div className="m-auto">
                <Button onClick={() => navigate('/vales-salida/nuevo')} className='text-white my-2 py-10 w-full bg-primary'>Crear vale de salida </Button>
                <Button onClick={() => navigate('/vales-salida')} className='text-white my-2 w-full bg-primary'>Consultar Vales </Button>
                <Button onClick={() => navigate('/personal/create') } className='text-white my-2 w-full bg-primary'>Registrar Lideres de cuadrilla</Button>
            </div>
        </div>
     );
}
 
export default Acciones;