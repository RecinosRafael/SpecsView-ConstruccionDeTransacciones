
class CobranzasColectoresCy{

    //Inicio Categoria de servivio


    CategoriaServicio(codigo, nombre, descripcion, secuencia){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)
        cy.get("#sequence").should("be.visible").clear().type(secuencia)
    }
    //Fin Categoria de servivio


    //Inicio subnivel Colectores

    Colectores(codigo, nombre, descripcion, secuencia){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)
        cy.get("#sequence").should("be.visible").clear().type(secuencia)

    }

    //Final subnivel Colectores



    //Inicio Categoria de servicios

    PagoServicios(codigo, nombre, descripcion, valorCateServicio, valorMoneda, valorColectorServio, valorTtipoFlujo, secuencia, codgioAlterno){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        this.seleccionarCombo(valorCateServicio, "Categorias de Servicio");
        this.seleccionarCombo(valorMoneda, "Moneda");
        this.seleccionarCombo(valorColectorServio, "Colector de Servicio");
        this.seleccionarCombo(valorTtipoFlujo, "Tipo de flujo");

        cy.get("#sequence").should("be.visible").clear().type(secuencia)
        cy.get("#codeAlternate").should("be.visible").clear().type(codgioAlterno)

    }



    //Fin Categoria de servicios

    //Inicio subnivel atrivutos
    Atributos(codigo, nombre, etiqueta, valorTipo, tamanioMinimo, tamanioMaximo, tamanioEnvio, secuencia, mascara, ejemplo, valorMoneda){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#label").should("be.visible").clear().type(etiqueta)

        this.seleccionarCombo(valorTipo, "Tipo");

        cy.get("#minLength").should("be.visible").clear().type(tamanioMinimo)
        cy.get("#maxLength").should("be.visible").clear().type(tamanioMaximo)
        cy.get("#lengthSend").should("be.visible").clear().type(tamanioEnvio)
        cy.get("#sequence").should("be.visible").clear().type(secuencia)
        cy.get("#mask").should("be.visible").clear().type(mascara)
        cy.get("#example").should("be.visible").clear().type(ejemplo)

        this.seleccionarCombo(valorMoneda, "Moneda")

    }

    Valores(codigo, etiqueta, valor, secuencia){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#label").should("be.visible").clear().type(etiqueta)
        cy.get("#value").should("be.visible").clear().type(valor)
        cy.get("#sequence").should("be.visible").clear().type(secuencia)

    }

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

        // 1️⃣ Abrir mat-select (forzando UN solo elemento)
        cy.xpath(
            `//label[.//*[contains(normalize-space(),'${xpath}')]]/ancestor::mat-form-field//mat-select`,
            { timeout: 20000 }
        )
            .filter(':visible')     // 🔥 elimina ocultos
            .should('have.length.at.least', 1)
            .first()                // 🔥 garantiza 1 solo
            .scrollIntoView()
            .click({ force: true });

        // 2️⃣ Seleccionar opción del overlay activo
        cy.get('.cdk-overlay-pane', { timeout: 20000 })
            .filter(':visible')
            .find('mat-option span')
            .contains(new RegExp(textoValor, 'i'))
            .should('exist')
            .scrollIntoView()
            .click({ force: true });
    }



}

export default CobranzasColectoresCy;

