let vidaJogador = 10000, vidaOponente = 10000;
let turnoAtual = "";
let cartaPendente = null;
let atacanteSelecionadoIdx = null;
let jaComprouNoTurno = false;

const usuario = localStorage.getItem("usuarioLogado") || "Duelista";
let meuDeck = JSON.parse(localStorage.getItem(`deck_${usuario}`)) || [];
let minhaMao = [];
let monstrosJogador = [null, null, null]; // LINHA DA FRENTE
let especiaisJogador = [null, null, null]; // LINHA DE TRÁS
let monstrosOponente = [
    { nome: "Inimigo", ataque: 1500, defesa: 1200, imagem: "imagens/back.jpg", modo: "defesa", revelada: false },
    null, null
];

// Inicialização
document.getElementById("nomeUser").innerText = usuario.toUpperCase();
meuDeck.sort(() => Math.random() - 0.5);

function girarRoleta() {
    const btnGirar = document.getElementById("btnGirar");
    const r = document.getElementById("roleta");
    
    btnGirar.disabled = true; // Evita cliques duplos
    const sortei = Math.random() > 0.5 ? "VOCÊ" : "MÁQUINA";
    
    // Animação da roleta
    r.style.transform = sortei === "VOCÊ" ? "rotate(1800deg)" : "rotate(1980deg)";
    
    setTimeout(() => {
        turnoAtual = sortei;
        document.getElementById("modalRoleta").style.display = "none";
        document.getElementById("turnoAviso").innerText = `TURNO: ${turnoAtual}`;
        
        // COMPRA INICIAL DE 3 CARTAS
        for(let i = 0; i < 3; i++) {
            if(meuDeck.length > 0) minhaMao.push(meuDeck.pop());
        }
        
        atualizarTela();
    }, 3200);
}

function comprarCarta() {
    if (turnoAtual !== "VOCÊ" || meuDeck.length === 0 || jaComprouNoTurno) return;
    
    minhaMao.push(meuDeck.pop());
    jaComprouNoTurno = true; 
    atualizarTela();
}

function usarDaMao(idx) {
    if (turnoAtual !== "VOCÊ") return;
    const carta = minhaMao[idx];

    if (carta.tipo === "monstro") {
        cartaPendente = { carta, idxNaMao: idx };
        document.getElementById("modalPosicao").style.display = "flex";
    } else {
        // Vai para a linha de TRÁS
        let slotLivre = especiaisJogador.findIndex(s => s === null);
        if (slotLivre !== -1) {
            especiaisJogador[slotLivre] = { ...carta, revelada: true };
            minhaMao.splice(idx, 1);
        } else {
            alert("Linha de suporte cheia!");
        }
        atualizarTela();
    }
}

function definirPosicao(modo) {
    // Vai para a linha da FRENTE
    let slotLivre = monstrosJogador.findIndex(s => s === null);
    if (slotLivre !== -1) {
        monstrosJogador[slotLivre] = { 
            ...cartaPendente.carta, 
            modo: modo, 
            revelada: (modo === 'ataque') 
        };
        minhaMao.splice(cartaPendente.idxNaMao, 1);
    } else {
        alert("Linha de monstros cheia!");
    }
    document.getElementById("modalPosicao").style.display = "none";
    cartaPendente = null;
    atualizarTela();
}

function atualizarTela() {
    document.getElementById("vidaJogador").innerText = vidaJogador;
    document.getElementById("vidaOponente").innerText = vidaOponente;
    document.getElementById("contador-deck").innerText = meuDeck.length;
    
    renderLinha("monstrosJogador", monstrosJogador, (i) => selecionarAtacante(i), false);
    renderLinha("especiaisJogador", especiaisJogador, null, false);
    renderLinha("monstrosOponente", monstrosOponente, (i) => atacar(i), true);
    renderLinha("especiaisOponente", [null, null, null], null, true);

    const btn = document.getElementById("btnComprar");
    btn.disabled = (turnoAtual !== "VOCÊ" || jaComprouNoTurno || meuDeck.length === 0);

    const maoDiv = document.getElementById("minhaMao");
    maoDiv.innerHTML = "";
    minhaMao.forEach((c, i) => {
        const img = document.createElement("img");
        img.src = c.imagem;
        img.className = "carta-mao";
        img.onclick = () => usarDaMao(i);
        maoDiv.appendChild(img);
    });
}

function renderLinha(id, lista, clique, oponente) {
    const el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = "";
    lista.forEach((c, i) => {
        const div = document.createElement("div");
        div.className = `slot ${c && c.modo === 'defesa' ? 'modo-defesa' : ''} ${!oponente && atacanteSelecionadoIdx === i ? 'selecionada' : ''}`;
        if (clique) div.onclick = () => clique(i);
        if (c) {
            const imgPath = (oponente && !c.revelada) ? "imagens/back.jpg" : c.imagem;
            div.innerHTML = `<img src="${imgPath}" class="carta-img">`;
            if (!oponente || c.revelada) {
                div.innerHTML += `<div class="status-badge">ATK ${c.ataque || 0}</div>`;
            }
        }
        el.appendChild(div);
    });
}

// Funções de Ataque
function selecionarAtacante(i) {
    if (monstrosJogador[i] && monstrosJogador[i].modo === 'ataque') {
        atacanteSelecionadoIdx = (atacanteSelecionadoIdx === i) ? null : i;
        atualizarTela();
    }
}

function atacar(alvoIdx) {
    if (atacanteSelecionadoIdx === null || !monstrosOponente[alvoIdx]) return;
    const atk = monstrosJogador[atacanteSelecionadoIdx];
    const def = monstrosOponente[alvoIdx];
    if (!def.revelada) def.revelada = true;
    
    if (def.modo === 'defesa') {
        if (atk.ataque > def.defesa) monstrosOponente[alvoIdx] = null;
        else if (atk.ataque < def.defesa) vidaJogador -= (def.defesa - atk.ataque);
    } else {
        if (atk.ataque > def.ataque) { 
            vidaOponente -= (atk.ataque - def.ataque); 
            monstrosOponente[alvoIdx] = null; 
        }
        else if (atk.ataque < def.ataque) { 
            vidaJogador -= (def.ataque - atk.ataque); 
            monstrosJogador[atacanteSelecionadoIdx] = null; 
        }
    }
    atacanteSelecionadoIdx = null;
    atualizarTela();
}