/*
@author LxingA
@version 1.0.0
@project SocASF
@description Integración de Apollo GraphQL como Gestor GraphQL de la Aplicación
@date 11/06/24 04:30AM
*/
import {ApolloClient,InMemoryCache,gql,HttpLink,ApolloLink,from} from '@apollo/client';
import {createFragmentRegistry} from '@apollo/client/cache';
import {createPersistedQueryLink} from '@apollo/client/link/persisted-queries';
import {sha256} from 'crypto-hash';
import type {GraphQLContext} from '../types/context';

/** Instancia del Cliente de Apollo GraphQL para la Aplicación */
const GraphQL = (new ApolloClient({
    cache: (new InMemoryCache({
        fragments: (createFragmentRegistry(gql`
            fragment fc159039b on f544e1445O {
                title
                key
                description
            }
            fragment d1f9097bb on fbd45e939O {
                title
                key
                description
            }
            fragment d4d44e9c8 on GraphQLMutatedResponse {
                status
                message
                context
            }
        `))
    })),
    link: from([
        (new ApolloLink((o,f) => {
            o["setContext"](({language}:GraphQLContext) => ({
                headers: {
                    "X-CKeyApp-H": (import.meta.env.SCVideoParamKeyAPIKeyAccess),
                    "X-CLangApp-H": (language)
                }
            }));return (f(o));
        })),
        (createPersistedQueryLink({sha256,useGETForHashedQueries:true})["concat"]((new HttpLink({
            uri: (import.meta.env.SCVideoParamKeyAPIEndPointURI + "/graphql"),
            useGETForQueries: true,
            includeUnusedVariables: false
        }))))
    ])
}));

export default GraphQL; 