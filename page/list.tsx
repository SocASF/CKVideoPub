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
import {GlobalFilterContainer} from '../components/util.component';
import Loader,{SkeletonTheme} from 'react-loading-skeleton';
import Moment from 'react-moment';
import SEO from '../view/seo.template';
import Storage from '../util/storage';
import Template from '../view/default.template';
import type Application from '../types/global';
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
    const _label_: string = (t("bfaa3a82v")["split"]("|")[(total["item"] <= 1 ? 0 : 1)]);
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
            <p dangerouslySetInnerHTML={{
                __html: (Texted(t("bfaa3a82"),{
                    celements: String((currentPage == total["page"]) ? total["item"] : (perPage * currentPage)),
                    telements: String(total["item"]),
                    label: _label_
                }))
            }}/>
        </nav>
    );
};

/** Utilidad Esencial para el Contenedor con la Cabecera de la Vista */
export const ListHeaderContainer = ({image,title,description,external = false}:{
    /** Identificador Único (UUID) de la Imágen Ilustrativa a Mostrar en la Cabecera */
    image: string,
    /** Titulo a Mostrar en la Cabecera */
    title: string,
    /** Descripción Ilustrativo a Mostrar en la Cabecera */
    description?: string,
    /** Establecer la Imagén desde el Origen Externo */
    external: boolean
}) => {
    const {t} = (useTranslation());
    const {support}: Application = (Storage["get"]("global"));
    return (
        <header className={external ? undefined : "mb-3"}>
            <div className="p-5 text-center bg-image" style={{
                backgroundImage: `url(${Provider({
                    identified: image,
                    external,
                    parameter: external ? undefined : {
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
                            {external && (
                                <button data-mdb-ripple-init className="btn btn-primary" style={{position:"relative",top:6}} onClick={event => {
                                    event["preventDefault"]();
                                    window["open"](`mailto:${support}`,"_self");
                                }}>
                                    {t("bb017663")}
                                </button>
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
    const {gameContext,mutate,mobile,currentFilter} = (useContext(GlobalContext));
    if(!gameContext) return (
        <Navigate to="/"/>
    );
    const {i18n:{language},t} = (useTranslation());
    const [perPage,setPerPage] = (useState<number>(4));
    const [currentPage,setPage] = (useState<number>(1));
    const [change,setChange] = (useState<string>());
    const [character,setCharacter] = (useState<string>());
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
            },
            a564ec1b3: (currentFilter == "637b9a0e-228b-4606-9ec8-baffcf61f6cd" ? undefined : currentFilter),
            aa2330ddd: character
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
                    description: gameContext["description"],
                    external: false
                }}/>
                <div className="row row-cols-1 row-cols-md-2 g-4 mb-3">
                    {_ctx_}
                </div>
            </Template>
        );
    }else{
        const {resource}: Application = (Storage["get"]("global"));
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
                        description: gameContext["description"],
                        external: false
                    }}/>
                    {!mobile && (
                        <GlobalFilterContainer className=" mb-3" disabled={currentPage > 1} callback={setPerPage} currentPerPage={perPage}/>
                    )}
                    <div className="row row-cols-1 row-cols-md-2 g-4 mb-3">
                        {(_dt_["ob"] as any[])["map"]((d,i) => (
                            <div className="col" key={i}>
                                <div className="card">
                                    <div className="card-header text-center">
                                        <div className="d-flex align-items-center">
                                            <div className="col">
                                                <i className="far fa-eye"></i>
                                                <span style={{position:"relative",left:6}}>
                                                    {Texted(t("c8ad0a14"),{
                                                        count: (d["view"])
                                                    })}
                                                </span>
                                            </div>
                                            {d["character"] && (
                                                <div className="col">
                                                    <span title={d["character"]["label"]} style={{position:"relative",left:6,cursor:"pointer"}} onClick={event => {
                                                        event["preventDefault"]();
                                                        setPage(1);
                                                        (character ? (setCharacter(undefined)) : (setCharacter(d["character"]["key"])));
                                                    }}>
                                                        <LazyLoadImage effect="blur" className="img-thumbnail" src={Provider({
                                                            identified: (d["character"]["illustration"]["filter"]((t:any) => (t["name"] == "icon"))[0]["key"]),
                                                            parameter: {
                                                                format: "webp",
                                                                width: 64
                                                            }
                                                        })}/>
                                                    </span>
                                                </div>
                                            )}
                                            <div className="col">
                                                <i className="far fa-calendar"></i>
                                                <span title={(new Date(Date["parse"](d["createAt"])))["toLocaleString"]()} style={{position:"relative",left:6}}>
                                                    <Moment fromNow>
                                                        {d["createAt"]}
                                                    </Moment>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-image hover-overlay" data-mdb-ripple-init data-mdb-ripple-color="light" style={{
                                        position: "relative",
                                        height: (mobile ? undefined : 300)
                                    }}>
                                        <LazyLoadImage effect="blur" className="img-fluid" src={Provider({
                                            identified: d["thumbnail"],
                                            parameter: {
                                                format: "webp",
                                                height: 400,
                                                quality: 60,
                                                fit: "inside"
                                            }
                                        })} placeholderSrc={Provider({
                                            identified: "884f520d-9fe5-4631-8e97-fdb2e80a3a2e.webp",
                                            external: true
                                        })}/>
                                        <div className="mask text-center d-flex align-items-center justify-content-center" style={{
                                            backgroundImage: "rgba(0,0,0,0.6)"
                                        }}>
                                            <LazyLoadImage effect="blur" src={Provider({
                                                identified: (resource["filter"](({name}) => (name == "logo.png"))[0]["key"]),
                                                parameter: {
                                                    format: "webp",
                                                    height: 256
                                                }
                                            })}/>
                                        </div>
                                    </div>
                                    <div className="card-body text-center" style={{
                                        position: "relative",
                                        marginBottom: 3
                                    }}>
                                        <h5 className="card-title" style={{fontSize:18}}>
                                            {Texted(d["title"],{
                                                hero: d["character"]?.label,
                                                game: gameContext?.name
                                            })}
                                        </h5>
                                        {d["description"] && (
                                            <p className="card-text">
                                                {Texted(d["description"],{
                                                    hero: d["character"]?.label,
                                                    game: gameContext?.name
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
                                            setTimeout(() => {
                                                _navigator_("/watch");
                                                window["scrollTo"](0,0);
                                            },1000);
                                        }}>
                                            {(typeof(change) == "string" && change == d["key"]) ? t("2f1527132") : t("2f1527131")}
                                        </button>
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