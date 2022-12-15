
import express, { Request, Response } from 'express'
import EstudiantesRepositoryMySQL from '../repositories/estudiantes/estudiantes.repository.mysql'

const router = express.Router()
const estudiantesRepository = new EstudiantesRepositoryMySQL()

router.get('/', async ( req: Request, res: Response) => {
    try {
        const data = await estudiantesRepository.findAll()
        res.send(data)
    }
    catch (error) {
        res.send(error)
    }
})

export { router as routerEstudiantes};
