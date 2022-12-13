const textarea = document.querySelector(".textarea");
const btnGravar = document.querySelector("#btnGravar");
const btnParar = document.querySelector("#btnParar");
const btnVer = document.querySelector("#btnVer");
const btnLimpar = document.querySelector("#btnLimpar");

class speechApi {
    constructor() {

        const SpeechToText = window.SpeechRecognition || window.webkitSpeechRecognition;

        this.speechApi = new SpeechToText();
        this.output = textarea.output;
        this.speechApi.continuous = true;
        this.speechApi.lang = 'pt-BR';

        this.speechApi.onresult = e => {
            let resultIndex = e.resultIndex;
            let transcript = e.results[resultIndex][0].transcript

            textarea.value += transcript
        }
    }
    start() {
        this.speechApi.start()
    }
    stop() {
        this.speechApi.stop()
    }
}




let speech = new speechApi()

btnGravar.addEventListener('click', () => {
    btnGravar.disabled = true;
    btnParar.disabled = false;
    speech.start()
})
btnParar.addEventListener('click', () => {
    btnGravar.disabled = false;
    btnParar.disabled = true;
    speech.stop();


})

btnLimpar.addEventListener('click', () => {
    textarea.value = "";
    speech.stop();
})






btnVer.addEventListener('click', () => {
    
    let arr = []
    let valor = textarea.value;
    arr = valor.split(" ");
    
    
    
    //retirando as palavras da array de pedido
    let nomeCliente = arr[0]
    let nomeProduto = arr[2]
    let quantidade = 0

    //conversão de número em extenso para número inteiro
    if (arr[1] == "um" || arr[1] == "uma" || arr[1] == 1) {
        quantidade = 1;
    }
    if (arr[1] == "dois" || arr[1] == "duas" || arr[1] == 2) {
        quantidade = 2;
    }

    //Essa é a lista de numeros que pode ser captada pelo reconhecimento de voz, pode ser ampliada no futuro
    const numeros = ["três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez"]

    let index = 3;

    for (contagem = 0; contagem < numeros.length; contagem++) {
        if (arr[1] == numeros[contagem]) {
            quantidade = index
        }
        index++
    }

    //objeto pedido que vai ser enviado para o banco de dados
    let pedido = {
        "nomeCliente": nomeCliente,
        "quantidade": quantidade,
        "nomeProduto": nomeProduto
    }

    //enviando o pedido para o banco de dados
    let xhr = new XMLHttpRequest();

    //Enviando dados para API
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            console.log(xhr)
        }
    }
    xhr.open("POST", "http://localhost:8080/pedido")

    xhr.setRequestHeader("Content-Type", "application/json");

    let jsonPedido = JSON.stringify(pedido)

    xhr.send(jsonPedido)


})