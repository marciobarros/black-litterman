// Cria uma matriz
function criaMatriz(rows, cols) {
  const resultado = Array(rows).fill(0).map(() => Array(cols).fill(0));
  return resultado;
}

// Multiplica duas matrizes
function multiplicaMatrizes(matrixA, matrixB) {
  const rowsA = matrixA.length;
  const colsA = matrixA[0].length;
  const rowsB = matrixB.length;
  const colsB = matrixB[0].length;

  // Verifica se as dimensões são compatíveis para multiplicação
  if (colsA !== rowsB) {
    throw new Error("Number of columns in Matrix A must equal number of rows in Matrix B.");
  }

  // Cria a matriz resultado
  const resultado = Array(rowsA).fill(0).map(() => Array(colsB).fill(0));

  // Realiza a multiplicação
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        resultado[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }

  return resultado;
}

// Multiplica uma matriz por um escalar
function multiplicaMatrizEscalar(matrixA, escalar) {
    // Pega as dimensões da matriz
    const rowsA = matrixA.length;
    const colsA = matrixA[0].length;

    // Cria a matriz resultado
    const resultado = Array(rowsA).fill(0).map(() => Array(colsA).fill(0));

    // Realiza a multiplicação
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsA; j++) {
            resultado[i][j] = matrixA[i][j] * escalar;
        }
    }

    return resultado;
}

// Multiplica uma matriz por um vetor
function multiplicaMatrizVetor(matrix, vector) {
    // Pega as dimensões da matriz
    const rows = matrix.length;
    const cols = matrix[0].length;

    // Pega a dimensão do vetor
    const n = vector.length;

    // Verifica se a matriz tem as dimensoes adequadas
    if (!Array.isArray(matrix) || !Array.isArray(matrix[0]) || n !== cols) {
        throw new Error("A matriz deve ter o mesmo numero de colunas do vetor.");
    }

    // Cria o vetor resultado
    const resultado = Array(rows).fill(0);

    // Realiza a multiplicação
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            resultado[i] += matrix[i][j] * vector[j];
        }
    }

    return resultado;
}

// Multiplica um vetor por uma matriz
function multiplicaVetorMatriz(vector, matrix) {
    // Pega as dimensões da matriz
    const rows = matrix.length;
    const cols = matrix[0].length;

    // Pega a dimensão do vetor
    const n = vector.length;

    // Verifica se a matriz tem as dimensoes adequadas
    if (!Array.isArray(matrix) || !Array.isArray(matrix[0]) || n !== rows) {
        throw new Error("A matriz deve ter o mesmo numero de linhas do vetor.");
    }

    // Cria o vetor resultado
    const resultado = Array(rows).fill(0);

    // Realiza a multiplicação
    for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) {
            resultado[i] += matrix[i][j] * vector[j];
        }
    }

    return resultado;
}

// Multiplia dois vetores
function multiplicaVetorVetor(vector1, vector2) {
    // Pega as dimensões do primeiro vetor
    const n1 = vector1.length;

    // Pega a dimensão do segundo vetor
    const n2 = vector2.length;

    // Verifica se os vetores tem dimensoes adequadas
    if (!Array.isArray(vector1) || !Array.isArray(vector2) || n1 !== n2) {
        throw new Error("Os vetores devem ter a mesma dimensão.");
    }

    // Cria o vetor resultado
    var resultado = 0.0;

    // Realiza a multiplicação
    for (let i = 0; i < n1; i++) {
        resultado += vector1[i] * vector2[i];
    }

    return resultado;
}

// Soma um escalar em uma matriz
function somaMatrizEscalar(matrix, escalar) {
    // Pega as dimensões da matriz
    const rowsA = matrix.length;
    const colsA = matrix[0].length;

    // Cria a matriz resultado
    const resultado = Array(rowsA).fill(0).map(() => Array(colsA).fill(0));

    // Realiza a multiplicação
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsA; j++) {
            resultado[i][j] = matrix[i][j] + escalar;
        }
    }

    return resultado;
}

// Soma duas matrizes
function somaMatrizes(matriz1, matriz2) {
    // Pega as dimensões da primeira matriz
    const rowsA = matriz1.length;
    const colsA = matriz1[0].length;

    // Pega as dimensões da segunda matriz
    const rowsB = matriz2.length;
    const colsB = matriz2[0].length;

    // Verifica se as dimensoes são compatíveis para a soma
    if (rowsA != rowsB || colsA != colsB) {
        throw new Error("As matrizes devem ter as mesmas dimensões para a soma.");
    }

    // Cria a matriz resultado
    const resultado = Array(rowsA).fill(0).map(() => Array(colsA).fill(0));

    // Realiza a multiplicação
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsA; j++) {
            resultado[i][j] = matriz1[i][j] + matriz2[i][j];
        }
    }

    return resultado;
}

// Inverte uma matriz quadrada usando o método de Gauss-Jordan
function inverteMatriz(matriz) {
    const n = matriz.length;

    // Verifica se a matriz é quadrada
    if (!Array.isArray(matriz) || !Array.isArray(matriz[0]) || n !== matriz[0].length) {
        throw new Error("A matriz deve ser quadrada.");
    }

    // Cria uma cópia da matriz
    const A = matriz.map(linha => linha.slice());
    
    // Cria uma matriz identidade
    const I = Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );

    // Aplica o método de Gauss-Jordan
    for (let i = 0; i < n; i++) {
        // Encontra o pivô
        let pivot = A[i][i];

        if (pivot === 0) {
            // tenta trocar de linha
            let swapRow = -1;
            
            for (let k = i + 1; k < n; k++) {
                if (A[k][i] !== 0) {
                    swapRow = k;
                    break;
                }
            }
            
            if (swapRow === -1) {
                console.error("A matriz não é invertível.");
                return null;
            }

            [A[i], A[swapRow]] = [A[swapRow], A[i]];
            [I[i], I[swapRow]] = [I[swapRow], I[i]];
            pivot = A[i][i];
        }

        // Normaliza a linha do pivô
        for (let j = 0; j < n; j++) {
            A[i][j] /= pivot;
            I[i][j] /= pivot;
        }

        // Elimina os outros elementos da coluna
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                const fator = A[k][i];

                for (let j = 0; j < n; j++) {
                    A[k][j] -= fator * A[i][j];
                    I[k][j] -= fator * I[i][j];
                }
            }
        }
    }

    return I;
}

// Calcula a matriz transposta de uma matriz
function transpoeMatriz(matriz) {
    const rows = matriz.length;
    const cols = matriz[0].length;
    const transposta = Array.from({ length: cols }, () => Array(rows).fill(0)); 
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            transposta[j][i] = matriz[i][j];
        }
    }
    
    return transposta;
}

// Soma todas as celulas de uma matriz
function somaCelulasMatriz(matriz) {
    const rows = matriz.length
    const cols = matriz[0].length
    var soma = 0.0
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            soma += matriz[i][j]
        }
    }
    
    return soma
}