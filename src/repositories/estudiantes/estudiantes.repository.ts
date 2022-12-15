import Estudiante from "../../models/Estudiante";

export default interface EstudiantesRepository{
    findAll(): Promise<Estudiante[]>
}