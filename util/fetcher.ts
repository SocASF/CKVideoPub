/*
@author LxingA
@version 1.0.0
@project SocASF
@description Utilidad Esencial para la Definición del Fetcher para la Comunicación con la API
@date 08/06/24 03:00AM
*/
import type Application from '../types/global';
import type {ResponseAPI} from '../types/global';

/** Comunicación con la API Global para la Obtención de la Información Esencial de la Aplicación */
export default async function API(): Promise<Application | string> {
    const _rq_ = (await fetch((`${import.meta.env.SCVideoParamKeyAPIEndPointURI}/global?context=application`),{
        method: "get",
        mode: "cors",
        headers: {
            "X-CKeyApp-H": (import.meta.env.SCVideoParamKeyAPIKeyAccess),
            "X-CLangApp-H": "es"
        }
    }));if(_rq_["status"] != 200 || !_rq_["ok"]) return (_rq_["statusText"] || "Hubo un error a realizar la petición a la API");
    else{
        const _rs_: ResponseAPI = (await _rq_["json"]());
        if(!_rs_["st"]) return ("Se realizó la petición, pero hubo un error en la respuesta de la API");
        else return _rs_["rs"]!["ob"][0] as Application;
    };
};