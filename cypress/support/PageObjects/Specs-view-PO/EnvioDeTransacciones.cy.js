class EnvioDeTransaccionesCy{

    EnvioTransacciones(correlativo, descripcion, valorRequiereLogin, valorTipoDatoEnvio, valorEndpointEnvio, valorTipoDatoRecibido, valorAnalizarRespuesta) {
        cy.get("#correlative").should("be.visible").clear().type(correlativo);
        cy.get("#description").should("be.visible").clear().type(descripcion);
        this.seleccionarComboET(valorRequiereLogin, 0);
        this.seleccionarComboET(valorTipoDatoEnvio, 1);
        this.seleccionarComboET(valorEndpointEnvio, 2);
        this.seleccionarComboET(valorTipoDatoRecibido, 3);
        this.seleccionarComboET(valorAnalizarRespuesta, 4);
    }


    seleccionarComboET(valor, index) {
        if (!valor) return;

        cy.get("mat-select", {timeout: 10000})
            .filter(":visible")
            .eq(index)
            .should("not.be.disabled")
            .then(($select) => {
                const valorActual = $select.find(".mat-select-min-line").text().trim();

                if (valorActual !== valor) {
                    cy.wrap($select).click();

                    // 👇 Espera real a que Angular cree el overlay
                    cy.get("body")
                        .find(".cdk-overlay-pane", {timeout: 15000})
                        .should("exist")
                        .within(() => {
                            cy.contains(".mat-option-text", valor)
                                .should("be.visible")
                                .click();
                        });
                }
            });
    }
}