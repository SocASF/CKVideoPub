/*
@author LxingA
@version 1.0.0
@project SocASF
@description Vista para Mostrar el Listado de los Vídeos Públicos para la Aplicación
@date 12/06/24 03:50AM
*/
import {Context as GlobalContext} from '../context/global.context';
import {useQuery} from '@apollo/client';
import {Navigate,useNavigate} from 'react-router-dom';
import {useContext,useState} from 'react';
import {GraphQLVideoListener} from '../util/graphql';
import {useTranslation} from 'react-i18next';
import {Texted} from '../util/element';
import {Provider} from '../util/storage';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import Loader,{SkeletonTheme} from 'react-loading-skeleton';
import SEO from '../view/seo.template';
import Template from '../view/default.template';
import type {ReactNode,Dispatch,SetStateAction} from 'react';

/** Utilidad Esencial para el Contenedor del Paginador para la Vista */
const ListPaginatorContainer = ({total,perPage,currentPage,callback}:{
    /** Objeto con los Totales Obtenidos en la Base de Datos */
    total: {
        /** Total de Páginas Obtenidas en la Base de Datos */
        page: number,
        /** Total de Elementos Obtenidos en la Base de Datos */
        item: number
    },
    /** Total de Elementos a Mostrar por Vista */
    perPage: number,
    /** Página Actual en el Contexto de la Vista */
    currentPage: number,
    /** Función de Utilidad para la Mutación de la Página Actual en el Contexto de la Vista */
    callback: Dispatch<SetStateAction<number>>
}) => {
    const {t} = (useTranslation());
    const {gameContext} = (useContext(GlobalContext));
    return (
        <nav className="text-center">
            <ul className="pagination d-flex justify-content-center">
                <li className="page-item">
                    <button data-mdb-ripple-init className="page-link btn btn-primary" disabled={currentPage <= 1} onClick={event => {
                        event["preventDefault"]();
                        callback(1);
                    }}>
                        <i className="fas fa-angles-left"></i>
                    </button>
                </li>
                <li className="page-item" style={{position:"relative",marginLeft:4}}>
                    <button data-mdb-ripple-init className="page-link btn btn-primary" disabled={currentPage <= 1} onClick={event => {
                        event["preventDefault"]();
                        callback(currentPage - 1);
                    }}>
                        <i className="fas fa-chevron-left"></i>
                    </button>
                </li>
                <li className="page-item" style={{position:"relative",marginLeft:4}}>
                    <button data-mdb-ripple-init className="page-link btn btn-primary" disabled={currentPage == total["page"]} onClick={event => {
                        event["preventDefault"]();
                        callback(currentPage + 1);
                    }}>
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </li>
                <li className="page-item" style={{position:"relative",marginLeft:4}}>
                    <button data-mdb-ripple-init className="page-link btn btn-primary" disabled={currentPage == total["page"]} onClick={event => {
                        event["preventDefault"]();
                        callback(total["page"]);
                    }}>
                        <i className="fas fa-angles-right"></i>
                    </button>
                </li>
            </ul>
            <p>
                {Texted(t("bfaa3a82"),{
                    celements: String((currentPage == total["page"]) ? total["item"] : (perPage * currentPage)),
                    telements: String(total["item"]),
                    game: String(gameContext?.name)["toLowerCase"]()
                })}
            </p>
        </nav>
    );
};

/** Utilidad Esencial para el Contenedor con la Cabecera de la Vista */
const ListHeaderContainer = ({image,title,description}:{
    image: string,
    title: string,
    description?: string
}) => {
    return (
        <header className="mb-3">
            <div className="p-5 text-center bg-image" style={{
                backgroundImage: `url(${Provider({
                    identified: image,
                    parameter: {
                        format: "webp"
                    }
                })})`,
                height: 600
            }}>
                <div className="mask" style={{
                    backgroundColor: "rgba(0,0,0,0.6)"
                }}>
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-white">
                            <h1 className="mb-3">
                                {title}
                            </h1>
                            {description && (
                                <h4 className="mb-3">
                                    {description}
                                </h4>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

/** Vista para Mostrar el Listado de los Vídeos Públicos */
export default function List(){
    const {gameContext,mutate} = (useContext(GlobalContext));
    if(!gameContext) return (
        <Navigate to="/"/>
    );
    const {i18n:{language},t} = (useTranslation());
    const [perPage] = (useState<number>(4));
    const [currentPage,setPage] = (useState<number>(1));
    const [change,setChange] = (useState<string>());
    const {data,loading} = (useQuery(GraphQLVideoListener,{
        notifyOnNetworkStatusChange: false,
        context: {
            language
        },
        variables: {
            a4fbcc125: gameContext["identified"],
            a5a9293de: {
                a3f53e411: perPage,
                af0afffd2: currentPage
            }
        }
    }));
    const _navigator_ = (useNavigate());
    const _ctx_: ReactNode[] = [];
    if(loading){
        for(let o = 0; o <= (perPage - 1); o++) _ctx_["push"](
            <div className="col" key={o}>
                <div className="card">
                    <div className="bg-image hover-overlay">
                        <LazyLoadImage effect="blur" className="img-fluid" src={Provider({
                            identified: "884f520d-9fe5-4631-8e97-fdb2e80a3a2e.webp",
                            external: true
                        })}/>
                    </div>
                    <div className="card-body text-center">
                        <SkeletonTheme baseColor="#424242">
                            <h5 className="card-title">
                                <Loader count={1} height={30}/>
                            </h5>
                            <p className="card-text">
                                <Loader count={4} height={10}/>
                            </p>
                        </SkeletonTheme>
                    </div>
                </div>
            </div>
        );
        return (
            <Template>
                <ListHeaderContainer {...{
                    image: gameContext["image"],
                    title: gameContext["name"],
                    description: gameContext["description"]
                }}/>
                <div className="row row-cols-1 row-cols-md-2 g-4 mb-3">
                    {_ctx_}
                </div>
            </Template>
        );
    }else{
        const _dt_: any = (data["fbd45e939"])["rs"];
        return (
            <Template>
                <SEO strategy={{
                    title: (Texted(t("58121785"),{
                        game: (gameContext["name"])
                    })),
                    description: (gameContext["description"])
                }}>
                    <ListHeaderContainer {...{
                        image: gameContext["image"],
                        title: gameContext["name"],
                        description: gameContext["description"]
                    }}/>
                    <div className="row row-cols-1 row-cols-md-2 g-4 mb-3">
                        {(_dt_["ob"] as any[])["map"]((d,i) => (
                            <div className="col" key={i}>
                                <div className="card">
                                    <div className="bg-image hover-overlay" data-mdb-ripple-init data-mdb-ripple-color="light">
                                        <LazyLoadImage effect="blur" className="img-fluid" src={Provider({
                                            identified: d["thumbnail"],
                                            parameter: {
                                                format: "webp"
                                            }
                                        })}/>
                                    </div>
                                    <div className="card-body text-center">
                                        <h5 className="card-title" style={{fontSize:18}}>
                                            {Texted(d["title"],{
                                                hero: d["character"]?.label
                                            })}
                                        </h5>
                                        {d["description"] && (
                                            <p className="card-text">
                                                {Texted(d["description"],{
                                                    hero: d["character"]?.label
                                                })["substring"](0,144)}...
                                            </p>
                                        )}
                                        <button disabled={(typeof(change) == "string")} className="btn btn-primary" data-mdb-ripple-init onClick={event => {
                                            event["preventDefault"]();
                                            setChange(d["key"]);
                                            mutate!({
                                                action: "AC_VIDEOCTX_SET",
                                                payload: d["key"]
                                            });
                                            setTimeout(() => _navigator_("/watch"),1000);
                                        }}>
                                            {(typeof(change) == "string" && change == d["key"]) ? t("2f1527132") : t("2f1527131")}
                                        </button>
                                    </div>
                                    <div className="card-footer text-center">
                                        <div className="d-flex align-items-center">
                                            <div className="col">
                                                <i className="far fa-eye"></i>
                                                <span style={{position:"relative",left:6}}>
                                                    {d["view"]}
                                                </span>
                                            </div>
                                            <div className="col">
                                                <i className="far fa-calendar"></i>
                                                <span style={{position:"relative",left:6}}>
                                                    {(new Date(Date["parse"](d["createAt"])))["toLocaleString"]()}
                                                </span>
                                            </div>
                                            {d["character"] && (
                                                <div className="col">
                                                    <i className="fas fa-khanda"></i>
                                                    <span style={{position:"relative",left:6}}>
                                                        {d["character"]["label"]}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <ListPaginatorContainer callback={setPage} total={{page:_dt_["pp"],item:_dt_["tt"]}} {...{perPage,currentPage}}/>
                </SEO>
            </Template>
        );
    }
};