/*
@author LxingA
@version 1.0.0
@project SocASF
@description Definición del Contexto Global para la Aplicación
@date 09/06/24 12:00AM
*/
import {createContext,useReducer} from 'react';
import type {ReactNode,Dispatch} from 'react';

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
        image: string
    },
    /** Identificador Único (UUID) del Vídeo para el Reproductor Local de la Aplicación */
    videoID?: string
};

/** Prototipo con el Objeto con la Acción del Contexto */
type GlobalAction = {
    /** Nombre del Accionador para la Mutación en el Contexto */
    action: "AC_DARKMODE_SET" | "AC_GAMECTX_SET" | "AC_VIDEOCTX_SET",
    /** Dato con los Parámetros Esenciales para el Accionador */
    payload: any
};

/** Objeto con el Estado Inicial del Contexto */
export const InitialState: GlobalPrototype = {
    dark: true
};

/** Instancia del Contexto para la Aplicación */
export const Context = (createContext<GlobalPrototype>(InitialState));

/** Reducedor Local para la Mutación del Estado en el Contexto */
const Reducer = ((state:GlobalPrototype,{action,payload}:GlobalAction) => {
    switch(action){
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
    return (
        <Context.Provider value={{...state,mutate}}>
            {children}
        </Context.Provider>
    );
};