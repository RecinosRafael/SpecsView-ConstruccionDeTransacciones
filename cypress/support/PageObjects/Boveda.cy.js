import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";

class BovedaPomCy{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    Boveda(nombre, descripcion, valorArbolRaiz, valorRamaArbol, valorJornada, valorUsuario){

        this.Generales.llenarCampo(nombre, "Nombre")
        this.Generales.llenarCampo(descripcion, "Descripción")
        this.Generales.seleccionarComboDependiente(valorArbolRaiz, "Árbol Raíz")
        this.Generales.seleccionarComboDependiente(valorRamaArbol, "Rama del árbol")
        this.Generales.seleccionarComboDependiente(valorJornada, "Jornada")
        this.Generales.seleccionarComboDependiente(valorUsuario, "Usuario")

    }

}
export default BovedaPomCy