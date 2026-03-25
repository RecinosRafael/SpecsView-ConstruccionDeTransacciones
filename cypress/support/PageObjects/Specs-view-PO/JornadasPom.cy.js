import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";

class JornadasPomCy {

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

       Jornada(data){
        this.Generales.llenarCampo(data.codigo, "código")
        this.Generales.llenarCampo(data.nombre, "nombre")
        this.Generales.seleccionarCombo(data.transfiereSaldos, "Transfiere saldos")
        this.Generales.seleccionarCombo(data.idJornadaTransferir, "ID de la jornada a transferir saldo")
    }
}
export default JornadasPomCy;