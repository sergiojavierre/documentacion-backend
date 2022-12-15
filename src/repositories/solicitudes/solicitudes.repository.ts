import Documento from '../../models/Documento'
import Estado from '../../models/Estado'
import Info from '../../models/Info'
import Solicitud from '../../models/Solicitud'
import SolicitudInfo from '../../models/SolicitudInfo'

export default interface SolicitudesRepository{
    findAll(): Promise<Solicitud[]>
    findById(id: Number): Promise<Solicitud | Info>
    findPending(): Promise<Solicitud[]>
    findTipos(): Promise<SolicitudInfo[]>

    add(solicitud: Solicitud): Promise<Solicitud>
    addDocumento(solicitud: Number, documento : Documento) : Promise<Documento>
    addEstado(solicitud: Number, estado : Estado) : Promise<Estado>

}