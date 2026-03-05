import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js"

class EnvioDeTransaccionesCy{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    EnvioTransacciones(transaccion, correlativo, descripcion, pagoServicio, requiereLogin, endpointDeLogueo, formatoDeEnvio, progGeneraInfoDeEnvio, tipoDatoEnvio, endpointDeEnvio, tipoDatoRecibido, archivoRespuesta, progRecibeInfo, analizaRespuesta) {

        this.Generales.seleccionarCombo(transaccion, "Transacción")
        this.Generales.llenarCampo(correlativo, "Correlativo")
        this.Generales.llenarCampo(descripcion, "Descripción")
        this.Generales.seleccionarCombo(pagoServicio, "Pago de servicio")
        this.Generales.seleccionarCombo(requiereLogin, "Requiere login")
        this.Generales.seleccionarCombo(endpointDeLogueo, "Endpoint de logueo")
        this.Generales.seleccionarCombo(formatoDeEnvio, "Formato de envío")
        this.Generales.llenarCampo(progGeneraInfoDeEnvio, "Programa genera informacion de envío")
        this.Generales.seleccionarCombo(tipoDatoEnvio, "Tipo dato envío")
        this.Generales.seleccionarCombo(endpointDeEnvio, "Endpoint de envío")
        this.Generales.seleccionarCombo(tipoDatoRecibido, "Tipo de dato recibido")
        this.Generales.llenarCampo(archivoRespuesta, "Archivo respuesta")
        this.Generales.llenarCampo(progRecibeInfo, "Programa recibe informacion")
        this.Generales.seleccionarCombo(analizaRespuesta, "Analiza respuesta")
    }
}

export default EnvioDeTransaccionesCy;