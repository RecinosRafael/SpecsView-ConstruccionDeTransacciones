class TotalDeCajeroPomCy{

    TotalesCajero(codigo, arbolRaiz, nombre, nombreCorto, descripcion, validaMontos, minimoRequiereAutorizacion, maximoRequiereAutorizacion, correlativoImpreso, enviarHost,
                  cicloVida, validoDesde, validoHasta, totalMonitoreado, rutinaCalculamontoConciliar, rutinacalculaMontoConciliado, esControlEfectivo){

        const campos = [
            {selector: '#code', valor: codigo},
            {selector: '#name', valor: nombre},
            {selector: '#shortName', valor: nombreCorto},
            {selector: 'textarea#description', valor: descripcion},
            {selector: '#correlativePrint', valor: correlativoImpreso},
        ];

        campos.forEach(({selector, valor}) => {

            // 🔒 Validación PRO (igual que la usas en todo el proyecto)
            if (valor === undefined || valor === null || valor === '') {
                cy.log(`Campo omitido: ${selector}`);
                return;
            }

            cy.get('body').then($body => {

                // 🔎 Verificar existencia en DOM
                if ($body.find(selector).length > 0) {

                    cy.get(selector)
                        .scrollIntoView({block: 'center'})
                        .clear({force: true})
                        .type(valor, {force: true});

                } else {
                    cy.log(`Campo no presente aún: ${selector}`);
                }
            });
        });

        // 🔽 Combos (se mantienen igual)
        this.seleccionarComboTC(arbolRaiz, "Árbol Raíz");
        this.seleccionarComboTC(cicloVida, "Ciclo de vida");
        this.seleccionarComboTC(rutinaCalculamontoConciliar, "Rutina calcula monto por Conciliar");
        this.seleccionarComboTC(rutinacalculaMontoConciliado, "Rutina calcula monto Conciliado");
        this.seleccionarComboTC(esControlEfectivo, "Es control de efectivo");

        this.seleccionarFecha('#validFrom', validoDesde);
        this.seleccionarFecha('#validTo', validoHasta);

        // ☑️ Checkboxes
        this.checkBoxWOS(validaMontos, "Valida Montos");
        this.checkBoxWOS(minimoRequiereAutorizacion, "Mínimo Requiere Autorización");
        this.checkBoxWOS(maximoRequiereAutorizacion, "Máximo Requiere Autorización");
        this.checkBoxWOS(enviarHost, "Enviar Host");
        this.checkBoxWOS(totalMonitoreado, "Total es monitoreado");
    }


    TotalesCuadra(TipoCajero){

        if (TipoCajero) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== TipoCajero) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(TipoCajero)
                            .should('be.visible')
                            .click();
                    }
                });
        }

    }

    ValidacionesCierreDia(codigo, nivelCajero, tolerancia, valorQueDeberiaCerrar, valorGlobalConstante, moneda){


        cy.get("#code").should("be.visible").clear().type(codigo)

        // 🔽 Combos (se mantienen igual)
        this.seleccionarComboTC(nivelCajero, "Nivel de cajero");

        cy.get("#tolerance").should("be.visible").clear().type(tolerancia)
        cy.get("#constant").should("be.visible").clear().type(valorQueDeberiaCerrar)

        this.seleccionarCombo(valorGlobalConstante, "Valor Global Constante");
        this.seleccionarCombo(moneda, "Moneda");


    }

    MinimosMaximos(tipoRama, tipoCajero, moneda, minimoCajero, maximoCajero, minimoTipoRama, maximoTipoRama){

        // 🔽 Combos (se mantienen igual)
        this.seleccionarCombo(tipoRama, "Tipo de Rama");
        this.seleccionarCombo(tipoCajero, "Tipo de cajero");
        this.seleccionarCombo(moneda, "Moneda");

        const campos = [
            {selector: '#minPerCashier', valor: minimoCajero},
            {selector: '#maxPerCashier', valor: maximoCajero},
            {selector: '#minPerTypeTreebranch', valor: minimoTipoRama},
            {selector: '#maxPerTypeTreebranch', valor: maximoTipoRama},
        ];

        campos.forEach(({selector, valor}) => {

            // 🔒 Validación PRO (igual que la usas en todo el proyecto)
            if (valor === undefined || valor === null || valor === '') {
                cy.log(`Campo omitido: ${selector}`);
                return;
            }

            cy.get('body').then($body => {

                // 🔎 Verificar existencia en DOM
                if ($body.find(selector).length > 0) {

                    cy.get(selector)
                        .scrollIntoView({block: 'center'})
                        .clear({force: true})
                        .type(valor, {force: true});

                } else {
                    cy.log(`Campo no presente aún: ${selector}`);
                }
            });
        });


    }

}
export default TotalDeCajeroPomCy;