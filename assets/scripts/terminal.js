// terminal.js — xterm.js console with enhanced Linux commands
// (c) 2025 Martin Topp
// dont steal my code, please

(function () {
  const COMMANDS = [
    "help", "about", "clear", "ls", "cd", "pwd", "cat", "echo", "whoami", 
    "uname", "date", "history", "mkdir", "touch", "rm", "grep", "find", 
    "tree", "resume", "linkedin", "github", "contact", "skills", "neofetch"
  ];

  // Routes/links
  const ROUTES = {
    about:    "#about",
    linkedin: "https://linkedin.com/in/martin-topp",
    github:   "https://github.com/mt292",
    resume:   "/resume",
  };

  // File system structure - Martin themed!
  const FILESYSTEM = {
    "/home/topp": {
      type: "dir",
      contents: {
        "about.txt": { type: "file", content: "Martin Topp | Cybersecurity Student | Windows Lead & OffSec Specialist\nIndiana Tech Cyber Warriors | GPA 3.9 | Aspiring Cybersecurity Professional" },
        "resume.txt": { type: "file", content: "Check out my full resume at: /resume\nSkills: Python, Bash, PowerShell, AD, GPO, DNS, Linux, Windows\nCertifications: TRUST Drone, NCAE Competitor, ServSafe" },
        "contact.txt": { type: "file", content: "Email: mtopp887@gmail.com\nPhone: (219) 789-3297\nLinkedIn: linkedin.com/in/martin-topp\nGitHub: github.com/mt292" },
        "skills.txt": { type: "file", content: "Offensive Security | Red Teaming | Penetration Testing\nWindows Security | Active Directory | Group Policy\nPython | Bash | PowerShell | HTML/CSS\nCCDC Top 6 | NCAE MVP | NCL Competitor" },
        "projects": {
          type: "dir",
          contents: {
            "scoring-engine.md": { type: "file", content: "Linux Scoring Engine - Python-based monitoring for SSH, WEB, DNS, FTP" },
            "ai-training.md": { type: "file", content: "Local AI Model - Trained on Indiana Tech data for student Q&A" },
            "ctfd.md": { type: "file", content: "CTFd Tryout Portal - 100+ users, Digital Forensics, Web Exploitation, OSINT" },
            "datacenter.md": { type: "file", content: "Datacenter Redesign - 99.98% uptime, Proxmox stack, AD/LDAP integration" },
          }
        },
        "competitions": {
          type: "dir",
          contents: {
            "ccdc.txt": { type: "file", content: "CCDC - Top 6 finish | National collegiate defense competition" },
            "ncae.txt": { type: "file", content: "NCAE Cyber Games - MVP Award | Most Improved Teammate" },
            "ubuff.txt": { type: "file", content: "UBuff Lockdown - Buffalo State cybersecurity competition" },
          }
        },
        ".secrets": {
          type: "dir",
          contents: {
            "flag.txt": { type: "file", content: "Nice work! You found the hidden flag.\nflag{y0u_f0und_m4rt1n5_s3cr3t}" },
          }
        }
      }
    }
  };

  const term = new Terminal({ 
    cursorBlink: true,
    scrollback: 1000,
    convertEol: true
  });
  let history = [];
  let histIdx = 0;
  let buffer = "";
  let currentPath = "/home/topp";
  let isDestroyed = false;

  // Helper to always push viewport to newest line
  function scrollBottom() {
    queueMicrotask(() => {
      term.scrollToBottom();
      // Ensure viewport is at the bottom
      const viewport = document.querySelector('.xterm-viewport');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    });
    // Also scroll immediately
    setTimeout(() => {
      term.scrollToBottom();
      const viewport = document.querySelector('.xterm-viewport');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }, 0);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("terminal");
    term.open(mount);

    // Fit terminal to container on mobile
    const fitTerminal = () => {
      const cols = Math.floor(mount.clientWidth / 9); // approximate char width
      const rows = Math.floor(mount.clientHeight / 17); // approximate line height
      term.resize(Math.max(cols, 40), Math.max(rows, 10));
    };

    fitTerminal();
    window.addEventListener('resize', fitTerminal);

    // Initial banner
    sys(`\x1b[38;2;250;70;22mWelcome to Martin's Portfolio Terminal v2.0\x1b[0m`);
    sys(`Type "help" for available commands or "neofetch" for system info.`);
    sys(``);
    prompt();

    // Auto-focus terminal so users can start typing immediately
    term.focus();
    
    // Re-focus terminal when clicking anywhere on the page
    document.addEventListener('click', () => {
      term.focus();
    });

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

        history.push(input);
        histIdx = history.length;
        handle(input);
        buffer = "";
        return;
      }

      if (k === "Tab") {
        domEvent.preventDefault();
        const parts = buffer.split(/\s+/);
        
        // If empty or just starting, complete command
        if (parts.length === 1) {
          const partial = parts[0].toLowerCase();
          const matches = COMMANDS.filter(cmd => cmd.startsWith(partial));
          
          if (matches.length === 1) {
            // Single match - complete it
            const completion = matches[0];
            buffer = completion + " ";
            term.write("\x1b[2K\r");
            promptBare();
            term.write(buffer);
          } else if (matches.length > 1) {
            // Multiple matches - show them
            sys("");
            sys(matches.join("  "));
            promptBare();
            term.write(buffer);
          }
        } else if (parts.length >= 2) {
          // Complete file/directory names
          const cmd = parts[0].toLowerCase();
          const partial = parts[parts.length - 1];
          
          // Get current directory contents
          const currentDir = resolvePath(currentPath);
          if (currentDir && currentDir.type === "dir") {
            const entries = Object.keys(currentDir.contents);
            const matches = entries.filter(name => name.startsWith(partial));
            
            if (matches.length === 1) {
              // Single match - complete it
              parts[parts.length - 1] = matches[0];
              buffer = parts.join(" ");
              term.write("\x1b[2K\r");
              promptBare();
              term.write(buffer);
            } else if (matches.length > 1) {
              // Multiple matches - show them
              sys("");
              sys(matches.join("  "));
              promptBare();
              term.write(buffer);
            }
          }
        }
        scrollBottom();
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
        if (history.length > 0 && histIdx > 0) {
          histIdx--;
          term.write("\x1b[2K\r");
          promptBare();
          buffer = history[histIdx];
          term.write(buffer);
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
            histIdx = history.length;
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
        scrollBottom();
      }
    });

    // Keep terminal focused and scrolled to bottom
    setInterval(() => {
      scrollBottom();
    }, 100);
    
    // Also scroll after any terminal write
    const originalWrite = term.write.bind(term);
    term.write = function(...args) {
      originalWrite(...args);
      scrollBottom();
    };
  });

  // ---------- Command handlers ----------
  function handle(raw) {
    const parts = raw.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    const fullCmd = parts.join(" ");

    // Check for rm -rf with wildcard
    if ((fullCmd === "rm -rf /*" || fullCmd === "sudo rm -rf /*")) {
      return destroyWebsite();
    }

    if (!COMMANDS.includes(cmd)) {
      const { most, score } = closest(cmd);
      if (score > 0.4) {
        return err(`Command not found: '${cmd}'. Did you mean '${most}'?`).then(prompt);
      }
      return err(`Command not found: '${cmd}'. Type 'help' for commands.`).then(prompt);
    }

    switch (cmd) {
      case "help":
        return cmdHelp().then(prompt);
      case "clear":
        term.clear();
        scrollBottom();
        return prompt();
      case "ls":
        return cmdLs(args).then(prompt);
      case "cd":
        return cmdCd(args[0]).then(prompt);
      case "pwd":
        return sys(currentPath).then(prompt);
      case "cat":
        return cmdCat(args[0]).then(prompt);
      case "echo":
        return sys(args.join(" ")).then(prompt);
      case "whoami":
        return sys("topp").then(prompt);
      case "uname":
        return sys("Linux portfolio 6.1.0-topp #1 SMP Martin's Custom Kernel").then(prompt);
      case "date":
        return sys(new Date().toString()).then(prompt);
      case "history":
        return cmdHistory().then(prompt);
      case "mkdir":
        return sys("Permission denied: This is a read-only portfolio filesystem").then(prompt);
      case "touch":
        return sys("Permission denied: This is a read-only portfolio filesystem").then(prompt);
      case "rm":
        if (args.includes("-rf") || args.includes("-r")) {
          return err("WARNING: Dangerous command detected! Use 'rm -rf /*' if you really want to delete everything...").then(prompt);
        }
        return sys("Permission denied: This is a read-only portfolio filesystem").then(prompt);
      case "grep":
        return cmdGrep(args).then(prompt);
      case "find":
        return cmdFind(args[0]).then(prompt);
      case "tree":
        return cmdTree().then(prompt);
      case "about":
        scrollToSection("#about");
        return sys("Navigating to About section...").then(prompt);
      case "resume":
        window.location.href = ROUTES.resume;
        return sys("Opening resume...").then(prompt);
      case "linkedin":
        openExternal(ROUTES.linkedin);
        return sys("Opening LinkedIn profile...").then(prompt);
      case "github":
        openExternal(ROUTES.github);
        return sys("Opening GitHub profile...").then(prompt);
      case "contact":
        scrollToSection("#contact");
        return sys("Navigating to Contact section...").then(prompt);
      case "skills":
        return cmdSkills().then(prompt);
      case "neofetch":
        return cmdNeofetch().then(prompt);
      default:
        return err(`Command '${cmd}' not yet implemented.`).then(prompt);
    }
  }

  // ---------- Command implementations ----------
  async function cmdHelp() {
    await sys("\x1b[1;36mAvailable Commands:\x1b[0m");
    await sys("  \x1b[33mNavigation:\x1b[0m ls, cd, pwd, tree");
    await sys("  \x1b[33mFile Ops:\x1b[0m cat, echo, grep, find");
    await sys("  \x1b[33mInfo:\x1b[0m whoami, uname, date, history, neofetch");
    await sys("  \x1b[33mPortfolio:\x1b[0m about, resume, linkedin, github, contact, skills");
    await sys("  \x1b[33mSystem:\x1b[0m clear, help");
    await sys("");
    await sys("\x1b[2mTry 'ls' to explore the filesystem or 'neofetch' for system info!\x1b[0m");
    await sys("\x1b[2m\x1b[31mWarning: rm -rf /* deletes the website\x1b[0m");
  }

  async function cmdLs(args) {
    const showHidden = args.includes("-a") || args.includes("-la") || args.includes("-al");
    const longFormat = args.includes("-l") || args.includes("-la") || args.includes("-al");
    
    const node = resolvePath(currentPath);
    if (!node || node.type !== "dir") {
      return err("ls: cannot access: Not a directory");
    }

    const entries = Object.keys(node.contents);
    const filtered = showHidden ? entries : entries.filter(e => !e.startsWith("."));

    if (filtered.length === 0) {
      return;
    }

    if (longFormat) {
      for (const name of filtered.sort()) {
        const item = node.contents[name];
        const type = item.type === "dir" ? "d" : "-";
        const perms = item.type === "dir" ? "rwxr-xr-x" : "rw-r--r--";
        const size = item.type === "dir" ? "4096" : (item.content?.length || "0").toString().padStart(4);
        await sys(`${type}${perms} 1 topp topp ${size} Jan 1 12:00 \x1b[${item.type === "dir" ? "34" : "0"}m${name}\x1b[0m`);
      }
    } else {
      const colorized = filtered.sort().map(name => {
        const item = node.contents[name];
        return item.type === "dir" ? `\x1b[34m${name}\x1b[0m` : name;
      });
      await sys(colorized.join("  "));
    }
  }

  async function cmdCd(arg) {
    if (!arg || arg === "~") {
      currentPath = "/home/topp";
      return;
    }

    if (arg === "..") {
      const parts = currentPath.split("/").filter(p => p);
      if (parts.length > 2) {
        parts.pop();
        currentPath = "/" + parts.join("/");
      } else {
        currentPath = "/home/topp";
      }
      return;
    }

    if (arg === "/") {
      return err("cd: Permission denied: Cannot access root");
    }

    let targetPath;
    if (arg.startsWith("/")) {
      targetPath = arg;
    } else {
      targetPath = currentPath + "/" + arg;
    }

    const node = resolvePath(targetPath);
    if (!node) {
      return err(`cd: ${arg}: No such file or directory`);
    }
    if (node.type !== "dir") {
      return err(`cd: ${arg}: Not a directory`);
    }

    currentPath = targetPath;
  }

  async function cmdCat(filename) {
    if (!filename) {
      return err("cat: missing file operand");
    }

    const node = resolvePath(currentPath);
    if (!node || !node.contents[filename]) {
      return err(`cat: ${filename}: No such file or directory`);
    }

    const file = node.contents[filename];
    if (file.type === "dir") {
      return err(`cat: ${filename}: Is a directory`);
    }

    await sys(file.content || "");
  }

  async function cmdHistory() {
    for (let i = 0; i < history.length; i++) {
      await sys(`  ${i + 1}  ${history[i]}`);
    }
  }

  async function cmdGrep(args) {
    if (args.length < 2) {
      return err("Usage: grep <pattern> <filename>");
    }
    const pattern = args[0];
    const filename = args[1];

    const node = resolvePath(currentPath);
    if (!node || !node.contents[filename]) {
      return err(`grep: ${filename}: No such file or directory`);
    }

    const file = node.contents[filename];
    if (file.type === "dir") {
      return err(`grep: ${filename}: Is a directory`);
    }

    const lines = (file.content || "").split("\n");
    const matches = lines.filter(line => line.toLowerCase().includes(pattern.toLowerCase()));
    
    if (matches.length === 0) {
      return sys(`No matches found for '${pattern}'`);
    }

    for (const match of matches) {
      await sys(match);
    }
  }

  async function cmdFind(pattern) {
    if (!pattern) {
      return err("Usage: find <pattern>");
    }

    await sys(`Searching for '${pattern}'...`);
    const results = findInFilesystem(FILESYSTEM["/home/topp"], "/home/topp", pattern);
    
    if (results.length === 0) {
      return sys("No matches found.");
    }

    for (const result of results) {
      await sys(`  ${result}`);
    }
  }

  async function cmdTree() {
    await sys(".");
    await printTree(FILESYSTEM["/home/topp"], "", true);
  }

  async function cmdSkills() {
    await sys("\x1b[1;36m=== Martin's Skills ===\x1b[0m");
    await sys("");
    await sys("\x1b[33m[+] Offensive Security\x1b[0m");
    await sys("   • Red Teaming & Penetration Testing");
    await sys("   • Vulnerability Assessment");
    await sys("   • Network Exploitation");
    await sys("");
    await sys("\x1b[33m[+] Windows Security\x1b[0m");
    await sys("   • Active Directory & Group Policy");
    await sys("   • Windows Server Administration");
    await sys("   • PowerShell Automation");
    await sys("");
    await sys("\x1b[33m[+] Linux Administration\x1b[0m");
    await sys("   • System Hardening & Configuration");
    await sys("   • Bash Scripting");
    await sys("   • Service Management");
    await sys("");
    await sys("\x1b[33m[+] Programming\x1b[0m");
    await sys("   • Python (Automation, Security Tools)");
    await sys("   • HTML/CSS/JavaScript");
    await sys("   • Bash & PowerShell");
  }

  async function cmdNeofetch() {
    await sys("\x1b[36m         _nnnn_\x1b[0m                      \x1b[33mtopp\x1b[0m@\x1b[33mportfolio\x1b[0m");
    await sys("\x1b[36m        dGGGGMMb\x1b[0m                     ----------------------");
    await sys("\x1b[36m       @p~qp~~qMb\x1b[0m                    \x1b[33mOS\x1b[0m: Portfolio Linux 6.1.0-topp");
    await sys("\x1b[36m       M|@||@) M|\x1b[0m                    \x1b[33mHost\x1b[0m: Martin Topp's Portfolio");
    await sys("\x1b[36m       @,----.JM|\x1b[0m                    \x1b[33mKernel\x1b[0m: 6.1.0-martin-custom");
    await sys("\x1b[36m      JS^\\__/  qKL\x1b[0m                   \x1b[33mUptime\x1b[0m: 24/7/365");
    await sys("\x1b[36m     dZP        qKRb\x1b[0m                  \x1b[33mShell\x1b[0m: xterm.js");
    await sys("\x1b[36m    dZP          qKKb\x1b[0m                 \x1b[33mResolution\x1b[0m: 1920x1080");
    await sys("\x1b[36m   fZP            SMMb\x1b[0m                \x1b[33mTerminal\x1b[0m: JavaScript Terminal");
    await sys("\x1b[36m   HZM            MMMM\x1b[0m                \x1b[33mCPU\x1b[0m: Cyber Warrior Core");
    await sys("\x1b[36m   FqM            MMMM\x1b[0m                \x1b[33mGPU\x1b[0m: NVIDIA OffSec Edition");
    await sys("\x1b[36m __| \".        |\\dS\"qML\x1b[0m               \x1b[33mMemory\x1b[0m: Unlimited (Cloud-based)");
    await sys("\x1b[36m |    \`.       | \`' \\Zq\x1b[0m              ");
    await sys("\x1b[36m_)      \\.___.,|     .'\x1b[0m               \x1b[31m███\x1b[32m███\x1b[33m███\x1b[34m███\x1b[35m███\x1b[36m███\x1b[0m");
    await sys("\x1b[36m\\____   )MMMMMP|   .'\x1b[0m");
    await sys("\x1b[36m     `-'       `--'\x1b[0m");
  }

  // ---------- Destroy sequence ----------
  async function destroyWebsite() {
    // Clear terminal and show ominous message
    term.clear();
    await sleep(500);
    await sys("\x1b[31m[!] CRITICAL: Executing rm -rf /*\x1b[0m");
    await sys("");
    await sleep(400);
    await sys("\x1b[31mDeleting all files...\x1b[0m");
    await sleep(800);
    await sys("\x1b[31mRemoving /home/topp...\x1b[0m");
    await sleep(400);
    await sys("\x1b[31mRemoving /var/www/html...\x1b[0m");
    await sleep(400);
    await sys("\x1b[31mRemoving /etc/nginx...\x1b[0m");
    await sleep(400);
    await sys("\x1b[31mRemoving system files...\x1b[0m");
    await sleep(400);
    await sys("\x1b[31mRemoving /boot...\x1b[0m");
    await sleep(600);
    await sys("");
    await sys("\x1b[31m[X] All files deleted.\x1b[0m");
    await sleep(1000);
    
    // Fade to black
    const terminal = document.getElementById("terminal");
    const hero = document.querySelector(".hero");
    
    // Create black overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      z-index: 9999;
      opacity: 0;
      transition: opacity 1s;
    `;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      overlay.style.opacity = "1";
    }, 100);

    await sleep(1000);

    // Hide everything except overlay
    document.body.style.overflow = "hidden";
    
    // Create new terminal on black screen
    const blackTerminal = document.createElement("div");
    blackTerminal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      z-index: 10000;
      font-family: 'Courier New', monospace;
      color: #0f0;
      padding: 20px;
      overflow: auto;
    `;
    document.body.appendChild(blackTerminal);

    // Blinking cursor in top left
    const cursor = document.createElement("span");
    cursor.textContent = "█";
    cursor.style.cssText = `
      animation: blink 1s infinite;
      font-size: 20px;
    `;
    const style = document.createElement("style");
    style.textContent = `
      @keyframes blink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    blackTerminal.appendChild(cursor);

    // Wait 3 seconds
    await sleep(3000);

    // Remove cursor, start typing
    cursor.remove();

    // Type out user messages (with animation)
    await typeText(blackTerminal, "Why would you delete my website?\n", 60);
    await sleep(500);
    await typeText(blackTerminal, "Let me reboot...\n", 60);
    await sleep(800);
    printText(blackTerminal, "\n");
    await typeText(blackTerminal, "$ sudo reboot\n", 80);
    await sleep(1000);

    // Boot sequence (instant, like real terminal output)
    printText(blackTerminal, "\nBooting Portfolio System...\n");
    await sleep(300);
    printText(blackTerminal, "[  OK  ] Started Load Kernel Modules\n", '#0f0');
    await sleep(200);
    printText(blackTerminal, "[  OK  ] Mounted /sys/fs/cgroup\n", '#0f0');
    await sleep(200);
    printText(blackTerminal, "[  OK  ] Started Network Name Resolution\n", '#0f0');
    await sleep(200);
    printText(blackTerminal, "[  OK  ] Reached target Network\n", '#0f0');
    await sleep(200);
    printText(blackTerminal, "[  OK  ] Started OpenSSH Daemon\n", '#0f0');
    await sleep(300);
    printText(blackTerminal, "[ FAIL ] Failed to start Nginx HTTP Server\n", '#f00');
    await sleep(400);
    printText(blackTerminal, "\nnginx: [emerg] bind() to 0.0.0.0:443 failed (98: Address already in use)\n");
    await sleep(400);
    printText(blackTerminal, "nginx: [emerg] bind() to 0.0.0.0:443 failed (98: Address already in use)\n");
    await sleep(400);
    printText(blackTerminal, "nginx: [emerg] still could not bind()\n");
    await sleep(800);
    
    // User troubleshooting (with typing animation)
    printText(blackTerminal, "\n");
    await typeText(blackTerminal, "$ sudo netstat -tlnp | grep :443\n", 40);
    await sleep(800);
    printText(blackTerminal, "tcp        0      0 0.0.0.0:443           0.0.0.0:*               LISTEN      1337/old-process\n");
    await sleep(700);
    printText(blackTerminal, "\n");
    await typeText(blackTerminal, "$ sudo kill -9 1337\n", 40);
    await sleep(600);
    printText(blackTerminal, "\n");
    await typeText(blackTerminal, "$ sudo systemctl start nginx\n", 40);
    await sleep(800);
    printText(blackTerminal, "[  OK  ] Started Nginx HTTP Server\n", '#0f0');
    await sleep(300);
    printText(blackTerminal, "[  OK  ] Started Portfolio Application\n", '#0f0');
    await sleep(300);
    printText(blackTerminal, "[  OK  ] Reached target Multi-User System\n", '#0f0');
    await sleep(500);
    printText(blackTerminal, "\nPortfolio System Boot Complete\n", '#0f0');
    await sleep(800);
    printText(blackTerminal, "\nRestoring website in 3...\n");
    await sleep(1000);
    printText(blackTerminal, "2...\n");
    await sleep(1000);
    printText(blackTerminal, "1...\n");
    await sleep(1000);

    // Reload the page
    window.location.reload();
  }

  // ---------- Helper functions ----------
  function resolvePath(path) {
    if (path === "/home/topp") {
      return FILESYSTEM["/home/topp"];
    }

    const parts = path.split("/").filter(p => p);
    let node = FILESYSTEM["/home/topp"];

    for (let i = 2; i < parts.length; i++) {
      if (!node.contents || !node.contents[parts[i]]) {
        return null;
      }
      node = node.contents[parts[i]];
    }

    return node;
  }

  function findInFilesystem(node, path, pattern) {
    const results = [];
    const lower = pattern.toLowerCase();

    if (node.type === "file") {
      if (path.toLowerCase().includes(lower) || 
          (node.content && node.content.toLowerCase().includes(lower))) {
        results.push(path);
      }
    } else if (node.type === "dir") {
      for (const [name, child] of Object.entries(node.contents)) {
        const childPath = path + "/" + name;
        results.push(...findInFilesystem(child, childPath, pattern));
      }
    }

    return results;
  }

  async function printTree(node, prefix, isLast) {
    const entries = Object.entries(node.contents);
    
    for (let i = 0; i < entries.length; i++) {
      const [name, child] = entries[i];
      const isLastEntry = i === entries.length - 1;
      const connector = isLastEntry ? "└── " : "├── ";
      const color = child.type === "dir" ? "\x1b[34m" : "\x1b[0m";
      
      await sys(prefix + connector + color + name + "\x1b[0m");
      
      if (child.type === "dir") {
        const newPrefix = prefix + (isLastEntry ? "    " : "│   ");
        await printTree(child, newPrefix, isLastEntry);
      }
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function typeText(element, text, speed) {
    for (const char of text) {
      if (char === '\n') {
        element.appendChild(document.createElement("br"));
      } else {
        const span = document.createElement("span");
        span.textContent = char;
        element.appendChild(span);
      }
      element.scrollTop = element.scrollHeight;
      await sleep(speed);
    }
  }

  function printText(element, text, color = '#fff') {
    const lines = text.split('\n');
    lines.forEach((line, index) => {
      const span = document.createElement("span");
      span.style.color = color;
      span.textContent = line;
      element.appendChild(span);
      if (index < lines.length - 1) {
        element.appendChild(document.createElement("br"));
      }
    });
    element.scrollTop = element.scrollHeight;
  }

  function scrollToSection(selector) {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  // ---------- Output helpers (auto-scroll after every write) ----------
  function prompt() {
    const shortPath = currentPath.replace("/home/topp", "~");
    term.write(`\r\n\x1b[32mtopp\x1b[0m@\x1b[36mportfolio\x1b[0m:\x1b[34m${shortPath}\x1b[0m$ `);
    scrollBottom();
  }

  function promptBare() {
    const shortPath = currentPath.replace("/home/topp", "~");
    term.write(`\r\x1b[32mtopp\x1b[0m@\x1b[36mportfolio\x1b[0m:\x1b[34m${shortPath}\x1b[0m$ `);
    scrollBottom();
  }

  function writeUser(text) {
    term.write(`\r\n`);
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

  function openExternal(url) {
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (w) { try { w.opener = null; } catch (_) {} }
  }

  function closest(input) {
    let best = "", bestScore = 0;
    for (const c of COMMANDS) {
      let s = 0;
      for (let i = 0; i < Math.min(input.length, c.length); i++) {
        if (input[i] === c[i]) s++; else break;
      }
      const similarity = s / Math.max(input.length, c.length);
      if (similarity > bestScore) { 
        best = c; 
        bestScore = similarity; 
      }
    }
    return { most: best, score: bestScore };
  }
})();
