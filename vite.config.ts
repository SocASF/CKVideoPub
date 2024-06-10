/*
@author LxingA
@version 1.0.0
@project SocASF
@description Integración de ViteJS en la Aplicación
@date 07/06/24 03:00AM
*/
import {defineConfig} from 'vite';
import {readFileSync} from 'fs';
import {join} from 'path';
import React from '@vitejs/plugin-react';

/** Definición de la Configuración Esencial para Vite en la Aplicación */
export default defineConfig({
    plugins: [
        React()
    ],
    server: {
        port: Number(readFileSync(join(__dirname,"./port.sc"))),
        strictPort: true,
        host: "0.0.0.0"
    },
    envPrefix: "SCVideoParamKey"
});