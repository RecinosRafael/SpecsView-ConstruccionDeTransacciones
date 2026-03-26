import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";
import 'cypress-xpath';
class DepartamentosPomCy{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    Departamentos(data){
        this.Generales.llenarCampo(data.codigo, "Código")
        this.Generales.llenarCampo(data.nombre, "Nombre")
    }

}
export default DepartamentosPomCy;