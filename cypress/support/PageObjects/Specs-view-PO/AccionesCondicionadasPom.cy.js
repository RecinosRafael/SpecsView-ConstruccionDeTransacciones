import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";

class AccionesCondicionadasPomCy{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }
        // this.Generales.llenarCampo(descripcion, "descripcion")
        // // this.Generales.llenarCampo("#beanRunTime").should("be.visible").clear().type(programaEjecucion)
        // //this.Generales.llenarCampo("#beanSpecAction").should("be.visible").clear().type(progrmaEspecificaion)
        // this.Generales.seleccionarCombo(ValorTipoAccion, "Tipo de acción");

    AccionCodicionada(transaccion, correlativo, regla, accion, ejecutar, descripcion){

        this.Generales.seleccionarCombo(transaccion, "Transacción");
        this.Generales.llenarCampo(correlativo, "Correlativo")
        this.Generales.seleccionarCombo(regla, "Regla");
        this.Generales.seleccionarCombo(accion, "Acción");
        this.Generales.seleccionarCombo(ejecutar, "Ejecutar");
        this.Generales.llenarCampo(descripcion, "Descripcion")
    }
    //inicio subnivel Acciones Condicionadas

    ACTxAsociadasCondicionadas(txAsociada, correlativo, tipoAsociacion, tipoAccion, descripcion, acumular, permiteRechazo, modoInverso, permiteCanacelacion ){

        this.Generales.seleccionarCombo(txAsociada, "Transaccion asociada");
        this.Generales.llenarCampo("#correlative").should("be.visible").clear().type(correlativo)
        this.Generales.seleccionarCombo(tipoAsociacion, "Tipo de asociación");
        this.Generales.seleccionarCombo(tipoAccion, "Tipo de acción");
        this.Generales.llenarCampo("#description").should("be.visible").clear().type(descripcion)
        this.checkBoxWOS(acumular, "Acumular");
        this.checkBoxWOS(permiteRechazo, "Permitir rechazo");
        this.Generales.seleccionarCombo(modoInverso, "Modo inverso");
        this.Generales.seleccionarCombo(permiteCanacelacion, "Permitir cancelación");

    }

    ACUserRecTxA(arbolRaiz, rama, usuario, jornada){

        this.Generales.seleccionarCombo(arbolRaiz, "Árbol Raíz");
        this.Generales.seleccionarCombo(rama, "Rama");
        this.Generales.seleccionarCombo(usuario, "Usuario");
        this.Generales.seleccionarCombo(jornada, "Jornada");

    }

    ACDetalle(correlativo, descripcion, caracteristica, tipoCampo, expresion1, operador, expresion2, protegerCampo, acumular){

        this.Generales.llenarCampo("#correlative").should("be.visible").clear().type(correlativo)
        this.Generales.llenarCampo("#description").should("be.visible").clear().type(descripcion)
        this.Generales.seleccionarCombo(caracteristica, "Característica");
        this.Generales.seleccionarCombo(tipoCampo, "Tipo de campo");
        this.Generales.llenarCampo("#expressionDataAssign1").should("be.visible").clear().type(expresion1)
        this.Generales.seleccionarCombo(operador, "Operador");
        this.Generales.llenarCampo("#expression2").should("be.visible").clear().type(expresion2)
        this.checkBoxWOS(protegerCampo, "Proteger campo");
        this.checkBoxWOS(acumular, "Acumular");

    }

    ACSolAutCon(Permiso, correlativo){

        this.Generales.seleccionarCombo(Permiso, "Permiso");
        this.Generales.llenarCampo("#corrCharactRequestAuth").should("be.visible").clear().type(correlativo)

    }

    ACForExtCon(correlativo, defJsonForm1, defJsonForm2, defJsonForm3){

        this.Generales.llenarCampo("#correlative").should("be.visible").clear().type(correlativo)
        this.Generales.llenarCampo("#form01Name").should("be.visible").clear().type(defJsonForm1)
        this.Generales.llenarCampo("#form02Name").should("be.visible").clear().type(defJsonForm2)
        this.Generales.llenarCampo("#form03Name").should("be.visible").clear().type(defJsonForm3)
    }

    ACAfecTotalCon(correlativo, caracteristica, arbolRaiz, totalCajero, operador, afectar){

        this.Generales.llenarCampo(correlativo, "Correlativo");
        this.Generales.seleccionarCombo(caracteristica, "Característica");
        this.Generales.seleccionarCombo(arbolRaiz, "Árbol Raíz");
        this.Generales.seleccionarCombo(totalCajero, "Total de Cajero");
        this.Generales.seleccionarCombo(operador, "Operador");
        this.Generales.seleccionarCombo(afectar, "Afectar");

    }

    ACFormtCond(correlativo, modo, formato, numeroCopias){

        this.Generales.llenarCampo("#correlative").should("be.visible").clear().type(correlativo)
        this.Generales.seleccionarCombo(modo, "Modo");
        this.Generales.seleccionarCombo(formato, "Formato");
        this.Generales.llenarCampo("#numCopies").should("be.visible").clear().type(numeroCopias)

    }

    ACMjsCon(mensajeUsuario, pasoTransaccion, tipoMensaje){

        this.Generales.llenarCampo("#messageUser").should("be.visible").clear().type(mensajeUsuario)
        this.Generales.llenarCampo("#transactionStep").should("be.visible").clear().type(pasoTransaccion)
        this.Generales.seleccionarCombo(tipoMensaje, "Tipo de mensaje");
    }

    ACCamAtrCamp(expressionField, proteger, obligatorio, negrita, tamanioLetra, RGB, expForceValue){

        this.Generales.llenarCampo("#expressionField").should("be.visible").clear().type(expressionField)
        this.checkBox(proteger, "Proteger");
        this.checkBox(obligatorio, "Obligatorio");
        this.checkBox(negrita, "Negrita");
        this.Generales.seleccionarCombo(tamanioLetra, "Tamaño de letra");
        this.Generales.llenarCampo('#color').should('be.visible').invoke('val', RGB).trigger('input').trigger('change');
        this.Generales.llenarCampo("#forceValue").should("be.visible").clear().type(expForceValue)
    }

    seleccionarComboAC(valor, xpath) {

        const textoValor = valor.toLowerCase();

        cy.xpath(
            "//mat-label[contains(normalize-space(),'"+xpath+"')]/ancestor::mat-form-field//mat-select",
            { timeout: 15000 }
        )
            .should('be.visible')
            .click();

        cy.xpath(
            `(//mat-option//span[contains(translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
        'abcdefghijklmnopqrstuvwxyzáéíóúüñ'),'${textoValor}')])[1]`,
            { timeout: 15000 }
        )
            .should('be.visible')
            .click();
    }

    checkBoxWOS(valor, xpath) {

        if(!valor){
            cy.xpath("//mat-checkbox[.//span[contains(normalize-space(),'"+xpath+"')]]").click();
        }

    }

    checkBox(valor, xpath) {

        if(valor){
            cy.xpath("//mat-checkbox[.//span[contains(normalize-space(),'"+xpath+"')]]").click();
        }

    }

}
export default AccionesCondicionadasPomCy;