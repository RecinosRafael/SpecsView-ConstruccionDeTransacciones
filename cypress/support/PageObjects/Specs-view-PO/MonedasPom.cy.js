class MonedasPomCy {

    Monedas(codigo, codigoIso, nombre, codigoNumerico, decimales, puntoFlotante) {

        // Mapeo directo selector → valor
        const campos = {
            '#code': { valor: codigo, nombre: 'Código', req: true },
            '#iso3Code': { valor: codigoIso, nombre: 'Código ISO', req: true },
            '#name': { valor: nombre, nombre: 'Nombre', req: true },
            '#numberCode': { valor: codigoNumerico, nombre: 'Código Numérico' },
            '#decimals': { valor: decimales, nombre: 'Decimales' },
            '#floatingPoint': { valor: puntoFlotante, nombre: 'Punto Flotante' }
        };

        // Validar requeridos (functional)
        const reqFaltantes = Object.values(campos)
            .filter(c => c.req && !c.valor)
            .map(c => c.nombre);

        if (reqFaltantes.length) {
            throw new Error(`Requeridos: ${reqFaltantes.join(', ')}`);
        }

        // Ejecutar campos con valor (functional pipeline)
        Object.entries(campos)
            .filter(([_, { valor }]) => valor)
            .forEach(([selector, { nombre, valor }]) => {
                cy.log(`${nombre}: "${valor}"`);
                cy.get(selector).clear().should('be.visible').type(String(valor));
            });

    }


    DenominacionMoneda(nombre, etiqueta, valorTipo, monto){
        cy.get('#name').should("be.visible").clear().type(nombre)
        cy.get('#label').should("be.visible").clear().type(etiqueta)

        if (valorTipo) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorTipo) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(valorTipo)
                            .should('be.visible')
                            .click();
                    }
                });
        }

        cy.get('#amount').should("be.visible").clear().type(monto)

    }


    /*PaisesQueUsan(valorPais){

        if (valorPais) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorPais) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(valorPais)
                            .should('be.visible')
                            .click();
                    }
                });
        }

    }*/

    PaisesQueUsan(valorPais){

        if (valorPais) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    if (valorActual !== valorPais) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .then(($overlay) => {

                                const opcion = $overlay.find('.mat-option-text')
                                    .filter((i, el) => el.innerText.trim() === valorPais)

                                if (opcion.length > 0) {

                                    cy.wrap(opcion).click()
                                    cy.wrap(true).as('paisExiste')

                                } else {

                                    cy.log('❌ País no encontrado: ' + valorPais)
                                    cy.wrap(false).as('paisExiste')
                                }

                            });
                    } else {

                        cy.wrap(true).as('paisExiste')
                    }

                });
        }

    }
}

export default MonedasPomCy;