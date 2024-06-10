/*
@author LxingA
@version 1.0.0
@project SocASF
@description Utilidad Esencial para el Almacenamiento Local de la Aplicación
@date 08/06/24 10:30PM
*/
import type Application from "../types/global";

/** Definición de la Ruta Absoluta de un Recurso de la Aplicación */
export const Provider = ({identified,parameter = {},external = false}:{
    /** Establecer el Punto Final Local del Proyecto */
    external?: boolean,
    /** Objeto con los Parámetros Adicionales en la Petición */
    parameter?: Record<string,any>,
    /** Identificador Único (UUID) del Recurso */
    identified: string
}): string => {
    const {endpoint,token}: Application = (Local["get"]("global"));
    let _parameter_: string = "";
    (Object["keys"](parameter)["forEach"]((k,i) => {
        _parameter_ += (`&${k}=${Object["values"](parameter)[i]}`);
    }));
    return (external ? `${endpoint["filter"](({name}) => (name == "global"))[0]["path"]["replace"]("cdn",("gb-" + import.meta.env.SCVideoParamKeyAPIKeyAccess["split"]("-")[4]))}/${identified}?v=${token}${_parameter_}`["trim"]() : `${endpoint["filter"](({name}) => (name == "resources"))[0]["path"]}/${identified}?access_token=${token}${_parameter_}`["trim"]());
};

/** Definición del Almacenamiento Local de la Aplicación */
const Local = (new Map<string,any>());

export default Local;