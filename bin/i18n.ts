/*
@author LxingA
@version 1.0.0
@project SocASF
@description Integración de i18n como Gestor de los Idiomas de la Aplicación
@date 09/06/24 07:30PM
*/
import {initReactI18next} from 'react-i18next';
import i18n from 'i18next';
import language from '../language.json';
import type {InitOptions} from 'i18next';

i18n["use"](initReactI18next)["init"]({
    lng: "es",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    },
    resources: language
} as InitOptions);

export default i18n;