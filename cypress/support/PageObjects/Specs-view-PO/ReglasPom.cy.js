class ReglasPomCy{

    Reglas(codigo, nombre, descripcion, valorCicloVida, desde, hasta){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        if (valorCicloVida) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorCicloVida) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(valorCicloVida)
                            .should('be.visible')
                            .click();
                    }
                });
        }

        // Válido Desde (obligatorio)
        this.seleccionarFechaR('#validFrom', desde);

        // Válido Hasta (opcional)
        this.seleccionarFechaR('#validTo', hasta);
    }

    seleccionarFechaR(selector, fecha) {

        if (!fecha) return;

        const [day, month, year] = fecha.split('/');
        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        cy.get(selector, { timeout: 20000 })
            .should('exist')
            .then($input => {

                // 🔓 Quitar disabled del input
                $input.prop('disabled', false);

                // 🔓 Quitar disabled del mat-form-field
                cy.wrap($input)
                    .closest('mat-form-field')
                    .invoke('removeClass', 'mat-form-field-disabled');

                // ✍️ Setear valor
                cy.wrap($input)
                    .clear({ force: true })
                    .type(isoDate, { force: true })
                    .trigger('input')
                    .trigger('change');
            });
    }

    DetalleReglas(correlativo, exprsion1, operador, expresion2, operadorLogico, tipoExpresion ){
        // cy.get("#correlative").should("be.visible").clear().type(correlativo)
        // cy.get("#expression1").should("be.visible").clear().type(exprsion1)

        const campos = [
            {selector: '#correlative', valor: correlativo},
            {selector: '#expression1', valor: exprsion1},
            {selector: '#expression2', valor: expresion2},

        ];

        campos.forEach(({selector, valor}) => {
            if (valor !== undefined && valor !== null && valor !== '') {

                cy.get('body').then($body => {
                    // Si el campo existe en el DOM
                    if ($body.find(selector).length > 0) {
                        cy.get(selector)
                            .scrollIntoView({block: 'center'})
                            .should('be.visible')
                            .clear()
                            .type(valor);
                    } else {
                        cy.log(`Campo no presente aún: ${selector}`);
                    }
                });

            }
        });

        this.seleccionarCombo(operador, "Operador");
        this.seleccionarCombo(operadorLogico, "Operador lógico");
        this.seleccionarCombo(tipoExpresion, "Tipo de Expresión");

    }

    seleccionarCombo(valor, labelText) {
        if (!valor) return cy.log(`⚠️ Valor vacío para combo "${labelText}"`);
        
        cy.log(`🔍 Seleccionando "${valor}" en combo "${labelText}"`);
        
        // Buscar el campo por su etiqueta label
        cy.contains('mat-label', labelText, { timeout: 10000 })
            .should('be.visible')
            .parents('mat-form-field')  // Sube al contenedor del campo
            .find('mat-select')  // Encuentra el select dentro de ese contenedor
            .should('be.visible')
            .then($select => {
                
                // Obtener el valor actual mostrado
                const valorActual = $select
                    .find('.mat-select-value-text, .mat-select-min-line, .mat-select-placeholder')
                    .first()
                    .text()
                    .trim();
                
                cy.log(`📌 Valor actual: "${valorActual || 'vacío'}"`);
                
                // Solo cambiar si es diferente
                if (valorActual !== valor && !valorActual.includes(valor)) {
                    
                    cy.wrap($select)
                        .should('not.be.disabled')
                        .click({ force: true });
                    
                    // Buscar la opción en el panel desplegable
                    cy.get('.cdk-overlay-pane', { timeout: 10000 })
                        .should('be.visible')
                        .find('mat-option')
                        .contains(valor)
                        .should('be.visible')
                        .click({ force: true });
                    
                    // Verificar que se seleccionó correctamente
                    cy.wrap($select)
                        .find('.mat-select-value-text, .mat-select-min-line')
                        .should('contain', valor);
                    
                    cy.log(`✅ Seleccionado "${valor}" en combo "${labelText}"`);
                } else {
                    cy.log(`⏭️ Ya tiene el valor "${valor}", no se requiere cambio`);
                }
            });
    }

}
export default ReglasPomCy;
