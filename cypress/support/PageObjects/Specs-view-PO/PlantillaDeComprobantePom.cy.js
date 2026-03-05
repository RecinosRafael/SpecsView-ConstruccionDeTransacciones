class PlantillaDeComprobantePomCy{

    PlantillasComprobantes(key, nombre, descripcion, archivo) {

        cy.get('input[name="key"]').should("be.visible").clear().type(key);
        cy.get('input[name="name"]').should("be.visible").clear().type(nombre);
        cy.get('textarea[name="description"]').should("be.visible").clear().type(descripcion);


        // Subir archivo (opcional)
        if (archivo) {
            cy.get('input[type="file"]', {timeout: 10000})
                .should('exist')
                .attachFile(archivo);
        }

    }

}
export default PlantillaDeComprobantePomCy;