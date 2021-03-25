const matrizMarcados = ['','','','','','','','','']
const ordemJogar = ['X']

let proximaJogada = [0,1,2,3,4,5,6,7,8]
let controlarMarcacoes = 0

const avisoParagraph = document.querySelector('.avisos')

let pontosJogador = 0 
let pontosComputador = 0 
let ultimaPosicaoJogadoComputador = -1

function jogar() {
    const vezDeJogar = quemComecaJogar()

    proximaJogada = [0,1,2,3,4,5,6,7,8]

    controlarMarcacoes = 0
    
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
        document.getElementById(`${i}`).textContent = ""
        // document.getElementById(`${i}`).removeAttribute('onclick')
        matrizMarcados[i-1] = ''
    }
}

function quemComecaJogar() {
    const tamanhoArray = ordemJogar.length
    return ordemJogar[tamanhoArray -1]
}

function verificarSeTabuleiroCompleto() {
    return jogoEncerrado('O') || jogoEncerrado('X')
}

function desabilitarInputs() {
    for(let i = 1; i <= 9; i++ ) {
        document.getElementById(`${i}`).removeAttribute('onclick','')
        document.getElementById(`${i}`).style.cursor = 'auto'
    }
}

function habilitarInputs() {
    for(let i = 1; i <= 9; i++ ) {
        document.getElementById(`${i}`).setAttribute('onclick','jogador(id)')
        document.getElementById(`${i}`).style.cursor = 'pointer'
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

    const qtdMarcadoPorLetra =  matrizMarcados.filter(item => item === letraAVerificar )

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
}

function conferirSeJaMarcou(posicao) {
    return matrizMarcados[posicao] !== ''
}

function jogador(id) {
    const campo = document.getElementById(id)
    const posicao = id - 1
    const posicaoJaMarcada = conferirSeJaMarcou(posicao)
    
    if(posicaoJaMarcada){
        return
    }
    
    campo.textContent = 'X'
    
    adicionarJogada(posicao, 'X')

    controlarMarcacoes++
    
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

    const fecharJogada = analisarJogadas('X')
    const ganhar = analisarJogadas('O')

    if (controlarMarcacoes === 0){
        const primeiraJogadaComputador = [0,2,4,6,8]
        if(!primeiraJogadaComputador.includes(posicao)){
            numAleatorioGerado = gerarNumAleatorio()
            posicao = numAleatorioGerado - 1
        }
        campo = document.getElementById(posicao + 1)
    }else if (controlarMarcacoes === 1 && pegarPrimeiraJogadaJogador()){
        posicao = 4
        campo = document.getElementById(posicao + 1)
    }else if(ganhar > 0){
        posicao = ganhar
        campo = document.getElementById(posicao + 1)
    }else if(fecharJogada > 0){
        posicao = fecharJogada
        campo = document.getElementById(posicao + 1)
    }else{ 
        proximaJogadaComputador(ultimaPosicaoJogadoComputador)
        // console.log('###', matrizMarcados,proximaJogada)
        // console.log('ultimaPosicaoJogadoComputador', ultimaPosicaoJogadoComputador)
        let possivelMarcacao = proximaJogada.includes(posicao)
        while (posicaoJaMarcada || (possivelMarcacao === false && controlarMarcacoes < 5)){
            // console.log('Era minha vez:', posicao)
            numAleatorioGerado = gerarNumAleatorio()
            posicao = numAleatorioGerado - 1
            possivelMarcacao = proximaJogada.includes(posicao)
            posicaoJaMarcada = conferirSeJaMarcou(posicao)
            contador++
            if(contador > 1500) {
                // console.log('ufa')
                break
            }
        }
        campo = document.getElementById(numAleatorioGerado)
    }
    
    campo.textContent = "O"

    ultimaPosicaoJogadoComputador = posicao

    adicionarJogada(posicao, 'O')

    controlarMarcacoes++
    
    // proximaJogadaComputador(posicao)

    avisoParagraph.textContent = 'É sua vez de jogar!'

    if(encerrarJogo()){
        return true
    }

    if(verificarSeTabuleiroCompleto()){
        return
    }

    habilitarInputs()
}

function proximaJogadaComputador(ultimaPosicaoMarcada) {
    let posicoesPossiveis = []
    proximaJogada = []

    switch (ultimaPosicaoMarcada) {
        case 0:
            posicoesPossiveis = [1,2,3,4,6,8]
            break
        case 1:
            posicoesPossiveis = [0,2,4,7]
            break
        case 2:
            posicoesPossiveis = [0,1,4,5,6,8]
            break
        case 3:
            posicoesPossiveis = [0,4,5,6]
            break
        case 4:
            posicoesPossiveis = [0,1,2,3,5,6,7,8]
            break
        case 5:
            posicoesPossiveis = [2,3,4,8]
            break
        case 6:
            posicoesPossiveis = [0,2,3,4,7,8]
            break     
        case 7:
            posicoesPossiveis = [1,4,6,8]
            break  
        case 8:
            posicoesPossiveis = [0,1,2,4,6,7]
            break  
    }
        
    posicoesPossiveis.forEach((pos) => {
        const temAlgoMarcado = matrizMarcados[pos].includes('X') || matrizMarcados[pos].includes('O')

        if (!conferirSeJaMarcou(pos) && !temAlgoMarcado) {
            proximaJogada.push(pos)
        }
    })

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
            mensagemVencedor = 'Poxa, você perdeu. Tente de novo!'
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
            return posicaoParaFecharJogada
        }
    }

    const linhasVerificada = verificarEixo(0,2,1) || verificarEixo(3,5,1) || verificarEixo(6,8,1)
    const colunasVerificada = verificarEixo(0,6,3) || verificarEixo(1,7,3) || verificarEixo(2,8,3)
    const diagonaisVerificada = verificarEixo(0,8,4) || verificarEixo(2,6,2)

    if(linhasVerificada > 0) {
        return linhasVerificada
    }else if (colunasVerificada){
        return colunasVerificada
    }else if(diagonaisVerificada){
        return diagonaisVerificada
    }
    return -1
}

function pegarPrimeiraJogadaJogador() {
    return matrizMarcados[0].includes('X') || matrizMarcados[2].includes('X') || matrizMarcados[6].includes('X') || matrizMarcados[8].includes('X')
}