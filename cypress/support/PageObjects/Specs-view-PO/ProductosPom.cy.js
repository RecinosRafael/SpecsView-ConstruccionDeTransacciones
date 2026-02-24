class ProductosPomCy{

    Productos(codigo, nombre, descripcion, valorMoneda, valorDigitoVetificador, longCuenta, mascaraCuenta){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        this.seleccionarCombo(valorMoneda, 0);
        this.seleccionarCombo(valorDigitoVetificador, 1);


        cy.get("#accountLength").should("be.visible").clear().type(longCuenta)
        cy.get("#acountMask").should("be.visible").clear().type(mascaraCuenta)


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


}

export default ProductosPomCy;
