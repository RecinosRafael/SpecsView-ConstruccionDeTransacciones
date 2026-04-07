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


    /*AsignarTransacciones(data) {
        // 1. Acceder al documento del iframe
        return cy.get('iframe.frame', { timeout: 10000 })
            .its('0.contentDocument')
            .should('exist')
            .then(doc => {
                // 2. Navegación por el árbol y asignación de transacciones
                return cy.wrap(doc.body).within(() => {
                    this.Generales.IngresarArbol(data.codigosArbol);
                    cy.wait(500);
                    this.Generales.esperarQueSpinnerDesaparezca({ skipContext: true });
                    cy.wait(500);

                    if (data.asignaTodas) {
                        cy.log("Asignando todas las transacciones");
                        this.Generales.BtnIframe('Asignar todos', { force: true, skipContext: true });
                        this.Generales.IngresarFechaIframe(data.validoDesde, "Valido Desde", { force: true, skipContext: true });
                        this.Generales.IngresarFechaIframe(data.validoHasta, "Valido Hasta", { force: true, skipContext: true });
                        cy.wait(1500)
                        this.Generales.BtnIframe('Aceptar', { force: true, skipContext: true });
                        cy.wait(1500)

                        return true;
                    } else {
                        cy.log("Asignando transacciones específicas", data.transaccionesAsignar);
                        this.Generales.AsignarTransacciones(data.transaccionesAsignar);
                        this.Generales.BtnIframe('Guardar', { force: true, skipContext: true });
                        // Esperar a que el diálogo pueda aparecer
                        cy.wait(2000);
                        // Salir del within (se retorna el resultado más abajo)
                        return null; // marcador para continuar fuera del within
                    }
                }).then(result => {
                    // 3. Si la asignación no requirió el diálogo (asignaTodas), ya retornamos true
                    if (result === true) return true;

                    // 4. Verificar si el diálogo apareció usando el documento original (doc)
                    if (doc.body.textContent.includes('Definición de Fechas')) {
                        cy.log('Diálogo detectado. Ingresando fechas...');
                        // 5. Volver a entrar al iframe para llenar fechas y aceptar
                        return cy.wrap(doc.body).within(() => {
                            this.Generales.IngresarFechaIframe(data.validoDesde, "Valido Desde", { force: true, skipContext: true });
                            this.Generales.IngresarFechaIframe(data.validoHasta, "Valido Hasta", { force: true, skipContext: true });
                            this.Generales.BtnIframe('Aceptar', { force: true, skipContext: true });
                            return true;
                        });
                    } else {
                        cy.log('No apareció diálogo, transacciones ya asignadas.');
                        return false;
                    }

            });
            

        });
        
    }*/

    AsignarTransacciones(data, reportOptions = {}) {
        const {
            contadorObj,
            describeBase = 'Asignar Transacciones',
            crudBase = 'Asignación'
        } = reportOptions;

        let numero;
        if (contadorObj) {
            contadorObj.valor++;
            numero = contadorObj.valor;
        } else {
            numero = 0;
        }

        return cy.get('iframe.frame', { timeout: 10000 })
            .its('0.contentDocument')
            .should('exist')
            .then(doc => {
                return cy.wrap(doc.body).within(() => {
                    this.Generales.IngresarArbol(data.codigosArbol);
                    cy.wait(500);
                    this.Generales.esperarQueSpinnerDesaparezca({ skipContext: true });
                    cy.wait(500);

                    if (data.asignaTodas) {
                        cy.log("Asignando todas las transacciones");
                        this.Generales.BtnIframe('Asignar todos', { force: true, skipContext: true });
                        this.Generales.IngresarFechaIframe(data.validoDesde, "Valido Desde", { force: true, skipContext: true });
                        this.Generales.IngresarFechaIframe(data.validoHasta, "Valido Hasta", { force: true, skipContext: true });
                        cy.wait(1500);

                        let alias = null;
                        if (contadorObj) {
                            alias = this.Generales.interceptar('asignarTransaccion', numero, 'POST', '**/transactionsByTreebranch/assignedAllTransaction');
                        }
                        this.Generales.BtnIframe('Aceptar', { force: true, skipContext: true });
                        cy.wait(1500);

                        if (alias) {
                            this.Generales.procesarRespuestaYReportarConFrame(alias, {
                                numero,
                                describe: `${describeBase} - Asignar todas - ${data.codigosArbol?.join('-')}`,
                                crud: crudBase,
                                descripcion: `Asignar todas las transacciones al nodo ${data.codigosArbol?.slice(-1)[0]}`
                            });
                        }
                        return true;
                    } else {
                        cy.log("Asignando transacciones específicas", data.transaccionesAsignar);
                        this.Generales.AsignarTransacciones(data.transaccionesAsignar);

                        let alias = null;
                        let peticionEnviada = false;

                        if (contadorObj) {
                            alias = this.Generales.interceptar('asignarTransaccion', numero, 'POST', '**/transactionsByTreebranch/administrateAll');
                        }
                        this.Generales.BtnIframe('Guardar', { force: true, skipContext: true });
                        cy.wait(2000);

                        // Verificar si apareció el diálogo de fechas (indica que se guardó)
                        const hayDialogo = doc.body.textContent.includes('Definición de Fechas');
                        if (hayDialogo) {
                            peticionEnviada = true;
                            cy.log('Diálogo detectado. Ingresando fechas...');
                            return cy.wrap(doc.body).within(() => {
                                this.Generales.IngresarFechaIframe(data.validoDesde, "Valido Desde", { force: true, skipContext: true });
                                this.Generales.IngresarFechaIframe(data.validoHasta, "Valido Hasta", { force: true, skipContext: true });
                                this.Generales.BtnIframe('Aceptar', { force: true, skipContext: true });
                                if (alias) {
                                    this.Generales.procesarRespuestaYReportarConFrame(alias, {
                                        numero,
                                        describe: `${describeBase} - Asignar específicas`,
                                        crud: crudBase,
                                        descripcion: `Asignar ${data.transaccionesAsignar?.length || 0} transacciones al nodo ${data.codigosArbol?.slice(-1)[0]}`
                                    });
                                }
                                return true;
                            });
                        } else {
                            cy.log('No apareció diálogo, transacciones ya asignadas o sin cambios.');
                            // Si no hay diálogo, probablemente no hubo petición. Aun así, registramos como éxito sin esperar respuesta.
                            if (alias) {
                                cy.task('guardarResultado', {
                                    numero,
                                    describe: `${describeBase} - Asignar específicas`,
                                    crud: crudBase,
                                    descripcion: `Asignar ${data.transaccionesAsignar?.length || 0} transacciones al nodo ${data.codigosArbol?.slice(-1)[0]} (sin cambios)`,
                                    estado: 'exitosa',
                                    mensaje: 'No se requirieron cambios, las transacciones ya estaban asignadas.',
                                    evidencia: ''
                                });
                            }
                            return false;
                        }
                    }
                });
            });
    }


    /*DesasignarTransacciones(data) {
        // 1. Acceder al documento del iframe
        return cy.get('iframe.frame', { timeout: 10000 })
            .its('0.contentDocument')
            .should('exist')
            .then(doc => {
                // 2. Navegación por el árbol y Desasignación de transacciones
                return cy.wrap(doc.body).within(() => {
                    this.Generales.IngresarArbol(data.codigosArbol);
                    cy.wait(500);
                    this.Generales.esperarQueSpinnerDesaparezca({ skipContext: true });
                    cy.wait(500);

                    if (data.desasignaTodas) {
                        cy.log("Desasignar todas las transacciones");
                        this.Generales.BtnIframe('Desasignar todos', { force: true, skipContext: true });
                        cy.wait(1500)
                        this.Generales.BtnIframe('Sí', { force: true, skipContext: true });
                        cy.wait(1500)

                        return true;
                    } else {
                        cy.log("Desasignando transacciones específicas", data.transaccionesADesasignar);
                        this.Generales.DesasignarTransacciones(data.transaccionesADesasignar);
                        this.Generales.BtnIframe('Guardar', { force: true, skipContext: true });
                        // Esperar a que el diálogo pueda aparecer
                        cy.wait(2000);
                        // Salir del within (se retorna el resultado más abajo)
                        return null; // marcador para continuar fuera del within
                    }
                }).then(result => {
                    // 3. Si la asignación no requirió el diálogo (asignaTodas), ya retornamos true
                    if (result === true) return true;

                    // 4. Verificar si el diálogo apareció usando el documento original (doc)
                    if (doc.body.textContent.includes('Confirmar')) {
                        cy.log('Diálogo detectado. Confirmar...');
                        // 5. Volver a entrar al iframe para llenar fechas y aceptar
                        return cy.wrap(doc.body).within(() => {
                            this.Generales.BtnIframe('Sí', { force: true, skipContext: true });
                            return true;
                        });
                    } else {
                        cy.log('No apareció diálogo, transacciones ya desasignadas.');
                        return false;
                    }

            });
            

        });
        
    }*/

    DesasignarTransacciones(data, reportOptions = {}) {
        const {
            contadorObj,
            describeBase = 'Desasignar Transacciones',
            crudBase = 'Desasignación'
        } = reportOptions;

        let numero;
        if (contadorObj) {
            contadorObj.valor++;
            numero = contadorObj.valor;
        } else {
            numero = 0;
        }

        return cy.get('iframe.frame', { timeout: 10000 })
            .its('0.contentDocument')
            .should('exist')
            .then(doc => {
                return cy.wrap(doc.body).within(() => {
                    this.Generales.IngresarArbol(data.codigosArbol);
                    cy.wait(500);
                    this.Generales.esperarQueSpinnerDesaparezca({ skipContext: true });
                    cy.wait(500);

                    if (data.desasignaTodas) {
                        cy.log("Desasignar todas las transacciones");
                        let alias = null;
                        if (contadorObj) {
                            alias = this.Generales.interceptar('desasignarTransaccion', numero, 'DELETE', '**/transactionsByTreebranch/deleteTransactionsByTreeBranch/*');
                        }
                        this.Generales.BtnIframe('Desasignar todos', { force: true, skipContext: true });
                        cy.wait(1500);
                        this.Generales.BtnIframe('Sí', { force: true, skipContext: true });
                        cy.wait(1500);

                        if (alias) {
                            this.Generales.procesarRespuestaYReportarConFrame(alias, {
                                numero,
                                describe: `${describeBase} - Desasignar todas - ${data.codigosArbol?.join('-')}`,
                                crud: crudBase,
                                descripcion: `Desasignar todas las transacciones al nodo ${data.codigosArbol?.slice(-1)[0]}`
                            });
                        }
                        return true;
                    } else {
                        cy.log("Desasignando transacciones específicas", data.transaccionesADesasignar);
                        this.Generales.DesasignarTransacciones(data.transaccionesADesasignar);
                        let alias = null;
                        if (contadorObj) {
                            alias = this.Generales.interceptar('desasignarTransaccion', numero, 'POST', '**/transactionsByTreebranch/administrateAll');
                        }
                        this.Generales.BtnIframe('Guardar', { force: true, skipContext: true });
                        cy.wait(2000);

                        const hayDialogo = doc.body.textContent.includes('Confirmar');
                        if (hayDialogo) {
                            cy.log('Diálogo detectado. Confirmar...');
                            return cy.wrap(doc.body).within(() => {
                                if (alias) {
                                    this.Generales.BtnIframe('Sí', { force: true, skipContext: true });
                                    this.Generales.procesarRespuestaYReportarConFrame(alias, {
                                        numero,
                                        describe: `${describeBase} - Desasignar específicas`,
                                        crud: crudBase,
                                        descripcion: `Desasignar ${data.transaccionesADesasignar?.length || 0} transacciones al nodo ${data.codigosArbol?.slice(-1)[0]}`
                                    });
                                } else {
                                    this.Generales.BtnIframe('Sí', { force: true, skipContext: true });
                                }
                                return true;
                            });
                        } else {
                            cy.log('No apareció diálogo, transacciones ya desasignadas o sin cambios.');
                            if (alias) {
                                cy.task('guardarResultado', {
                                    numero,
                                    describe: `${describeBase} - Desasignar específicas`,
                                    crud: crudBase,
                                    descripcion: `Desasignar ${data.transaccionesADesasignar?.length || 0} transacciones al nodo ${data.codigosArbol?.slice(-1)[0]} (sin cambios)`,
                                    estado: 'exitosa',
                                    mensaje: 'No se requirieron cambios, las transacciones ya estaban desasignadas.',
                                    evidencia: ''
                                });
                            }
                            return false;
                        }
                    }
                });
            });
    }

    /*CamposHabilitados(data) {
        if (!data.camposHabilitados|| !Array.isArray(data.camposHabilitados)) return;
        data.camposHabilitados.forEach(dato => {
            this.Generales.seleccionarComboIframe(dato.campo, "Campos habilitados a Entidad", { timeout: 10000, force: true, skipContext: true })
            this.Generales.seleccionarComboIframe(dato.datoCampo, "Dato del campo", { timeout: 10000, force: true, skipContext: true })               
            this.Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true })
        });

    }*/

    CamposHabilitados(data, contadorObj, describeBase = 'Campos Adicionales', crudBase = 'Campos Adicionales') {
        if (!data.camposHabilitados || !Array.isArray(data.camposHabilitados)) return;

        data.camposHabilitados.forEach(dato => {
            contadorObj.valor++;
            const numero = contadorObj.valor;

            // 1. Llenar los combos del formulario
            this.Generales.seleccionarComboIframe(dato.campo, "Campos habilitados a Entidad", { timeout: 10000, force: true, skipContext: true });
            this.Generales.seleccionarComboIframe(dato.datoCampo, "Dato del campo", { timeout: 10000, force: true, skipContext: true });

            // 2. Interceptar la petición (ajusta la URL real de tu backend)
            const alias = this.Generales.interceptar('guardarCampo', numero, 'POST', '**/additionalEntityFields');

            // 3. Hacer clic en Guardar (dispara la petición)
            this.Generales.BtnIframe('Guardar', { timeout: 10000, force: true, skipContext: true });

            // 4. Procesar respuesta y generar reporte (sin cerrar el modal)
            this.Generales.procesarRespuestaYReportarConFrame(alias, {
                numero,
                describe: `${describeBase} - ${data.codigo || data.nombre}`,
                crud: crudBase,
                descripcion: `Campos habilitados a Entidad: ${dato.campo} - Dato del Campo: ${dato.datoCampo}`,
                onSuccess: () => {
                    // Éxito: solo registrar log, no cerrar el modal
                    cy.log(`Campo ${dato.campo} guardado correctamente`);
                },
                onError: () => {
                    // Error: solo registrar log, no cerrar el modal (el usuario podría corregir o continuar)
                    cy.log(`Error al guardar campo ${dato.campo}`);
                }
            });
        });
    }


}
export default ArbolOrganizacionalPom;

