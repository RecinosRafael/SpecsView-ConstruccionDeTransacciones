class ProductosPomCy{

    /*Productos(codigo, nombre, descripcion, valorMoneda, valorDigitoVetificador, longCuenta, mascaraCuenta){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        this.seleccionarCombo(valorMoneda, 0);
        this.seleccionarCombo(valorDigitoVetificador, 1);


        cy.get("#accountLength").should("be.visible").clear().type(longCuenta)
        cy.get("#acountMask").should("be.visible").clear().type(mascaraCuenta)


    }*/

    Productos(codigo, nombre, descripcion, valorMoneda, valorDigitoVerificador, longCuenta, mascaraCuenta) {

        // Mapeo directo selector → valor
        const campos = {
            '#code': { valor: codigo, nombre: 'Código', req: true },
            '#name': { valor: nombre, nombre: 'Nombre', req: true },
            '#description': { valor: descripcion, nombre: 'Descripción', req: false },
            '#moneda': { valor: valorMoneda, nombre: 'Moneda', req: true, esCombo: true, index: 0 },
            '#digitoVerificador': { valor: valorDigitoVerificador, nombre: 'Dígito Verificador', req: false, esCombo: true, index: 1 }, // ← Cambiado a false
            '#accountLength': { valor: longCuenta, nombre: 'Longitud Cuenta', req: false },
            '#acountMask': { valor: mascaraCuenta, nombre: 'Máscara Cuenta', req: false }
        };

        // Validar requeridos
        const reqFaltantes = Object.values(campos)
            .filter(c => c.req && (c.valor === undefined || c.valor === null || c.valor === ''))
            .map(c => c.nombre);

        if (reqFaltantes.length) {
            throw new Error(`Requeridos: ${reqFaltantes.join(', ')}`);
        }

        // Ejecutar campos con valor
        Object.entries(campos)
            .filter(([_, { valor }]) => valor !== undefined && valor !== null && valor !== '')
            .forEach(([selector, { nombre, valor, esCombo, index }]) => {
                cy.log(`${nombre}: "${valor}"`);

                if (esCombo) {
                    this.seleccionarCombo(valor, index);
                } else {
                    cy.get(selector).clear().should('be.visible').type(String(valor));
                }
            });
    }

    seleccionarCombo(valor, index) {
        // Si no hay valor, simplemente salir sin error
        if (!valor || valor === '') {
            cy.log(`ℹ️ Combo índice ${index} omitido (valor vacío)`);
            return;
        }

        cy.log(`🎯 Seleccionando "${valor}" en combo índice ${index}`);

        cy.get('mat-select', { timeout: 10000 })
            .filter(':visible')
            .eq(index)
            .should('not.be.disabled')
            .then($select => {
                const valorActual = $select.find('.mat-select-min-line').first().text().trim();

                if (valorActual !== valor) {
                    cy.wrap($select).click();
                    cy.get('.cdk-overlay-pane', { timeout: 10000 })
                        .find('.mat-option-text')
                        .contains(valor)
                        .should('be.visible')
                        .click();
                    cy.log(`✅ Seleccionado: "${valor}"`);
                } else {
                    cy.log(`ℹ️ Combo ya tiene valor "${valor}"`);
                }
            });
    }


   /* seleccionarCombo(valor, index) {

        if (!valor) return;

        cy.get('mat-select', { timeout: 10000 })
            .filter(':visible')
            .eq(index)
            .then($select => {

                const valorActual = $select
                    .find('.mat-select-min-line')
                    .text()
                    .trim();

                // 🔁 Cambia solo si es diferente
                if (valorActual !== valor) {

                    cy.wrap($select)
                        .should('not.be.disabled')
                        .click({ force: true });

                    cy.get('.cdk-overlay-pane', { timeout: 10000 })
                        .find('.mat-option-text')
                        .contains(valor)
                        .should('be.visible')
                        .click();
                }
            });
    }*/


}

export default ProductosPomCy;
