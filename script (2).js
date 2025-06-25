// Função para iniciar o timer de 60s por exercício
function iniciarTimer(id) {
    let seconds = 60;
    const timerDiv = document.getElementById(`timer-${id}`);
    timerDiv.textContent = `⏳ Tempo restante: ${seconds}s`;

    const countdown = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
            clearInterval(countdown);
            timerDiv.textContent = "✅ Tempo finalizado!";
        } else {
            timerDiv.textContent = `⏳ Tempo restante: ${seconds}s`;
        }
    }, 1000);
}

// Função para marcar o exercício como concluído
function marcarConcluido(id) {
    const li = document.getElementById(`ex-${id}`);
    if (!li) return;

    li.classList.add("concluido");

    let statusSpan = li.querySelector(".status");
    if (!statusSpan) {
        statusSpan = document.createElement("span");
        statusSpan.className = "status";
        li.querySelector(".exercise-actions")?.appendChild(statusSpan);
    }
    statusSpan.textContent = "✔️ Concluído";
    statusSpan.style.color = "#0f0";

    // Salvar no localStorage
    const progresso = JSON.parse(localStorage.getItem("progressoTreino")) || {};
    progresso[`ex-${id}`] = progresso[`ex-${id}`] || {};
    progresso[`ex-${id}`].concluido = true;
    localStorage.setItem("progressoTreino", JSON.stringify(progresso));
}

// Restaura status e cargas ao abrir a página
window.onload = function () {
    const progresso = JSON.parse(localStorage.getItem("progressoTreino")) || {};

    document.querySelectorAll("li[id^='ex-']").forEach(li => {
        const id = li.id;
        const data = progresso[id];
        if (!data) return;

        // Restaurar conclusão
        if (data.concluido) {
            li.classList.add("concluido");
            let statusSpan = li.querySelector(".status");
            if (!statusSpan) {
                statusSpan = document.createElement("span");
                statusSpan.className = "status";
                li.querySelector(".exercise-actions")?.appendChild(statusSpan);
            }
            statusSpan.textContent = "✔️ Concluído";
            statusSpan.style.color = "#0f0";
        }

        // Restaurar carga
        if (data.carga !== undefined) {
            const input = li.querySelector("input[type='number']");
            if (input) input.value = data.carga;
        }
    });

    // Escutar mudanças nos campos de carga
    document.querySelectorAll("li[id^='ex-'] input[type='number']").forEach(input => {
        input.addEventListener("input", () => {
            const li = input.closest("li");
            const id = li.id;
            const progresso = JSON.parse(localStorage.getItem("progressoTreino")) || {};
            progresso[id] = progresso[id] || {};
            progresso[id].carga = input.value;
            localStorage.setItem("progressoTreino", JSON.stringify(progresso));
        });
    });
};

// Envio de relatório via WhatsApp
function enviarRelatorio() {
    const mensagem = `Treino semanal concluído! Semana 1 - Brenda`;
    const url = `https://wa.me/5592984413665?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}
