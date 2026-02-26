class MetodosGeneralesPomCy{

    //Boton para agregar registros
    BtnAgregarRegistro(){
        cy.log('Clic en botón ADD');

        cy.get('button.mat-fab', { timeout: 15000 })
            .should('exist')
            .then($btn => {
                cy.wrap($btn)
                    //.scrollIntoView()
                    .click({ force: true });
            });
    }
    
    getIframeBody() {
     return cy
        .get('iframe.frame', { timeout: 20000 })
        .should('be.visible')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)
    }

    BtnGuardarRegistroAng() {
        cy.log('Clic en botón GUARDAR');

        this.getIframeBody().within(() => {

            cy.xpath(
            "//button[.//mat-icon[normalize-space()='save']]",
            { timeout: 15000 }
            )
            .should('exist')
            .click({ force: true });

        });
    }

    BtnAceptarRegistroAng() {
        cy.log('Clic en botón ACEPTAR');

      this.getIframeBody().within(() => {
        cy.get('mat-dialog-actions .buttonAdd button', { timeout: 15000 })
        .should('exist')
        .click({ force: true });
        });
    }

    //Boton para agregar registros Angular
    BtnAgregarAng(){
     cy.log('Clic en botón ADD');

    this.getIframeBody().within(() => {
      cy.xpath("//button[.//mat-icon[normalize-space()='add']]", { timeout: 15000 })
        .should('be.visible')
        .click({ force: true });
    });
}

    

    //Boton agregar en subnivel
    BtnAgregarRegistroSubnivel() {

        cy.contains('mat-icon', 'add', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

    }

    // //Boton para Regresar
    // BtnRegresarNivel() {
    //     cy.log('Clic en botón Regresar');

    //     cy.contains('mat-icon', 'arrow_back', { timeout: 15000 })
    //     .parents('button')
    //     .should('be.visible')
    //     .click();
    // }


    //Boton para confirmar el agregar y modificar registros
    BtnAceptarRegistro(){
        cy.log('Clic en botón ACEPTAR');

        cy.contains('button mat-button-wrapper, span.mat-button-wrapper', 'Aceptar', { timeout: 15000 })
            .parents('button')
            .should('exist')
            .click({ force: true });
    }

    //Boton para cancelar la insercion del registro.
    BtnCancelarRegistro() {
        cy.log('Clic en botón CANCELAR');

        cy.contains('button', 'Cancelar', { timeout: 15000 })
            .should('exist')
            .click({ force: true });
    }


    //Filtro, Buscar por codigo
    BuscarRegistroCodigo(codigo) {

        // ✅ Intercept real del endpoint correcto
        cy.intercept(
            'GET',
            '**/api/catalog-service/v1/money*'
        ).as('buscarCodigo')

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('be.visible')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Código"
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Código')
            .should('be.visible')
            .click({ force: true });

        // 3️⃣ Ingresar código
        cy.get('#code', { timeout: 15000 })
            .should('be.visible')
            .clear()
            .type(codigo);

        // 4️⃣ Click buscar
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .parents('button')
            .click({ force: true });
            cy.wait(5000)

        // 🔥 Espera REAL a la petición correcta
        cy.wait('@buscarCodigo', { timeout: 20000 })
            .its('response.statusCode')
            .should('eq', 206)

        // 5️⃣ Esperar que la tabla tenga datos
        cy.get('.mat-row .cdk-column-code', { timeout: 20000 })
            .should('have.length.greaterThan', 0)
            .first()
            .click({ force: true });
    }


    //Filtro, Buscar por Regla
    /*BuscarRegistroRegla(correlativo, Regla) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Regla" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Regla')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar código en el input
        cy.xpath("//button[.//span[normalize-space()='Buscar por']]/following::select[1]", { timeout: 15000 })
            .should('exist')
            .clear()
            .type(Regla);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en el código encontrado en la tabla
        cy.xpath("//table[@role='table']//tr[@role='row'][.//td[count(preceding-sibling::td) =count(//th[contains(translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ','abcdefghijklmnopqrstuvwxyzáéíóúüñ'),'usuario')]/preceding-sibling::th)and contains(translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ','abcdefghijklmnopqrstuvwxyzáéíóúüñ'),"+valor.toLowerCase()+")]]", { timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });
    }*/

    BuscarRegistroRegla(correlativo, nombreRegla) {

        if (!nombreRegla || nombreRegla.trim() === '') {
            cy.log('Regla vacía, búsqueda omitida');
            return;
        }

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 20000 })
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Regla"
        cy.get('.cdk-overlay-pane', { timeout: 20000 })
            .filter(':visible')
            .contains('button, li', /^Regla$/)
            .click({ force: true });

        // 3️⃣ Seleccionar la REGLA (NO el correlativo)
        cy.get('#rulesSpec', { timeout: 20000 })
            .should('exist')
            .select(nombreRegla, { force: true });

        // 4️⃣ Click en BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 20000 })
            .parents('button')
            .click({ force: true });

        // 5️⃣ Validar el correlativo en la tabla
        cy.get('table[role="table"] tbody tr', { timeout: 20000 })
            .contains('td', new RegExp(`^\\s*${correlativo}\\s*$`))
            .parents('tr')
            .should('exist')
            .click({ force: true });
    }




    //Filtro, Buscar por Nombre
    BuscarRegistroNombre(nombre) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Nombre" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Nombre')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar nombre en el input
        cy.get('#name', { timeout: 15000 })
            .should('exist')
            .clear()
            .type(nombre);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en el registro encontrado en la tabla
        cy.get('.mat-row .cdk-column-name', { timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });

    }

    BuscarRegistroNombre2(nombre) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Nombre" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Nombre')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar nombre en el input
        cy.get('#entityName', { timeout: 15000 })
            .should('exist')
            .clear()
            .type(nombre);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en el registro encontrado en la tabla
        cy.get('.mat-row .cdk-column-entityName', { timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });

    }
    //Fitro, Buscar por valor

    BuscarRegistroValor(valor) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Valor" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Valor')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar valor en el input
        cy.get('#value', { timeout: 15000 }) // ⬅️ ajusta si el id es otro
            .should('exist')
            .clear()
            .type(valor);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en el valor encontrado en la tabla
        cy.get('.mat-row .cdk-column-value', { timeout: 15000 }) // ⬅️ ajusta si el nombre difiere
            .first()
            .should('exist')
            .click({ force: true });
    }

    //Filtro, Buscar por Descripcion
    BuscarRegistroDescripcion(descripcion) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Descripción" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Descripción')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar descripción en el input
        cy.get('#description', { timeout: 15000 }) // ⬅️ ajusta si el id es otro
            .should('exist')
            .clear()
            .type(descripcion);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en la descripción encontrada en la tabla
        cy.get('.mat-row .cdk-column-description', { timeout: 15000 }) // ⬅️ ajusta si el nombre difiere
            .first()
            .should('exist')
            .click({ force: true });
    }

    //Filtro, Buscar por Valor
    BuscarPorDivisionGeografica(valor) {

        // 1️⃣ Click en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar "División geográfica" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'División geográfica')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Seleccionar valor en el SELECT real
        cy.get('select#geographicLevel1', { timeout: 15000 })
            .should('exist')
            .select(valor);

        // 4️⃣ Click en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Click en el registro encontrado (columna correcta)
        cy.get('.mat-row .cdk-column-geographicLevel1-name', { timeout: 15000 })
            .contains(valor)
            .should('be.visible')
            .click({ force: true });
    }

    BuscarRegistroUsuarioAC(buscarPor, valor) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Regla" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', buscarPor)
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar código en el input
        cy.xpath("//label[contains(normalize-space(),'"+buscarPor+"')]/following::select[1]", { timeout: 15000 })
            .should('be.visible')
            .select(valor);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en el código encontrado en la tabla
        cy.xpath("//table[@role='table']//tr[@role='row'][.//td[count(preceding-sibling::td) =count(//th[contains(translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ','abcdefghijklmnopqrstuvwxyzáéíóúüñ'),'usuario')]/preceding-sibling::th)and contains(translate(normalize-space(),'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ','abcdefghijklmnopqrstuvwxyzáéíóúüñ'),"+valor.toLowerCase()+")]]", { timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });
    }


    //Filtro, Buscar por Usuario

    BuscarRegistroUsuario(usuario) {

        // 1️⃣ Click en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('be.visible')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Usuario" (este SÍ es un mat-menu)
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .should('be.visible')
            .contains('button, span', 'Usuario')
            .click({ force: true });

        // 3️⃣ Esperar el SELECT real por su LABEL "Usuario"
        cy.contains('label', 'Usuario', { timeout: 15000 })
            .should('be.visible');

        // 4️⃣ Seleccionar el usuario en el <select> REAL
        cy.get('select#user', { timeout: 15000 })
            .should('be.visible')
            .select(usuario);   // 👈 AQUÍ está la clave

        // 5️⃣ Click en la lupa (buscar)
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .parents('button')
            .should('be.visible')
            .click({ force: true });

        // 6️⃣ Click en el registro de la tabla usando el usuario
        cy.get('table', { timeout: 15000 })
            .contains('td', usuario)
            .should('be.visible')
            .click({ force: true });
    }


    BuscarRegistroNivelCajero(nombreNivelCajero) {

        // 1️⃣ Click en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('be.visible')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar "Nombre del nivel de cajero"
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, span', 'Nombre del nivel de cajero')
            .click({ force: true });

        // 3️⃣ Seleccionar en el <select> REAL (SIN CLICK)
        cy.get('select#cashierLevel', { timeout: 15000 })
            .should('be.visible')
            .select(nombreNivelCajero);   // 👈 AQUÍ ESTÁ LA CLAVE

        // 4️⃣ Click en la lupa
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .parents('button')
            .click({ force: true });

        // 5️⃣ Click en el resultado
        cy.get('table', { timeout: 15000 })
            .contains('td', nombreNivelCajero)
            .should('be.visible')
            .click({ force: true });
    }

    //Filto Buscar por Caracteristica
    BuscarRegistroCaracteristica(caracteristica) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Regla" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Característica')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar código en el input
        cy.xpath("//button[.//span[normalize-space()='Buscar por']]/following::select[@id='charspec']", { timeout: 15000 })
            .should('be.visible')
            .select(caracteristica);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en la caracteristica encontrado en la tabla
        cy.xpath("//tr[@role='row'][.//td[contains(@class,'cdk-column-charspec-name')][normalize-space()='" + caracteristica + "']]", { timeout: 15000 })
        .first()
        .should('exist')
        .click({ force: true });

    }

    BuscarRegistroCaracteristicaCombo(caracteristica) {

        if (!caracteristica) return;

        const texto = caracteristica.toLowerCase();

        // 1️⃣ Click en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar "Característica"
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li, span', 'Característica')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Seleccionar la característica (aunque NO esté visible)
        cy.xpath(
            `(//select[@id='characteristicSpec']/option[contains(
            translate(normalize-space(),
            'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
            'abcdefghijklmnopqrstuvwxyzáéíóúüñ'),
            '${texto}'
        )])[1]`,
            { timeout: 15000 }
        )
            .should('exist')
            .then($option => {
                cy.get('#characteristicSpec')
                    .should('exist')
                    .select($option.val());
            });

        // 4️⃣ Click en la lupa
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .parents('button')
            .should('exist')
            .click({ force: true });

        // 5️⃣ Click en el registro encontrado en la tabla ✅ CORRECTO
        cy.xpath(
            `//tr[contains(@class,'mat-row')]
         [.//td[contains(@class,'cdk-column-characteristicSpec-name')]
          [contains(
            translate(normalize-space(),
            'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ',
            'abcdefghijklmnopqrstuvwxyzáéíóúüñ'),
            '${texto}'
          )]]`,
            { timeout: 15000 }
        )
            .should('exist')
            .scrollIntoView()
            .click({ force: true });
    }



    //Filto Buscar por Expresión para definir campo
    BuscarRegistroTipoMensaje(valor) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Regla" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Expresión para definir campo')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar código en el input
        cy.xpath("//button[.//span[normalize-space()='Buscar por']]/following::select[@id='expressionField']", { timeout: 15000 })
            .should('be.visible')
            .type(valor);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en la caracteristica encontrado en la tabla
        cy.xpath("//tr[@role='row'][.//td[contains(@class,'cdk-column-expressionField')][normalize-space()='" + valor + "']]",{ timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });

    }


    BuscarRegistroValorNumerico(valorNumerico) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Valor Numérico"
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Valor Numérico')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar valor numérico en el input
        cy.get('#numericValue', { timeout: 15000 }) // ⚠️ ajusta el ID si es distinto
            .should('exist')
            .clear()
            .type(valorNumerico.toString());

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en el registro encontrado en la tabla
        cy.get('.mat-row .cdk-column-numericValue', { timeout: 15000 }) // ⚠️ ajusta columna
            .first()
            .should('exist')
            .click({ force: true });
    }


    //Filto Buscar por Expresión para definir campo
    BuscarRegistroExpresionCampo(valor) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Expresión para definir campo" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Expresión para definir campo')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar código en el input
        cy.get('#expressionField', { timeout: 15000 })   // 👈 cambia el ID si es distinto
            .should('exist')
            .clear()
            .type(valor);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en la caracteristica encontrado en la tabla
        cy.xpath("//tr[@role='row'][.//td[contains(@class,'cdk-column-expressionField')][normalize-space()='" + valor + "']]",{ timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });

    }


    //Filto Buscar por Tipo de Mensaje
    BuscarRegistroTipoMensaje(tipoMensaje) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Regla" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Tipo de mensaje')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar código en el input
        cy.xpath("//button[.//span[normalize-space()='Buscar por']]/following::select[@id='typeMessage']", { timeout: 15000 })
            .should('be.visible')
            .select(tipoMensaje);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en la caracteristica encontrado en la tabla
        cy.xpath("//tr[@role='row'][.//td[contains(@class,'cdk-column-typeMessage')][normalize-space()='" + tipoMensaje + "']]",{ timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });

    }


    //Filtro, Buscar por Correlativo
    BuscarRegistroCorrelativo(correlativo) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Correlativo" del menú
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Correlativo')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Ingresar correlativo en el input
        cy.get('#correlative, #corrCharactRequestAuth', { timeout: 15000 })   // 👈 cambia el ID si es distinto
            .should('exist')
            .clear()
            .type(correlativo);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en el correlativo encontrado en la tabla
        cy.get('.mat-row .cdk-column-correlative, .mat-row .cdk-column-corrCharactRequestAuth', { timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });
    }


    //Filtro, Buscar por tipo de cajero
    BuscarRegistroTipoCajero(tipoCajero) {

        if (!tipoCajero || tipoCajero.toString().trim() === '') {
            cy.log('Tipo de Cajero vacío, búsqueda omitida');
            return;
        }

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Tipo Cajero"
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Tipo de cajero')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Seleccionar tipo de cajero en el combo
        cy.get('#typeCashier', { timeout: 15000 })
            .should('exist')
            .select(tipoCajero);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en el resultado encontrado
        cy.get('.mat-row .cdk-column-typeCashier-description', { timeout: 15000 })
            .first()
            .should('exist')
            .click({ force: true });
    }


    //Filto Buscar por Arbol Raiz
    BuscarRegistroArbolRiaz(){
        cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('#treeRoot').should("be.visible").select("Byte S.A. (Raiz)")
        cy.wait(1000)
        cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-row > .cdk-column-treeRoot-name').should("be.visible").click({force:true})
        cy.wait(1000)
    }

    BuscarRegistroPais(pais) {

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "País"
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'País')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Seleccionar país en el combo
        cy.get('select#country', { timeout: 15000 })
            .should('exist')
            .select(pais);

        // 4️⃣ Clic en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Clic en la fila de la tabla por el texto del país
        cy.get('.mat-row', { timeout: 15000 })
            .contains('td', pais)
            .should('exist')
            .parents('.mat-row')
            .click({ force: true });
    }

    BuscarRegistroTipoRutina(tipoRutina) {

        if (!tipoRutina || tipoRutina.toString().trim() === '') {
            cy.log('Tipo de Rutina vacío, búsqueda omitida');
            return;
        }

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .closest('button')
            .click({ force: true });

        // 2️⃣ Seleccionar "Tipo de rutina"
        cy.contains('button, .mat-menu-item, li', 'Tipo de rutina', { timeout: 15000 })
            .should('exist')
            .click({ force: true });

        // 3️⃣ Select HTML
        cy.get('#typeRoutine', { timeout: 15000 })
            .should('exist')
            .select(tipoRutina);

        // 4️⃣ Buscar
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .closest('button')
            .click({ force: true });

        // 5️⃣ Click en la fila del resultado
        cy.contains('.mat-row td', tipoRutina, { timeout: 15000 })
            .closest('.mat-row')
            .click({ force: true });
    }

    BuscarRegistroTipoFormato(tipoFormato) {

        if (!tipoFormato || tipoFormato.toString().trim() === '') {
            cy.log('Tipo de Formato vacío, búsqueda omitida');
            return;
        }

        // 1️⃣ Clic en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Tipo de Formato"
        cy.get('.cdk-overlay-pane', { timeout: 15000 })
            .contains('button, li', 'Tipo de Formato')
            .should('exist')
            .click({ force: true });

        // 3️⃣ Seleccionar tipo de formato
        cy.get('#formatType', { timeout: 15000 }) // 👈 ESTE ID SÍ EXISTE
            .should('exist')
            .select(tipoFormato);

        // 4️⃣ Click en icono BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });

        // 5️⃣ Click en el resultado (columna REAL)
        cy.get('.mat-row .cdk-column-formatType', { timeout: 15000 })
            .first()
            .should('be.visible')
            .click({ force: true });
    }




    //Modificar
    BtnModificarRegistro(){
        cy.log('Clic en botón EDITAR');

        cy.contains('mat-icon', 'edit', { timeout: 15000 })
            .parents('button')
            .should('exist')
            .click({ force: true });
    }

    //Eliminar
    EliminarRegistro(){
        cy.log('Clic en botón ELIMINAR');

        // 1️⃣ Clic en ícono ELIMINAR
        cy.contains('mat-icon', 'delete', { timeout: 15000 })
            .parents('button')
            .should('exist')
            .click({ force: true });

        // 2️⃣ Confirmar eliminación (botón Eliminar)
        cy.contains('span.mat-button-wrapper', 'Eliminar', { timeout: 15000 })
            .parents('button')
            .should('exist')
            .click({ force: true });

        cy.wait(1000)
    }

    //Navegacion a SubMenus

    NavegacionSubMenu(opcion) {

        // 1️⃣ Abrir menú
        cy.contains('mat-icon', 'menu_open', { timeout: 15000 })
            .parents('button')
            .should('exist')
            .click({ force: true });

        // 2️⃣ Clic en opción del submenú (li)
        cy.contains('li', opcion, { timeout: 15000 })
            .should('be.visible')
            .click({ force: true });
    }

    BuscarRegistroProceso(proceso) {

        if (!proceso || proceso.toString().trim() === '') {
            cy.log('Proceso vacío, búsqueda omitida');
            return;
        }

        // 1️⃣ Click en "Buscar por"
        cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
            .should('exist')
            .closest('button')
            .click({ force: true });

        // 2️⃣ Seleccionar opción "Proceso" del mat-menu
        cy.get('body', { timeout: 15000 }).then($body => {

            if ($body.find('.cdk-overlay-pane').length > 0) {

                cy.get('.cdk-overlay-pane')
                    .last()
                    .within(() => {
                        cy.contains('button, .mat-menu-item', 'Proceso')
                            .should('exist')
                            .click({ force: true });
                    });

            } else {
                throw new Error('No se desplegó el menú "Buscar por"');
            }
        });

        // 3️⃣ Seleccionar Proceso (select HTML nativo)
        cy.get('#process', { timeout: 15000 })
            .should('exist')
            .should('not.be.disabled')
            .select(proceso);

        // 4️⃣ Click en BUSCAR
        cy.contains('mat-icon', 'search', { timeout: 15000 })
            .closest('button')
            .should('exist')
            .click({ force: true });

        // 5️⃣ Click en la fila del resultado (columna Proceso)
        cy.contains(
            '.mat-row td, .mat-row .cdk-column-process',
            proceso,
            { timeout: 15000 }
        )
            .should('exist')
            .closest('.mat-row')
            .click({ force: true });
    }



    //Regredar

    Regresar(){
        cy.contains('mat-icon', 'arrow_back', { timeout: 15000 })
            .should('exist')
            .parents('button')
            .click({ force: true });
    }

    //Seleccionar Memu

    SelectMenuOpcion(texto) {
        cy.log(`Clic en menú: ${texto}`);

        cy.contains('.mat-list-item-content', texto, { timeout: 15000 })
            .filter(":visible:not([disabled])")
            .first()
            .scrollIntoView()
            .should("be.visible")
            .click({ force: true });
    }

    IrAPantalla(ruta) {
        cy.log(`Navegando a: #/${ruta}`);
        cy.window().then(win => {
            win.location.hash = `#/${ruta}`;
            cy.wait(2000)
        });
    }


    Login(URL, Usuario, Password) {
        //visitamos la pagina indicada en cypress.config.js
        cy.visit(URL);
        cy.wait(4500)
        //buesca en el cuerpo de la pagina si aparece el selector
        cy.get('body').then(($body) => {
            if ($body.find('#kc-login').length > 0) {

                cy.log('Se encontró el texto, ejecutando login');
                //validando campo usuario
                cy.get("label").then(($label) => {
                       // if ($label.text().includes("Usuario o email")) {
                        if ($label.text().includes("Usuario")) {
                            cy.get("input").eq(0).should("be.visible").type(Usuario);
                        } else {
                            // Si el label no contiene el texto esperado, muestra un log
                            console.log("El label no tiene el texto esperado.");
                            cy.log("El label no tiene el texto esperado.");
                        }
                    }
                )
                // Validando campo Contraseña
                cy.get("label").then(($label) => {
                        if ($label.text().includes("Contraseña")) {
                            // Si el texto del label es correcto, llena el campo desde el archivo json
                            cy.get("input").eq(1).should("be.visible").type(Password);
                        } else {
                            // Si el label no contiene el texto esperado, muestra un log
                            console.log("El label no tiene el texto esperado.");
                            cy.log("El label no tiene el texto esperado.");
                        }
                    }
                )
                // Hacer clic en el botón de login
                cy.get("#kc-login").should("be.visible").click({ force: true });
                cy.wait(2000);
            } else {
                cy.log('Ya estás logeado.');
            }
        })
        cy.wait(1500)
    }





}

export default MetodosGeneralesPomCy;