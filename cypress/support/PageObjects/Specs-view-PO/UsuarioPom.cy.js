class UsuarioPomCy{

    BuscarPersona(tipoIdentificacion, numeroIdentificacion) {

        // 1️⃣ Abrir combo "Tipo de identificación"
        cy.contains('mat-label', 'Tipo de identificación', { timeout: 10000 })
            .parents('mat-form-field')
            .find('mat-select')
            .click({ force: true });
        cy.wait(1500)

        // 2️⃣ Seleccionar opción del combo
        cy.get('mat-option', { timeout: 10000 })
            .contains(tipoIdentificacion)
            .click();

        // 3️⃣ Llenar número de identificación
        cy.get('input#idnumber', { timeout: 10000 })
            .should('be.visible')
            .clear()
            .type(numeroIdentificacion);

        // 4️⃣ Click en botón Buscar
        cy.contains('button', 'Buscar', { timeout: 10000 })
            .should('not.be.disabled')
            .click();
    }

    Usuario(codigo, usuario, pNombre, sNombre, pApellido, sApellido, valorPais, codigoEbs, correo, telTrabajo, codigoEmpleado, valorArbolRaiz, valorRamaArbol, valorDepartamento,
        valorTipoCajero, valorJornadaLaboral, valorNivelCajero, puertoImpre) {

        this.escribirInputSeguro('input[data-placeholder="Código"]', codigo);
        this.escribirInputSeguro('input[data-placeholder="Usuario"]', usuario);
        this.escribirInputSeguro('input[data-placeholder="Primer nombre"]', pNombre);
        this.escribirInputSeguro('input[data-placeholder="Segundo nombre"]', sNombre);
        this.escribirInputSeguro('input[data-placeholder="Primer apellido"]', pApellido);
        this.escribirInputSeguro('input[data-placeholder="Segundo apellido"]', sApellido);

        this.seleccionarComboUser(valorPais, "País");

        this.escribirInputSeguro('input[data-placeholder="Código de usuario en Esb"]', codigoEbs);
        this.escribirInputSeguro('input[data-placeholder="Código del empleado"]', codigoEmpleado);
        this.escribirInputSeguro('input[data-placeholder="Correo electrónico"]', correo);
        this.escribirInputSeguro('input[data-placeholder="Teléfono del trabajo"]', telTrabajo);

        this.seleccionarComboUser(valorArbolRaiz, "Árbol raíz");
        this.seleccionarComboUser(valorRamaArbol, "Rama del árbol");
        this.seleccionarComboUser(valorDepartamento, "Departamento");
        this.seleccionarComboUser(valorTipoCajero, "Tipo de cajero");
        this.seleccionarComboUser(valorJornadaLaboral, "Jornada laboral");
        this.seleccionarComboUser(valorNivelCajero, "Nivel de cajero");

        this.escribirInputSeguro('input[data-placeholder="Puerto de impresión"]', puertoImpre);
    }

    escribirInputSeguro(selector, valor) {

        if (
            valor === undefined ||
            valor === null ||
            valor.toString().trim() === ''
        ) {
            cy.log(`Input omitido (valor vacío): ${selector}`);
            return;
        }

        cy.get(selector, { timeout: 15000 })
            .should('exist')
            .then($input => {

                const isReadonly  = $input.prop('readonly');
                const isDisabled  = $input.prop('disabled');

                if (isReadonly || isDisabled) {
                    cy.log(`Input bloqueado, no se escribe: ${selector}`);
                    return;
                }

                cy.wrap($input)
                    .should('be.visible')
                    .clear({ force: true })
                    .type(valor, { force: true });
            });
    }


    seleccionarComboUser(valor, xpath) {

        // 🔒 Normalización PRO (igual que tú)
        if (
            valor === undefined ||
            valor === null ||
            valor === '' ||
            valor.toString().trim().toLowerCase() === 'lleno'
        ) {
            cy.log(`Combo omitido: ${xpath}`);
            return;
        }

        const textoValor = valor.toString().trim().toLowerCase();

        // 1️⃣ Localizar mat-select por label (XPath intacto)
        cy.xpath(
            `//label[.//*[contains(normalize-space(),'${xpath}')]]/ancestor::mat-form-field//mat-select`,
            { timeout: 20000 }
        )
            .should('exist')
            .then($select => {

                const estaDeshabilitado =
                    $select.prop('disabled') ||
                    $select.attr('aria-disabled') === 'true' ||
                    $select.hasClass('mat-select-disabled');

                const valorActual = $select
                    .find('.mat-select-min-line')
                    .text()
                    .trim()
                    .toLowerCase();

                // 🚫 Combo bloqueado (MODIFICAR)
                if (estaDeshabilitado) {
                    cy.log(`Combo bloqueado, no se interactúa: ${xpath}`);
                    return;
                }

                // 🔁 Ya tiene el valor (MODIFICAR)
                if (valorActual && valorActual.includes(textoValor)) {
                    cy.log(`Combo ya seleccionado: ${xpath}`);
                    return;
                }

                // 2️⃣ Abrir combo
                cy.wrap($select)
                    .should('be.visible')
                    .click({ force: true });

                // 3️⃣ Verificar si Angular creó overlay
                cy.get('body').then($body => {

                    if ($body.find('.cdk-overlay-pane').length === 0) {
                        cy.log(`Overlay no creado (combo no abrió): ${xpath}`);
                        return;
                    }

                    // 4️⃣ Usar el overlay MÁS RECIENTE
                    cy.get('.cdk-overlay-pane')
                        .last()
                        .should('exist')
                        .within(() => {

                            cy.xpath(
                                `.//mat-option//span[contains(
                                translate(
                                    normalize-space(),
                                    'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
                                    'abcdefghijklmnopqrstuvwxyzáéíóúüñ'
                                ),
                                '${textoValor}'
                            )]`
                            )
                                .filter(':visible')
                                .first()
                                .should('exist')
                                .scrollIntoView({ block: 'center' })
                                .click({ force: true });
                        });
                });
            });

        // 5️⃣ ESPERA REAL PARA COMBOS DEPENDIENTES (SIN FORZAR)
        cy.wait(300);
    }
}
export default UsuarioPomCy;