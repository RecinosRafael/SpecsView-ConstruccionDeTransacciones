import metodosGeneralesPomCy  from "./MetodosGeneralesPom.cy";

class ArbolOrganizacional{
    constructor(){
        this.Generales = new metodosGeneralesPomCy();
    }

    ArbolOrganizacional(codigo, nombre, descripcion, responsable, cicloDeVida, canal, validoDesde, validoHasta, tieneUsuariosFinales, esRaiz, padre, tipoRama, puesto, codigoEquivalente, 
                        nivelArbol, nombreUsuario, complementoDireccion, tiempoLimite, nivelGeografico1, nivelGeografico2, nivelGeografico3, region, latitud, longitud){

    }
}

export default ArbolOrganizacional;