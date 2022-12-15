import { executeQuery } from "../../db/mysql.connector";
import Estudiante from "../../models/Estudiante";
import EstudiantesRepository from "./estudiantes.repository";

export default class EstudiantesRepositoryMySQL implements EstudiantesRepository{

    async findAll(): Promise<Estudiante[]> {
        const estudiantes: Estudiante[] = []
        const data: any[] = await executeQuery('select * from estudiantes')
        for (const item of data) {
            const estudiante: Estudiante = {
                id: item.id
            }
            estudiantes.push(estudiante)
        }
        return estudiantes
    }

}