import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";
import 'cypress-xpath';
class CamposAdicionalesEntidadPomCy{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    CamposAdicionalesEntidad(data){
        this.Generales.seleccionarCombo(data.entidad, "Entidad")
        this.Generales.seleccionarCombo(data.caracteristica, "Característica")
        this.Generales.checkbox(data.campoMandatorio, "Campo madatorio")
        this.Generales.seleccionarCombo(data.Tipo, "Tipo")
        this.Generales.llenarCampo(data.campoReferencia, "Campo de Referencia")
        this.Generales.llenarCampo(data.descripcion, "Descripción")
    }

}
export default CamposAdicionalesEntidadPomCy;

