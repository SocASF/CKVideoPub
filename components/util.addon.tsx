/*
@author LxingA
@version 1.0.4
@project SocASF
@description Complementos Esenciales para los Componentes de Utilidad de la Aplicación
@date 18/06/24 10:30PM
*/
import {useContext} from 'react';
import {Context} from '../context/global.context';
import type {Dispatch,SetStateAction} from 'react';

/** Definición del Tipo para la Definición de la Opción del Selector */
export type SelectOption = {
    /** Nombre de la Etiqueta a Mostrar en el Selector */
    label: string,
    /** Valor a Asignar con la Etiqueta en el Selector */
    value: string
};

/** Complemento para la Definición del Selector para el Contenedor del Filtrador de la Aplicación */
export const AddonSelectorContainer = ({option,callback,currentPerPage,disabled}:{
    /** Contenedor con las Opciones para el Selector */
    option: SelectOption[],
    /** Callback de Ejecución para la Mutación de un Estado Local de la Aplicación */
    callback?: Dispatch<SetStateAction<number>>,
    /** Total de Elementos a Mostrar Currente en el Filtrador */
    currentPerPage?: number,
    /** Indicador de Deshabilitar el Selector en el Filtrador */
    disabled?: boolean
}) => {
    const {currentFilter,mutate} = (useContext(Context));
    return (
        <select className="form-control select-input" style={{
            width: 300
        }} onChange={event => {
            event["preventDefault"]();
            switch(typeof(callback)){
                case "function":
                    callback(Number(event["target"]["value"]));
                break;
                default:
                    mutate!({
                        action: "AC_FILTERCTX_SET",
                        payload: (event["target"]["value"])
                    });
                break;
            }
        }} defaultValue={currentPerPage || currentFilter} {...{disabled}}>
            {option["map"](({label,value},iterator) => (
                <option key={iterator} {...{value}}>
                    {label}
                </option>
            ))}
        </select>
    );
};