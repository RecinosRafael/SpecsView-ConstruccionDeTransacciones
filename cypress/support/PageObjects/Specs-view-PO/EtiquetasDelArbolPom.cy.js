import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";
import 'cypress-xpath';
class EtiquetasDelArbolPomCy{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    EtiqeutasArbol(data){

        this.Generales.esperarQueSpinnerDesaparezca()
        this.Generales.seleccionarCombo(data.arbolRaiz, "Árbol Raíz", {Timeout: 10000})
        this.Generales.llenarCampo(data.nivel, "Nivel del árbol")
        this.Generales.llenarCampo(data.nombre, "Nombre")

    }

}
export default EtiquetasDelArbolPomCy;