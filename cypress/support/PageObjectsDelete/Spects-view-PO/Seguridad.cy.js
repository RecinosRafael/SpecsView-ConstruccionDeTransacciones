class SeguridadCy{

    //Niveles de Autorización

    //Inicio Nivel de Autorizacion

    NivelAutorizacion(valorArbolRaiz, nivel, nombre, desdcripcion){

        if (valorArbolRaiz) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorArbolRaiz) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(valorArbolRaiz)
                            .should('be.visible')
                            .click();
                    }
                });
        }

        cy.get("#level_").clear().should("be.visible").type(nivel)
        cy.get("#name").clear().should("be.visible").type(nombre)
        cy.get("#description").clear().should("be.visible").type(desdcripcion)

    }

    //Fin Nivel de Autorizacion



//Inicio Nivel de Cajero

     NivelCajero(codigo, valorArbolRaiz, nombre, descripcion, valorNivelAutorizacion, rolKeycloak){

        cy.get("#code").should("be.visible").clear().type(codigo)

        this.seleccionarComboNC(valorArbolRaiz, 0);


        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        this.seleccionarComboNC(valorNivelAutorizacion, 1);

        cy.get("#roleKeycloak").clear().should("be.visible").type(rolKeycloak)

    }

    seleccionarComboNC(valor, index) {
        if (!valor) return;

        cy.get('mat-select', { timeout: 15000 })
            .eq(index)
            .should('exist')
            .then($select => {

                const valorActual = $select
                    .find('.mat-select-min-line')
                    .text()
                    .trim();

                if (valorActual !== valor) {

                    cy.wrap($select)
                        .scrollIntoView({ block: 'center' })
                        .click({ force: true }); // 👈 fuerza click aunque no esté visible

                    // 👇 Overlay real de Angular Material
                    cy.get('.cdk-overlay-pane', { timeout: 15000 })
                        .should('exist')
                        .within(() => {
                            cy.contains('.mat-option-text', valor)
                                .should('exist')
                                .click({ force: true });
                        });
                }
            });
    }


    //Fin Nivel de Cajero


    //Inicio Tipo de Cajero


    TipoCajero(codigo, descripcion, verTotales){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }


    //Fin Tipo de Cajero



//Inicio Usuario

    BuscarPersona(tipoIdentificacion, numeroIdentificacion) {

        // 1️⃣ Abrir combo "Tipo de identificación"
        cy.contains('mat-label', 'Tipo de identificación', { timeout: 10000 })
            .parents('mat-form-field')
            .find('mat-select')
            .click({ force: true });

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


   /* Usuario(codigo, usuario, pNombre, sNombre, pApellido, sApellido, valorPais, correo, telTrabajo, codigoEmpleado, valorArbolRaiz, valorRamaArbol, valorDepartamento,
            valorTipoCajero, valorJornadaLaboral, valorNivelCajero, puertoImpre){

        cy.get('input[data-placeholder="Código"]').should('be.visible').clear().type(codigo);
        cy.get('input[data-placeholder="Usuario"]').should('be.visible').type(usuario);
        cy.get('input[data-placeholder="Primer nombre"]').should('be.visible').clear().type(pNombre);
        cy.get('input[data-placeholder="Segundo nombre"]').should('be.visible').clear().type(sNombre);
        cy.get('input[data-placeholder="Primer apellido"]').should('be.visible').clear().type(pApellido);
        cy.get('input[data-placeholder="Segundo apellido"]').should('be.visible').clear().type(sApellido);

        this.seleccionarComboUser(valorPais, "País");

        cy.get('input[data-placeholder="Código del empleado"]').should('be.visible').clear().type(codigoEmpleado);
        cy.get('input[data-placeholder="Correo electrónico"]').should('be.visible').clear().type(correo);
        cy.get('input[data-placeholder="Teléfono del trabajo"]').should('be.visible').clear().type(telTrabajo);

        this.seleccionarComboUser(valorArbolRaiz, "Árbol raíz");
        this.seleccionarComboUser(valorRamaArbol, "Rama del árbol");
        this.seleccionarComboUser(valorDepartamento, "Departamento");
        this.seleccionarComboUser(valorTipoCajero, "Tipo de cajero");
        this.seleccionarComboUser(valorJornadaLaboral, "Jornada laboral");
        this.seleccionarComboUser(valorNivelCajero, "Nivel de cajero");

        cy.get('input[data-placeholder="Puerto de impresión"]').should('be.visible').clear().type(puertoImpre);



    }*/

    Usuario(
        codigo, usuario, pNombre, sNombre, pApellido, sApellido,
        valorPais, correo, telTrabajo, codigoEmpleado,
        valorArbolRaiz, valorRamaArbol, valorDepartamento,
        valorTipoCajero, valorJornadaLaboral, valorNivelCajero,
        puertoImpre
    ) {

        this.escribirInputSeguro('input[data-placeholder="Código"]', codigo);
        this.escribirInputSeguro('input[data-placeholder="Usuario"]', usuario);
        this.escribirInputSeguro('input[data-placeholder="Primer nombre"]', pNombre);
        this.escribirInputSeguro('input[data-placeholder="Segundo nombre"]', sNombre);
        this.escribirInputSeguro('input[data-placeholder="Primer apellido"]', pApellido);
        this.escribirInputSeguro('input[data-placeholder="Segundo apellido"]', sApellido);

        this.seleccionarComboUser(valorPais, "País");

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



    BuscarUsuario(nombre){
        cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
        cy.wait(2000)
        cy.get('.mat-menu-content > :nth-child(2)').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('#fullName').should("be.visible").type(nombre)
        cy.wait(1000)
        cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-row > .cdk-column-fullName').should("be.visible").click({force:true})
        cy.wait(1000)
    }

    //Fin Usuario



//Inicio Asociar un usuario a Varias ramas

    AsociarUsuarioVariasAgencias(valorUsuario, valorRama){

        this.seleccionarComboPorLabel('Usuario', valorUsuario);
        this.seleccionarComboPorLabel('Rama', valorRama);

    }

    seleccionarComboPorLabel(labelTexto, valor) {

        if (!valor) return;

        cy.contains('mat-label', labelTexto, { timeout: 15000 })
            .closest('.mat-form-field')
            .find('mat-select')
            .should('be.visible')
            .should('not.be.disabled')
            .then($select => {

                const valorActual = $select
                    .find('.mat-select-min-line')
                    .text()
                    .trim();

                if (valorActual !== valor) {

                    cy.wrap($select).click({ force: true });

                    // Esperar overlay real
                    cy.get('.cdk-overlay-pane mat-option', { timeout: 15000 })
                        .should('exist');

                    cy.contains('.cdk-overlay-pane mat-option', valor, { timeout: 15000 })
                        .scrollIntoView()
                        .should('be.visible')
                        .click({ force: true });

                    // Esperar cierre del combo
                    cy.get('.cdk-overlay-pane')
                        .should('not.exist');
                }
            });
    }

    //Fin Asociar un usuario a Varias ramas


//Razones de Bloqueo de Usuarios

    RazonesBloqueoUsuarios(codigo, razon, mensaje){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#reason").should("be.visible").clear().type(razon)
        cy.get("#message").should("be.visible").clear().type(mensaje)

    }

    //Fin Razones de bloqueo de usuarios


    //Inicio Submenu

    Submenu(codigo, nombre, descripcion, url, valorTipoAplicacion){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)
        cy.get("#url").should("be.visible").clear().type(url)

        if (valorTipoAplicacion) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorTipoAplicacion) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(valorTipoAplicacion)
                            .should('be.visible')
                            .click();
                    }
                });
        }
    }

    SubmenuNivelCajero(valorNivelCajero){

        if (valorNivelCajero) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorNivelCajero) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(valorNivelCajero)
                            .should('be.visible')
                            .click();
                    }
                });
        }

    }

    //Fin Submenu

    seleccionarCombo(valor, xpath) {

        // 🔒 Normalización PRO
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

        // 1️⃣ Abrir el mat-select por su label
        cy.xpath(
            `//label[.//*[contains(normalize-space(),'${xpath}')]]/ancestor::mat-form-field//mat-select`,
            { timeout: 15000 }
        )
            .should('be.visible')
            .click({ force: true });

        // 2️⃣ Esperar overlay
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .should('exist')
            .within(() => {

                // 3️⃣ Seleccionar opción (insensible a mayúsculas / acentos)
                cy.xpath(
                    `(//mat-option//span[contains(
          translate(
            normalize-space(),
            'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
            'abcdefghijklmnopqrstuvwxyzáéíóúüñ'
          ),
          '${textoValor}'
        )])[1]`
                )
                    .scrollIntoView({ block: 'center' })
                    .filter(':visible')   // 🔥 elimina duplicados
                    .first()
                    .should('exist')

                    .click({ force: true });
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





}

export default SeguridadCy;
