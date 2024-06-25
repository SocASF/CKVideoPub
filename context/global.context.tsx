/*
@author LxingA
@version 1.0.0
@project SocASF
@description Definición del Contexto Global para la Aplicación
@date 09/06/24 12:00AM
*/
import {createContext,useReducer,useState,useEffect} from 'react';
import type {ReactNode,Dispatch} from 'react';

/** Condición de Inicialización sí el Dispositivo es Móvil */
const conditionalMovil: string = "(max-width:600px)";

/** Prototipo con el Objeto con la Información para el Contexto Global */
interface GlobalPrototype {
    /** Funcionalidad para la Mutación del Estado en el Contexto */
    mutate?: Dispatch<GlobalAction>,
    /** Indicador del Modo Obscuro en la Aplicación */
    dark: boolean,
    /** Objeto con la Información del Juego en el Contexto Actual */
    gameContext?: {
        /** Identificador Único (UUID) del Juego en la Base de Datos */
        identified: string,
        /** Nombre del Juego desde la Base de Datos */
        name: string,
        /** Descripción Acerca del Juego desde la Base de Datos */
        description?: string,
        /** Identificador Único (UUID) del Fondo de Pantalla del Juego desde la Base de Datos */
        image: string,
        /** Definición del Género del Juego Actual desde la Base de Datos */
        genre: string
    },
    /** Identificador Único (UUID) del Vídeo para el Reproductor Local de la Aplicación */
    videoID?: string,
    /** Indicador sí el Dispositivo está en Modo Móvil para la Aplicación */
    mobile: boolean,
    /** Identificador Único (UUID) del Filtro Actual en la Aplicación */
    currentFilter: string
};

/** Prototipo con el Objeto con la Acción del Contexto */
type GlobalAction = {
    /** Nombre del Accionador para la Mutación en el Contexto */
    action: "AC_DARKMODE_SET" | "AC_GAMECTX_SET" | "AC_VIDEOCTX_SET" | "AC_FILTERCTX_SET",
    /** Dato con los Parámetros Esenciales para el Accionador */
    payload: any
};

/** Objeto con el Estado Inicial del Contexto */
export const InitialState: GlobalPrototype = {
    dark: true,
    mobile: (window["matchMedia"](conditionalMovil)["matches"]),
    currentFilter: "637b9a0e-228b-4606-9ec8-baffcf61f6cd"
};

/** Instancia del Contexto para la Aplicación */
export const Context = (createContext<GlobalPrototype>(InitialState));

/** Reducedor Local para la Mutación del Estado en el Contexto */
const Reducer = ((state:GlobalPrototype,{action,payload}:GlobalAction) => {
    switch(action){
        /** Definición del Filtro Actual para la Aplicación */
        case "AC_FILTERCTX_SET":
            state["currentFilter"] = (payload);
            return {...state};
        /** Definición del Vídeo Currente para el Reproductor Local */
        case "AC_VIDEOCTX_SET":
            state["videoID"] = (payload);
            return {...state};
        /** Definición de la Raíz del Juego Activo en la Aplicación */
        case "AC_GAMECTX_SET":
            switch(payload["method"]){
                case "add":
                    state["gameContext"] = payload["value"];
                break;
                case "remove":
                    delete state["gameContext"];
                break;
            }return {...state};
        /** Mutación del Tema Actual en la Aplicación */
        case "AC_DARKMODE_SET":
            document["documentElement"]["setAttribute"]("data-mdb-theme",(payload ? "dark" : "light"));
            state["dark"] = (payload);
            return {...state};
        default:
            return state;
    }
});

/** Componente con la Referencia del Proveedor del Contexto */
export default function Provider({children}:{
    /** Referencia al Hijo DOM para el Renderizado en el Proveedor */
    children: ReactNode
}){
    const [state,mutate] = (useReducer(Reducer,InitialState));
    const [mobile,setMobile] = (useState<boolean>(InitialState["mobile"]));
    useEffect(() => {
        window["matchMedia"](conditionalMovil)["addEventListener"]("change",({matches}) => (setMobile(matches)));
    },[]);
    return (
        <Context.Provider value={{...state,mutate,mobile}}>
            {children}
        </Context.Provider>
    );
};