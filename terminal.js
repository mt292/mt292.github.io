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
        const cmd = input.value.trim();
        const output = document.createElement('div');
        output.textContent = `➜ ${cmd}: command not found`;
        output.style.marginTop = '0.5rem';
        terminal.insertBefore(output, input);
        input.value = '';
      }
    });
  });
});
