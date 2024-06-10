/*
@author LxingA
@version 1.0.0
@project SocASF
@description Complementos Esenciales para el Componente de la Cabecera de la Aplicación
@date 09/06/24 02:00AM
*/
import {useTranslation} from 'react-i18next';
import {Context as GlobalContext} from '../context/global.context';
import Storage from '../util/storage';
import type Application from '../types/global';

/** Complemento para Mostrar el Contenedor con los Bótones de Acción de la Cabecera de la Aplicación */
export const AddonHeaderContainerActions = () => {
    const {language:LenguagePack}: Application = (Storage["get"]("global"));
    const {i18n:{changeLanguage,language:CurrentLanguage},t} = (useTranslation());
    return (
        <div className="d-flex align-items-center">
            <select defaultValue={CurrentLanguage} className="form-control select-input" style={{position:"relative",marginRight:4.5}} onChange={event => {
                event["preventDefault"]();
                changeLanguage(event["target"]["value"]);
            }}>
                {LenguagePack["map"](({iso,label},iterator) => (
                    <option key={iterator} value={iso}>
                        {label}
                    </option>
                ))}
            </select>
            <GlobalContext.Consumer>
                {({dark,mutate}) => (
                    <button title={t(`0236d4bb${dark ? "D" : "L"}`)} className={`btn btn-${dark ? "dark" : "light"} px-3`} onClick={event => {
                        event["preventDefault"]();
                        mutate!({
                            action: "AC_DARKMODE_SET",
                            payload: !dark
                        });
                    }}>
                        <i className={`fa-regular fa-${dark ? "moon" : "sun"}`}></i>
                    </button>
                )}
            </GlobalContext.Consumer>
        </div>
    );
};