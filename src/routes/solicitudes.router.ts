
import express, { Request, Response } from 'express'
import Documento from '../models/Documento'
import Estado from '../models/Estado'
import Solicitud from '../models/Solicitud'
import SolicitudesRepositoryMySQL from '../repositories/solicitudes/solicitudes.repository.mysql'

const router = express.Router()
const solicitudesRepository = new SolicitudesRepositoryMySQL()

router.get('/', async ( req: Request, res: Response) => {
    try {
        const data = await solicitudesRepository.findAll()
        res.send(data)
    }
    catch (error) {
        res.send(error)
    }
})

router.get("/pendientes", async ( req: Request, res: Response) => {
    try {
        const data = await solicitudesRepository.findPending()
        res.send(data)
    }
    catch (error) {
        res.send(error)
    }
})

router.get("/tipos", async ( req: Request, res: Response) => {
    try {
        const data = await solicitudesRepository.findTipos()
        res.send(data)
    }
    catch (error) {
        res.send(error)
    }
})

router.get("/:id", async ( req: Request, res: Response) => {
    try {
        const data = await solicitudesRepository.findById(Number(req.params.id))
        res.send(data)
    }
    catch (error) {
        res.send(error)
    }
})

router.post("/", async ( req: Request, res: Response) => {
    try {
        const solicitud: Solicitud = {
            estudiante: req.body.estudiante,
            tipo: req.body.tipo
        }
        const data = await solicitudesRepository.add(solicitud)
        res.send(data)
    }
    catch (error) {
        res.send(error)
    }
})
router.post("/completa", async ( req: Request, res: Response) => {
    try {
        const solicitud: Solicitud = {
            estudiante: req.body.estudiante,
            tipo: req.body.tipo,
            documentos: req.body.documentos,
            estados: req.body.estados
        }
        const solicitudGuardada: Solicitud = await solicitudesRepository.add(solicitud)        
        if (solicitudGuardada.id && solicitud.documentos) {
            solicitudGuardada.documentos = []
            for (const documento of solicitud.documentos) {
                
                const documentoGuardado = await solicitudesRepository.addDocumento(solicitudGuardada.id, documento)
                solicitudGuardada.documentos.push(documentoGuardado)
            }
        }
        if (solicitudGuardada.id && solicitud.estados) {
            solicitudGuardada.estados = []
            for (const estado of solicitud.estados) {
                const estadoGuardado = await solicitudesRepository.addEstado(solicitudGuardada.id, estado)
                solicitudGuardada.estados.push(estadoGuardado)
            }
        }
        res.send(solicitudGuardada)
    }
    catch (error) {
        res.send(error)
    }
})

router.put("/:id/documentacion", async ( req: Request, res: Response) => {
    try {
        const solicitud : Number = Number(req.params.id)
        const documento: Documento = {
            ruta: req.body.ruta
        }
        const data = await solicitudesRepository.addDocumento(solicitud, documento)
        res.send(data)
    }
    catch (error) {
        res.send(error)
    }
})

router.put("/:id/estado", async ( req: Request, res: Response) => {
    try {
        const solicitud : Number = Number(req.params.id)
        const estado: Estado = {
            comentarios: req.body.comentarios
        }
        const data = await solicitudesRepository.addEstado(solicitud, estado)
        res.send(data)
    }
    catch (error) {
        res.send(error)
    }
})




export { router as routerSolicitudes};
