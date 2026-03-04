import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import AccionesCondicionadasPomCy from "../support/PageObjects/Specs-view-PO/AccionesCondicionadasPom.cy";

const Generales = new metodosGeneralesPomCy()
const AccionCondicionada = new AccionesCondicionadasPomCy()

describe("Prueba unitaria del submenu del Crud AccionesCondicionadas...", () =>{

    Cypress.on('uncaught:exception',(err,Runnable) =>{
        return false
    })

    //Login y visita al Specs-view
    before(() => {
        Generales.Login(
            Cypress.env('BASE_URL'),
            Cypress.env('USER'),
            Cypress.env('PASS')
        )
        
        cy.fixture('transaccionesAsociadasCondicionadas').as('transaccionesAsociadasCondicionadas')
    })

    beforeEach(() => {
        Generales.IrAPantalla('conditionedActions')
    })

    it("Agregar registros a sub nivel", function () {

        const datos = this.transaccionesAsociadasCondicionadas.agregar
        
        // Agrupar por regla + transacción + un identificador de lote
        // Podemos usar el índice para separar los grupos
        let grupoActual = 0
        let ultimaKey = null

        const agrupadas = datos.reduce((acc, item, index) => {
            const keyBase = `${item.nombreReglaAC}|${item.transaccionAC || 'null'}`
            
            // Si es el primer elemento o cambia la key base, crear nuevo grupo
            if (index === 0 || keyBase !== ultimaKey) {
                grupoActual++
                ultimaKey = keyBase
            }
            
            const keyConLote = `${keyBase}|lote${grupoActual}`
            
            if (!acc[keyConLote]) {
                acc[keyConLote] = {
                    nombreRegla: item.nombreReglaAC,
                    transaccion: item.transaccionAC || null,
                    lote: grupoActual,
                    registros: []
                }
            }
            acc[keyConLote].registros.push(item)
            return acc
        }, {})

        // Iterar sobre las claves del objeto agrupado
        cy.wrap(Object.keys(agrupadas)).each((key) => {
            const grupo = agrupadas[key]
            
            cy.log(`🔄 Procesando Regla: "${grupo.nombreRegla}", Transacción: "${grupo.transaccion || 'vacía'}"`)

            // 🔎 Buscar por Regla y Transacción (CORREGIDO: usar grupo, no item)
            Generales.BuscarRegistroEnTabla([
                { columna: 'Regla', valor: grupo.nombreRegla },
                { columna: 'Transacción', valor: grupo.transaccion || '' }
            ])
            
            // Navegar al submenú
            Generales.NavegacionSubMenu('Transacciones asociadas condicionadas')
            
            // Agregar cada registro del grupo
            return cy.wrap(grupo.registros).each((registro) => {
                Generales.BtnAgregarRegistroSubnivel()
                cy.log(`📝 Agregando registro - Correlativo: ${registro.correlativo}, Caracteristica: ${registro.caracteristica}`)
                
                AccionCondicionada.ACTxAsociadasCondicionadas(
                    //txAsociada, correlativo, tipoAsociacion, tipoAccion, descripcion, acumular, permiteRechazo, modoInverso, permiteCanacelacion
                    registro.txAsociada, 
                    registro.correlativo,  
                    registro.tipoAsociacion, 
                    registro.tipoAccion, 
                    registro.descripcion,   
                    registro.acumular,  
                    registro.permiteRechazo,   
                    registro.modoInverso, 
                    registro.permiteCanacelacion 
                )

                Generales.BtnAceptarRegistro()
                cy.wait(2000)
                
                return cy.get('body').then(($body) => {
                    // Buscar específicamente el snackbar de error
                    const snackBarError = $body.find('.snack-container__error')
                    
                    if (snackBarError.length > 0) {
                        // Obtener el mensaje específico
                        const mensajeError = snackBarError.find('.message-snack').text()
                        cy.log(`⚠️ Error detectado: ${mensajeError}`)
                        
                        // Cerrar el snackbar si tiene botón de cerrar
                        cy.get('.snack--btn-close').click()
                        
                        Generales.BtnCancelarRegistro()
                        cy.log('❌ Registro duplicado - cancelando')
                    } else {
                        cy.log('✅ Registro agregado correctamente')
                    }
                    
                    return cy.get('mat-dialog-container', { timeout: 10000 })
                        .should('not.exist')
                })
            }).then(() => {
                cy.log('🔙 Regresando al nivel principal')

                // Primer regreso - SALIR DEL SUBNIVEL
                return cy.then(() => {
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que salimos del subnivel (modal cerrado)
                    return cy.get('mat-dialog-container', { timeout: 5000 })
                        .should('not.exist')
                }).then(() => {
                    // Segundo regreso - SALIR DEL DETALLE
                    cy.wait(3000)
                    Generales.Regresar()
                    // Verificar que estamos en el listado principal
                    return cy.contains('span.mat-button-wrapper', 'Buscar por', { timeout: 15000 })
                        .should('be.visible')
                }) 
            })
        })
    })
})