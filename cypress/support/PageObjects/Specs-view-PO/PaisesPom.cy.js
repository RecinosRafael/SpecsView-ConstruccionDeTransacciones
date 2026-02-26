class PaisesPomCy{

    Pais(nombre, iso2Code, iso3Code, valorTipo){
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#iso2Code").should("be.visible").clear().type(iso2Code)
        cy.get("#iso3Code").should("be.visible").clear().type(iso3Code)

        if (valorTipo) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorTipo) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(valorTipo)
                            .should('be.visible')
                            .click();
                    }
                });
        }


    }

}
export default PaisesPomCy;