class NivelesDeCajeroPomCy{

    NivelCajero(codigo, valorArbolRaiz, nombre, descripcion, valorNivelAutorizacion, rolKeycloak){

        cy.get("#code").should("be.visible").clear().type(codigo)

        this.seleccionarComboNC(valorArbolRaiz, 0);


        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        this.seleccionarComboNC(valorNivelAutorizacion, 1);

        cy.get("#roleKeycloak").clear().should("be.visible").type(rolKeycloak)

    }

    seleccionarComboNC(valor, index) {
        if (!valor) return;

        cy.get('mat-select', { timeout: 15000 })
            .eq(index)
            .should('exist')
            .then($select => {

                const valorActual = $select
                    .find('.mat-select-min-line')
                    .text()
                    .trim();

                if (valorActual !== valor) {

                    cy.wrap($select)
                        .scrollIntoView({ block: 'center' })
                        .click({ force: true }); // 👈 fuerza click aunque no esté visible

                    // 👇 Overlay real de Angular Material
                    cy.get('.cdk-overlay-pane', { timeout: 15000 })
                        .should('exist')
                        .within(() => {
                            cy.contains('.mat-option-text', valor)
                                .should('exist')
                                .click({ force: true });
                        });
                }
            });
    }


}
export default NivelesDeCajeroPomCy;