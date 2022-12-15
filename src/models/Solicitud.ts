import Documento from "./Documento";
import Estado from "./Estado";
import Estudiante from "./Estudiante";

export default interface Solicitud{
    id?: Number,
    estudiante: Estudiante,
    tipo: String,
    estados?: Estado[]
    documentos?: Documento[]
}