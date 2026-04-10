const { execSync } = require('child_process');

// Lista de archivos (sin la extensión .cy.js)
const tests = [
    'UnitTest-Paises',
    'UnitTest-Monedas',
    'UnitTest-UnitTest-DivGeografica',
    'UnitTest-UnitTest-DivGeografica2Sub',
    'UnitTest-UnitTest-DivGeografica3Sub',
    'UnitTest-Regiones',
    'UnitTest-Jornadas',
    'UnitTest-TipoRamaAgencia',
    'UnitTest-EtiquetasDelArbol',
    'UnitTest-ArbolOrganizacional',
    //'Definir estructura de arbol organizacional y agencias de pruebas'
    'UnitTest-NivelDeCajero',
    'UnitTest-TipoCajero',
    'UnitTest-Departamentos',
    'UnitTest-Usuarios',
    'UnitTest-Boveda',
    //'16. Definir y/o ajustar los medios de notificación de comprobantes',
    'UnitTest-ValoresGoblales'




];

const specPattern = tests.map(t => `cypress/e2e/${t}.cy.js`).join(',');
console.log(`Ejecutando: ${specPattern}`);

try {
    execSync(`npx cypress run --spec "${specPattern}"`, { stdio: 'inherit' });
    console.log('Ejecución completada. Revisa el Excel en ReporteXlsx/');
} catch (error) {
    console.error('Error en la ejecución de las pruebas');
    process.exit(1);
}