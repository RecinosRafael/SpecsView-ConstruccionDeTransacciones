class RegionesPomCy{

    Region(codigo, nombre, descipcion){
        cy.get("#code").clear().should("be.visible").type(codigo)
        cy.get("#name").clear().should("be.visible").type(nombre)
        cy.get('#description').clear().should("be.visible").type(descipcion)
    }

}
export default RegionesPomCy;