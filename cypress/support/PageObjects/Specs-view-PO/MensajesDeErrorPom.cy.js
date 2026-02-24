class MensajesDeErrorPomCy{

    MensajesError(codigo, mensajeError, descripcion, valorTipoMensaje, valorAccion){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#message").should("be.visible").clear().type(mensajeError)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        this.seleccionarComboME(valorTipoMensaje, 0);
        this.seleccionarComboME(valorAccion, 1);
    }

    seleccionarComboME(valor, index) {

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

}
export default MensajesDeErrorPomCy;