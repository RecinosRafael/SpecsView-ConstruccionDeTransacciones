class EquivalenciasPomCy{

    Equivalencias(llave, datosEquivalentes, descripcion){

        cy.get("#keyword").should("be.visible").clear().type(llave)
        cy.get("#equivalentData").should("be.visible").clear().type(datosEquivalentes)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }

}
export default EquivalenciasPomCy;