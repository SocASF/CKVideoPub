/*
@author LxingA
@version 1.0.0
@project SocASF
@description Definición de los Documentos GraphQL para la Consulta a la API
@date 11/06/24 04:30AM
*/
import {gql} from '@apollo/client';

/** Esquema GraphQL para la Obtención de Información de los Juegos en Modo Listado para la Aplicación */
export const GraphQLGameListener = (gql`
    query c4a720fd($a2a2f7516:f544e1445I) {
        f544e1445(ac10fa519:$a2a2f7516) {
            rs {
                tt
                pp
                ob {
                    ...fc159039b
                    illustration {
                        type
                        key
                        name
                    }
                    createAt
                    available
                    populate
                }
            }
        }
    }
`);

/** Esquema GraphQL para la Obtención de Información de los Vídeos en Modo Listado para la Aplicación */
export const GraphQLVideoListener = (gql`
    query d1f9097b($a4fbcc125:String!,$a5a9293de:fbd45e939I) {
        fbd45e939(ad73b976c:$a4fbcc125,ac10fa519:$a5a9293de) {
            rs {
                tt
                pp
                ob {
                    ...d1f9097bb
                    thumbnail
                    character {
                        label
                    }
                    view,
                    key,
                    createAt
                }
            }
        }
    }
`);

/** Esquema GraphQL para la Obtención de Información del Vídeo en el Contexto Actual de la Aplicación */
export const GraphQLVideoInfo = (gql`
    query a9eec98d($a4fbcc125:String!,$a0f2179a5:String!) {
        fbd45e939(ad73b976c:$a4fbcc125,a4ee44f99:$a0f2179a5) {
            rs {
                ob {
                    ...d1f9097bb
                    endpoint
                    character {
                        label
                        description
                        illustration {
                            name
                            key
                        }
                        key
                    }
                    view
                    createAt
                }
            }
        }
    }
`);

/** Esquema GraphQL para la Obtención de los Vídeos Sugeridos para el Contexto Actual de la Aplicación */
export const GraphQLVideoSuggest = (gql`
    query e3e5f2fd($a6ab0ea58:String!,$a6fed3051:String,$ac122a135:String,$a0296b5fb:fbd45e939I,$af28f7203:Boolean) {
        fbd45e939(ad73b976c:$a6ab0ea58,a4ee44f99:$a6fed3051,a0e95a8b1:$ac122a135,ac10fa519:$a0296b5fb,e10794ae:$af28f7203) {
            rs {
                ob {
                    ...d1f9097bb
                    thumbnail
                    createAt
                }
            }
        }
    }
`);