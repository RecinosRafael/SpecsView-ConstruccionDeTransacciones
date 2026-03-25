import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";
import 'cypress-xpath';
class NivelesDeAutorizacionPomCy{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    NivelesDeAutorizacion(data){

        this.Generales.esperarQueSpinnerDesaparezca()
        this.Generales.seleccionarCombo(data.arbolRaiz, "Árbol Raíz", {Timeout: 10000})
        this.Generales.llenarCampo(data.nivel, "Nivel")
        this.Generales.llenarCampo(data.nombre, "Nombre")
        this.Generales.llenarCampo(data.descripcion, "Descripción")

    }

}
export default NivelesDeAutorizacionPomCy;