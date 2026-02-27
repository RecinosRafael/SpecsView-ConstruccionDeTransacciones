import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";


class AccionesPomCy{
    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    Accion(codigo, nombre, descripcion, ValorTipoAccion){
        
        this.Generales.llenarCampo(codigo, "Codigo")
        this.Generales.llenarCampo(nombre, "Nombre")
        this.Generales.llenarCampo(descripcion, "descripcion")
        // cy.get("#beanRunTime").should("be.visible").clear().type(programaEjecucion)
        //cy.get("#beanSpecAction").should("be.visible").clear().type(progrmaEspecificaion)
        this.Generales.seleccionarCombo(ValorTipoAccion, "Tipo de acción");


    }

}
export default AccionesPomCy;