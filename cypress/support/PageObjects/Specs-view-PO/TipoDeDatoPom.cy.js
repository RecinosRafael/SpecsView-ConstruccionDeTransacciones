import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";

class TipoDeDatoPomCy {

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    TipoDato(codigo, nombre, descripcion){

        this.Generales.llenarCampo(codigo, "codigo")
        this.Generales.llenarCampo(nombre, "nombre")
        this.Generales.llenarCampo(descripcion, "descripcion")


    }

}
export default TipoDeDatoPomCy;