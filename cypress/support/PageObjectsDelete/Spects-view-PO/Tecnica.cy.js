class TecnicaCy{

    //Inicio Etiquetas de arbol

    EtiquetasArbol(valorArbolRaiz, nivelArgbol, nombre){


        if (valorArbolRaiz) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorArbolRaiz) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(valorArbolRaiz)
                            .should('be.visible')
                            .click();
                    }
                });
        }

        cy.get("#treeLevel").clear().should("be.visible").type(nivelArgbol)
        cy.wait(1000)
        cy.get("#name").clear().should("be.visible").type(nombre)
        cy.wait(1000)
    }

    //Fin Etiquetas de arbol

    //Inicio Tipo de evento

    TipoEvento(codigo, nombre, descripcion){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }

    //Fin Tipo de evento


//Inicio Tipo de transaccion

    TipoTransaccion(codigo, nombre, descripcion, valorAccionFinanciera, valorcomportamiento){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        this.seleccionarCombo(valorAccionFinanciera, 0);
        this.seleccionarCombo(valorcomportamiento, 1);

    }

    seleccionarCombo(valor, index) {

        if (!valor) return;

        cy.get('mat-select', { timeout: 10000 })
            .filter(':visible')
            .eq(index)
            .then($select => {

                const valorActual = $select
                    .find('.mat-select-min-line')
                    .text()
                    .trim();

                // 🔁 Cambia solo si es diferente
                if (valorActual !== valor) {

                    cy.wrap($select)
                        .should('not.be.disabled')
                        .click({ force: true });

                    cy.get('.cdk-overlay-pane', { timeout: 10000 })
                        .find('.mat-option-text')
                        .contains(valor)
                        .should('be.visible')
                        .click();
                }
            });
    }


    //Fin Tipo de transaccion


    //Inicio Tipo de dato

    TipoDato(codigo, nombre, descripcion){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }

    //Fin Tipo de dato


    //Inicio Tipo de rutina

    TipoRutina(codigo, nombre, descripcion){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }

    //Fin Tipo de rutina


//Acciones

    Accion(codigo, nombre, descripcion, ValorTipoAccion){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)
        // cy.get("#beanRunTime").should("be.visible").clear().type(programaEjecucion)
        //cy.get("#beanSpecAction").should("be.visible").clear().type(progrmaEspecificaion)

        if (ValorTipoAccion) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== ValorTipoAccion) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(ValorTipoAccion)
                            .should('be.visible')
                            .click();
                    }
                });
        }


    }


    //Fin Accion


    //Inicio Medios de notificación


    MediosNotificacion(codigo, nombre, descripcion, endpoint, valorTipoNotificacion, mascaraTelefono, endpointSecundario){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)


        if (endpoint) {
            cy.get("#endpoint")
                .should("be.visible")
                .clear()
                .type(endpoint);
        }

        if (!valorTipoNotificacion) {
            return; // ⛔ No hacer nada si viene vacío
        }

        cy.get('mat-select', { timeout: 10000 })
            .filter(':visible')
            .first()
            .then($select => {

                const valorActual = $select
                    .find('.mat-select-min-line')
                    .text()
                    .trim();

                // 🔁 Cambiar solo si es distinto
                if (valorActual !== valorTipoNotificacion) {

                    cy.wrap($select)
                        .should('not.be.disabled')
                        .click({ force: true });

                    cy.get('.cdk-overlay-pane', { timeout: 10000 })
                        .find('.mat-option-text')
                        .contains(valorTipoNotificacion)
                        .should('be.visible')
                        .click();
                }
            });


        // 🟩 Máscara teléfono (opcional)
        if (mascaraTelefono) {
            cy.get("#phoneMask")
                .should("be.visible")
                .clear()
                .type(mascaraTelefono);
        }

        // 🟩 Endpoint secundario (opcional)
        if (endpointSecundario) {
            cy.get("#secondaryEndpoint")
                .should("be.visible")
                .clear()
                .type(endpointSecundario);
        }

    }

    //Fin Medios de notificación


//Parámetros generales

    //Inicio Parametros Generales

    ParametrosGenerales(nombreEmpresa, ValorMonedaBase){

        cy.get("#name").should("be.visible").clear().type(nombreEmpresa)

        if (ValorMonedaBase) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== ValorMonedaBase) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(ValorMonedaBase)
                            .should('be.visible')
                            .click();
                    }
                });
        }





    }


    // ParametrosGenerales(nombreEmpresa, monedaBase, arbolPadre, ramaArbol, cantidadVeces, caracteresPermitidos, longitudMinima, creditoLibreta, debitosLibreta, dia, mes, anio){
    //
    //     cy.get("#name").should("be.visible").clear().type(nombreEmpresa)
    //
    //     if(monedaBase == 'i'){
    //         cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-general-parameters[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
    //         cy.wait(100)
    //         cy.xpath("//span[contains(text(),'Quetzal')]").should("be.visible").click({force:true})
    //         cy.wait(100)
    //     }else{
    //
    //     }
    //
    //     if(arbolPadre == 'i'){
    //         cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-general-parameters[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
    //         cy.wait(100)
    //         cy.xpath("//span[contains(text(),'Byte S.A. (Raiz)')]").should("be.visible").click({force:true})
    //         cy.wait(200)
    //
    //     }else{
    //
    //     }
    //
    //     if(ramaArbol == 'i'){
    //         cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-general-parameters[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
    //         cy.wait(100)
    //         cy.xpath("//span[contains(text(),'Agencia rural')]").should("be.visible").click({force:true})
    //         cy.wait(100)
    //
    //     }else{
    //
    //     }
    //
    //     cy.get("#sometimesRecyclePassword").should("be.visible").clear().type(cantidadVeces)
    //
    //     if(caracteresPermitidos == 'i'){
    //         cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-general-parameters[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[6]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
    //         cy.wait(100)
    //         cy.xpath("//span[contains(text(),'Alfanumérico')]").should("be.visible").click({force:true})
    //         cy.wait(100)
    //
    //     }else{
    //
    //     }
    //
    //
    //     cy.get("#minimunLength").should("be.visible").clear().type(longitudMinima)
    //     cy.get("#creditNotebook").should("be.visible").clear().type(creditoLibreta)
    //     cy.get("#debitNotebook").should("be.visible").clear().type(creditoLibreta)
    //     cy.get("#day").should("be.visible").clear().type(dia).scrollIntoView()
    //     cy.get("#month").should("be.visible").clear().type(mes)
    //     cy.get("#year").should("be.visible").clear().type(anio)
    //
    //
    //
    //
    // }

    //Fin Parametros Generales

}

export default TecnicaCy;
