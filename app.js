const matrizMarcados = ['','','','','','','','','']

const ordemJogar = ['X']

const avisoParagraph = document.querySelector('.avisos')

function verificarSeTabuleiroCompleto() {
    console.log('       verificarSeTabuleiroCompleto', jogoEncerrado('O') || jogoEncerrado('X'))
    return jogoEncerrado('O') || jogoEncerrado('X')
}

function limpar() {
    for(let i = 1; i <= 9; i++ ) {
        document.getElementById(`${i}`).value = ""
        document.getElementById(`${i}`).removeAttribute('disabled')
        matrizMarcados[i-1] = ''
    }
}

function desabilitarInputs() {
    for(let i = 1; i <= 9; i++ ) {
        document.getElementById(`${i}`).setAttribute('disabled','')
    }
}

function habilitarInputs() {
    for(let i = 1; i <= 9; i++ ) {
        document.getElementById(`${i}`).removeAttribute('disabled','')
    }
}

function gerarNumAleatorio() {
    let aleatorio = Math.random()
    let num = Math.trunc(aleatorio * 10) 
    
    if(num < 1 || num > 10){
        aleatorio = Math.random()
        num = Math.trunc(aleatorio * 10) 
    }
    return num
}

function jogoEncerrado(letraXouO) {
    const letraAVerificar = letraXouO
    const vezDeJogar = quemJoga()

    const qtdMarcadoPorLetra =  matrizMarcados.filter(item => item === letraAVerificar )

    console.log('jogoEncerrado:',letraXouO, letraAVerificar,qtdMarcadoPorLetra.length, qtdMarcadoPorLetra)
    if(letraAVerificar === letraXouO){
        if(qtdMarcadoPorLetra.length === 5){
            avisoParagraph.textContent = 'Olha só, deu empate!'
            console.log('Olha só, deu empate! XXXXXXXXXXXXXXXXXXXX')
            return true
        }
    }
    return false
}

function adicionarJogada(posicao, letra) {
    matrizMarcados[posicao] = letra
    console.log('adicionarJogada:', matrizMarcados)
}

function conferirSeJaMarcou(posicao) {
    console.log('conferirSeJaMarcou:',matrizMarcados[posicao] !== '')
    return matrizMarcados[posicao] !== ''
}

function jogador(id) {
    const campo = document.getElementById(id)
    const posicao = id - 1
    const posicaoJaMarcada = conferirSeJaMarcou(posicao)
    
    if(posicaoJaMarcada){
        return
    }
    
    campo.value = 'X'
    
    adicionarJogada(posicao, 'X')
    
    avisoParagraph.textContent = 'Computador irá jogar!'
    
    
    if(encerrarJogo()){
        return true
    }
    
    if(verificarSeTabuleiroCompleto()){
        return
    }

    desabilitarInputs()

    setTimeout(() => {
        if(!verificarSeTabuleiroCompleto()){
            computador()
        }
    }, 1000);

}

function computador() {
    let numAleatorioGerado = gerarNumAleatorio()
    let posicao = numAleatorioGerado - 1
    let posicaoJaMarcada = conferirSeJaMarcou(posicao)
    let contador = 0

    // while (posicaoJaMarcada){
    //     numAleatorioGerado = gerarNumAleatorio()
    //     posicao = numAleatorioGerado - 1
    //     posicaoJaMarcada = conferirSeJaMarcou(posicao)
    //     contador++
    //     if(contador > 200) {
    //         break
    //     }
    // }

    //DESENVOLVIMENTO
    const fecharJogada = fecharJogador()
    let campo 
    if(fecharJogada > 0){
        posicao = fecharJogada
        campo = document.getElementById(posicao + 1)
    }else{ 
        while (posicaoJaMarcada){
            numAleatorioGerado = gerarNumAleatorio()
            posicao = numAleatorioGerado - 1
            posicaoJaMarcada = conferirSeJaMarcou(posicao)
            contador++
            if(contador > 200) {
                break
            }
        }
        campo = document.getElementById(numAleatorioGerado)
    }
    
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', fecharJogada, posicao)
    
    
    campo.value = "O"

    adicionarJogada(posicao, 'O')

    avisoParagraph.textContent = 'É sua vez de jogar!'

    if(encerrarJogo()){
        return true
    }

    if(verificarSeTabuleiroCompleto()){
        return
    }

    habilitarInputs()

}

function encerrarJogo() {
    const { teveVencedor, quemVenceu } = definirVencedor()
    
    desabilitarInputs()
    
    if(teveVencedor){
        let mensagemVencedor = ''
        if(quemVenceu === 'X'){
            mensagemVencedor = 'Parabéns, você venceu!'
        }else {
            mensagemVencedor = 'Poxa, você perdeu!'
        }
        avisoParagraph.textContent = mensagemVencedor
        return true
    }

    return false
}


function definirVencedor() {

    //        c1  c2  c3 
    // Linha1 _0_|_1_|_2_
    // Linha2 _3_|_4_|_5_
    // Linha3  6 | 7 | 8

    const vencedorLinha1 = matrizMarcados[0] !== '' ? (matrizMarcados[0] === matrizMarcados[1]) && (matrizMarcados[1] === matrizMarcados[2]) : false
    const vencedorLinha2 = matrizMarcados[3] !== '' ? (matrizMarcados[3] === matrizMarcados[4]) && (matrizMarcados[4] === matrizMarcados[5]) : false
    const vencedorLinha3 = matrizMarcados[6] !== '' ? (matrizMarcados[6] === matrizMarcados[7]) && (matrizMarcados[7] === matrizMarcados[8]) : false

    const vencedorColuna1 = matrizMarcados[0] !== '' ? (matrizMarcados[0] === matrizMarcados[3]) && (matrizMarcados[3] === matrizMarcados[6]) : false
    const vencedorColuna2 = matrizMarcados[1] !== '' ? (matrizMarcados[1] === matrizMarcados[4]) && (matrizMarcados[4] === matrizMarcados[7]) : false
    const vencedorColuna3 = matrizMarcados[2] !== '' ? (matrizMarcados[2] === matrizMarcados[5]) && (matrizMarcados[5] === matrizMarcados[8]) : false

    const vencedorDiagonal1 = matrizMarcados[0] !== '' ? (matrizMarcados[0] === matrizMarcados[4]) && (matrizMarcados[4] === matrizMarcados[8]) : false
    const vencedorDiagonal2 = matrizMarcados[2] !== '' ? (matrizMarcados[2] === matrizMarcados[4]) && (matrizMarcados[4] === matrizMarcados[6]) : false

    const venceuNaLinha = vencedorLinha1 || vencedorLinha2 || vencedorLinha3 
    const venceuNaColuna = vencedorColuna1 || vencedorColuna2 || vencedorColuna3 
    const venceuNaDiagonal = vencedorDiagonal1 || vencedorDiagonal2 

    let vencedor = ''

    if(vencedorLinha1){
        vencedor = matrizMarcados[0]
    }else if(vencedorLinha2){
        vencedor = matrizMarcados[3]
    }else if(vencedorLinha3){
        vencedor = matrizMarcados[6]
    }else if(vencedorColuna1){
        vencedor = matrizMarcados[0]
    }else if(vencedorColuna2){
        vencedor = matrizMarcados[1]
    }else if(vencedorColuna3){
        vencedor = matrizMarcados[2]
    }else if(vencedorDiagonal1){
        vencedor = matrizMarcados[0]
    }else if(vencedorDiagonal2){
        vencedor = matrizMarcados[2]
    }

    // console.log('definirVencedor - Linha',vencedorLinha1,vencedorLinha2,vencedorLinha3)
    // console.log('definirVencedor - Coluna',vencedorColuna1,vencedorColuna2,vencedorColuna3)
    // console.log('definirVencedor - Diagonal',vencedorDiagonal1,vencedorDiagonal2)

    // console.log('definirVencedor - OBJETO',{
    //     teveVencedor: venceuNaLinha || venceuNaColuna || venceuNaDiagonal,
    //     quemVenceu: vencedor
    // })

    return {
            teveVencedor: venceuNaLinha || venceuNaColuna || venceuNaDiagonal,
            quemVenceu: vencedor
        }   
}


function quemJoga() {
    const tamanhoArray = ordemJogar.length
    return ordemJogar[tamanhoArray -1]
}

function jogar() {
    const vezDeJogar = quemJoga()
    console.log('vez de quem jogar?',ordemJogar,vezDeJogar)
    
    limpar()
    
    if(vezDeJogar === 'O'){
        avisoParagraph.textContent = 'Computador irá jogar!'
        ordemJogar.push('X')
        setTimeout(()=>{
            computador()
        },500)
        return
    }
    habilitarInputs()
    avisoParagraph.textContent = 'É sua vez de jogar!'
    ordemJogar.push('O')
}
 
// somar vitorias do jogador

// somar vitorias do computador

// ANALISAR SE JOGADOR ESTÁ PARA BATER E ENTÃO FECHAR JOGADA.
// function fecharJogador() {
//     const verificarLinha = (posicaoInicial, posicaoFinal) => {
//         const arrayJogadasJogador = []
//         let posicaoParaFecharJogada = -1
//         for(let i = posicaoInicial; i <= posicaoFinal; i++){
//             const itemAtual = matrizMarcados[i]
//             if(itemAtual === 'X'){
//                 arrayJogadasJogador.push(itemAtual)
//             }else if(itemAtual === '') {
//                 posicaoParaFecharJogada = i
//             }
//         }
//         if(arrayJogadasJogador.length > 1){
//             console.log('LINHAS ->>>> fecharJogador:', arrayJogadasJogador, posicaoParaFecharJogada)
//             return posicaoParaFecharJogada
//         }
//     }

//     const verificarColuna = (posicaoInicial, posicaoFinal) => {
//         const arrayJogadasJogador = []
//         let posicaoParaFecharJogada = -1
//         for(let i = posicaoInicial; i <= posicaoFinal; i += 3){
//             const itemAtual = matrizMarcados[i]
//             if(itemAtual === 'X'){
//                 arrayJogadasJogador.push(itemAtual)
//             }else if(itemAtual === '') {
//                 posicaoParaFecharJogada = i
//             }
//         }
//         if(arrayJogadasJogador.length > 1){
//             console.log('COLUNAS ->>>> fecharJogador:', arrayJogadasJogador, posicaoParaFecharJogada)
//             return posicaoParaFecharJogada
//         }
//     }

//     const verificarDiagonal = (posicaoInicial, posicaoFinal, incremento) => {
//         const arrayJogadasJogador = []
//         let posicaoParaFecharJogada = -1
//         for(let i = posicaoInicial; i <= posicaoFinal; i += incremento){
//             const itemAtual = matrizMarcados[i]
//             if(itemAtual === 'X'){
//                 arrayJogadasJogador.push(itemAtual)
//             }else if(itemAtual === '') {
//                 posicaoParaFecharJogada = i
//             }
//         }
//         if(arrayJogadasJogador.length > 1){
//             console.log('DIAGONAIS ->>>> fecharJogador:', arrayJogadasJogador, posicaoParaFecharJogada)
//             return posicaoParaFecharJogada
//         }
//     }

//     const linhasVerificada = verificarLinha(0,2) || verificarLinha(3,5) || verificarLinha(6,8)
//     const colunasVerificada = verificarColuna(0,6) || verificarColuna(1,7) || verificarColuna(2,8)
//     const diagonaisVerificada = verificarDiagonal(0,8,4) || verificarDiagonal(2,6,2)

//     console.log(linhasVerificada,colunasVerificada)

//     if(linhasVerificada > 0) {
//         return linhasVerificada
//     }else if (colunasVerificada){
//         return colunasVerificada
//     }else if(diagonaisVerificada){
//         return diagonaisVerificada
//     }
    
// }

function fecharJogador() {
    const verificarEixo = (posicaoInicial, posicaoFinal, incremento) => {
        const arrayJogadasJogador = []
        let posicaoParaFecharJogada = -1
        for(let i = posicaoInicial; i <= posicaoFinal; i += incremento){
            const itemAtual = matrizMarcados[i]
            if(itemAtual === 'X'){
                arrayJogadasJogador.push(itemAtual)
            }else if(itemAtual === '') {
                posicaoParaFecharJogada = i
            }
        }
        if(arrayJogadasJogador.length > 1){
            console.log('DIAGONAIS ->>>> fecharJogador:', arrayJogadasJogador, posicaoParaFecharJogada)
            return posicaoParaFecharJogada
        }
    }

    const linhasVerificada = verificarEixo(0,2,1) || verificarEixo(3,5,1) || verificarEixo(6,8,1)
    const colunasVerificada = verificarEixo(0,6,3) || verificarEixo(1,7,3) || verificarEixo(2,8,3)
    const diagonaisVerificada = verificarEixo(0,8,4) || verificarEixo(2,6,2)

    console.log(linhasVerificada,colunasVerificada)

    if(linhasVerificada > 0) {
        return linhasVerificada
    }else if (colunasVerificada){
        return colunasVerificada
    }else if(diagonaisVerificada){
        return diagonaisVerificada
    }
    return -1
    
}
    //        c1  c2  c3 
    // Linha1 _0_|_1_|_2_
    // Linha2 _3_|_4_|_5_
    // Linha3  6 | 7 | 8




// ANALISAR SE COMPUTADOR ESTÁ PARA BATER E ENTÃO BATER, NÃO JOGAR ALEATÓRIO.
function computadorBater () {

}