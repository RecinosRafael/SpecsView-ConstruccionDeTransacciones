import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";

class TipoRamaAgenciaPomCy {

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

       TipoRamaAgencia(data){
        this.Generales.llenarCampo(data.codigo, "código")
        this.Generales.llenarCampo(data.nombre, "nombre")
        this.Generales.llenarCampo(data.descripcion, "descripción")
        this.Generales.seleccionarCombo(data.canal, "Canal")
    }
}
export default TipoRamaAgenciaPomCy;