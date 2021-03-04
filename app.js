const matrizMarcados = ['','','','','','','','','']

const ordemJogar = ['X']

const avisoParagraph = document.querySelector('.avisos')

let pontosJogador = 0 
let pontosComputador = 0 

function jogar() {
    const vezDeJogar = quemJoga()
    console.log('vez de quem jogar?',ordemJogar,vezDeJogar)
    
    limpar()
    pintarInputs('black')

    if(vezDeJogar === 'O'){
        avisoParagraph.textContent = 'Computador irá jogar!'
        ordemJogar.push('X')
        setTimeout(()=>{
            computador()
        },200)
        return
    }
    habilitarInputs()
    avisoParagraph.textContent = 'É sua vez de jogar!'
    ordemJogar.push('O')
}

function limpar() {
    for(let i = 1; i <= 9; i++ ) {
        document.getElementById(`${i}`).value = ""
        document.getElementById(`${i}`).removeAttribute('disabled')
        matrizMarcados[i-1] = ''
    }
}

function quemJoga() {
    const tamanhoArray = ordemJogar.length
    return ordemJogar[tamanhoArray -1]
}

function verificarSeTabuleiroCompleto() {
    // console.log('       verificarSeTabuleiroCompleto', jogoEncerrado('O') || jogoEncerrado('X'))
    return jogoEncerrado('O') || jogoEncerrado('X')
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

function pintarInputs(cor) {
    for(let i = 1; i <= 9; i++ ) {
        document.getElementById(`${i}`).style.color = cor
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
            pintarInputs('#f1c40f') //amarelo 
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
    let campo = null

    // const fecharJogada = fecharJogador()
    // const ganhar = computadorBater()
    const fecharJogada = analisarJogadas('X')
    const ganhar = analisarJogadas('O')

    if(ganhar > 0){
        posicao = ganhar
        campo = document.getElementById(posicao + 1)
    }else if(fecharJogada > 0){
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

    const setarPontosJogador = document.querySelector('#pts-jogador').querySelector('p')
    const setarPontosComputador = document.querySelector('#pts-computador').querySelector('p')
    
    desabilitarInputs()
    
    if(teveVencedor){
        let mensagemVencedor = ''
        if(quemVenceu === 'X'){
            mensagemVencedor = 'Parabéns, você venceu!'
            pintarInputs('#27ae60') //verde
            pontosJogador++
            setarPontosJogador.textContent = pontosJogador
        }else {
            mensagemVencedor = 'Poxa, você perdeu!'
            pintarInputs('#d35400') // laranja
            pontosComputador++
            setarPontosComputador.textContent = pontosComputador
        }
        scrollTo(0,0)
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

    return {
            teveVencedor: venceuNaLinha || venceuNaColuna || venceuNaDiagonal,
            quemVenceu: vencedor
        }   
}

function analisarJogadas (letraXouO) {
    const verificarEixo = (posicaoInicial, posicaoFinal, incremento) => {
        const arrayJogadasJogador = []
        let posicaoParaFecharJogada = -1
        for(let i = posicaoInicial; i <= posicaoFinal; i += incremento){
            const itemAtual = matrizMarcados[i]
            if(itemAtual === letraXouO){
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
