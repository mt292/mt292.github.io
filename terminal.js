// terminal.js — xterm.js console with auto-scroll
// (c) 2025 Martin Topp <
// dont steal my code, please
// Commands: about, help, linkedin, resume, clear, cd, ls, echo, cat, whoami, pwd

(function () {
  const COMMANDS = [
    "about","help","linkedin","resume",
    "clear","cd","ls","echo","cat","whoami","pwd"
  ];

  // Routes/links
  const ROUTES = {
    about:    "#about",
    linkedin: "https://linkedin.com/in/martin-topp",
    resume:   "/resume-page.html",
    rmrf: "/delete.html",
  };

  const term = new Terminal({ cursorBlink: true });
  let history = [];
  let histIdx = 0;
  let buffer = "";

  // Helper to always push viewport to newest line
  function scrollBottom() {
    // microtask avoids fighting xterm's own render timing
    queueMicrotask(() => term.scrollToBottom());
  }

  document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("terminal");
    term.open(mount);

    // Initial banner
    sys(`Martin's Terminal ~`);
    sys(`Type "help" for commands.`);
    prompt();

    // If the terminal resizes, stay pinned to bottom
    term.onResize(scrollBottom);

    term.onKey(({ key, domEvent }) => {
      const k = domEvent.key;

      if (k === "Enter") {
        const input = buffer.trim();
        writeUser(input);
        if (input.length === 0) {
          sys("");
          return prompt();
        }

        history = history.length === 0 ? [input] : [...history, input];
        histIdx = history.length - 1;
        handle(input);
        buffer = "";
        return;
      }

      if (k === "Backspace") {
        if (buffer.length > 0) {
          buffer = buffer.slice(0, -1);
          term.write("\b \b");
          scrollBottom();
        }
        return;
      }

      if (k === "ArrowUp") {
        if (history.length > 0) {
          term.write("\x1b[2K\r");
          promptBare();
          buffer = history[histIdx];
          term.write(buffer);
          if (histIdx > 0) histIdx--;
          scrollBottom();
        }
        return;
      }

      if (k === "ArrowDown") {
        if (history.length > 0) {
          term.write("\x1b[2K\r");
          promptBare();
          if (histIdx < history.length - 1) {
            histIdx++;
            buffer = history[histIdx];
          } else {
            buffer = "";
          }
          term.write(buffer);
          scrollBottom();
        }
        return;
      }

      if (key.length === 1 && !domEvent.ctrlKey && !domEvent.metaKey) {
        buffer += key;
        term.write(key);
        // don't auto-scroll on each printable key (optional), but harmless:
        scrollBottom();
      }
    });
  });

  // ---------- Command handlers ----------
  function handle(raw) {
    const [cmd, ...args] = raw.split(/\s+/);
    if (COMMANDS.includes(cmd)) {
      switch (cmd) {
        case "help":
          return sys("Commands: " + COMMANDS.join(", ")).then(prompt);

        case "clear":
          term.clear();
          scrollBottom();
          return prompt();

        case "ls":
          return sys("Desktop  Downloads  youshouldreadmyresume.sh").then(prompt);

        case "cd":
          return cd(args[0]).then(prompt);

        case "echo":
          return sys(args.join(" ")).then(prompt);

        case "cat":
          return sys("British Shorthair all the way").then(prompt);

        case "whoami":
          return sys("Martin Topp").then(prompt);

        case "pwd":
          return sys("~/topp").then(prompt);

        case "about":
          return openRoute("about").then(prompt);

        case "linkedin":
          openExternal(ROUTES.linkedin);
          return sys("Opening LinkedIn…").then(prompt);

        case "resume":
          location.href = ROUTES.resume;
          return sys("Opening resume…").then(prompt);

        case "rm -rf":
          location.href = ROUTES.rmrf;
          return sys("bro...").then(prompt);
      }
    } else {
      const { most, score } = closest(raw);
      if (score > 0) {
        return err(`Command not found: '${raw}'. Did you mean '${most}'?`).then(prompt);
      }
      return err(`Command not found: '${raw}'. Type 'help' for commands.`).then(prompt);
    }
  }

  async function cd(arg) {
    if (!arg) {
      await err("cd: ~/topp");
      return;
    }
    if (arg === "about") {
      await openRoute("about");
    } else {
      await err(`Directory not found: ${arg}`);
    }
  }

  async function openRoute(key) {
    const dest = ROUTES[key];
    if (!dest) {
      await err(`Route not found: ${key}`);
      return;
    }
    if (dest.startsWith("#")) {
      document.querySelector(dest)?.scrollIntoView({ behavior: "smooth" });
      await sys(`Opened ${dest}`);
    } else {
      location.href = dest;
    }
  }

  // ---------- Output helpers (auto-scroll after every write) ----------
  function prompt() {
    term.write(`\r\n\x1b[38;2;250;70;22m$\x1b[0m `); // orange prompt
    scrollBottom();
  }
  function promptBare() {
    term.write(`\r\x1b[38;2;250;70;22m$\x1b[0m `);
    scrollBottom();
  }
  function writeUser(text) {
    term.write(`\r\n\x1b[38;2;16;185;129m${text}\x1b[0m\r\n`); // green input echo
    scrollBottom();
  }
  function sys(text = "") {
    term.write(`${text}\r\n`);
    scrollBottom();
    return Promise.resolve();
  }
  function err(text) {
    term.write(`\x1b[31m${text}\x1b[0m\r\n`);
    scrollBottom();
    return Promise.resolve();
  }
  document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("terminal-input").focus();
  });


  

  // ---------- Utils ----------
  function openExternal(url) {
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (w) { try { w.opener = null; } catch (_) {} }
  }

  function closest(input) {
    let best = "", bestScore = 0;
    for (const c of COMMANDS) {
      let s = 0;
      for (let i = 0; i < input.length && i < c.length; i++) {
        if (input[i] === c[i]) s++; else break;
      }
      if (s > bestScore) { best = c; bestScore = s; }
    }
    return { most: best, score: bestScore };
  }
})();
