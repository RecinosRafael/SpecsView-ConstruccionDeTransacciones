class TipoCajeroPomCy{

    TipoCajero(codigo, descripcion, verTotales, permiteTotalizar, permiteRepetirLlave){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#description").should("be.visible").clear().type(descripcion)
        this.Checkbox(verTotales, "Puede ver Totales de Control de Efectivo")
        this.Checkbox(permiteTotalizar, "Permite Totalizar")
        this.Checkbox(permiteRepetirLlave, "Permite Repetir Llave")

    }

    Checkbox(valor, labelText) {
        cy.log(`🔍 Procesando checkbox "${labelText}" con valor: ${valor}`);
        
        // Buscar el checkbox por su label
        cy.contains('mat-checkbox', labelText, { timeout: 10000 })
            .should('be.visible')
            .then($checkbox => {
                
                // Verificar si está chequeado
                const estaChequeado = $checkbox.hasClass('mat-checkbox-checked');
                
                // Convertir valor a booleano (por si viene como string del JSON)
                const valorEsperado = valor === true || valor === 'true' || valor === 1 || valor === '1';
                
                cy.log(`📌 Estado actual: ${estaChequeado ? '✓ Chequeado' : '○ No chequeado'}`);
                cy.log(`📌 Estado esperado: ${valorEsperado ? '✓ Chequeado' : '○ No chequeado'}`);
                
                // Solo hacer clic si es necesario
                if (estaChequeado !== valorEsperado) {
                    cy.wrap($checkbox)
                        .find('.mat-checkbox-layout, .mat-checkbox-inner-container')
                        .first()
                        .click({ force: true });
                    
                    cy.log(`✅ Checkbox "${labelText}" actualizado a ${valorEsperado ? 'chequeado' : 'no chequeado'}`);
                } else {
                    cy.log(`⏭️ Checkbox "${labelText}" ya tiene el estado correcto`);
                }
            });
    }



}
export default TipoCajeroPomCy;