class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
            return true
        }

    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }

    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))


        localStorage.setItem('id', id)

    }

    recuperarTodosRegistros() {

        //array de despesas
        let despesas = []

        let id = localStorage.getItem('id')

        //recuperar todas as despesas cadastradas em locaStorage
        for (let i = 1; i <= id; i++) {

            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //existe a possibilidade de haver indices que foram pulados/removidos
            //nestes casos nós vamos literalmente pula-los
            if (despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar(despesa) {
        let despesasFiltradas = []
        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesa)

        console.log('despesaFiltradas (array original)')
        console.log(despesasFiltradas)

        //ano
        if (despesa.ano != '') {
            console.log('Filtro de ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        //mes
        if (despesa.mes != '') {
            console.log('Filtro de mes')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //dia
        if (despesa.dia != '') {
            console.log('Filtro de dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if (despesa.tipo != '') {
            console.log('Filtro de tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descrição
        if (despesa.descricao != '') {
            console.log('Filtro de descricao')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        //valor
        if (despesa.valor != '') {
            console.log('Filtro de valor')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas

    }

    remover(id) {
        localStorage.removeItem(id)

    }
}

let bd = new Bd()


function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.querySelector('#mes')
    let dia = document.querySelector('#dia')
    let tipo = document.querySelector('#tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')


    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if (despesa.validarDados()) {

        bd.gravar(despesa)

        //dialog de sucesso
        $('#modalRegistraDespesa').modal('show')

        let tituloModal = document.getElementById('titulo-modal')
        let botaoModal = document.getElementById('botao-modal')
        let modalTxt = document.getElementById('modal-txt')

        let modalHeader = document.getElementById('modal-header')

        //para apos o registro dos dados, retornar os campos de textos em branco
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''


        modalHeader.className = 'modal-header text-success'

        //tituloModal.style.color = 'green'
        tituloModal.innerHTML = 'Registro inserido com sucesso'
        botaoModal.className = 'btn btn-success'
        botaoModal.innerHTML = 'Voltar'
        modalTxt.innerHTML = "Despesa foi cadastrada com sucesso!"


    } else {
        //dialog de erro
        $('#modalRegistraDespesa').modal('show')

        let tituloModal = document.getElementById('titulo-modal')
        let botaoModal = document.getElementById('botao-modal')
        let modalTxt = document.getElementById('modal-txt')

        let modalHeader = document.getElementById('modal-header')

        modalHeader.className = 'modal-header text-danger'

        //tituloModal.style.color = 'red'
        tituloModal.innerHTML = 'Algo deu errado (Registro incompleto)'
        botaoModal.className = 'btn btn-danger'
        botaoModal.innerHTML = 'Voltar e corrigir'
        modalTxt.innerHTML = "Está faltando alguma informação, Tente novamente (ANIMAL)"

    }

}

function carregaListaDespesas(despesas = [], filtro = false) {

    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }



    //selecionando o elemento (tbody) da tabela em "consulta.html"
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''


    /*
            <tr>
            <td>7/2/22</td>
            <td>Educação</td>
            <td>hfgfffffffffffff</td>
            <td>55.66</td>
            </tr>
    */


    //percorrer o array despesas, listando cada despesa de forma dinâmica
    despesas.forEach(function (d) {
        // console.log(d)


        //criando a linha (tr)
        let linha = listaDespesas.insertRow()

        //criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        //ajustar o  tipo
        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break

            case '2': d.tipo = 'Educação'
                break

            case '3': d.tipo = 'Lazer'
                break

            case '4': d.tipo = 'Saúde'
                break

            case '5': d.tipo = 'Transporte'
                break

        }
        linha.insertCell(1).innerHTML = d.tipo


        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor


        //criar o botão para limpar/excluir despesa

        let btn = document.createElement('button')
        btn.className = 'btn btn-warning text-light'
        btn.innerHTML = '<i class="fas fa-times">'
        btn.id = `id-despesa-${d.id}`
        btn.onclick = function() { //remover despesa
            
            let id = this.id.replace('id-despesa-', '')
            //alert(id)
            bd.remover(id)

            window.location.reload()
        }
        linha.insertCell(4).append(btn)
        
        console.log(d)


    })

}

function pesquisarDespesa() {

    let ano = document.querySelector('#ano').value
    let mes = document.querySelector('#mes').value
    let dia = document.querySelector('#dia').value
    let tipo = document.querySelector('#tipo').value
    let descricao = document.querySelector('#descricao').value
    let valor = document.querySelector('#valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    this.carregaListaDespesas(despesas, true)

}