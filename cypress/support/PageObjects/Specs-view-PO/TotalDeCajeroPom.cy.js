import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";
import 'cypress-xpath';
class TotalDeCajeroPomCy{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    TotalesCajero(codigo, arbolRaiz, nombre, nombreCorto, descripcion, validaMontos, minimoRequiereAutorizacion, maximoRequiereAutorizacion, correlativoImpreso, enviarHost,
                  cicloVida, validoDesde, validoHasta, totalMonitoreado, rutinaCalculamontoConciliar, rutinacalculaMontoConciliado, esControlEfectivo){

        const campos = [
            {selector: '#code', valor: codigo},
            {selector: '#name', valor: nombre},
            {selector: '#shortName', valor: nombreCorto},
            {selector: 'textarea#description', valor: descripcion},
            {selector: '#correlativePrint', valor: correlativoImpreso},
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
        this.seleccionarComboTC(arbolRaiz, "Árbol Raíz");
        this.seleccionarComboTC(cicloVida, "Ciclo de vida");
        this.seleccionarComboTC(rutinaCalculamontoConciliar, "Rutina calcula monto por Conciliar");
        this.seleccionarComboTC(rutinacalculaMontoConciliado, "Rutina calcula monto Conciliado");
        this.seleccionarComboTC(esControlEfectivo, "Es control de efectivo");

        this.seleccionarFecha('#validFrom', validoDesde);
        this.seleccionarFecha('#validTo', validoHasta);

        // ☑️ Checkboxes
        this.checkBoxWOS(validaMontos, "Valida Montos");
        this.checkBoxWOS(minimoRequiereAutorizacion, "Mínimo Requiere Autorización");
        this.checkBoxWOS(maximoRequiereAutorizacion, "Máximo Requiere Autorización");
        this.checkBoxWOS(enviarHost, "Enviar Host");
        this.checkBoxWOS(totalMonitoreado, "Total es monitoreado");
    }


    TotalesCuadra(tipoCajero, cuadraEfectivo){

        if (tipoCajero) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== tipoCajero) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(tipoCajero)
                            .should('be.visible')
                            .click();
                    }
                });
        }

        this.checkBoxWOS(cuadraEfectivo, "Cuadra Efectivo");

    }

    ValidacionesCierreDia(codigo, nivelCajero, tolerancia, valorQueDeberiaCerrar, valorGlobalConstante, moneda){


        cy.get("#code").should("be.visible").clear().type(codigo)

        // 🔽 Combos (se mantienen igual)
        this.seleccionarComboTC(nivelCajero, "Nivel de cajero");

        cy.get("#tolerance").should("be.visible").clear().type(tolerancia)
        cy.get("#constant").should("be.visible").clear().type(valorQueDeberiaCerrar)

        this.seleccionarCombo(valorGlobalConstante, "Valor Global Constante");
        this.seleccionarCombo(moneda, "Moneda");


    }

    MinimosMaximos(tipoRama, tipoCajero, moneda, minimoCajero, maximoCajero, minimoTipoRama, maximoTipoRama){

        // 🔽 Combos (se mantienen igual)
        this.Generales.seleccionarCombo(tipoRama, "Tipo de Rama");
        this.Generales.seleccionarCombo(tipoCajero, "Tipo de cajero");
        this.Generales.seleccionarCombo(moneda, "Moneda");

        // this.seleccionarComboTC(tipoRama, "Tipo de Rama");
        // this.seleccionarComboTC(tipoCajero, "Tipo de cajero");
        // this.seleccionarComboTC(moneda, "Moneda");

        const campos = [
            {selector: '#minPerCashier', valor: minimoCajero},
            {selector: '#maxPerCashier', valor: maximoCajero},
            {selector: '#minPerTypeTreebranch', valor: minimoTipoRama},
            {selector: '#maxPerTypeTreebranch', valor: maximoTipoRama},
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

    seleccionarFecha(selector, fecha) {

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
    }

    //Metodo combo totales cajero
    seleccionarComboTC(valor, xpath) {

        // 🔒 Validación PRO (igual que la tuya)
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

        // 1️⃣ Abrir el mat-select por label
        cy.xpath(
            `//label[.//*[contains(normalize-space(),'${xpath}')]]
         /ancestor::mat-form-field//mat-select`,
            { timeout: 15000 }
        )
            .should('exist')
            .click({ force: true });

        // 2️⃣ Esperar overlay
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .should('exist')
            .within(() => {

                // 3️⃣ Seleccionar por mat-option (NO span)
                cy.xpath(
                    `//mat-option[
                    contains(
                        translate(
                            normalize-space(.),
                            'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
                            'abcdefghijklmnopqrstuvwxyzáéíóúüñ'
                        ),
                        '${textoValor}'
                    )
                ]`,
                    { timeout: 15000 }
                )
                    .first()                // 🔑 uno solo
                    .should('exist')
                    .click({ force: true }); // 🔥 aunque no sea visible
            });
    }


}
export default TotalDeCajeroPomCy;