document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema Infoviário Inicializado...");

    const buttons = document.querySelectorAll('.btn-read');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const title = e.target.parentElement.querySelector('h3').innerText;
            alert(`Você está acessando dados sobre: ${title}\nRedirecionando via infraestrutura infoviária...`);
        });
    });

    // Efeito de scroll no header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.background = '#000';
        } else {
            header.style.background = '#1a1a2e';
        }
    });
});