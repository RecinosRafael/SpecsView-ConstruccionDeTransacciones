class TipoCajeroPomCy{

    TipoCajero(codigo, descripcion, verTotales){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }

}
export default TipoCajeroPomCy;