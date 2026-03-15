require('cypress-xpath');
class RutinasPomCy{

    Rutinas(codigo, nombre, nombreRecurso, endpointRutinaRutaComponenteAngular, tipoRutina, capaEjecucion, descripcion, parametros, tipoOperacion, esLogin, formatoEnvio,
            formatoRecibido, expresion1, operacion, expresion2, tipoExpresion, endpointRutinaSecundario, enviarListaRecursos, ofline, online, noGuardarLOG) {

        const campos = [
            {selector: '#code', valor: codigo},
            {selector: '#name', valor: nombre},
            {selector: '#resourceName', valor: nombreRecurso},
            {selector: 'textarea#beanRoutine', valor: endpointRutinaRutaComponenteAngular},
            {selector: 'textarea#description', valor: descripcion},
            {selector: 'textarea#parameters', valor: parametros},
            {selector: '#expression1', valor: expresion1},
            {selector: '#expression2', valor: expresion2},
            {selector: 'textarea#secondaryEndpoint', valor: endpointRutinaSecundario}
        ];

        campos.forEach(({selector, valor}) => {

            // 🔒 Validación PRO (igual que la usas en todo el proyecto)
            if (valor === undefined || valor === null || valor === '') {
                cy.log(`Campo omitido: ${selector}`);
                return;
            }

            cy.get('body').then($body => {

                // 🔎 Verificar existencia en DOM
                if ($body.find(selector).length > 0) {

                    cy.get(selector)
                        .scrollIntoView({block: 'center'})
                        .clear({force: true})
                        .type(valor, {force: true});

                } else {
                    cy.log(`Campo no presente aún: ${selector}`);
                }
            });
        });

        // 🔽 Combos (se mantienen igual)
        this.seleccionarCombo(tipoRutina, "Tipo de rutina");
        this.seleccionarCombo(capaEjecucion, "Capa de Ejecución");
        this.seleccionarCombo(tipoOperacion, "Tipo de operación");
        this.seleccionarCombo(esLogin, "Es Login");
        this.seleccionarCombo(formatoEnvio, "Formato de envío");
        this.seleccionarCombo(formatoRecibido, "Formato de recibido");
        this.seleccionarCombo(operacion, "Operación");
        this.seleccionarCombo(tipoExpresion, "Tipo de Expresión");

        // ☑️ Checkboxes
        this.checkBoxWOS(enviarListaRecursos, "Enviar lista de recursos");
        this.checkBoxWOS(ofline, "Offline");
        this.checkBoxWOS(online, "Online");
        this.checkBoxWOS(noGuardarLOG, "No guardar LOG");
    }

    /*seleccionarCombo(valor, xpath) {

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
            `//label[.//!*[contains(normalize-space(),'${xpath}')]]/ancestor::mat-form-field//mat-select`,
            {timeout: 15000}
        )
            .should('be.visible')
            .click({force: true});

        // 2️⃣ Esperar overlay
        cy.get('.cdk-overlay-pane', {timeout: 15000})
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
                    .scrollIntoView({block: 'center'})
                    .filter(':visible')   // 🔥 elimina duplicados
                    .first()
                    .should('exist')

                    .click({force: true});
            });
    }*/

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

        // 2️⃣ Esperar overlay y SELECCIONAR EL PRIMERO (solución al error)
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .should('have.length.at.least', 1) // Verificar que al menos hay uno
            .first() // 👈 TOMAR SOLO EL PRIMERO
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
                    .filter(':visible')
                    .first()
                    .should('exist')
                    .click({ force: true });
            });
    }


    checkBoxWOS(valor, textoLabel) {

        // 🔹 VALIDACIÓN MEJORADA - No tocar si no viene el parámetro
        if (valor === undefined ||
            valor === null ||
            valor === '' ||
            valor.toString().trim() === '') {

            cy.log(`✅ Checkbox omitido correctamente: ${textoLabel} (valor: ${valor})`);
            return;
        }

        cy.log(`☑️ Procesando checkbox "${textoLabel}" = ${valor}`);

        // Convertir a booleano (por si viene como string "true"/"false")
        const valorBooleano = valor.toString().toLowerCase() === 'true' ? true : false;

        cy.contains('span', textoLabel, { timeout: 15000 })
            .should('be.visible')
            .parents('mat-checkbox')
            .should('exist')
            .then($checkbox => {
                const estaMarcado = $checkbox.find('input[type="checkbox"]').prop('checked');

                if (estaMarcado !== valorBooleano) {
                    cy.wrap($checkbox).find('.mat-checkbox-layout').click();
                    cy.wrap($checkbox)
                        .find('input[type="checkbox"]')
                        .should(valorBooleano ? 'be.checked' : 'not.be.checked');
                    cy.log(`✅ Checkbox "${textoLabel}" actualizado a ${valorBooleano}`);
                } else {
                    cy.log(`ℹ️ Checkbox "${textoLabel}" ya está en estado correcto`);
                }
            });
    }

}
export default RutinasPomCy;