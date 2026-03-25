class CatalogosCy{

    //Inicio Monedas

    Monedas(codigo, codigoIso, nombre, codigoNumerico, decimales, puntoFlotante){

        cy.get('#code').clear().should("be.visible").type(codigo)
        cy.get('#iso3Code').clear().should("be.visible").type(codigoIso)
        cy.get('#name').clear().should("be.visible").type(nombre)
        cy.get('#numberCode').clear().should("be.visible").type(codigoNumerico)
        cy.get('#decimals').clear().should("be.visible").type(decimales)
        cy.get('#floatingPoint').clear().should("be.visible").type(puntoFlotante)
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

    }


    //Fin Monedas


    //Países

    //Inicio Pais
    Pais(nombre, iso2Code, iso3Code, valorTipo){
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#iso2Code").should("be.visible").clear().type(iso2Code)
        cy.get("#iso3Code").should("be.visible").clear().type(iso3Code)

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


    }

    //Fin Pais

    //Inicio Nivel Geografico

    DivisionGeografica(codigo, nombre){
        cy.get("#code").should("be.visible").clear().type(codigo);
        cy.get("#name").should("be.visible").clear().type(nombre);
    }


//Productos

    //Inicio Productos
    SelectOpcProductos(){
        cy.get('#authLevel > .mat-list-item-content').scrollIntoView()
        cy.wait(1000)
        cy.xpath("//a[@id='products']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    Productos(codigo, nombre, descripcion, valorMoneda, valorDigitoVetificador, longCuenta, mascaraCuenta){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        this.seleccionarCombo(valorMoneda, 0);
        this.seleccionarCombo(valorDigitoVetificador, 1);


        cy.get("#accountLength").should("be.visible").clear().type(longCuenta)
        cy.get("#acountMask").should("be.visible").clear().type(mascaraCuenta)


    }


    seleccionarCombo(valor, index) {

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
    }




    //Fin Productos


//Bancos

    //Inicio Banco

    Banco(codigo, nombre){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
    }

    //Fin Banco


//Razones de Reversión

    //Inicio Razon de reverso

    RazonReversion(codigo, nombre, descripcion){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }

    //Fin Razon de reverso


//Dígito Verificador

    //Inicio Digito Verficador

    DigitoVerificador(codigo, descripcion, ValorModuloVeridicador){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        if (ValorModuloVeridicador) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== ValorModuloVeridicador) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(ValorModuloVeridicador)
                            .should('be.visible')
                            .click();
                    }
                });
        }

        cy.get('#weightVerifier12').should("be.visible").scrollIntoView()

    }

    //Fin Digito Verficador


//Tipos de Cliente

    //Inicio Tipo de Cliente

    TipoCliente(codigo, nombre, descripcion){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)
    }

    //Fin Tipo de Cliente


//Valores globales


    //Inicio Valor Global

    ValorGlobal(codigo, valorTipo, longitud, descripcion){
        cy.get("#code").should("be.visible").clear().type(codigo)

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

        cy.get("#length").should("be.visible").clear().type(longitud)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }

    //Fin Valor Global

    //Inico subnivel Valores Globales

    ValoresGlobales(valorArbol, valor){

        if (valorArbol) {

            cy.get('mat-select', { timeout: 10000 })
                .filter(':visible')
                .first()
                .then($select => {

                    const valorActual = $select
                        .find('.mat-select-min-line')
                        .text()
                        .trim();

                    // 🔁 Solo cambiar si es distinto
                    if (valorActual !== valorArbol) {

                        cy.wrap($select)
                            .should('not.be.disabled')
                            .click({ force: true });

                        cy.get('.cdk-overlay-pane', { timeout: 10000 })
                            .find('.mat-option-text')
                            .contains(valorArbol)
                            .should('be.visible')
                            .click();
                    }
                });
        }

        cy.get("#value").should("be.visible").clear().type(valor)

    }

    BuscarRegistroValoresGloabeles(valor){
        cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-menu-content > .mat-focus-indicator').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get("#value").should("be.visible").type(valor)
        cy.wait(1000)
        cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-row > .cdk-column-value').should("be.visible").click({force:true})
        cy.wait(1000)
    }


    //Fin subnivel Valores Globales


//Mensajes de error

    //Inicio mensaje de error

    MensajesError(codigo, mensajeError, descripcion, valorTipoMensaje, valorAccion){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#message").should("be.visible").clear().type(mensajeError)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        this.seleccionarComboME(valorTipoMensaje, 0);
        this.seleccionarComboME(valorAccion, 1);
    }

    seleccionarComboME(valor, index) {

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
    }

    //Fin mensaje de error


//Equivalencias

    //Inicio Equivalencias

    Equivalencias(llave, datosEquivalentes, descripcion){

        cy.get("#keyword").should("be.visible").clear().type(llave)
        cy.get("#equivalentData").should("be.visible").clear().type(datosEquivalentes)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }
    //Fin Equivalencias


//Días no laborales

    //Inico Dias no habiles


    DiasNoHabiles(valorNivelGeografico1, valorNivelGeografico2, valorNivelGeografico3, fechaInicio, fechaFin, descripcion){



        this.seleccionarComboDN(valorNivelGeografico1, "División geográfica 1");
        this.seleccionarComboDN(valorNivelGeografico2, "División geográfica 2");
        this.seleccionarComboDN(valorNivelGeografico3, "División geográfica 3");

        // 📅 Fecha Inicio (obligatoria)
        this.seleccionarFecha('#dateStartNonWork', fechaInicio);

        // 📅 Fecha Fin (opcional)
        if (fechaFin) {
            this.seleccionarFecha('#dateEndNonWork', fechaFin);
        }

        // 📝 Descripción
        cy.get('#description')
            .should('be.visible')
            .clear()
            .type(descripcion);
    }

    seleccionarComboDN(valor, xpath) {

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

        // 1️⃣ Esperar mat-select visible y habilitado
        cy.xpath(
            `//label[.//*[contains(normalize-space(),'${xpath}')]]/ancestor::mat-form-field//mat-select`,
            { timeout: 20000 }
        )
            .should('be.visible')
            .should('not.have.attr', 'aria-disabled', 'true')
            .scrollIntoView()
            .click(); // 🚫 sin force

        // 2️⃣ Esperar overlay REAL (visible y último)
        cy.get('.cdk-overlay-pane:visible', { timeout: 20000 })
            .should('have.length.at.least', 1)
            .last()
            .within(() => {

                // 3️⃣ Esperar opciones (combo dependiente / backend lento)
                cy.xpath(
                    `.//mat-option//span[contains(
          translate(
            normalize-space(),
            'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
            'abcdefghijklmnopqrstuvwxyzáéíóúüñ'
          ),
          '${textoValor}'
        )]`,
                    { timeout: 20000 }
                )
                    .first()
                    .should('be.visible')
                    .scrollIntoView({ block: 'center' })
                    .click();
            });

        // 4️⃣ Confirmar selección (evita falsos positivos)
        cy.xpath(
            `//label[.//*[contains(normalize-space(),'${xpath}')]]/ancestor::mat-form-field//mat-select//span[contains(@class,'mat-select-min-line')]`,
            { timeout: 10000 }
        )
            .invoke('text')
            .should(text => {
                expect(text.trim().toLowerCase()).to.contain(textoValor);
            });
    }



    seleccionarFecha(selector, fecha, obligatoria = false) {

        // =====================================================
        // 🔹 1️⃣ Validación inicial
        // =====================================================
        if (!fecha || fecha.toString().trim() === '') {

            if (obligatoria) {
                throw new Error(`La fecha es obligatoria y no fue enviada (${selector})`);
            }

            cy.log(`🟡 Fecha omitida (opcional): ${selector}`);
            return;
        }

        // =====================================================
        // 🔹 2️⃣ Parsear fecha D/M/YYYY o DD/MM/YYYY
        // =====================================================
        const partes = fecha.toString().trim().split('/');

        if (partes.length !== 3) {
            throw new Error(`Formato de fecha inválido: ${fecha}`);
        }

        let [day, month, year] = partes.map(p => parseInt(p, 10));

        if (
            isNaN(day) ||
            isNaN(month) ||
            isNaN(year) ||
            year < 1900
        ) {
            throw new Error(`Fecha inválida: ${fecha}`);
        }

        // =====================================================
        // 🔹 3️⃣ Crear Date REAL (CLAVE)
        // =====================================================
        const dateObj = new Date(year, month - 1, day);

        // =====================================================
        // 🔹 4️⃣ Setear fecha correctamente en Angular
        // =====================================================
        cy.get(selector, { timeout: 20000 })
            .should('exist')
            .then($input => {

                // 🔓 Habilitar input
                $input.prop('disabled', false);

                cy.wrap($input)
                    .closest('mat-form-field')
                    .invoke('removeClass', 'mat-form-field-disabled');

                // 🧠 SETEO REAL (NO TYPE)
                cy.wrap($input)
                    .invoke('val', dateObj)
                    .trigger('input')
                    .trigger('change')
                    .trigger('blur');
            });
    }

    //Fin Dias no habiles


}

export default CatalogosCy;



