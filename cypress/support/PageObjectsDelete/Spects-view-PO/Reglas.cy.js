
class ReglasCy{

//Inicio Reglas
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
    //Fin Reglas

//Inicio Acciones Condicionadas
    AccionCodicionada(transaccion, correlativo, regla, accion, ejecutar, descripcion){

        this.seleccionarComboAC(transaccion, "Transacción");
        cy.get("#correlative").should("be.visible").clear().type(correlativo)
        this.seleccionarComboAC(regla, "Regla");
        this.seleccionarComboAC(accion, "Acción");
        this.seleccionarComboAC(ejecutar, "Ejecutar");
        cy.get("#description").should("be.visible").clear().type(descripcion)
    }
        //inicio subnivel Acciones Condicionadas

        ACTxAsociadasCondicionadas(txAsociada, correlativo, tipoAsociacion, tipoAccion, descripcion, acumular, permiteRechazo, modoInverso, permiteCanacelacion ){

            this.seleccionarComboAC(txAsociada, "Transaccion asociada");
            cy.get("#correlative").should("be.visible").clear().type(correlativo)
            this.seleccionarComboAC(tipoAsociacion, "Tipo de asociación");
            this.seleccionarComboAC(tipoAccion, "Tipo de acción");
            cy.get("#description").should("be.visible").clear().type(descripcion)
            this.checkBoxWOS(acumular, "Acumular");
            this.checkBoxWOS(permiteRechazo, "Permitir rechazo");
            this.seleccionarComboAC(modoInverso, "Modo inverso");
            this.seleccionarComboAC(permiteCanacelacion, "Permitir cancelación");

        }

            ACUserRecTxA(arbolRaiz, rama, usuario, jornada){

                this.seleccionarComboAC(arbolRaiz, "Árbol Raíz");
                this.seleccionarComboAC(rama, "Rama");
                this.seleccionarComboAC(usuario, "Usuario");
                this.seleccionarComboAC(jornada, "Jornada");

            }

            ACDetalle(correlativo, descripcion, caracteristica, tipoCampo, expresion1, operador, expresion2, protegerCampo, acumular){

                cy.get("#correlative").should("be.visible").clear().type(correlativo)
                cy.get("#description").should("be.visible").clear().type(descripcion)
                this.seleccionarComboAC(caracteristica, "Característica");
                this.seleccionarComboAC(tipoCampo, "Tipo de campo");
                cy.get("#expressionDataAssign1").should("be.visible").clear().type(expresion1)
                this.seleccionarComboAC(operador, "Operador");
                cy.get("#expression2").should("be.visible").clear().type(expresion2)
                this.checkBoxWOS(protegerCampo, "Proteger campo");
                this.checkBoxWOS(acumular, "Acumular");

            }

        ACSolAutCon(Permiso, correlativo){

            this.seleccionarComboAC(Permiso, "Permiso");
            cy.get("#corrCharactRequestAuth").should("be.visible").clear().type(correlativo)

        }

        ACForExtCon(correlativo, defJsonForm1, defJsonForm2, defJsonForm3){

            cy.get("#correlative").should("be.visible").clear().type(correlativo)
            cy.get("#form01Name").should("be.visible").clear().type(defJsonForm1)
            cy.get("#form02Name").should("be.visible").clear().type(defJsonForm2)
            cy.get("#form03Name").should("be.visible").clear().type(defJsonForm3)
        }

        ACAfecTotalCon(correlativo, caracteristica, arbolRaiz, totalCajero, operador, afectar){

            cy.get("#correlative").should("be.visible").clear().type(correlativo)
            this.seleccionarComboAC(caracteristica, "Característica");
            this.seleccionarComboAC(arbolRaiz, "Árbol Raíz");
            this.seleccionarComboAC(totalCajero, "Total de Cajero");
            this.seleccionarComboAC(operador, "Operador");
            this.seleccionarComboAC(afectar, "Afectar");

        }

        ACFormtCond(correlativo, modo, formato, numeroCopias){
            
            cy.get("#correlative").should("be.visible").clear().type(correlativo)
            this.seleccionarComboAC(modo, "Modo");
            this.seleccionarComboAC(formato, "Formato");
            cy.get("#numCopies").should("be.visible").clear().type(numeroCopias)

        }

        ACMjsCon(mensajeUsuario, pasoTransaccion, tipoMensaje){
            
            cy.get("#messageUser").should("be.visible").clear().type(mensajeUsuario)
            cy.get("#transactionStep").should("be.visible").clear().type(pasoTransaccion)
            this.seleccionarComboAC(tipoMensaje, "Tipo de mensaje");
        }

        ACCamAtrCamp(expressionField, proteger, obligatorio, negrita, tamanioLetra, RGB, expForceValue){
            
            cy.get("#expressionField").should("be.visible").clear().type(expressionField)
            this.checkBox(proteger, "Proteger");
            this.checkBox(obligatorio, "Obligatorio");
            this.checkBox(negrita, "Negrita");
            this.seleccionarComboAC(tamanioLetra, "Tamaño de letra");
            cy.get('#color').should('be.visible').invoke('val', RGB).trigger('input').trigger('change');
            cy.get("#forceValue").should("be.visible").clear().type(expForceValue)
 }

    //Fin Acciones Condicionadas


        //Inicio Suibnivel Transacciones asociadas condicionadas


        //Inicio Subnivel Solicitar autorización

        NavegarSolicitarAutorizacion(){
            cy.xpath("//li[contains(text(),'Solicitar autorización')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        SolicitarAutorizacion(permiso, correlativo){

            if(permiso == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'CANCELAR TRANSACCION ASOCIADA')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            cy.get("#corrCharactRequestAuth").should("be.visible").clear().type(correlativo)

        }

        //Fin  Subnivel Solicitar autorización


        //Inicio Subnivel Formulario extendido condicionado

        NavegarFormularioExtendidoCondicionado(){
            cy.xpath("//li[contains(text(),'Formulario extendido condicionado')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        FormularioExtendidoCondicionado(correlativo, jsonFormulario1){

            cy.get("#correlative").should("be.visible").clear().type(correlativo)
            cy.get("#form01Name").should("be.visible").clear().type(jsonFormulario1)

        }


        //Fin Subnivel Formulario extendido condicionado

        //Inico Subnivel Afectar totales condicionados

        NavegarAfectarTotalesCondicionados(){
            cy.xpath("//li[contains(text(),'Afectar totales condicionados')]").click({force:true})
            cy.wait(1000)
        }

        AfectarTotalesCondicionados(correlativo, caracteristica, arbolRaiz, totalCajero, operador, afectar){

            cy.get("#correlative").should("be.visible").clear().type(correlativo)

            if(caracteristica == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Referencia No')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            if(arbolRaiz == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Byte S.A. (Raiz)')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            if(totalCajero == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[5]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Ahorros (140)')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            if(operador == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[6]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'+')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }

            if(afectar == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[7]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Ambas')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{

            }
            

        }

        //Fin Subnivel Afectar totales condicionados

        //Inicio Subnivel Formatos condicionados 

        NavegarFormatosCondicionados(){
            cy.xpath("//li[contains(text(),'Formatos condicionados')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }
        
        FormatosCondicionados(correlativo, modo, formato, numeroCopias){

            cy.get("#correlative").should("be.visible").clear().type(correlativo)

            if(modo == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(100)
                cy.xpath("//span[contains(text(),'Offline')]").should("be.visible").click({force:true})
                cy.wait(100)
            }else{

            }

            if(formato == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(100)
                cy.xpath("//span[contains(text(),'Cns préstamo core-byte')]").should("be.visible").click({force:true})
                cy.wait(100)
            }else{
                
            }

            cy.get("#numCopies").should("be.visible").clear().type(numeroCopias)

        }

        //Fin Subnivel Formatos condicionados

        //Inicio Subnivel Mensaje condicionado

        NavegarMensajeCondicionado(){
            cy.xpath("//li[contains(text(),'Mensaje condicionado')]").should("be.visible").click({force:false})
            cy.wait(1000)
        }

        MensajeCondicionado(mensajeUsuario, pasoTransaccion, tipoMensaje){

            cy.get("#messageUser").should("be.visible").clear().type(mensajeUsuario)
            cy.get("#transactionStep").should("be.visible").clear().type(pasoTransaccion)

            if(tipoMensaje == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible"),click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Informativo')]").should("be.visible"),click({force:true})
                cy.wait(1000)
            }else{

            }

        }

        BuscarRegristroMensajeCondicionado(){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > .mat-focus-indicator').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get("#typeMessage").should("be.visible").select('Informativo')
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-typeMessage').should("be.visible").click({force:true})
            cy.wait(1000)
        }

        //Fin Subnivel Mensaje condicionado

        //Inicio Cambiar Atributos de Campo

        NavegarCambiarAtributosCampo(){
            cy.xpath("//li[contains(text(),'Cambiar Atributos de Campo')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        CambiarAtributosCampo(expresionDefinirCampo, tamanioLetra, expresionForzarValor){

            cy.get("#expressionField").should("be.visible").clear().type(expresionDefinirCampo)

            if(tamanioLetra == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[5]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible"),click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'14')]").should("be.visible"),click({force:true})
                cy.wait(1000)
            }else{

            }

            cy.get("#forceValue").should("be.visible").clear().type(expresionForzarValor)

        }

        BuscarRegristroCambiarAtributoCampo(){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > .mat-focus-indicator').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#expressionField').should("be.visible").select('Informativo')
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-typeMessage').should("be.visible").click({force:true})
            cy.wait(1000)
        }

        seleccionarComboAC(valor, xpath) {

        const textoValor = valor.toLowerCase();

        cy.xpath(
        "//mat-label[contains(normalize-space(),'"+xpath+"')]/ancestor::mat-form-field//mat-select",
        { timeout: 15000 }
        )
        .should('be.visible')
        .click();

        cy.xpath(
        `(//mat-option//span[contains(translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
        'abcdefghijklmnopqrstuvwxyzáéíóúüñ'),'${textoValor}')])[1]`,
        { timeout: 15000 }
        )
        .should('be.visible')
        .click();
        }

        checkBoxWOS(valor, xpath) {

        if(!valor){
            cy.xpath("//mat-checkbox[.//span[contains(normalize-space(),'"+xpath+"')]]").click();
            }
        
        }

        checkBox(valor, xpath) {

        if(valor){
            cy.xpath("//mat-checkbox[.//span[contains(normalize-space(),'"+xpath+"')]]").click();
            }
        
        }

        //Fin Cambiar Atributos de Campo


    //Fin Acciones Condicionadas

        seleccionarCombo(valor, xpath) {

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

    //Abrir el mat-select por su label
    cy.xpath(
        `//label[.//*[contains(normalize-space(),'${xpath}')]]/ancestor::mat-form-field//mat-select`,
        {timeout: 15000}
    )
        .should('be.visible')
        .click({force: true});

    //Esperar overlay
    cy.get('.cdk-overlay-pane', {timeout: 15000})
        .should('exist')
        .within(() => {

            //Seleccionar opción (insensible a mayúsculas / acentos)
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
                .filter(':visible')   //elimina duplicados
                .first()
                .should('exist')

                .click({force: true});
        });
}


    //Fin Acciones Condicionadas

 seleccionarFecha(selector, fecha) {

        if (!fecha) return;

        // Convierte "DD/MM/YYYY" a Date
        const [day, month, year] = fecha.split('/');
        const dateObj = new Date(year, month - 1, day);

        cy.get(selector, { timeout: 10000 })
            .should('exist')
            .invoke('removeAttr', 'disabled')
            .then($input => {
                const nativeInput = $input[0];

                // Setea el valor como Date real
                nativeInput.value = dateObj.toISOString().substring(0, 10);
                nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
                nativeInput.dispatchEvent(new Event('change', { bubbles: true }));
            });
    }
}

export default ReglasCy;

