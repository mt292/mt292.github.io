document.addEventListener('DOMContentLoaded', () => {
  const terminal = document.getElementById('terminal');

  terminal.addEventListener('click', () => {
    if (terminal.querySelector('.term-input')) return;
    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add('term-input');
    input.placeholder = 'type a command...';
    terminal.appendChild(input);
    input.focus();

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim().toLowerCase();
        let outputText = `➜ ${cmd}: command not found`;
        if (cmd === 'resume')    openLink('resume-page.html');
        else if (cmd === 'about')   scrollToSection('about');
        else if (cmd === 'linkedin') openLink('https://linkedin.com/in/martin-topp');
        else if (cmd === 'github')   openLink('https://github.com/mtopp292');
        const output = document.createElement('div');
        output.textContent = outputText;
        output.style.marginTop = '0.5rem';
        terminal.insertBefore(output, input);
        input.value = '';
      }
    });
  });
});

function openLink(url) {
  window.open(url, '_blank');
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}
