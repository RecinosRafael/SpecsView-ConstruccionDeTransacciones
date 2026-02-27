class AccionesPomCy{

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

}
export default AccionesPomCy;