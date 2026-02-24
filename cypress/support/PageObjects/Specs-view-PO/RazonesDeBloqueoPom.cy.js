class RazonesDeBloqueoPomCy{

    RazonesBloqueoUsuarios(codigo, razon, mensaje){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#reason").should("be.visible").clear().type(razon)
        cy.get("#message").should("be.visible").clear().type(mensaje)
    }

}
export default RazonesDeBloqueoPomCy;