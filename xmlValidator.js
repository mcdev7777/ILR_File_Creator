const { parentPort, workerData } = require('worker_threads');
const xmllint = require('xmllint');

const { xml, xsd } = workerData;

try {
    let result = xmllint.validateXML({ xml, schema: xsd });
    parentPort.postMessage({ valid: !result.errors || result.errors.length === 0, errors: result.errors });
} catch (error) {
    parentPort.postMessage({ valid: false, errors: [error.message] });
} 