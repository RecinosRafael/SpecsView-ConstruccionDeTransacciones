require("cypress-xpath");

class VisitaSpectsView{

    VisitaSpectsView(){
        before(() => {

            //con sertificado server 14.30
            cy.visit("http://172.16.14.30:30010/specs-view");        

            //con sertificado server 108
            //cy.visit("https://keycloak.bytesw.cloud:30001/specs-view/#/");        

            //con sertificado server 21:10
            //cy.visit("http://172.16.21.10:30001/specs-view");
    
            //Sin sertificado
            //cy.visit("http://172.16.10.109:30001/specs-view")
    
          //  cy.title().should('eq', 'Inicia sesión en jteller');
            cy.wait(1500);
        })
    }

    //Inicio de Metodos Generales 

        //Boton para agregar registros 
        BtnAgregarRegistro(){
            cy.xpath("//mat-icon[contains(text(),'add')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        //Boton para confirmar el agregar y modificar registros
        BtnAceptarRegistro(){
            cy.contains('button', 'Aceptar').click({force:true})
            cy.wait(1000)
        }   

        //Filtro, Buscar por codigo 
        BuscarRegistroCodigo(codigo){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(2000)
            cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
            cy.wait(2000)
            cy.get("#code").should("be.visible").type(codigo)
            cy.wait(2000)
            cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
            cy.wait(2000)
            cy.get('.mat-row > .cdk-column-code').should("be.visible").click({force:true})
            cy.wait(2000)
         }

         //Filtro, Buscar por Nombre 
         BuscarRegristroNombre(nombre){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > .mat-focus-indicator').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#name').should("be.visible").type(nombre)
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('tbody > :nth-child(1) > .cdk-column-name').should("be.visible").click({force:true})
            cy.wait(1000)
        }

        //Filtro, Buscar por Descripcion  
        BuscarRegristroDescripcion(descripcion){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(3)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('#description').should("be.visible").type(descripcion)
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('tbody > :nth-child(1) > .cdk-column-description').should("be.visible").click({force:true})
            cy.wait(1000)
        }

         //Filtro, Buscar por tipo de cajero  
         BuscarRegristroTipoCajero(){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.is-empty > #typeCashier').should("be.visible").select('Cajero Byte SA')
            cy.wait(1000)
            cy.xpath("//mat-icon[contains(text(),'search')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-typeCashier-description').should("be.visible").click({force:true})
            cy.wait(1000)
        }

        //Filtro, Buscar por correlativo 

        BuscarRegistroCorrelativo(correlativo){
            cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-menu-content > .mat-focus-indicator').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get("#correlative").should("be.visible").type(correlativo)
            cy.wait(1000)
            cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
            cy.wait(1000)
            cy.get('.mat-row > .cdk-column-correlative').should("be.visible").click({force:true})
            cy.wait(1000)
         }


         //Modificar 
         BtnModificarRegistro(){
            cy.xpath("//mat-icon[contains(text(),'edit')]").should("be.visible").click({force:true})
            cy.wait(2000)
         }

        //Eliminar
        EliminarRegistro(){
            cy.contains('mat-icon', 'delete').click({force:true});
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Eliminar')]").should("be.visible").click({force:true})
            cy.wait(3000)
         }
        
         //Eliminar
        EliminarRegistroSinConf(){
            cy.contains('mat-icon', 'delete').click({force:true});
            cy.wait(2000)
 }

        //Regredar 

        Regresar(){
            cy.get('.back').should("be.visible").click({force:true})
            cy.wait(1000)
        }

    //Final de Metodos Generales 

    Login(username, password){
        cy.get("#username").should("be.visible").type(username);
            cy.get("#password").should("be.visible").type(password);
            cy.get("#kc-login").should("be.visible").click({ force: true });
            cy.wait(5000);

    }

    SelectMenu(){
        cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav[1]/div[1]/div[1]/span[2]/mat-nav-list[1]/a[1]").should("be.visible").click({force:true})
        cy.wait(1000)
    }


    //Inicio Digito Verficador

    SelectOpcDigitoVerificador(){
        cy.xpath("//a[@id='checkDigit']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    DigitoVerificador(codigo, descripcion, moduloVeridicador){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        if(moduloVeridicador == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-checkdigit[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Módulo 10')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        cy.get('#weightVerifier12').should("be.visible").scrollIntoView()

    }

    //Fin Digito Verficador


    //Inicio Tipo de evento

    SelectOPcTipoEvento(){
        cy.xpath("//a[@id='eventType']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    TipoEvento(codigo, nombre, descripcion){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }

    //Fin Tipo de evento

    //Inicio Indicador

    SelectOpcIndicador(){
        cy.xpath("//a[@id='indicator']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    Indicador(codigo, nombre, descripcion){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }

    //Fin Indicador

    //Inicio Tipo de transaccion
    
    SelectOpcTipoTransaccion(){
        cy.xpath("//a[@id='transactionType']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    TipoTransaccion(codigo, nombre, descripcion, accionFinanciera, comportamiento){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        if(accionFinanciera == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-type[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(100)
            cy.xpath("//span[contains(text(),'No Aplica')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{
            // cy.xpath("").should("be.visible").click({force:true})
            // cy.wait(100)
            // cy.xpath("").should("be.visible").click({force:true})
            // cy.wait(1000)
        }

        if(comportamiento == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-type[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[5]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(100)
            cy.xpath("//span[contains(text(),'Normal')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{
            // cy.xpath("").should("be.visible").click({force:true})
            // cy.wait(100)
            // cy.xpath("").should("be.visible").click({force:true})
            // cy.wait(1000)
        }

    }

    //Fin Tipo de transaccion

    //Inicio Habilitar Campos adicionales a Entidad

    SelectOpcHabilCamAdicioEntidad(){
        cy.xpath("//a[@id='entityFields']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

 ConfifurarCamposAdicionalesEntidad(entidad, caracteristica, tipo, campoReferencia, descripcion){

        if(entidad == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-configure-entities-fields[1]/div[1]/app-form-configure-entities-fields[1]/div[2]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Árbol organizacional')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{
            // cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-configure-entities-fields[1]/div[1]/app-form-configure-entities-fields[1]/div[2]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            // cy.wait(1000)
            // cy.xpath("").should("be.visible").click({force:true})
            // cy.wait(1000)
        }

        if(caracteristica == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-configure-entities-fields[1]/div[1]/app-form-configure-entities-fields[1]/div[2]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Campo 2')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{
            // cy.xpath("").should("be.visible").click({force:true})
            // cy.wait(1000)
            // cy.xpath("").should("be.visible").click({force:true})
            // cy.wait(1000)
        }

        if(tipo == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-configure-entities-fields[1]/div[1]/app-form-configure-entities-fields[1]/div[2]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Journal de Jteller')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{
            // cy.xpath("").should("be.visible").click({force:true})
            // cy.wait(1000)
            // cy.xpath("").should("be.visible").click({force:true})
            // cy.wait(1000)
        }

        cy.get('[formcontrolname="refField"]').should("be.visible").clear().type(campoReferencia) 
        cy.get('[formcontrolname="description"]').should("be.visible").clear().type(descripcion)


    }

    EntrarConfifurarCamposAdicionalesEntidad(){
        cy.contains('td', 'Campo 2').click({force:true})
    }

    //Fin Habilitar Campos adicionales a Entidad

    //Inicio Tipo de dato

    SelectOpcTipoDato(){
        cy.xpath("//a[@id='dataType']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    TipoDato(codigo, nombre, descripcion){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }

    //Fin Tipo de dato

    //Inicio Formato

    SelectOpcFormato(){
        cy.xpath("//a[@id='format']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    Formato(codigo, nombre, nombreAbreviado, descripcion, numeroLineas, plantilla, extencion, datosTachados, incluirImagen, posicion, tamanioImagen, paraCatalogos, codigoPlantillAlternativa, poscEtiquetaComprobante){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#shortName").should("be.visible").clear().type(nombreAbreviado)
        cy.get("#description").should("be.visible").clear().type(descripcion)
        cy.get("#numberLines").should("be.visible").clear().type(numeroLineas)
        cy.get("#templateId").should("be.visible").clear().type(plantilla)
        cy.get("#extension").should("be.visible").clear().type(extencion)

        if(datosTachados == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-format[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[8]/mat-form-field[1]/div[1]/div[1]/div[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'No aplica')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }

        if(incluirImagen == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-format[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[9]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'No aplicar')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{
            
        }

        cy.get("#position").should("be.visible").clear().type(posicion)
        cy.get("#imageSize").should("be.visible").clear().type(tamanioImagen)

        if(paraCatalogos == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-format[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[12]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Generar código')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{
            
        }

        cy.get("#alternateTemplateCode").should("be.visible").clear().type(posicion)
        cy.get("#labelPosition").should("be.visible").clear().type(tamanioImagen)

    }

    //Fin Formato
    
    //Inicio Subnivel Opciones Detalle de Formato

    NavegarDetalleFormato(){
        cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
        cy.wait(1000)
        cy.xpath("//li[contains(text(),'Detalle de Formato')]").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    DetalleDormato(coorrelativo, descripcion, tipoDato, leerPosicionInicial, leerTamanioDatos, imprimirFila, imprimirTamanioDatos){

         cy.get("#correlative").should("be.visible").clear().type(coorrelativo)
         cy.get("#description").should("be.visible").clear().type(descripcion)

         if(tipoDato == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-format[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Autorización 2 de Transacción')]").should("be.visible").click({force:true})
            cy.wait(1000)
         }else{

         }
         cy.get("#readInitPosition").should("be.visible").scrollIntoView()

         cy.get("#readInitPosition").should("be.visible").clear().type(leerPosicionInicial)
         cy.get("#readLenData").should("be.visible").clear().type(leerTamanioDatos)
         cy.get("#printInRow").should("be.visible").clear().type(imprimirFila)
         cy.get("#printLenData").should("be.visible").clear().type(imprimirTamanioDatos)

    }


    //Fin Subnivel Opciones Detalle de Formato


      //Inicio Tipo de rutina

      SelectOpcTipoRutina(){
        cy.xpath("//a[@id='type-routine']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    TipoRutina(codigo, nombre, descripcion){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }

    //Fin Tipo de rutina

       //Inicio Tipo de rutina

       SelectOpcRutina(){
        cy.xpath("//a[@id='type-routine']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        cy.xpath("//a[@id='routine']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    Rutina(codigo, nombre, endpoin, tipoRutina, capaEjecucion, tipoOperacion, esLogin, ){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#beanRoutine").should("be.visible").clear().type(endpoin)

        if(tipoRutina == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-routine[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[5]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should('be.visible').click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Consultas')]").should('be.visible').click({force:true})
            cy.wait(1000)
        }else{

        }

        if(capaEjecucion == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-routine[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[6]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should('be.visible').click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'BackEnd')]").should('be.visible').click({force:true})
            cy.wait(1000)
        }else{
            
        }

        cy.get("#description").should("be.visible").scrollIntoView()

        if(tipoOperacion == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-routine[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[9]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should('be.visible').click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'GET')]").should('be.visible').click({force:true})
            cy.wait(1000)
        }else{
            
        }

        if(esLogin == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-routine[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[10]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should('be.visible').click({force:true})
            cy.wait(1000)
            cy.xpath("//body/div[3]/div[2]/div[1]/div[1]/div[1]/mat-option[1]/span[1]").should('be.visible').click({force:true})
            cy.wait(1000)
        }else{
            
        }



    }

    //Fin Tipo de rutina


    //Inicio Estructura de Datos

    SelectOpcEstructuraDatos(){
        cy.xpath("//a[@id='type-routine']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        cy.xpath("//a[@id='dataFrame']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    EstructuraDatos(codigo, nombre, descripcion){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }

    //Fin Estructura de Datos

    //Inicio Estructura de Datos subinivel Detalle 

    NavegarDetalle(){
        cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
        cy.wait(1000)
        cy.xpath("//li[contains(text(),'Detalle')]").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    Detalle(coorrelativo, descripcion, tipoDato, posicionInicial, longitud, especicaCaracteristica){

        cy.get("#correlative").should("be.visible").clear().type(coorrelativo)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        if(tipoDato == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-data-frame[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Alfanumérico')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }

        cy.get("#initialPosition").should("be.visible").clear().type(posicionInicial)
        cy.get("#length").should("be.visible").clear().type(longitud)

        if(especicaCaracteristica == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-data-frame[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[6]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Referencia No')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{
            
        }

    }

    BuscarRegistroDetalle(coorrelativo){
        cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-menu-content > .mat-focus-indicator').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get("#correlative").should("be.visible").type(coorrelativo)
        cy.wait(1000)
        cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-row > .cdk-column-correlative').should("be.visible").click({force:true})
        cy.wait(1000)
     }

    //Fin Estructura de Datos subinivel Detalle 

    //Inicio Medios de notificación


    SelectOpcMediosNotificacion(){
        cy.xpath("//a[@id='type-routine']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        cy.xpath("//a[@id='meansNotification']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    MediosNotificacion(codigo, nombre, descripcion){
        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }

    //Fin Medios de notificación

    //Inicio Envio de transacciones

    SelectOpcEnvioTransacciones(){
        cy.xpath("//a[@id='type-routine']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        cy.xpath("//a[@id='transactionSendSpec']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    EnvioTransacciones(correlativo, descripcion, requiereLogin, tipoDatoEnvio, endpointEnvio, tipoDatoRecibido, analizarRespuesta){
        cy.get("#correlative").should("be.visible").clear().type(correlativo)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        if(requiereLogin == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-send-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[5]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'No')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }

        if(tipoDatoEnvio == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-send-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[9]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'TRAMA')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }

        if(endpointEnvio == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-send-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[10]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Cambiar Responsable de Boveda')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }

        if(tipoDatoRecibido == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-send-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[11]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'JSON')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }

        if(analizarRespuesta == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-transaction-send-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[14]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Sí')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }

    }

    //Inicio Envio de transacciones

    //Inicio Reglas

    SelectOpcReglas(){
        cy.xpath("//a[@id='type-routine']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        cy.xpath("//a[@id='rulesSpec']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    Reglas(codigo, nombre, descripcion, desde){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        if(desde == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-rules-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[5]/mat-form-field[1]/div[1]/div[1]/div[2]/mat-datepicker-toggle[1]/button[1]/span[1]/*[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//div[contains(text(),'19')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }
        

    }

   

    //Fin Reglas 

    //Inicio Sbnivel Detalle

    ReglasDetalle(correlativo, expresion1){
        cy.get("#correlative").should("be.visible").clear().type(correlativo)
        cy.get("#expression1").should("be.visible").clear().type(expresion1)
    }


    BuscarRegistroDetalleCorrelativo(correlativo){
        cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-menu-content > :nth-child(1)').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get("#correlative").should("be.visible").type(correlativo)
        cy.wait(1000)
        cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-row > .cdk-column-correlative').should("be.visible").click({force:true})
        cy.wait(1000)
     }

    //Fin Sbnivel Detalle

    //Inicio Accion  

    SelectOpcAccion(){
        cy.xpath("//a[@id='type-routine']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        cy.xpath("//a[@id='action']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    Accion(codigo, nombre, descripcion, tipoAccion){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)
       // cy.get("#beanRunTime").should("be.visible").clear().type(programaEjecucion)
        //cy.get("#beanSpecAction").should("be.visible").clear().type(progrmaEspecificaion)

        if(tipoAccion == 'i'){
            cy.get("#typeAction").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Solicitar autorización')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }


    }

    BuscarRegistroAccion(codigo){
        cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-menu-content > :nth-child(2)').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get("#code").should("be.visible").type(codigo)
        cy.wait(1000)
        cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-row > .cdk-column-code').should("be.visible").click({force:true})
        cy.wait(1000)
     }


    //Inicio Accion 

    //Inicio Acciones Condicionadas

    SelectOpcAccionesCondicionadas(){
        cy.xpath("//a[@id='type-routine']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        cy.xpath("//a[@id='rulesSpec']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        cy.xpath("//a[@id='conditionedActions']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    AccionesCondicionadas(transaccion, correlativo, regla, accion, descripcion){

        if(transaccion == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Aperturar Saldos de Cajero')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }

        cy.get("#correlative").should("be.visible").clear().type(correlativo)

        if(regla == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Clave cuando no se cobra comisión')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }

        if(accion == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Cambiar atributos de campo')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }

        cy.get("#description").should("be.visible").clear().type(descripcion)

    }


    BuscarRegistroAccionesCondicionadas(){
        cy.xpath("//span[contains(text(),'Buscar por')]").should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('.mat-menu-content > :nth-child(2)').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('#action').should("be.visible").select("Cambiar atributos de campo")
        cy.wait(1000)
        cy.get('[aria-label="Click to search"]').should("be.visible").click({force:true})
        cy.wait(1000)
        cy.get('tbody > :nth-child(1) > .cdk-column-correlative').should("be.visible").click({force:true})
        cy.wait(1000)
     }

        //Inicio Suibnivel Transacciones asociadas condicionadas

        NavergarTransaccionesAsociadasCondicionadas(){
            cy.xpath("ransacciones asociadas condicionadas").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//li[contains(text(),'Transacciones asociadas condicionadas')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        TransaccionesAsociadasCondicionadas(transaccionAsociada, correlativo, tipoAsociacion, tipoAccion, descripcion, permiteCanacelacion, modoInverso){

            if(transaccionAsociada == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'ASIGNAR TOTALES DELEGACION TEMPORAL')]").should("be.visible").click({force:true})
                cy.wait(1000) 

            }else{

            }

            cy.get("#correlative").should("be.visible").clear().type(correlativo)

            if(tipoAsociacion == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Normal')]").should("be.visible").click({force:true})
                cy.wait(1000) 

            }else{

            }

            if(tipoAccion == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Regresar y Salir')]").should("be.visible").click({force:true})
                cy.wait(1000) 

            }else{

            }

            cy.get("#description").should("be.visible").clear().type(descripcion)

            if(permiteCanacelacion == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[8]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'No permite')]").should("be.visible").click({force:true})
                cy.wait(1000) 

            }else{

            }

            if(modoInverso == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-conditioned-spec[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[9]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//body/div[3]/div[2]/div[1]/div[1]/div[1]/mat-option[2]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000) 

            }else{

            }


        }

        //Fin Suibnivel Transacciones asociadas condicionadas


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



        //Fin Cambiar Atributos de Campo


    //Fin Acciones Condicionadas



    //Inicio Valor Global 

    SelectOpcValorGlobal(){
        cy.xpath("//a[@id='format']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        // cy.xpath("//a[@id='rulesSpec']").should("be.visible").scrollIntoView()
        // cy.wait(1000)
        cy.xpath("//a[@id='globalValues']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    ValorGlobal(codigo, tipo, longitud, descripcion){
        cy.get("#code").should("be.visible").clear().type(codigo)

        if(tipo == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-global-values[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Alfanumérico')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }

        cy.get("#length").should("be.visible").clear().type(longitud)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }

    //Fin Valor Global 

    //Inico subnivel Valores Globales 

    NavergarValoresGlobales(){
        cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
        cy.wait(1000)
        cy.xpath("//li[contains(text(),'Valores Globales')]").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    ValoresGlobales(arbol, Valor){

        if(arbol == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-global-values[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Byte S.A. (Raiz)')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }

        cy.get("#value").should("be.visible").clear().type(Valor)

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
    y
    
    //Inicio Parametros Generales 
    
    SelectOpcParametrosGenerales(){
        cy.xpath("//a[@id='format']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        // cy.xpath("//a[@id='rulesSpec']").should("be.visible").scrollIntoView()
        // cy.wait(1000)
        cy.xpath("//a[@id='generalParameters']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    ParametrosGenerales(nombreEmpresa, monedaBase, arbolPadre, ramaArbol, cantidadVeces, caracteresPermitidos, longitudMinima, creditoLibreta, debitosLibreta, dia, mes, anio){

        cy.get("#name").should("be.visible").clear().type(nombreEmpresa)

        if(monedaBase == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-general-parameters[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[2]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(100)
            cy.xpath("//span[contains(text(),'Quetzal')]").should("be.visible").click({force:true})
            cy.wait(100)
        }else{

        }

        if(arbolPadre == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-general-parameters[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(100)
            cy.xpath("//span[contains(text(),'Byte S.A. (Raiz)')]").should("be.visible").click({force:true})
            cy.wait(200)

        }else{

        }

        if(ramaArbol == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-general-parameters[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(100)
            cy.xpath("//span[contains(text(),'Agencia rural')]").should("be.visible").click({force:true})
            cy.wait(100)

        }else{

        }

        cy.get("#sometimesRecyclePassword").should("be.visible").clear().type(cantidadVeces)

        if(caracteresPermitidos == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-general-parameters[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[6]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(100)
            cy.xpath("//span[contains(text(),'Alfanumérico')]").should("be.visible").click({force:true})
            cy.wait(100)

        }else{

        }


        cy.get("#minimunLength").should("be.visible").clear().type(longitudMinima)
        cy.get("#creditNotebook").should("be.visible").clear().type(creditoLibreta)
        cy.get("#debitNotebook").should("be.visible").clear().type(creditoLibreta)
        cy.get("#day").should("be.visible").clear().type(dia).scrollIntoView()
        cy.get("#month").should("be.visible").clear().type(mes)
        cy.get("#year").should("be.visible").clear().type(anio)


        

    }

    //Fin Parametros Generales

    //Inicio mensaje de error 

    SelectOpcMensajesError(){
        cy.xpath("//a[@id='format']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        cy.xpath("//a[@id='rulesSpec']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        cy.xpath("//a[@id='errorMessage']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    MensajesError(codigo, mensajeError, descripcion, tipoMensaje, accion){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#message").should("be.visible").clear().type(mensajeError)
        cy.get("#description").should("be.visible").clear().type(descripcion)

        if(tipoMensaje == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-error-message[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[4]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Alerta')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }

        if(accion == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-error-message[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[5]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Salir del flujo de transacción')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }
        

    }

    //Fin mensaje de error


    //Inicio Submenu

    SelectOpcSubmenu(){
        cy.xpath("//a[@id='format']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        cy.xpath("//a[@id='rulesSpec']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        cy.xpath("//a[@id='appSubmenu']").should("be.visible").click({force:true})
        cy.wait(1000)
    }
    
    Submenu(codigo, nombre, descripcion, url, tipoAplicacion){

        cy.get("#code").should("be.visible").clear().type(codigo)
        cy.get("#name").should("be.visible").clear().type(nombre)
        cy.get("#description").should("be.visible").clear().type(descripcion)
        cy.get("#url").should("be.visible").clear().type(url)

        if(tipoAplicacion == 'i'){
            cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/applications-submenu[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[5]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//span[contains(text(),'Normal')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }else{

        }

    }
    //Fin Submenu


        //Inicio Submenu por nivel cajero

        NavegarSubnivelPorCajero(){
            cy.xpath("//mat-icon[contains(text(),'menu_open')]").should("be.visible").click({force:true})
            cy.wait(1000)
            cy.xpath("//li[contains(text(),'Submenu por nivel cajero')]").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        SubmenuPorNivelCajero(NivelCajero){

            if(NivelCajero == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/applications-submenu[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Cajero Byte SA')]").should("be.visible").click({force:true})
                cy.wait(1000)
            }else{
    
            }

        }

        //Fin Submenu por nivel cajero


        //Inicio Equivalencias


    SelectOpcEquivalencias(){
        cy.xpath("//a[@id='format']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        cy.xpath("//a[@id='rulesSpec']").should("be.visible").scrollIntoView()
        cy.wait(1000)
        cy.xpath("//a[@id='equivalencies']").should("be.visible").click({force:true})
        cy.wait(1000)
    }

    Equivalencias(llave, datosEquivalentes, descripcion){

        cy.get("#keyword").should("be.visible").clear().type(llave)
        cy.get("#equivalentData").should("be.visible").clear().type(datosEquivalentes)
        cy.get("#description").should("be.visible").clear().type(descripcion)

    }
        //Fin Equivalencias

        //Inicio Plantilla de Flujo

        SelectOpcPlantillaFlujo(){
            cy.xpath("//a[@id='format']").should("be.visible").scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='rulesSpec']").should("be.visible").scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='flowTemplate']").should("be.visible").click({force:true})
            cy.wait(1000)
        }

        PlantilaFlujo(nombre, descripcion, estado){

            cy.get("#name").should("be.visible").clear().type(nombre)
            cy.get("#description").should("be.visible").clear().type(descripcion)

            if(estado == 'i'){
                cy.xpath("//body/app-root[1]/app-navigator[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/div[1]/app-flow-template[1]/bt-dynamic-crud[1]/div[1]/div[1]/bt-sub-dynamic-crud[1]/div[1]/mat-drawer-container[1]/mat-drawer-content[1]/bt-crud-overview[1]/form[1]/div[1]/div[3]/mat-form-field[1]/div[1]/div[1]/div[1]/mat-select[1]/div[1]/div[1]/span[1]").should("be.visible").click({force:true})
                cy.wait(1000)
                cy.xpath("//span[contains(text(),'Activo')]").should("be.visible").click({force:true})
                cy.wait(1000)

            }else{

            }

        }

        //Fin Plantilla Flujo


        //Inicio plantilla de comprobante


        SelectOpcPlantillaComprobante(){
            cy.xpath("//a[@id='format']").should("be.visible").scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='rulesSpec']").should("be.visible").scrollIntoView()
            cy.wait(1000)
            cy.xpath("//a[@id='voucherTemplate']").should("be.visible").click({force:true})
            cy.wait(1000)
        }


        PlantillaComprobante(key, nombre, descripcion){
            cy.get("#mat-input-0").should("be.visible").clear().type(key)
            cy.get("#mat-input-1").should("be.visible").clear().type(nombre)
            cy.get("#mat-input-2").should("be.visible").clear().type(descripcion)

        }

        //Fin plantilla de comprobante

}

export default VisitaSpectsView;