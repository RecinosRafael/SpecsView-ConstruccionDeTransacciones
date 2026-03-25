import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";
import 'cypress-xpath';
class ValoresGlobalesPomCy{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    ValoresGlobales(data){
        this.Generales.llenarCampo(data.codigo, "Código")
        this.Generales.seleccionarCombo(data.tipo, "Tipo")
        this.Generales.llenarCampo(data.longitud, "Longitud")
        if(data.tipo==="Numérico"){
        this.Generales.llenarCampo(data.decimales, "Decimales")
        }else{
            cy.log("Tipo de dato no es Numérico")
        }
        this.Generales.llenarCampo(data.descripcion, "Descripción")
    }


    SubValoresGlobales(data){

        this.Generales.seleccionarCombo(data.arbolRaiz, "Árbol Raíz")
        this.Generales.llenarCampo(data.valor, "Valor")

    }

}
export default ValoresGlobalesPomCy;