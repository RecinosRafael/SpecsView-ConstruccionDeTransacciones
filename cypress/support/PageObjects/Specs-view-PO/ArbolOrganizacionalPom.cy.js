import metodosGeneralesPomCy from "./MetodosGeneralesPom.cy.js";
import 'cypress-xpath';
class ArbolOrganizacionalPom{

    constructor() {
        this.Generales = new metodosGeneralesPomCy();
    }

    ArbolOrganizacional(data){
        this.Generales.llenarCampoIframe(data.codigo, "Código", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.nombre, "Nombre", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.descripcion, "Descripción", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.responsable, "Responsable", { timeout: 10000, skipContext: true })
        this.Generales.seleccionarComboIframe(data.cicloVida, "Ciclo de vida", { timeout: 10000, force: true, skipContext: true })
        this.Generales.seleccionarComboIframe(data.canal, "Canal", { timeout: 10000, skipContext: true })
        this.Generales.IngresarFechaIframe(data.validoDesde, "Válido Desde", { timeout: 10000, skipContext: true })
        this.Generales.IngresarFechaIframe(data.validoHasta, "Válido Hasta", { timeout: 10000, skipContext: true })
        this.Generales.slideToggleIframe(data.tieneUsuariosFinales, "Tiene usuarios finales", { timeout: 10000, skipContext: true })
        if(data.esRaiz){
        this.Generales.slideToggleIframe(data.esRaiz, "Es Raíz", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.tiempoLimite, "Tiempo Límite", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.tipoRama, "Tipo de Rama", { timeout: 10000, skipContext: true, force: true })
        this.Generales.llenarCampoIframe(data.Puesto, "Puesto", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.codigoEquivalente, "Código Equivalente", { timeout: 10000, skipContext: true, force: true})
        this.Generales.llenarCampoIframe(data.nivelEnArbol, "Nivel en árbol [0,1,2,..]", { timeout: 10000, force: true, skipContext: true })//validar si jala con ese texto
        this.Generales.llenarCampoIframe(data.nombreUsuario, "Nombre de usuario", { timeout: 10000, skipContext: true, force: true })
        this.Generales.llenarCampoIframe(data.complementoDireccion, "Complemento de Dirección", { timeout: 10000, skipContext: true })
        this.Generales.seleccionarComboIframe(data.nivelGeografico1, "Nivel Geográfico 1", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.nivelGeografico2, "Nivel Geográfico 2", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.nivelGeografico3, "Nivel Geográfico 3", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.region, "Región", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.latitud, "Latitud", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.longitud, "Longitud", { timeout: 10000, skipContext: true })
        this.Generales.cargarImagen(data.logo, "Logo", { timeout: 10000, skipContext: true, force: true }) //metodo para subir logo pendiente aqui y en gestor
        cy.wait(500)
        }else{
        cy.log("No es raiz")
        this.Generales.seleccionarComboIframe(data.padre, "Padre", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.tipoRama, "Tipo de Rama", { timeout: 10000, skipContext: true, force: true })
        this.Generales.llenarCampoIframe(data.Puesto, "Puesto", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.codigoEquivalente, "Código Equivalente", { timeout: 10000, skipContext: true, force: true})
        this.Generales.llenarCampoIframe(data.nivelEnArbol, "Nivel en árbol [0,1,2,..]", { timeout: 10000, force: true, skipContext: true })//validar si jala con ese texto
        this.Generales.llenarCampoIframe(data.nombreUsuario, "Nombre de usuario", { timeout: 10000, skipContext: true, force: true })
        this.Generales.llenarCampoIframe(data.complementoDireccion, "Complemento de Dirección", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.tiempoLimite, "Tiempo Límite", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.nivelGeografico1, "Nivel Geográfico 1", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.nivelGeografico2, "Nivel Geográfico 2", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.nivelGeografico3, "Nivel Geográfico 3", { timeout: 10000, skipContext: true, force: true })
        this.Generales.seleccionarComboIframe(data.region, "Región", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.latitud, "Latitud", { timeout: 10000, skipContext: true })
        this.Generales.llenarCampoIframe(data.longitud, "Longitud", { timeout: 10000, skipContext: true })

    }
    }

    AsignarTransacciones(data){
        //ingresamos al arbol que deseamos agregar las TX
        this.Generales.IngresarArbol(data.codigosArbol)
        cy.wait(500)
        this.Generales.esperarQueSpinnerDesaparezca()
        cy.wait(500)
        if(data.asignaTodas){
            cy.log("Asignando todas las transacciones")
            this.Generales.BtnIframe('Asignar todos', { timeout: 10000, force: true, skipContext: true });
            this.Generales.IngresarFechaIframe(data.validoDesde, "Valido Desde", { timeout: 10000, skipContext: true, force: true });
            this.Generales.IngresarFechaIframe(data.validoHasta, "Valido Hasta", { timeout: 10000, skipContext: true,  force: true});
            this.Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });

        }else{
            cy.log("Asignando las transacciones", data.transaccionesAsignar)
            this.Generales.AsignarTransacciones(data.transaccionesAsignar)
            this.Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });
            this.Generales.IngresarFechaIframe(data.validoDesde, "Valido Desde", { timeout: 10000, skipContext: true,  force: true });
            this.Generales.IngresarFechaIframe(data.validoHasta, "Valido Hasta", { timeout: 10000, skipContext: true,  force: true });
            this.Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });
        }

    }




}
export default ArbolOrganizacionalPom;


/*

// import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
// import ArbolOrganizacionalPom from "../support/PageObjects/Specs-view-PO/ArbolOrganizacionalPom.cy";
// import 'cypress-xpath';

// const Generales = new metodosGeneralesPomCy()
// const ArbolOrganizacional = new ArbolOrganizacionalPom()


// describe("Prueba unitaria del Crud Gestor de Transacciones ...", () =>{

//     Cypress.on('uncaught:exception',(err,Runnable) =>{
//         return false
//     })

//     //Login y visita al Specs-view
//     before(() => {
//         Generales.Login(
//             Cypress.env('BASE_URL'),
//             Cypress.env('USER'),
//             Cypress.env('PASS')
//         )
//     })

//     beforeEach(() => {
//         Generales.IrAPantalla('organizationTree')
//     })

//     it("Agregar múltiples registros dinámicamente", () => {

    
//         cy.readFile('./JsonData/asignarTransaccionesArbol.json').then((data) => {
//             cy.wrap(item.agregar).each((item) => {
//             //para ocultar el log y no se sature y ponga lenta la prueba
//             cy.then(() => {
//         let  dialogoAparecio = true
//         const doc = window.top.document;
//         // Intentamos con varios selectores que usa Cypress para su log
//         const logContainer = doc.querySelector('.reporter .commands') || 
//                              doc.querySelector('.command-list') ||
//                              doc.querySelector('.runnable-commands-region');
                             
//         if (logContainer) {
//             logContainer.innerHTML = ''; 
//         }
//             });

//             cy.log(`Insertando código: ${item.codigosArbol}`)
    
    
//                 cy.get('iframe.frame', { timeout: 10000 })
//                 .its('0.contentDocument.body')
//                 .should('not.be.empty')
//                 .then(cy.wrap)
//                 .within(() => {

//                     Generales.IngresarArbol(item.codigosArbol)

//                     //ingresamos al arbol que deseamos agregar las TX
//                     Generales.IngresarArbol(data.codigosArbol)
//                     cy.wait(500)
//                     Generales.esperarQueSpinnerDesaparezca()
//                     cy.wait(500)
//                     if(data.asignaTodas){
//                         cy.log("Asignando todas las transacciones")
//                         Generales.BtnIframe('Asignar todos', { timeout: 10000, force: true, skipContext: true });
//                         Generales.IngresarFechaIframe(data.validoDesde, "Valido Desde", { timeout: 10000, skipContext: true, force: true });
//                         Generales.IngresarFechaIframe(data.validoHasta, "Valido Hasta", { timeout: 10000, skipContext: true,  force: true});
//                         Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });
//                         dialogoAparecio
//                     }else{
//                         cy.log("Asignando las transacciones", data.transaccionesAsignar)
//                         Generales.AsignarTransacciones(data.transaccionesAsignar)
//                         Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });
//                         cy.wait(1500) 
//             cy.document().then(doc => {
//             // Buscar el texto con cy.contains dentro del documento
//             cy.wrap(doc).contains('Definición de Fechas', { timeout: 5000 }).then(() => {
//                 cy.log('Definición de Fechas encontrado...');
//                 // ejecutar acciones
//                 Generales.IngresarFechaIframe(data.validoDesde, "Valido Desde", { timeout: 10000, skipContext: true, force: true });
//                 Generales.IngresarFechaIframe(data.validoHasta, "Valido Hasta", { timeout: 10000, skipContext: true, force: true });
//                 Generales.BtnIframe('Aceptar', { timeout: 10000, force: true, skipContext: true });
//             }).catch(() => {
//                 cy.log('No date dialog, transactions already assigned.');
//                 dialogoAparecio = false
//             });
//             });
//         }
    
//                 cy.intercept('POST', '**///transactionsByTreebranch/administrateAll').as('guardar');

//                     if (dialogoAparecio) {
//                             cy.wait('@guardar').then((interception) => {
//                                     const status = interception.response.statusCode
//                                     if (status === 200 || status === 201) {
//                                         cy.log('Registro insertado correctamente')
//                                         // Esperar que el modal desaparezca
//                                         Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
//                                         cy.wait(2000) 

//                                         // Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })

//                                     } else {
//                                         cy.log(`Error detectado. Status: ${status}`)
//                                         Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
//                                         cy.contains('h2', 'Nuevo Registro').should('not.exist')
//                                         // Generales.BtnIframe('Sí', { timeout: 10000, force: true, skipContext: true });

//                                     }
//                                 })
//                             }else{
//                                 //ya estaba asignadas las tx tomar captura aqui 
//                                 Generales.BtnIframe('Atrás', { timeout: 10000, force: true, skipContext: true })
//                             }   
            
//                 })


//             })//aqui termina cada registros
//         })
//     })
  
// })

