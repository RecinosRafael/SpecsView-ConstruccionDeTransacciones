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
        cy.get("#correlative").should("be.visible").clear().type(correlativo)
        cy.get("#expression1").should("be.visible").clear().type(exprsion1)

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

}
export default ReglasPomCy;
