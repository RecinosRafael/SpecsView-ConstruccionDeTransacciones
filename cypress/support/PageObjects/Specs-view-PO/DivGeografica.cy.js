import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";


class DivGeografica{
    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    DivicionGeografica(codigo, nombre){
        
        this.Generales.llenarCampo(codigo, "Codigo")
        this.Generales.llenarCampo(nombre, "Nombre")
    }

    DivicionGeografica2(codigo, nombre){
        
        this.Generales.llenarCampo(codigo, "Codigo")
        this.Generales.llenarCampo(nombre, "Nombre")
    }

    DivicionGeografica3(codigo, nombre){
        
        this.Generales.llenarCampo(codigo, "Codigo")
        this.Generales.llenarCampo(nombre, "Nombre")
    }


}
export default DivGeografica;