import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";
import 'cypress-xpath';
class ParametrosGeneralesPomCy{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    ParametrosGenerales(data){
        this.Generales.llenarCampo(data.nombre, "Nombre de la Empresa")
        this.Generales.seleccionarCombo(data.moneda, "Moneda Base")
    }

}
export default ParametrosGeneralesPomCy;