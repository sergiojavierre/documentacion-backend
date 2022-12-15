import Solicitud from "../../models/Solicitud";
import SolicitudesRepository from "./solicitudes.repository";

import {executeQuery} from '../../db/mysql.connector'
import Info, { NotFound } from "../../models/Info";
import Estado from "../../models/Estado";
import Documento from "../../models/Documento";
import SolicitudInfo from "../../models/SolicitudInfo";

export default class SolicitudesRepositoryMySQL implements SolicitudesRepository{
    
    
    async findAll(): Promise<Solicitud[]> {
        const solicitudes: Solicitud[] = []
        const data: any[] = await executeQuery(
            `select * 
            from solicitudes s`
        )
        for (const item of data) {
            const solicitud: Solicitud = {
                id: item.id,
                estudiante: item.estudiante,
                tipo: item.tipo
            }
            solicitudes.push(solicitud)
        }
        return solicitudes
    }

    async findById(id: Number): Promise<Solicitud | Info> {
        const data: any[] = await executeQuery(
            `select * 
            from solicitudes s
            where id = ${id}`
        )
        if (data.length > 0) {
            const item : any = data[0]
            const solicitud: Solicitud = {
                id: item.id,
                estudiante: item.estudiante,
                tipo: item.tipo,
                estados: [],
                documentos: []
            }
            const dataEstados: any[] = await executeQuery(
                `select * 
                from estados 
                where solicitud = ${id}`
            )
            for (const itemEstado of dataEstados) {
                const estado: Estado = {
                    actualizacion: itemEstado.actualizacion,
                    comentarios: itemEstado.comentarios
                }
                solicitud.estados?.push(estado)
            }
            const dataDocumentos: any[] = await executeQuery(
                `select * 
                from documentos 
                where solicitud = ${id}`
            )
            for (const itemDocumento of dataDocumentos) {
                const documento: Documento = {
                    id: itemDocumento.id,
                    ruta: itemDocumento.ruta
                }
                solicitud.documentos?.push(documento)
            }
            return solicitud
        }
        return NotFound
    }

    async findPending(): Promise<Solicitud[]> {
        const solicitudes: Solicitud[] = []
        const data: any[] = await executeQuery(
            `select *
            from solicitudes
            where id not in (
                select solicitud
                from estados
                where comentarios = 'FINALIZADO'
            );`
        )
        for (const item of data) {
            const solicitud: Solicitud = {
                id: item.id,
                estudiante: item.estudiante,
                tipo: item.tipo
            }
            solicitudes.push(solicitud)
        }
        return solicitudes
    }

    async findTipos(): Promise<SolicitudInfo[]>{
        const tipos: SolicitudInfo[] = []
        const data: any[] = await executeQuery(
            `select count(*) as cantidad, tipo
            from solicitudes
            group by tipo;`
        )
        for (const item of data) {
            const solicitud: SolicitudInfo = {
                cantidad: item.cantidad,
                tipo: item.tipo
            }
            tipos.push(solicitud)
        }
        return tipos
    }

    async add(solicitud: Solicitud): Promise<Solicitud>{
        const sql = `insert into solicitudes (estudiante, tipo) values (${solicitud.estudiante}, "${solicitud.tipo}")`
        const sqlSearch = `select * from solicitudes where estudiante = ${solicitud.estudiante} and tipo = "${solicitud.tipo}" order by id desc`
        await executeQuery(sql)
        const data: any[] = await executeQuery(sqlSearch)
        if (data.length > 0) {
            const item: any = data[0]
            solicitud.id = item.id
        }
        return {
            id: solicitud.id,
            estudiante: solicitud.estudiante,
            tipo: solicitud.tipo
        }
    }

    async addDocumento(solicitud: Number, documento: Documento): Promise<Documento> {
        const sql = `insert into documentos (solicitud, ruta) values (${solicitud}, "${documento.ruta}")`
        const sqlSearch = `select * from documentos where solicitud = ${solicitud} and ruta = "${documento.ruta}" order by id desc`
        await executeQuery(sql)
        const data: any[] = await executeQuery(sqlSearch)
        if (data.length > 0) {
            const item: any = data[0]
            documento.id = item.id
        }
        return documento
    }

    async addEstado(solicitud: Number, estado: Estado): Promise<Estado> {
        const sql = `insert into estados (solicitud, comentarios) values (${solicitud}, "${estado.comentarios}")`
        const sqlSearch = `select * from estados where solicitud = ${solicitud} and comentarios = "${estado.comentarios}" order by actualizacion desc`
        await executeQuery(sql)
        const data: any[] = await executeQuery(sqlSearch)
        if (data.length > 0) {
            const item: any = data[0]
            estado.actualizacion = item.actualizacion
        }
        return estado
    }

}