function fazerLogin() {
    const input = document.getElementById("username");
    const nome = input.value.trim();

    if (nome === "") {
        alert("Pela honra do reino, um duelista precisa de um nome!");
        input.focus();
        return;
    }

    localStorage.setItem("usuarioLogado", nome);

    // Se o jogador não tiver deck, cria o inicial com os novos status
    if (!localStorage.getItem(`deck_${nome}`)) {
        const deckInicial = [
            // 5 Guerreiros Nível 1: 600 ATK / 300 DEF
            ...Array(5).fill({ nome: "Guerreiro 1", ataque: 600, defesa: 300, imagem: "imagens/guerreiro1.jpg", tipo: "monstro", nivel: 1 }),
            // 2 Guerreiros Nível 2: 1200 ATK / 800 DEF
            ...Array(2).fill({ nome: "Guerreiro 2", ataque: 1200, defesa: 800, imagem: "imagens/guerreiro2.jpg", tipo: "monstro", nivel: 2 }),
            // Itens Especiais
            ...Array(3).fill({ nome: "Vida", valor: 1000, tipo: "especial", imagem: "imagens/vida.jpg" }),
            ...Array(2).fill({ nome: "Power Up", valor: 300, tipo: "especial", imagem: "imagens/powerup.jpg" })
        ];

        localStorage.setItem(`deck_${nome}`, JSON.stringify(deckInicial));
        localStorage.setItem(`moedas_${nome}`, "0");
        localStorage.setItem(`nivel_${nome}`, "1");
        localStorage.setItem(`vitorias_${nome}`, "0");
    }

    window.location.href = "deck.html";
}

document.addEventListener('keypress', (e) => { if (e.key === 'Enter') fazerLogin(); });