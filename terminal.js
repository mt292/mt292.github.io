document.addEventListener('DOMContentLoaded', () => {
  const term = new Terminal({ cursorBlink: true });
  term.open(document.getElementById('terminal'));
  term.writeln("Welcome to Martin's terminal");
  term.writeln('Type a command to begin:');
  term.writeln(' - resume');
  term.writeln(' - linkedin');
  term.writeln(' - github');
  term.prompt = () => term.write('\r\n$ ');
  term.prompt();

  let command = '';
  term.onKey(e => {
    const char = e.key;
    if (char === '\r') {
      switch (command.trim()) {
        case 'resume':
          openLink('resume-page.html');
          break;
        case 'linkedin':
          openLink('https://linkedin.com/in/martin-topp');
          break;
        case 'github':
          openLink('https://github.com/mtopp292');
          break;
        default:
          term.writeln('Unknown command: ' + command);
      }
      command = '';
      term.prompt();
    } else if (char === '\u007f') {
      command = command.slice(0, -1);
      term.write('\b \b');
    } else if (char.length === 1) {
      command += char;
      term.write(char);
    }
  });
});

function openLink(url) {
  window.open(url, '_blank');
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}
