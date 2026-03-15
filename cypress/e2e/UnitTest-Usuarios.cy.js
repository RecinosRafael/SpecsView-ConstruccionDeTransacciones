import metodosGeneralesPomCy from "../support/PageObjects/Specs-view-PO/MetodosGeneralesPom.cy";
import usuarioPomCy from "../support/PageObjects/Specs-view-PO/UsuarioPom.cy";
require('cypress-xpath');

const Generales = new metodosGeneralesPomCy();
const Usuarios = new usuarioPomCy()

describe("Suite de pruebas Opción Usuario", () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    before(() => {
        Generales.Login(
            Cypress.env('BASE_URL'),
            Cypress.env('USER'),
            Cypress.env('PASS')
        );
    });

    beforeEach(() => {
        Generales.IrAPantalla('user');
    });

    it("Buscar persona y agregar múltiples usuarios dinámicamente", () => {
        cy.fixture('usuarios').then((dataUsuarios) => {
            cy.log(`📋 Total de registros a procesar: ${dataUsuarios.agregar.length}`);
            let registrosExitosos = 0;
            let registrosFallidos = 0;

            cy.wrap(dataUsuarios.agregar).each((item, index) => {
                cy.log(`\n🔄 Procesando registro ${index + 1}/${dataUsuarios.agregar.length}`);
                cy.log(`📝 Usuario: ${item.codigo} - ${item.usuario}`);

                // =============================================
                // PASO 1: Buscar Persona
                // =============================================
                cy.log('🔍 PASO 1: Buscando persona');

                // Abrir formulario de búsqueda de persona
                Generales.BtnAgregarRegistroSubnivel();

                // Validar que el modal de búsqueda abrió
                cy.contains('h2', 'Buscar persona', { timeout: 10000 }).should('be.visible');

                // Usar el método BuscarPersona
                Usuarios.BuscarPersona(
                    item.tipoIdentificacion,
                    item.numeroIdentificacion
                );

                // Esperar que se complete la búsqueda
                cy.wait(2000);

                // =============================================
                // Verificar ERRORES en búsqueda (solo aquí cerramos si hay error)
                // =============================================
                cy.get('body').then(($body) => {
                    const hayErrorBusqueda =
                        $body.text().includes('no encontrado') ||
                        $body.text().includes('no existe') ||
                        $body.text().includes('invalid') ||
                        $body.find('.error-message, .alert-danger, .toast-error, .mat-error').length > 0;

                    if (hayErrorBusqueda) {
                        cy.log('⚠️ Error en búsqueda de persona - Cancelando este registro');

                        // SOLO cerramos si hay error
                        if ($body.find('h2:contains("Buscar persona")').length > 0) {
                            cy.get('button').contains('Cancelar').click();
                            cy.contains('h2', 'Buscar persona').should('not.exist');
                        }

                        registrosFallidos++;
                        cy.log(`❌ Registro ${index + 1} fallido - Continuando con el siguiente`);
                        return; // Salir de este registro
                    } else {
                        cy.log('✅ Búsqueda exitosa - Continuamos con el modal abierto');
                    }
                });

                // =============================================
                // PASO 2: Agregar Usuario (con el modal de búsqueda aún abierto)
                // =============================================
                cy.log('👤 PASO 2: Agregando usuario');

                // Aquí NO cerramos el modal de búsqueda, continuamos con el flujo normal
                // El modal de búsqueda probablemente se reutiliza o se cierra automáticamente

                // Llenar datos de usuario
                Usuarios.Usuario(
                    item.codigo,
                    item.usuario,
                    item.pNombre,
                    item.sNombre,
                    item.pApellido,
                    item.sApellido,
                    item.valorPais,
                    item.codigoEbs,
                    item.correo,
                    item.telTrabajo,
                    item.codigoEmpleado,
                    item.valorArbolRaiz,
                    item.valorRamaArbol,
                    item.valorDepartamento,
                    item.valorTipoCajero,
                    item.valorJornadaLaboral,
                    item.valorNivelCajero,
                    item.puertoImpre
                );

                // Verificar errores en combos (solo aquí cerramos si hay error)
                cy.get('body', { timeout: 5000 }).then(($body) => {
                    const hayErrorCombos =
                        $body.find('.error-message, .alert-danger, .toast-error, .mat-error').length > 0 ||
                        $body.text().includes('requerido') ||
                        $body.text().includes('obligatorio');

                    if (hayErrorCombos) {
                        cy.log('⚠️ Error en combos detectado - Cancelando este registro');

                        // SOLO cerramos si hay error
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            Generales.BtnCancelarRegistro();
                            cy.contains('h2', 'Nuevo Registro').should('not.exist');
                        }

                        registrosFallidos++;
                        cy.log(`❌ Registro ${index + 1} fallido - Continuando con el siguiente`);
                        return; // Salir de este registro
                    }
                });

                // Interceptar petición
                cy.intercept('POST', '**/user').as('guardar');

                // Hacer clic en Aceptar
                Generales.BtnAceptarRegistro();

                // Esperar respuesta del backend
                cy.wait('@guardar', { timeout: 15000 }).then((interception) => {
                    const status = interception.response.statusCode;
                    cy.log(`📊 Status: ${status}`);

                    if (status === 200 || status === 201) {
                        cy.log('✅ Registro insertado correctamente');
                        registrosExitosos++;
                        // El modal se cierra automáticamente con éxito
                        cy.contains('h2', 'Nuevo Registro', { timeout: 10000 }).should('not.exist');
                    } else {
                        cy.log(`❌ Error detectado. Status: ${status}`);
                        registrosFallidos++;

                        // SOLO cerramos si hay error
                        cy.get('body').then(($body) => {
                            if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                                Generales.BtnCancelarRegistro();
                                cy.contains('h2', 'Nuevo Registro', { timeout: 10000 }).should('not.exist');
                            }
                        });
                    }
                });

                // Verificación de timeout (solo cerramos si hay error)
                cy.wait(16000).then(() => {
                    cy.get('body').then(($body) => {
                        if ($body.find('h2:contains("Nuevo Registro")').length > 0) {
                            cy.log('⚠️ Timeout detectado - Cancelando por error');
                            Generales.BtnCancelarRegistro();
                            cy.contains('h2', 'Nuevo Registro', { timeout: 5000 }).should('not.exist');
                            registrosFallidos++;
                        }
                    });
                });

                // Pausa entre registros
                cy.wait(1000);
            });

            // =============================================
            // RESUMEN FINAL
            // =============================================
            cy.then(() => {
                cy.log('\n📊 ====== RESUMEN FINAL ======');
                cy.log(`📋 Total procesados: ${dataUsuarios.agregar.length}`);
                cy.log(`✅ Exitosos: ${registrosExitosos}`);
                cy.log(`❌ Fallidos: ${registrosFallidos}`);
                cy.log(`📊 ===========================`);
            });
        });
    });
});