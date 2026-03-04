class NivelesDeCajeroPomCy{

    NivelCajero(codigo, valorArbolRaiz, nombre, descripcion, valorNivelAutorizacion, rolKeycloak){

        // Mapeo directo selector → valor
        const campos = {
            '#code': { valor: codigo, nombre: 'Código', req: true },
            '#arbolRaiz': { valor: valorArbolRaiz, nombre: 'Árbol Raíz', req: true, esCombo: true, index: 0 },
            '#name': { valor: nombre, nombre: 'Nombre', req: true },
            '#description': { valor: descripcion, nombre: 'Descripción', req: false },
            '#nivelAutorizacion': { valor: valorNivelAutorizacion, nombre: 'Nivel de Autorización', req: false, esCombo: true, index: 1 }, // ← Cambiado a false
            '#roleKeycloak': { valor: rolKeycloak, nombre: 'Rol en keycloak', req: false }
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


}
export default NivelesDeCajeroPomCy;