class MonedasPomCy {

    Monedas(codigo, codigoIso, nombre, codigoNumerico, decimales, puntoFlotante){

        cy.get('#code').clear().should("be.visible").type(codigo)
        cy.get('#iso3Code').clear().should("be.visible").type(codigoIso)
        cy.get('#name').clear().should("be.visible").type(nombre)
        cy.get('#numberCode').clear().should("be.visible").type(codigoNumerico)
        cy.get('#decimals').clear().should("be.visible").type(decimales)
        cy.get('#floatingPoint').clear().should("be.visible").type(puntoFlotante)
    }


    DenominacionMoneda(nombre, etiqueta, valorTipo, monto){
        cy.get('#name').should("be.visible").clear().type(nombre)
        cy.get('#label').should("be.visible").clear().type(etiqueta)

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

        cy.get('#amount').should("be.visible").clear().type(monto)

    }


    PaisesQueUsan(valorPais){

        if (valorPais) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorPais) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(valorPais)
                            .should('be.visible')
                            .click();
                    }
                });
        }

    }

}

export default MonedasPomCy;