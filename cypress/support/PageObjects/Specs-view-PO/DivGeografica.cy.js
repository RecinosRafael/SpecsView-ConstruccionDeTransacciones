import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";


class DivGeografica{
    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    DivisionGeografica(codigo, nombre){
        
        this.Generales.llenarCampo(codigo, "Codigo")
        this.Generales.llenarCampo(nombre, "Nombre")
    }

    DivisionGeografica2(codigo, nombre){
        
        this.Generales.llenarCampo(codigo, "Codigo")
        this.Generales.llenarCampo(nombre, "Nombre")
    }

    DivisionGeografica3(codigo, nombre){
        
        this.Generales.llenarCampo(codigo, "Codigo")
        this.Generales.llenarCampo(nombre, "Nombre")
    }


}
export default DivGeografica;