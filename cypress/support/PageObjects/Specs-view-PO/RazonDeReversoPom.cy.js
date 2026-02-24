class RazonDeReversoPomCy {

    RazonReversion(codigo, nombre, descripcion){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }

}

export default RazonDeReversoPomCy;