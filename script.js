/**
 * Función principal para validar la cédula al hacer clic en el botón.
 */
function validarCedula() {
    const cedula = document.getElementById('cedulaInput').value.trim();
    const resultadoElement = document.getElementById('resultado');

    // Limpiar resultado anterior
    resultadoElement.textContent = '';
    resultadoElement.className = 'resultado';

    // 1. Validaciones Iniciales
    if (!/^\d{10}$/.test(cedula)) {
        mostrarResultado(resultadoElement, '❌ Debe ingresar 10 dígitos numéricos.', false);
        return;
    }

    const esValida = verificarCedulaEcuatoriana(cedula);

    // 2. Mostrar Resultado
    if (esValida) {
        mostrarResultado(resultadoElement, '✅ Cédula VÁLIDA', true);
    } else {
        mostrarResultado(resultadoElement, '❌ Cédula INVÁLIDA (Dígito verificador incorrecto o datos inválidos)', false);
    }
}

/**
 * Muestra el resultado en el elemento HTML.
 * @param {HTMLElement} element - El elemento <p> de resultado.
 * @param {string} mensaje - El mensaje a mostrar.
 * @param {boolean} exito - true si es válida, false si es inválida.
 */
function mostrarResultado(element, mensaje, exito) {
    element.textContent = mensaje;
    element.classList.add(exito ? 'valida' : 'invalida');
}

/**
 * Implementa el algoritmo Módulo 10 para la validación de cédulas.
 * @param {string} cedula - La cédula de 10 dígitos a verificar.
 * @returns {boolean} - true si la cédula es válida, false si no lo es.
 */
function verificarCedulaEcuatoriana(cedula) {
    // Convertir el string a un array de números
    const digitos = cedula.split('').map(Number);
    const digitoVerificadorUsuario = digitos[9]; // Décimo dígito
    const cedulaBase = digitos.slice(0, 9); // Nueve primeros dígitos

    // Validar Región y Tercer Dígito
    const codigoProvincia = digitos[0] * 10 + digitos[1];
    if (codigoProvincia < 1 || codigoProvincia > 24 && codigoProvincia !== 30) {
        // Códigos de provincia válidos: 01-24, 30 (extranjeros)
        return false;
    }
    
    if (digitos[2] >= 6) {
        // Tercer dígito debe ser 0, 1, 2, 3, 4, o 5
        return false;
    }

    let sumaTotal = 0;

    // Iterar sobre los primeros 9 dígitos
    for (let i = 0; i < cedulaBase.length; i++) {
        let valor = cedulaBase[i];

        // Posiciones Impares (índices 0, 2, 4, 6, 8)
        if ((i + 1) % 2 !== 0) {
            valor *= 2;
            // Si el resultado es mayor a 9, se le resta 9
            if (valor > 9) {
                valor -= 9;
            }
            sumaTotal += valor;
        } else {
            // Posiciones Pares (índices 1, 3, 5, 7)
            sumaTotal += valor;
        }
    }

    // 3. Calcular el Dígito de Control
    const modulo = sumaTotal % 10;
    
    let digitoVerificadorCalculado;
    
    if (modulo === 0) {
        digitoVerificadorCalculado = 0;
    } else {
        // El dígito verificador es 10 menos el residuo
        digitoVerificadorCalculado = 10 - modulo;
    }

    // 4. Verificar
    return digitoVerificadorCalculado === digitoVerificadorUsuario;
}