/*
@author LxingA
@version 1.0.4
@project SocASF
@description Componentes de Utilidad Esenciales para la Aplicación
@date 18/06/24 10:30PM
*/
import {AddonSelectorContainer} from './util.addon';
import {useTranslation} from 'react-i18next';
import {Texted} from '../util/element';
import type {SelectOption} from './util.addon';
import type {Dispatch,SetStateAction} from 'react';

/** Componente con el Contenedor del Filtrador Global para la Aplicación */
export const GlobalFilterContainer = ({additionalOption,callback,currentPerPage,disabled,className}:{
    /** Contenedor con Opciones Adicionales para el Contenedor del Filtrador */
    additionalOption?: SelectOption[],
    /** Función de Referencia para la Mutación del Estado Local de la Vista para el Filtrador */
    callback?: Dispatch<SetStateAction<number>>,
    /** Número de Elementos por Página Currente para el Filtrador */
    currentPerPage: number,
    /** Deshabilitar en Contexto del Filtrador el Selector */
    disabled?: boolean,
    /** Nombre de las Clases Adicionales a Establecer en el Contenedor del Filtro */
    className?: string
}) => {
    const {t} = (useTranslation());
    return (
        <div className={`container mt-3${className ?? ""}`}>
            <div className="row text-center">
                <div className="col">
                    <AddonSelectorContainer option={[
                        {
                            label: (Texted(t("883e7c270"),{
                                label: (t("883e7c271"))
                            })),
                            value: "637b9a0e-228b-4606-9ec8-baffcf61f6cd"
                        },
                        {
                            label: (Texted(t("883e7c270"),{
                                label: (t("883e7c272"))
                            })),
                            value: "92499353-6816-45da-b27f-ac8af43ad019"
                        },
                        {
                            label: (Texted(t("883e7c270"),{
                                label: (t("883e7c273"))
                            })),
                            value: "055457b5-41ff-4cc6-9535-b71ab7030623"
                        },
                        ...(additionalOption ?? [])
                    ]} {...{disabled}}/>
                </div>
                <div className="col d-flex justify-content-end">
                    <AddonSelectorContainer {...{callback,currentPerPage,disabled}} option={[
                        {
                            label: (Texted(t("11372d9d"),{
                                count: String(2)
                            })),
                            value: "2"
                        },
                        {
                            label: (Texted(t("11372d9d"),{
                                count: String(4)
                            })),
                            value: "4"
                        },
                        {
                            label: (Texted(t("11372d9d"),{
                                count: String(8)
                            })),
                            value: "8"
                        }
                    ]}/>
                </div>
            </div>
        </div>
    );
};