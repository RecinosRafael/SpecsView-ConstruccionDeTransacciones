class AccionesCondicionadasPomCy{

    AccionCodicionada(transaccion, correlativo, regla, accion, ejecutar, descripcion){

        this.seleccionarComboAC(transaccion, "Transacción");
        cy.get("#correlative").should("be.visible").clear().type(correlativo)
        this.seleccionarComboAC(regla, "Regla");
        this.seleccionarComboAC(accion, "Acción");
        this.seleccionarComboAC(ejecutar, "Ejecutar");
        cy.get("#description").should("be.visible").clear().type(descripcion)
    }
    //inicio subnivel Acciones Condicionadas

    ACTxAsociadasCondicionadas(txAsociada, correlativo, tipoAsociacion, tipoAccion, descripcion, acumular, permiteRechazo, modoInverso, permiteCanacelacion ){

        this.seleccionarComboAC(txAsociada, "Transaccion asociada");
        cy.get("#correlative").should("be.visible").clear().type(correlativo)
        this.seleccionarComboAC(tipoAsociacion, "Tipo de asociación");
        this.seleccionarComboAC(tipoAccion, "Tipo de acción");
        cy.get("#description").should("be.visible").clear().type(descripcion)
        this.checkBoxWOS(acumular, "Acumular");
        this.checkBoxWOS(permiteRechazo, "Permitir rechazo");
        this.seleccionarComboAC(modoInverso, "Modo inverso");
        this.seleccionarComboAC(permiteCanacelacion, "Permitir cancelación");

    }

    ACUserRecTxA(arbolRaiz, rama, usuario, jornada){

        this.seleccionarComboAC(arbolRaiz, "Árbol Raíz");
        this.seleccionarComboAC(rama, "Rama");
        this.seleccionarComboAC(usuario, "Usuario");
        this.seleccionarComboAC(jornada, "Jornada");

    }

    ACDetalle(correlativo, descripcion, caracteristica, tipoCampo, expresion1, operador, expresion2, protegerCampo, acumular){

        cy.get("#correlative").should("be.visible").clear().type(correlativo)
        cy.get("#description").should("be.visible").clear().type(descripcion)
        this.seleccionarComboAC(caracteristica, "Característica");
        this.seleccionarComboAC(tipoCampo, "Tipo de campo");
        cy.get("#expressionDataAssign1").should("be.visible").clear().type(expresion1)
        this.seleccionarComboAC(operador, "Operador");
        cy.get("#expression2").should("be.visible").clear().type(expresion2)
        this.checkBoxWOS(protegerCampo, "Proteger campo");
        this.checkBoxWOS(acumular, "Acumular");

    }

    ACSolAutCon(Permiso, correlativo){

        this.seleccionarComboAC(Permiso, "Permiso");
        cy.get("#corrCharactRequestAuth").should("be.visible").clear().type(correlativo)

    }

    ACForExtCon(correlativo, defJsonForm1, defJsonForm2, defJsonForm3){

        cy.get("#correlative").should("be.visible").clear().type(correlativo)
        cy.get("#form01Name").should("be.visible").clear().type(defJsonForm1)
        cy.get("#form02Name").should("be.visible").clear().type(defJsonForm2)
        cy.get("#form03Name").should("be.visible").clear().type(defJsonForm3)
    }

    ACAfecTotalCon(correlativo, caracteristica, arbolRaiz, totalCajero, operador, afectar){

        cy.get("#correlative").should("be.visible").clear().type(correlativo)
        this.seleccionarComboAC(caracteristica, "Característica");
        this.seleccionarComboAC(arbolRaiz, "Árbol Raíz");
        this.seleccionarComboAC(totalCajero, "Total de Cajero");
        this.seleccionarComboAC(operador, "Operador");
        this.seleccionarComboAC(afectar, "Afectar");

    }

    ACFormtCond(correlativo, modo, formato, numeroCopias){

        cy.get("#correlative").should("be.visible").clear().type(correlativo)
        this.seleccionarComboAC(modo, "Modo");
        this.seleccionarComboAC(formato, "Formato");
        cy.get("#numCopies").should("be.visible").clear().type(numeroCopias)

    }

    ACMjsCon(mensajeUsuario, pasoTransaccion, tipoMensaje){

        cy.get("#messageUser").should("be.visible").clear().type(mensajeUsuario)
        cy.get("#transactionStep").should("be.visible").clear().type(pasoTransaccion)
        this.seleccionarComboAC(tipoMensaje, "Tipo de mensaje");
    }

    ACCamAtrCamp(expressionField, proteger, obligatorio, negrita, tamanioLetra, RGB, expForceValue){

        cy.get("#expressionField").should("be.visible").clear().type(expressionField)
        this.checkBox(proteger, "Proteger");
        this.checkBox(obligatorio, "Obligatorio");
        this.checkBox(negrita, "Negrita");
        this.seleccionarComboAC(tamanioLetra, "Tamaño de letra");
        cy.get('#color').should('be.visible').invoke('val', RGB).trigger('input').trigger('change');
        cy.get("#forceValue").should("be.visible").clear().type(expForceValue)
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