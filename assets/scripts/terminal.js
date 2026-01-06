// terminal.js — xterm.js console with enhanced Linux commands
// (c) 2025 Martin Topp
// dont steal my code, please

(function () {
  const COMMANDS = [
    "help", "about", "clear", "ls", "cd", "pwd", "cat", "echo", "whoami", 
    "uname", "date", "history", "mkdir", "touch", "rm", "grep", "find", 
    "tree", "resume", "linkedin", "github", "contact", "skills", "neofetch",
    "curl", "wget", "ping", "ssh", "systemctl", "service", "ps", "top", "htop",
    "df", "du", "free", "uptime", "w", "who", "last", "man", "nano", "vim",
    "head", "tail", "less", "more", "wc", "sort", "uniq", "diff", "chmod",
    "chown", "sudo", "su", "kill", "killall", "pkill", "bg", "fg", "jobs",
    "alias", "export", "env", "printenv", "which", "whereis", "locate",
    "tar", "zip", "unzip", "gzip", "gunzip", "apt", "yum", "dnf", "pacman",
    "git", "docker", "python", "python3", "node", "npm", "pip", "make",
    "gcc", "java", "javac", "ruby", "php", "perl", "bash", "sh", "zsh",
    // Network commands
    "ifconfig", "ip", "netstat", "ss", "traceroute", "nslookup", "dig", "host",
    "route", "arp", "hostname", "iptables", "tcpdump", "nc", "netcat", "telnet",
    "ftp", "sftp", "scp", "rsync", "nmap", "iperf", "mtr", "whois",
    // Process management
    "nice", "renice", "nohup", "screen", "tmux", "at", "cron", "crontab",
    "watch", "pgrep", "pstree", "pidof", "lsof", "fuser", "strace", "ltrace",
    // System info
    "lscpu", "lsblk", "lsusb", "lspci", "lsmod", "dmesg", "journalctl",
    "hostnamectl", "timedatectl", "localectl", "vmstat", "iostat", "sar",
    "mpstat", "blkid", "fdisk", "parted", "lshw", "dmidecode", "hwinfo",
    // File operations
    "cp", "mv", "ln", "dd", "split", "csplit", "cut", "paste", "join",
    "tr", "sed", "awk", "xargs", "tee", "basename", "dirname", "readlink",
    "stat", "file", "strings", "hexdump", "xxd", "md5sum", "sha256sum",
    // Text processing
    "vi", "emacs", "gedit", "code", "fmt", "pr", "nl", "expand", "unexpand",
    "column", "fold", "look", "aspell", "iconv", "dos2unix", "unix2dos",
    // Compression
    "bzip2", "bunzip2", "xz", "unxz", "7z", "rar", "unrar", "compress", "uncompress",
    // Package management
    "dpkg", "rpm", "snap", "flatpak", "pip3", "gem", "cargo", "go",
    "brew", "port", "emerge", "zypper", "apk",
    // User management
    "useradd", "userdel", "usermod", "groupadd", "groupdel", "passwd", "chpasswd",
    "id", "groups", "finger", "chage", "getent", "newgrp", "gpasswd",
    // Permissions
    "umask", "chattr", "lsattr", "setfacl", "getfacl", "chgrp", "chroot",
    // Disk operations
    "mount", "umount", "fsck", "mkfs", "tune2fs", "resize2fs", "e2label",
    "badblocks", "sync", "eject", "hdparm", "smartctl",
    // Archive
    "cpio", "ar", "pax",
    // Shell
    "source", "exec", "eval", "test", "logout", "exit", "true", "false",
    "yes", "seq", "factor", "bc", "expr", "let", "printf", "read", "shift",
    // System control
    "reboot", "shutdown", "halt", "poweroff", "init", "telinit", "runlevel",
    // Misc utilities
    "cal", "banner", "figlet", "cowsay", "fortune", "sl", "rev", "tac",
    "shuf", "od", "base64", "uuencode", "uudecode", "gpg", "openssl",
    "time", "timeout", "sleep", "usleep", "wait", "suspend",
    // Easter eggs
    "hack", "matrix", "starwars", "theme"
  ];

  // Routes/links
  const ROUTES = {
    about:    "#about",
    linkedin: "https://linkedin.com/in/martin-topp",
    github:   "https://github.com/mt292",
    resume:   "/resume",
  };

  let previousPath = "/home/topp"; // For cd -

  // File system structure - Martin themed!
  const FILESYSTEM = {
    "/home/topp": {
      type: "dir",
      contents: {
        "about.txt": { type: "file", content: "Martin Topp | Cybersecurity Student | Windows Lead & OffSec Specialist\nIndiana Tech Cyber Warriors | GPA 3.9 | Aspiring Cybersecurity Professional" },
        "resume.txt": { type: "file", content: "Check out my full resume at: /resume\nSkills: Python, Bash, PowerShell, AD, GPO, DNS, Linux, Windows\nCertifications: TRUST Drone, NCAE Competitor, ServSafe" },
        "contact.txt": { type: "file", content: "Email: mtopp887@gmail.com\nLinkedIn: linkedin.com/in/martin-topp\nGitHub: github.com/mt292" },
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
    convertEol: true,
    fontSize: 14,
    fontFamily: "'Source Code Pro', Menlo, Monaco, 'Courier New', monospace",
    theme: {
      background: '#000000',
      foreground: '#e4e6eb',
      cursor: '#ffffffff',
      cursorAccent: '#000000'
    },
    allowTransparency: false,
    scrollOnUserInput: true,
    cursorStyle: 'block'
  });
  let history = [];
  let histIdx = 0;
  let buffer = "";
  let cursorPos = 0; // Track cursor position in buffer
  let currentPath = "/home/topp";
  let isDestroyed = false;

  // Advanced features state
  let aliases = {
    'll': 'ls -la',
    'la': 'ls -a',
    'l': 'ls',
    '..': 'cd ..',
    '...': 'cd ../..',
    'c': 'clear',
    'h': 'history',
    'e': 'echo',
    'g': 'grep'
  };
  
  let envVars = {
    'USER': 'topp',
    'HOME': '/home/topp',
    'PATH': '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
    'SHELL': '/bin/zsh',
    'HOSTNAME': 'portfolio',
    'TERM': 'xterm-256color',
    'PWD': '/home/topp',
    'LANG': 'en_US.UTF-8',
    'EDITOR': 'vim'
  };
  
  let jobs = [];
  let jobIdCounter = 1;
  
  // Load persistent history from localStorage
  try {
    const savedHistory = localStorage.getItem('terminal_history');
    if (savedHistory) {
      history = JSON.parse(savedHistory);
      histIdx = history.length;
    }
  } catch (e) {
    console.warn('Failed to load history from localStorage:', e);
  }

  // Helper to always push viewport to newest line
  function scrollBottom() {
    // Immediate scroll
    term.scrollToBottom();
    
    // Also schedule for next frame to ensure it happens after rendering
    requestAnimationFrame(() => {
      term.scrollToBottom();
      const viewport = document.querySelector('.xterm-viewport');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    });
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

      // Handle Ctrl+C - Cancel current input
      if (domEvent.ctrlKey && k === 'c') {
        domEvent.preventDefault();
        term.write("^C\r\n");
        buffer = "";
        cursorPos = 0;
        prompt();
        return;
      }

      // Handle Ctrl+D - Exit/EOF
      if (domEvent.ctrlKey && k === 'd') {
        domEvent.preventDefault();
        if (buffer.length === 0) {
          term.write("^D\r\n");
          sys("exit");
          sys("\x1b[2mRefresh the page to restart the terminal\x1b[0m");
          return;
        }
        return;
      }

      // Handle Ctrl+Z - Suspend (just show message)
      if (domEvent.ctrlKey && k === 'z') {
        domEvent.preventDefault();
        term.write("^Z\r\n");
        sys("[1]+  Stopped");
        buffer = "";
        cursorPos = 0;
        prompt();
        return;
      }

      // Handle Ctrl+L - Clear screen
      if (domEvent.ctrlKey && k === 'l') {
        domEvent.preventDefault();
        term.clear();
        buffer = "";
        cursorPos = 0;
        scrollBottom();
        prompt();
        return;
      }

      // Handle Ctrl+U - Clear line before cursor
      if (domEvent.ctrlKey && k === 'u') {
        domEvent.preventDefault();
        buffer = "";
        cursorPos = 0;
        term.write("\x1b[2K\r");
        promptBare();
        return;
      }

      // Handle Ctrl+K - Clear line after cursor
      if (domEvent.ctrlKey && k === 'k') {
        domEvent.preventDefault();
        buffer = "";
        cursorPos = 0;
        term.write("\x1b[0K");
        return;
      }

      // Handle Ctrl+W - Delete word before cursor
      if (domEvent.ctrlKey && k === 'w') {
        domEvent.preventDefault();
        const words = buffer.trimEnd().split(/\s+/);
        if (words.length > 0) {
          words.pop();
          buffer = words.join(" ");
          if (buffer.length > 0) buffer += " ";
        }
        cursorPos = buffer.length;
        term.write("\x1b[2K\r");
        promptBare();
        term.write(buffer);
        return;
      }

      // Handle Ctrl+A - Move to beginning of line
      if (domEvent.ctrlKey && k === 'a') {
        domEvent.preventDefault();
        cursorPos = 0;
        term.write("\x1b[2K\r");
        promptBare();
        term.write(buffer);
        // Move cursor back to start
        if (buffer.length > 0) {
          term.write(`\x1b[${buffer.length}D`);
        }
        return;
      }

      // Handle Ctrl+E - Move to end of line
      if (domEvent.ctrlKey && k === 'e') {
        domEvent.preventDefault();
        cursorPos = buffer.length;
        return;
      }

      if (k === "Enter") {
        const input = buffer.trim();
        writeUser(input);
        if (input.length === 0) {
          sys("");
          buffer = "";
          cursorPos = 0;
          return prompt();
        }

        history.push(input);
        histIdx = history.length;
        
        // Save history to localStorage
        try {
          localStorage.setItem('terminal_history', JSON.stringify(history.slice(-100))); // Keep last 100 commands
        } catch (e) {
          console.warn('Failed to save history:', e);
        }
        
        handle(input);
        buffer = "";
        cursorPos = 0;
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
            cursorPos = buffer.length;
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
              cursorPos = buffer.length;
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
        if (cursorPos > 0) {
          buffer = buffer.slice(0, cursorPos - 1) + buffer.slice(cursorPos);
          cursorPos--;
          term.write("\x1b[2K\r");
          promptBare();
          term.write(buffer);
          // Move cursor to correct position
          if (cursorPos < buffer.length) {
            term.write(`\x1b[${buffer.length - cursorPos}D`);
          }
          scrollBottom();
        }
        return;
      }

      if (k === "Delete") {
        if (cursorPos < buffer.length) {
          buffer = buffer.slice(0, cursorPos) + buffer.slice(cursorPos + 1);
          term.write("\x1b[2K\r");
          promptBare();
          term.write(buffer);
          // Move cursor to correct position
          if (cursorPos < buffer.length) {
            term.write(`\x1b[${buffer.length - cursorPos}D`);
          }
          scrollBottom();
        }
        return;
      }

      if (k === "ArrowLeft") {
        if (cursorPos > 0) {
          cursorPos--;
          term.write("\x1b[D"); // Move cursor left
        }
        return;
      }

      if (k === "ArrowRight") {
        if (cursorPos < buffer.length) {
          cursorPos++;
          term.write("\x1b[C"); // Move cursor right
        }
        return;
      }

      if (k === "Home") {
        if (cursorPos > 0) {
          term.write(`\x1b[${cursorPos}D`); // Move cursor to start
          cursorPos = 0;
        }
        return;
      }

      if (k === "End") {
        if (cursorPos < buffer.length) {
          term.write(`\x1b[${buffer.length - cursorPos}C`); // Move cursor to end
          cursorPos = buffer.length;
        }
        return;
      }

      if (k === "ArrowUp") {
        if (history.length > 0 && histIdx > 0) {
          histIdx--;
          term.write("\x1b[2K\r");
          promptBare();
          buffer = history[histIdx];
          cursorPos = buffer.length;
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
          cursorPos = buffer.length;
          term.write(buffer);
          scrollBottom();
        }
        return;
      }

      if (key.length === 1 && !domEvent.ctrlKey && !domEvent.metaKey) {
        // Insert character at cursor position
        buffer = buffer.slice(0, cursorPos) + key + buffer.slice(cursorPos);
        cursorPos++;
        
        // Redraw line from cursor position
        term.write("\x1b[2K\r");
        promptBare();
        term.write(buffer);
        
        // Move cursor to correct position if not at end
        if (cursorPos < buffer.length) {
          term.write(`\x1b[${buffer.length - cursorPos}D`);
        }
        scrollBottom();
      }
    });

    // Keep terminal scrolled to bottom
    setInterval(() => {
      term.scrollToBottom();
      const viewport = document.querySelector('.xterm-viewport');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }, 100);
  });

  // ---------- Advanced Shell Features ----------
  
  // Expand aliases (e.g., ll -> ls -la)
  function expandAliases(raw) {
    const parts = raw.split(/\s+/);
    const cmd = parts[0];
    if (aliases[cmd]) {
      parts[0] = aliases[cmd];
      return parts.join(' ');
    }
    return raw;
  }
  
  // Expand environment variables (e.g., $USER -> topp)
  function expandEnvVars(raw) {
    return raw.replace(/\$(\w+)/g, (match, varName) => {
      if (varName === 'PWD') return currentPath;
      return envVars[varName] || match;
    });
  }
  
  // Command substitution $(command) or `command`
  function expandCommandSubstitution(raw) {
    // This is simplified - in a real shell this would execute the command
    raw = raw.replace(/\$\(pwd\)/gi, currentPath);
    raw = raw.replace(/`pwd`/gi, currentPath);
    raw = raw.replace(/\$\(whoami\)/gi, 'topp');
    raw = raw.replace(/`whoami`/gi, 'topp');
    raw = raw.replace(/\$\(date\)/gi, new Date().toDateString());
    raw = raw.replace(/`date`/gi, new Date().toDateString());
    return raw;
  }
  
  // Expand wildcards (e.g., *.txt)
  function expandWildcards(raw) {
    const parts = raw.split(/\s+/);
    const hasWildcard = parts.some(p => p.includes('*') || p.includes('?'));
    
    if (!hasWildcard) {
      return [raw];
    }
    
    // Get current directory contents
    const currentDir = resolvePath(currentPath);
    if (!currentDir || currentDir.type !== 'dir') {
      return [raw];
    }
    
    const files = Object.keys(currentDir.contents);
    const expandedParts = parts.map(part => {
      if (part.includes('*')) {
        const regex = new RegExp('^' + part.replace(/\*/g, '.*') + '$');
        const matches = files.filter(f => regex.test(f));
        return matches.length > 0 ? matches : [part];
      } else if (part.includes('?')) {
        const regex = new RegExp('^' + part.replace(/\?/g, '.') + '$');
        const matches = files.filter(f => regex.test(f));
        return matches.length > 0 ? matches : [part];
      }
      return [part];
    });
    
    // Flatten and combine
    const flattened = expandedParts.flat();
    return [flattened.join(' ')];
  }
  
  // Handle command chaining (&&, ||, ;)
  async function handleChaining(raw) {
    let lastExitCode = 0;
    
    // Split by ; first, then handle && and ||
    const commands = raw.split(';').map(s => s.trim());
    
    for (const cmdGroup of commands) {
      if (cmdGroup.includes('&&')) {
        const andCommands = cmdGroup.split('&&').map(s => s.trim());
        for (const cmd of andCommands) {
          if (lastExitCode === 0) {
            lastExitCode = await executeCommandWithReturn(cmd);
          } else {
            break;
          }
        }
      } else if (cmdGroup.includes('||')) {
        const orCommands = cmdGroup.split('||').map(s => s.trim());
        for (const cmd of orCommands) {
          if (lastExitCode !== 0) {
            lastExitCode = await executeCommandWithReturn(cmd);
          } else {
            break;
          }
        }
      } else {
        lastExitCode = await executeCommandWithReturn(cmdGroup);
      }
    }
    
    prompt();
  }
  
  // Handle pipes (e.g., ls | grep txt)
  async function handlePipe(raw) {
    const commands = raw.split('|').map(s => s.trim());
    let output = '';
    
    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      if (i === 0) {
        // First command - capture output
        output = await captureCommandOutput(cmd);
      } else {
        // Subsequent commands - use previous output as input
        output = await processPipeCommand(cmd, output);
      }
    }
    
    sys(output);
    prompt();
  }
  
  // Handle output redirection (>, >>)
  async function handleRedirection(raw) {
    let append = false;
    let parts;
    
    if (raw.includes('>>')) {
      append = true;
      parts = raw.split('>>').map(s => s.trim());
    } else {
      parts = raw.split('>').map(s => s.trim());
    }
    
    const cmd = parts[0];
    const filename = parts[1];
    
    if (!filename) {
      err('Syntax error: missing filename');
      return prompt();
    }
    
    const output = await captureCommandOutput(cmd);
    
    // Write to virtual filesystem
    const currentDir = resolvePath(currentPath);
    if (currentDir && currentDir.type === 'dir') {
      if (currentDir.contents[filename] && currentDir.contents[filename].type === 'file') {
        if (append) {
          currentDir.contents[filename].content += '\n' + output;
        } else {
          currentDir.contents[filename].content = output;
        }
        sys(`Output written to ${filename}`);
      } else {
        currentDir.contents[filename] = { type: 'file', content: output };
        sys(`Created ${filename}`);
      }
    } else {
      err('Cannot write to read-only filesystem');
    }
    
    prompt();
  }
  
  // Execute command and return exit code
  async function executeCommandWithReturn(raw) {
    try {
      await executeCommand(raw);
      return 0;
    } catch (e) {
      return 1;
    }
  }
  
  // Capture command output without displaying
  async function captureCommandOutput(raw) {
    // Simplified implementation - capture specific commands
    const parts = raw.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    
    if (cmd === 'ls') {
      const currentDir = resolvePath(currentPath);
      if (currentDir && currentDir.type === 'dir') {
        return Object.keys(currentDir.contents).join('\n');
      }
      return '';
    } else if (cmd === 'echo') {
      return args.join(' ');
    } else if (cmd === 'cat') {
      const file = resolvePath(currentPath + '/' + args[0]);
      if (file && file.type === 'file') {
        return file.content;
      }
      return '';
    } else if (cmd === 'pwd') {
      return currentPath;
    } else if (cmd === 'whoami') {
      return 'topp';
    } else if (cmd === 'date') {
      return new Date().toString();
    }
    
    return '';
  }
  
  // Process pipe command with input
  async function processPipeCommand(cmd, input) {
    const parts = cmd.split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);
    
    if (command === 'grep') {
      const pattern = args[0];
      if (!pattern) return input;
      const lines = input.split('\n');
      return lines.filter(line => line.includes(pattern)).join('\n');
    } else if (command === 'head') {
      const n = args[0] && args[0].startsWith('-') ? parseInt(args[0].slice(1)) : 10;
      return input.split('\n').slice(0, n).join('\n');
    } else if (command === 'tail') {
      const n = args[0] && args[0].startsWith('-') ? parseInt(args[0].slice(1)) : 10;
      const lines = input.split('\n');
      return lines.slice(-n).join('\n');
    } else if (command === 'wc') {
      const lines = input.split('\n').length;
      const words = input.split(/\s+/).length;
      const chars = input.length;
      return `${lines} ${words} ${chars}`;
    } else if (command === 'sort') {
      return input.split('\n').sort().join('\n');
    } else if (command === 'uniq') {
      const lines = input.split('\n');
      return [...new Set(lines)].join('\n');
    }
    
    return input;
  }

  // ---------- Command handlers ----------
  function handle(raw) {
    // Process command chaining (&&, ||, ;)
    if (raw.includes('&&') || raw.includes('||') || raw.includes(';')) {
      return handleChaining(raw);
    }
    
    // Process pipes
    if (raw.includes('|') && !raw.includes('||')) {
      return handlePipe(raw);
    }
    
    // Process output redirection
    if (raw.includes('>')) {
      return handleRedirection(raw);
    }
    
    // Expand aliases
    raw = expandAliases(raw);
    
    // Expand environment variables
    raw = expandEnvVars(raw);
    
    // Command substitution
    raw = expandCommandSubstitution(raw);
    
    // Expand wildcards
    const expandedCommands = expandWildcards(raw);
    
    for (const expandedRaw of expandedCommands) {
      executeCommand(expandedRaw);
    }
  }
  
  function executeCommand(raw) {
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
        if (args.includes("-v") || args.includes("--verbose")) {
          return cmdWhoamiVerbose().then(prompt);
        }
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
      case "curl":
        return cmdCurl(args).then(prompt);
      case "wget":
        return cmdWget(args).then(prompt);
      case "ping":
        return cmdPing(args[0]).then(prompt);
      case "ssh":
        return cmdSsh(args).then(prompt);
      case "systemctl":
        return cmdSystemctl(args).then(prompt);
      case "service":
        return cmdService(args).then(prompt);
      case "ps":
        return cmdPs(args).then(prompt);
      case "top":
      case "htop":
        return cmdTop().then(prompt);
      case "df":
        return cmdDf().then(prompt);
      case "du":
        return cmdDu(args).then(prompt);
      case "free":
        return cmdFree().then(prompt);
      case "uptime":
        return cmdUptime().then(prompt);
      case "w":
      case "who":
        return cmdWho().then(prompt);
      case "last":
        return cmdLast().then(prompt);
      case "man":
        return cmdMan(args[0]).then(prompt);
      case "nano":
      case "vim":
        return sys(`${cmd}: This is a web terminal - use 'cat' to view files`).then(prompt);
      case "head":
        return cmdHead(args).then(prompt);
      case "tail":
        return cmdTail(args).then(prompt);
      case "less":
      case "more":
        return cmdCat(args[0]).then(prompt);
      case "wc":
        return cmdWc(args).then(prompt);
      case "sort":
        return sys("sort: Not implemented in web terminal").then(prompt);
      case "uniq":
        return sys("uniq: Not implemented in web terminal").then(prompt);
      case "diff":
        return sys("diff: Not implemented in web terminal").then(prompt);
      case "chmod":
      case "chown":
        return sys("Permission denied: This is a read-only portfolio filesystem").then(prompt);
      case "sudo":
        if (args[0] === "rm" && (args.includes("-rf") || args.includes("-r"))) {
          return err("WARNING: Dangerous command detected! Use 'sudo rm -rf /*' if you really want to delete everything...").then(prompt);
        }
        return sys("sudo: This portfolio runs with maximum permissions already").then(prompt);
      case "su":
        return err("su: You are already root").then(prompt);
      case "kill":
      case "killall":
      case "pkill":
        return sys(`${cmd}: No processes to kill in web terminal`).then(prompt);
      case "bg":
        return cmdBg(args).then(prompt);
      case "fg":
        return cmdFg(args).then(prompt);
      case "jobs":
        return cmdJobs().then(prompt);
      case "alias":
        return cmdAlias(args).then(prompt);
      case "export":
        return cmdExport(args).then(prompt);
      case "env":
      case "printenv":
        return cmdEnv().then(prompt);
      case "which":
        return cmdWhich(args[0]).then(prompt);
      case "whereis":
        return cmdWhereis(args[0]).then(prompt);
      case "locate":
        return sys("locate: Database not available in web terminal").then(prompt);
      case "tar":
      case "zip":
      case "unzip":
      case "gzip":
      case "gunzip":
        return sys(`${cmd}: Archive operations not supported in web terminal`).then(prompt);
      case "apt":
      case "yum":
      case "dnf":
      case "pacman":
        return sys(`${cmd}: Package management not available in web terminal`).then(prompt);
      case "git":
        return cmdGit(args).then(prompt);
      case "docker":
        return cmdDocker(args).then(prompt);
      case "python":
      case "python3":
        return cmdPython(args).then(prompt);
      case "node":
        return cmdNode(args).then(prompt);
      case "npm":
        return cmdNpm(args).then(prompt);
      case "pip":
        return cmdPip(args).then(prompt);
      case "make":
      case "gcc":
      case "java":
      case "javac":
      case "ruby":
      case "php":
      case "perl":
        return sys(`${cmd}: Compiler/interpreter not available in web terminal`).then(prompt);
      case "bash":
      case "sh":
      case "zsh":
        return sys(`${cmd}: Already running in ${cmd} shell`).then(prompt);
      
      // Network commands
      case "ifconfig":
        return cmdIfconfig().then(prompt);
      case "ip":
        return cmdIp(args).then(prompt);
      case "netstat":
        return cmdNetstat(args).then(prompt);
      case "ss":
        return cmdSs(args).then(prompt);
      case "traceroute":
        return cmdTraceroute(args[0]).then(prompt);
      case "nslookup":
        return cmdNslookup(args[0]).then(prompt);
      case "dig":
        return cmdDig(args[0]).then(prompt);
      case "host":
        return cmdHost(args[0]).then(prompt);
      case "route":
        return cmdRoute().then(prompt);
      case "arp":
        return cmdArp().then(prompt);
      case "hostname":
        return sys("portfolio.martintopp.com").then(prompt);
      case "iptables":
        return sys("iptables: Permission denied (requires root)").then(prompt);
      case "tcpdump":
        return sys("tcpdump: Permission denied (requires root)").then(prompt);
      case "nc":
      case "netcat":
        return sys(`${cmd}: Netcat not available in web terminal`).then(prompt);
      case "telnet":
      case "ftp":
        return sys(`${cmd}: Protocol not supported in web terminal`).then(prompt);
      case "sftp":
      case "scp":
        return sys(`${cmd}: Secure file transfer not available in web terminal`).then(prompt);
      case "rsync":
        return sys("rsync: Remote sync not available in web terminal").then(prompt);
      case "nmap":
        return cmdNmap(args[0]).then(prompt);
      case "iperf":
        return sys("iperf: Network performance testing not available").then(prompt);
      case "mtr":
        return sys("mtr: Combined ping/traceroute not available").then(prompt);
      case "whois":
        return cmdWhois(args[0]).then(prompt);
      
      // Process management
      case "nice":
      case "renice":
        return sys(`${cmd}: Process priority management not available`).then(prompt);
      case "nohup":
        return sys("nohup: No background processes in web terminal").then(prompt);
      case "screen":
      case "tmux":
        return sys(`${cmd}: Terminal multiplexer not available in web terminal`).then(prompt);
      case "at":
        return sys("at: Scheduled task execution not available").then(prompt);
      case "cron":
      case "crontab":
        return cmdCrontab(args).then(prompt);
      case "watch":
        return sys("watch: Command watching not available in web terminal").then(prompt);
      case "pgrep":
        return cmdPgrep(args[0]).then(prompt);
      case "pstree":
        return cmdPstree().then(prompt);
      case "pidof":
        return sys("pidof: Process ID lookup not available").then(prompt);
      case "lsof":
        return cmdLsof().then(prompt);
      case "fuser":
        return sys("fuser: File user identification not available").then(prompt);
      case "strace":
      case "ltrace":
        return sys(`${cmd}: System call tracing not available in web terminal`).then(prompt);
      
      // System info
      case "lscpu":
        return cmdLscpu().then(prompt);
      case "lsblk":
        return cmdLsblk().then(prompt);
      case "lsusb":
        return cmdLsusb().then(prompt);
      case "lspci":
        return cmdLspci().then(prompt);
      case "lsmod":
        return cmdLsmod().then(prompt);
      case "dmesg":
        return sys("dmesg: Permission denied (requires root)").then(prompt);
      case "journalctl":
        return cmdJournalctl(args).then(prompt);
      case "hostnamectl":
        return cmdHostnamectl().then(prompt);
      case "timedatectl":
        return cmdTimedatectl().then(prompt);
      case "localectl":
        return cmdLocalectl().then(prompt);
      case "vmstat":
        return cmdVmstat().then(prompt);
      case "iostat":
        return cmdIostat().then(prompt);
      case "sar":
        return sys("sar: System activity report not available").then(prompt);
      case "mpstat":
        return sys("mpstat: Multi-processor statistics not available").then(prompt);
      case "blkid":
        return cmdBlkid().then(prompt);
      case "fdisk":
      case "parted":
        return sys(`${cmd}: Disk partitioning requires root privileges`).then(prompt);
      case "lshw":
        return sys("lshw: Hardware lister requires root privileges").then(prompt);
      case "dmidecode":
        return sys("dmidecode: DMI table decoder requires root privileges").then(prompt);
      case "hwinfo":
        return sys("hwinfo: Hardware information tool requires root privileges").then(prompt);
      
      // File operations
      case "cp":
        return sys("cp: File copying not available in read-only filesystem").then(prompt);
      case "mv":
        return sys("mv: File moving not available in read-only filesystem").then(prompt);
      case "ln":
        return sys("ln: Link creation not available in read-only filesystem").then(prompt);
      case "dd":
        return sys("dd: Block-level operations not available").then(prompt);
      case "split":
      case "csplit":
        return sys(`${cmd}: File splitting not available in web terminal`).then(prompt);
      case "cut":
        return cmdCut(args).then(prompt);
      case "paste":
        return sys("paste: File merging not available in web terminal").then(prompt);
      case "join":
        return sys("join: File joining not available in web terminal").then(prompt);
      case "tr":
        return sys("tr: Character translation requires pipe input").then(prompt);
      case "sed":
        return sys("sed: Stream editor not fully implemented in web terminal").then(prompt);
      case "awk":
        return sys("awk: Text processing not fully implemented in web terminal").then(prompt);
      case "xargs":
        return sys("xargs: Command building not available in web terminal").then(prompt);
      case "tee":
        return sys("tee: Output duplication not available in web terminal").then(prompt);
      case "basename":
        return cmdBasename(args[0]).then(prompt);
      case "dirname":
        return cmdDirname(args[0]).then(prompt);
      case "readlink":
        return sys("readlink: Symbolic link resolution not available").then(prompt);
      case "stat":
        return cmdStat(args[0]).then(prompt);
      case "file":
        return cmdFile(args[0]).then(prompt);
      case "strings":
        return sys("strings: Binary string extraction not available").then(prompt);
      case "hexdump":
      case "xxd":
        return sys(`${cmd}: Hex dump not available in web terminal`).then(prompt);
      case "md5sum":
        return cmdMd5sum(args[0]).then(prompt);
      case "sha256sum":
        return cmdSha256sum(args[0]).then(prompt);
      
      // Text processing
      case "vi":
      case "emacs":
      case "gedit":
      case "code":
        return sys(`${cmd}: Text editor not available in web terminal - use 'cat' to view files`).then(prompt);
      case "fmt":
      case "pr":
      case "nl":
        return sys(`${cmd}: Text formatting not available in web terminal`).then(prompt);
      case "expand":
      case "unexpand":
        return sys(`${cmd}: Tab conversion not available in web terminal`).then(prompt);
      case "column":
        return sys("column: Column formatting not available in web terminal").then(prompt);
      case "fold":
        return sys("fold: Line folding not available in web terminal").then(prompt);
      case "look":
        return sys("look: Dictionary lookup not available").then(prompt);
      case "aspell":
        return sys("aspell: Spell checker not available").then(prompt);
      case "iconv":
        return sys("iconv: Character encoding conversion not available").then(prompt);
      case "dos2unix":
      case "unix2dos":
        return sys(`${cmd}: Line ending conversion not available`).then(prompt);
      
      // Compression
      case "bzip2":
      case "bunzip2":
      case "xz":
      case "unxz":
      case "7z":
      case "rar":
      case "unrar":
      case "compress":
      case "uncompress":
        return sys(`${cmd}: Compression tool not available in web terminal`).then(prompt);
      
      // Package management
      case "dpkg":
      case "rpm":
      case "snap":
      case "flatpak":
      case "pip3":
      case "gem":
      case "cargo":
      case "go":
      case "brew":
      case "port":
      case "emerge":
      case "zypper":
      case "apk":
        return sys(`${cmd}: Package manager not available in web terminal`).then(prompt);
      
      // User management
      case "useradd":
      case "userdel":
      case "usermod":
      case "groupadd":
      case "groupdel":
        return sys(`${cmd}: User management requires root privileges`).then(prompt);
      case "passwd":
        return cmdPasswd(args).then(prompt);
      case "chpasswd":
        return sys("chpasswd: Password change requires root privileges").then(prompt);
      case "id":
        return cmdId(args[0]).then(prompt);
      case "groups":
        return cmdGroups(args[0]).then(prompt);
      case "finger":
        return cmdFinger(args[0]).then(prompt);
      case "chage":
        return sys("chage: Password aging requires root privileges").then(prompt);
      case "getent":
        return cmdGetent(args).then(prompt);
      case "newgrp":
      case "gpasswd":
        return sys(`${cmd}: Group management not available`).then(prompt);
      
      // Permissions
      case "umask":
        return cmdUmask(args[0]).then(prompt);
      case "chattr":
      case "lsattr":
        return sys(`${cmd}: Extended attributes not available in web filesystem`).then(prompt);
      case "setfacl":
      case "getfacl":
        return sys(`${cmd}: ACL operations not available in web filesystem`).then(prompt);
      case "chgrp":
        return sys("chgrp: Group ownership change not available in read-only filesystem").then(prompt);
      case "chroot":
        return sys("chroot: Root directory change requires root privileges").then(prompt);
      
      // Disk operations
      case "mount":
      case "umount":
        return sys(`${cmd}: Filesystem mounting requires root privileges`).then(prompt);
      case "fsck":
      case "mkfs":
        return sys(`${cmd}: Filesystem operations require root privileges`).then(prompt);
      case "tune2fs":
      case "resize2fs":
      case "e2label":
        return sys(`${cmd}: ext2/3/4 filesystem tool requires root privileges`).then(prompt);
      case "badblocks":
        return sys("badblocks: Block device testing requires root privileges").then(prompt);
      case "sync":
        return sys("sync: Filesystem buffers synced").then(prompt);
      case "eject":
        return sys("eject: No removable media found").then(prompt);
      case "hdparm":
      case "smartctl":
        return sys(`${cmd}: Disk parameter tool requires root privileges`).then(prompt);
      
      // Archive
      case "cpio":
      case "ar":
      case "pax":
        return sys(`${cmd}: Archive tool not available in web terminal`).then(prompt);
      
      // Shell
      case "source":
        return sys("source: Script sourcing not available in web terminal").then(prompt);
      case "exec":
        return sys("exec: Command execution not available").then(prompt);
      case "eval":
        return sys("eval: Expression evaluation not available").then(prompt);
      case "test":
        return sys("test: Condition testing not available").then(prompt);
      case "logout":
      case "exit":
        return cmdExit().then(prompt);
      case "true":
        return prompt();
      case "false":
        return err("false: Exit status 1").then(prompt);
      case "yes":
        return err("yes: Infinite output blocked (use Ctrl+C to stop)").then(prompt);
      case "seq":
        return cmdSeq(args).then(prompt);
      case "factor":
        return cmdFactor(args[0]).then(prompt);
      case "bc":
        return sys("bc: Calculator not available - use 'expr' for basic math").then(prompt);
      case "expr":
        return cmdExpr(args).then(prompt);
      case "let":
        return sys("let: Arithmetic evaluation not available").then(prompt);
      case "printf":
        return sys(args.join(" ")).then(prompt);
      case "read":
        return sys("read: Interactive input not available in web terminal").then(prompt);
      case "shift":
        return sys("shift: Positional parameter shifting not available").then(prompt);
      
      // System control
      case "reboot":
      case "shutdown":
      case "halt":
      case "poweroff":
        return cmdReboot().then(prompt);
      case "init":
      case "telinit":
        return sys(`${cmd}: Init system control requires root privileges`).then(prompt);
      case "runlevel":
        return sys("N 5").then(prompt);
      
      // Misc utilities
      case "cal":
        return cmdCal(args).then(prompt);
      case "banner":
        return cmdBanner(args.join(" ")).then(prompt);
      case "figlet":
        return cmdFiglet(args.join(" ")).then(prompt);
      case "cowsay":
        return cmdCowsay(args.join(" ")).then(prompt);
      case "fortune":
        return cmdFortune().then(prompt);
      case "sl":
        return cmdSl().then(prompt);
      case "rev":
        return cmdRev(args.join(" ")).then(prompt);
      case "tac":
        return sys("tac: Reverse line output not available").then(prompt);
      case "shuf":
        return sys("shuf: Line shuffling not available").then(prompt);
      case "od":
        return sys("od: Octal dump not available").then(prompt);
      case "base64":
        return cmdBase64(args).then(prompt);
      case "uuencode":
      case "uudecode":
        return sys(`${cmd}: Encoding not available in web terminal`).then(prompt);
      case "gpg":
      case "openssl":
        return sys(`${cmd}: Cryptography tool not available in web terminal`).then(prompt);
      case "time":
        return sys("time: Command timing not available - command would execute instantly").then(prompt);
      case "timeout":
        return sys("timeout: Command timeout not available").then(prompt);
      case "sleep":
        return cmdSleep(args[0]).then(prompt);
      case "usleep":
        return sys("usleep: Microsecond sleep not available").then(prompt);
      case "wait":
        return sys("wait: No background processes to wait for").then(prompt);
      case "suspend":
        return sys("suspend: Process suspension not available").then(prompt);
      
      // Easter eggs and fun commands
      case "hack":
        return cmdHack().then(prompt);
      case "matrix":
        return cmdMatrix().then(prompt);
      case "starwars":
        return cmdStarwars().then(prompt);
      case "theme":
        return cmdTheme(args).then(prompt);
      
      default:
        return err(`Command '${cmd}' not yet implemented.`).then(prompt);
    }
  }

  // ---------- Command implementations ----------
  async function cmdHelp() {
    await sys("\x1b[1;36m=== Martin's Portfolio Terminal ===\x1b[0m");
    await sys("\x1b[2;36mAdvanced shell with pipes, redirection, aliases, and more!\x1b[0m");
    await sys("");
    await sys("  \x1b[1;32mPortfolio Commands:\x1b[0m");
    await sys("     \x1b[36mabout\x1b[0m      - Learn about Martin Topp");
    await sys("     \x1b[36mresume\x1b[0m     - View full resume");
    await sys("     \x1b[36mskills\x1b[0m     - Technical skills & certifications");
    await sys("     \x1b[36mcontact\x1b[0m    - Get in touch");
    await sys("     \x1b[36mlinkedin\x1b[0m   - LinkedIn profile");
    await sys("     \x1b[36mgithub\x1b[0m     - GitHub repositories");
    await sys("     \x1b[36mneofetch\x1b[0m   - System information");
    await sys("");
    await sys("  \x1b[33mNavigation:\x1b[0m ls, cd, pwd, tree, find");
    await sys("  \x1b[33mFile Ops:\x1b[0m cat, echo, grep, head, tail, wc, stat, file");
    await sys("  \x1b[33mNetwork:\x1b[0m ping, curl, wget, ifconfig, netstat, nslookup, dig, traceroute");
    await sys("  \x1b[33mSystem Info:\x1b[0m whoami, uname, date, uptime, hostname, lscpu, lsblk, free, df");
    await sys("  \x1b[33mProcesses:\x1b[0m ps, top, htop, pgrep, pstree, lsof, kill, jobs, bg, fg");
    await sys("  \x1b[33mUser/Perms:\x1b[0m id, groups, passwd, chmod, chown, umask");
    await sys("  \x1b[33mPackages:\x1b[0m apt, yum, dnf, npm, pip, docker, git");
    await sys("  \x1b[33mText Tools:\x1b[0m sort, uniq, diff, sed, awk, cut, tr");
    await sys("  \x1b[33mCompression:\x1b[0m tar, zip, gzip, bzip2, xz");
    await sys("  \x1b[33mShell:\x1b[0m alias, export, env, theme");
    await sys("  \x1b[33mUtilities:\x1b[0m man, which, history, cal, bc, expr, base64");
    await sys("  \x1b[33mFun:\x1b[0m cowsay, figlet, fortune, sl, banner, rev, hack, matrix, starwars");
    await sys("  \x1b[33mSystem:\x1b[0m clear, help, reboot, shutdown, exit");
    await sys("");
    await sys("\x1b[1;35mAdvanced Features:\x1b[0m");
    await sys("  \x1b[35mPipes:\x1b[0m        ls | grep txt");
    await sys("  \x1b[35mRedirection:\x1b[0m  echo hello > file.txt");
    await sys("  \x1b[35mChaining:\x1b[0m     cd /tmp && ls");
    await sys("  \x1b[35mAliases:\x1b[0m      alias ll='ls -la'");
    await sys("  \x1b[35mVariables:\x1b[0m    echo $USER");
    await sys("  \x1b[35mWildcards:\x1b[0m    cat *.txt");
    await sys("");
    await sys("\x1b[2mTry 'ls' to explore files or 'fortune' for hiring inspiration!\x1b[0m");
    await sys("\x1b[2mUse 'man <command>' for detailed help on any command.\x1b[0m");
    await sys("\x1b[2m\x1b[31mWarning: 'rm -rf /*' will delete the entire website!\x1b[0m");
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
      previousPath = currentPath;
      currentPath = "/home/topp";
      return;
    }

    if (arg === "-") {
      const temp = currentPath;
      currentPath = previousPath;
      previousPath = temp;
      await sys(currentPath);
      return;
    }

    if (arg === "..") {
      const parts = currentPath.split("/").filter(p => p);
      if (parts.length > 2) {
        previousPath = currentPath;
        parts.pop();
        currentPath = "/" + parts.join("/");
      } else {
        previousPath = currentPath;
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

    previousPath = currentPath;
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

  async function cmdAlias(args) {
    if (args.length === 0) {
      // Show all aliases
      for (const [name, value] of Object.entries(aliases)) {
        await sys(`alias ${name}='${value}'`);
      }
      return;
    }
    
    // Set alias: alias name='command'
    const input = args.join(' ');
    const match = input.match(/^(\w+)=['"](.+)['"]$/);
    if (match) {
      const [, name, value] = match;
      aliases[name] = value;
      await sys(`alias ${name}='${value}'`);
    } else {
      // Show specific alias
      const name = args[0];
      if (aliases[name]) {
        await sys(`alias ${name}='${aliases[name]}'`);
      } else {
        await err(`alias: ${name}: not found`);
      }
    }
  }

  async function cmdExport(args) {
    if (args.length === 0) {
      // Show all exported variables
      for (const [name, value] of Object.entries(envVars)) {
        await sys(`export ${name}="${value}"`);
      }
      return;
    }
    
    // Set variable: export VAR=value
    const input = args.join(' ');
    const match = input.match(/^(\w+)=(.+)$/);
    if (match) {
      const [, name, value] = match;
      envVars[name] = value.replace(/['"]/g, '');
      await sys(`export ${name}="${envVars[name]}"`);
    } else {
      await err(`export: Invalid syntax. Use: export VAR=value`);
    }
  }

  async function cmdEnv() {
    envVars.PWD = currentPath;
    for (const [name, value] of Object.entries(envVars)) {
      await sys(`${name}=${value}`);
    }
  }

  async function cmdJobs() {
    if (jobs.length === 0) {
      await sys("No background jobs");
      return;
    }
    
    for (const job of jobs) {
      const status = job.status === 'running' ? 'Running' : 'Stopped';
      await sys(`[${job.id}]  ${status}\t${job.command}`);
    }
  }

  async function cmdFg(args) {
    if (jobs.length === 0) {
      return err("fg: no job control");
    }
    
    const jobId = args[0] ? parseInt(args[0]) : jobs[jobs.length - 1].id;
    const job = jobs.find(j => j.id === jobId);
    
    if (!job) {
      return err(`fg: ${jobId}: no such job`);
    }
    
    await sys(`${job.command}`);
    jobs = jobs.filter(j => j.id !== jobId);
  }

  async function cmdBg(args) {
    if (jobs.length === 0) {
      return err("bg: no job control");
    }
    
    const jobId = args[0] ? parseInt(args[0]) : jobs[jobs.length - 1].id;
    const job = jobs.find(j => j.id === jobId);
    
    if (!job) {
      return err(`bg: ${jobId}: no such job`);
    }
    
    job.status = 'running';
    await sys(`[${job.id}] ${job.command} &`);
  }

  async function cmdTheme(args) {
    const theme = args[0];
    
    if (!theme) {
      await sys("Available themes: dark (default), light, matrix, cyberpunk, hacker");
      return;
    }
    
    const themes = {
      dark: {
        background: '#000000',
        foreground: '#e4e6eb',
        cursor: '#00ff00'
      },
      light: {
        background: '#ffffff',
        foreground: '#000000',
        cursor: '#0000ff'
      },
      matrix: {
        background: '#000000',
        foreground: '#00ff00',
        cursor: '#00ff00'
      },
      cyberpunk: {
        background: '#0a0e27',
        foreground: '#ff00ff',
        cursor: '#00ffff'
      },
      hacker: {
        background: '#000000',
        foreground: '#00ff00',
        cursor: '#ff0000'
      }
    };
    
    if (themes[theme]) {
      term.options.theme = themes[theme];
      await sys(`Theme changed to: ${theme}`);
    } else {
      await err(`Unknown theme: ${theme}`);
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

  async function cmdWhoamiVerbose() {
    await sys("\x1b[1;36m════════════════════════════════════════════════\x1b[0m");
    await sys("\x1b[1;36m           Martin Topp - whoami -v              \x1b[0m");
    await sys("\x1b[1;36m════════════════════════════════════════════════\x1b[0m");
    await sys("");
    await sys("\x1b[33mUser:\x1b[0m           topp (Martin Topp)");
    await sys("\x1b[33mRole:\x1b[0m           Cybersecurity Student & Competitor");
    await sys("\x1b[33mOrganization:\x1b[0m   Indiana Tech Cyber Warriors");
    await sys("\x1b[33mGPA:\x1b[0m            3.9 / 4.0");
    await sys("\x1b[33mSpecialty:\x1b[0m      Offensive Security & Windows Administration");
    await sys("");
    await sys("\x1b[32mAchievements:\x1b[0m");
    await sys("   • CCDC Top 6 National Finish");
    await sys("   • NCAE Cyber Games MVP Award");
    await sys("   • NCAE Most Improved Teammate");
    await sys("   • NCL Competitor");
    await sys("");
    await sys("\x1b[36mContact:\x1b[0m mtopp887@gmail.com");
    await sys("\x1b[36mLinks:\x1b[0m    linkedin.com/in/martin-topp | github.com/mt292");
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
    await sys("\x1b[36m       @p~qp~~qMb\x1b[0m                    \x1b[33mName\x1b[0m: Martin Topp");
    await sys("\x1b[36m       M|@||@) M|\x1b[0m                    \x1b[33mRole\x1b[0m: Cybersecurity Student");
    await sys("\x1b[36m       @,----.JM|\x1b[0m                    \x1b[33mSchool\x1b[0m: Indiana Tech");
    await sys("\x1b[36m      JS^\\__/  qKL\x1b[0m                   \x1b[33mGPA\x1b[0m: 3.9 / 4.0");
    await sys("\x1b[36m     dZP        qKRb\x1b[0m                  \x1b[33mTeam\x1b[0m: Cyber Warriors");
    await sys("\x1b[36m    dZP          qKKb\x1b[0m                 \x1b[33mSpecialty\x1b[0m: OffSec & Windows");
    await sys("\x1b[36m   fZP            SMMb\x1b[0m                \x1b[33mSkills\x1b[0m: Python, Bash, PowerShell");
    await sys("\x1b[36m   HZM            MMMM\x1b[0m                \x1b[33mAchievements\x1b[0m: CCDC Top 6, NCAE MVP");
    await sys("\x1b[36m   FqM            MMMM\x1b[0m                \x1b[33mEmail\x1b[0m: mtopp887@gmail.com");
    await sys("\x1b[36m __| \".        |\\dS\"qML\x1b[0m");
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

  async function cmdGit(args) {
    if (!args[0]) {
      return sys("usage: git [--version] [--help] <command> [<args>]");
    }
    
    const subcmd = args[0];
    if (subcmd === "--version") {
      return sys("git version 2.42.0");
    }
    if (subcmd === "status") {
      await sys("On branch main");
      await sys("Your branch is up to date with 'origin/main'.");
      await sys("");
      return sys("nothing to commit, working tree clean");
    }
    if (subcmd === "log") {
      await sys("\x1b[33mcommit a7f8e9d2c1b3f4e5a6c7d8e9f0a1b2c3d4e5f6a7\x1b[0m");
      await sys("Author: Martin Topp <mtopp887@gmail.com>");
      await sys("Date:   " + new Date().toDateString());
      await sys("");
      return sys("    Updated portfolio with new projects");
    }
    if (subcmd === "branch") {
      return sys("* \x1b[32mmain\x1b[0m");
    }
    return sys(`git ${subcmd}: command not fully implemented in web terminal`);
  }

  async function cmdDocker(args) {
    if (!args[0]) {
      return sys("Usage: docker [OPTIONS] COMMAND");
    }
    
    const subcmd = args[0];
    if (subcmd === "ps") {
      await sys("CONTAINER ID   IMAGE           COMMAND                  CREATED        STATUS        PORTS                    NAMES");
      await sys("a1b2c3d4e5f6   nginx:latest    \"/docker-entrypoint.…\"   2 hours ago    Up 2 hours    0.0.0.0:80->80/tcp       portfolio-web");
      return sys("f6e5d4c3b2a1   postgres:15     \"docker-entrypoint.s…\"   3 hours ago    Up 3 hours    0.0.0.0:5432->5432/tcp   portfolio-db");
    }
    if (subcmd === "images") {
      await sys("REPOSITORY    TAG       IMAGE ID       CREATED        SIZE");
      await sys("nginx         latest    a1b2c3d4e5f6   2 weeks ago    142MB");
      return sys("postgres      15        f6e5d4c3b2a1   3 weeks ago    379MB");
    }
    if (subcmd === "--version" || subcmd === "version") {
      return sys("Docker version 24.0.6, build ed223bc");
    }
    return sys(`docker ${subcmd}: command not fully implemented in web terminal`);
  }

  async function cmdPython(args) {
    if (!args[0]) {
      return sys("Python 3.11.5 interactive shell not available in web terminal");
    }
    if (args[0] === "--version") {
      return sys("Python 3.11.5");
    }
    if (args[0] === "-c" && args[1]) {
      return sys(`python: code execution not available in web terminal`);
    }
    return sys(`python: script execution not available`);
  }

  async function cmdNode(args) {
    if (!args[0]) {
      return sys("Node.js interactive shell not available in web terminal");
    }
    if (args[0] === "--version" || args[0] === "-v") {
      return sys("v20.9.0");
    }
    return sys(`node: script execution not available`);
  }

  async function cmdNpm(args) {
    if (!args[0]) {
      return sys("Usage: npm <command>");
    }
    const subcmd = args[0];
    if (subcmd === "--version" || subcmd === "-v") {
      return sys("10.1.0");
    }
    if (subcmd === "list" || subcmd === "ls") {
      await sys("portfolio@1.0.0 /home/topp");
      await sys("├── xterm@5.3.0");
      return sys("└── xterm-addon-fit@0.8.0");
    }
    return sys(`npm ${subcmd}: package management not available in web terminal`);
  }

  async function cmdPip(args) {
    if (!args[0]) {
      return sys("Usage: pip <command> [options]");
    }
    const subcmd = args[0];
    if (subcmd === "--version") {
      return sys("pip 23.3.1 from /usr/lib/python3.11/site-packages/pip (python 3.11)");
    }
    if (subcmd === "list") {
      await sys("Package           Version");
      await sys("-----------------  -------");
      await sys("requests           2.31.0");
      await sys("flask              3.0.0");
      return sys("paramiko           3.3.1");
    }
    return sys(`pip ${subcmd}: package management not available in web terminal`);
  }

  // Network command implementations
  async function cmdIfconfig() {
    await sys("eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500");
    await sys("        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255");
    await sys("        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>");
    await sys("        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)");
    await sys("        RX packets 142857  bytes 89264531 (85.1 MiB)");
    await sys("        TX packets 98432   bytes 12847392 (12.2 MiB)");
    await sys("");
    await sys("lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536");
    await sys("        inet 127.0.0.1  netmask 255.0.0.0");
    await sys("        inet6 ::1  prefixlen 128  scopeid 0x10<host>");
    await sys("        loop  txqueuelen 1000  (Local Loopback)");
  }

  async function cmdIp(args) {
    if (!args[0]) {
      return sys("Usage: ip [ OPTIONS ] OBJECT { COMMAND | help }");
    }
    if (args[0] === "addr" || args[0] === "address") {
      await sys("1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000");
      await sys("    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00");
      await sys("    inet 127.0.0.1/8 scope host lo");
      await sys("2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000");
      await sys("    link/ether 08:00:27:4e:66:a1 brd ff:ff:ff:ff:ff:ff");
      return sys("    inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic eth0");
    }
    if (args[0] === "route") {
      await sys("default via 192.168.1.1 dev eth0 proto dhcp metric 100");
      return sys("192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100 metric 100");
    }
    return sys(`ip ${args[0]}: command not fully implemented`);
  }

  async function cmdNetstat(args) {
    await sys("Active Internet connections (servers and established)");
    await sys("Proto Recv-Q Send-Q Local Address           Foreign Address         State");
    await sys("tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN");
    await sys("tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN");
    await sys("tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN");
    await sys("tcp        0      0 192.168.1.100:22        192.168.1.50:54321      ESTABLISHED");
    await sys("tcp6       0      0 :::22                   :::*                    LISTEN");
    await sys("tcp6       0      0 :::80                   :::*                    LISTEN");
  }

  async function cmdSs(args) {
    await sys("Netid  State   Recv-Q  Send-Q   Local Address:Port    Peer Address:Port   Process");
    await sys("tcp    LISTEN  0       128            0.0.0.0:22           0.0.0.0:*");
    await sys("tcp    LISTEN  0       511            0.0.0.0:80           0.0.0.0:*");
    await sys("tcp    LISTEN  0       511            0.0.0.0:443          0.0.0.0:*");
    await sys("tcp    ESTAB   0       0        192.168.1.100:22     192.168.1.50:54321");
  }

  async function cmdTraceroute(host) {
    if (!host) {
      return err("Usage: traceroute <host>");
    }
    await sys(`traceroute to ${host} (93.184.216.34), 30 hops max, 60 byte packets`);
    await sys(" 1  192.168.1.1 (192.168.1.1)  1.234 ms  1.198 ms  1.165 ms");
    await sys(" 2  10.0.0.1 (10.0.0.1)  5.432 ms  5.398 ms  5.365 ms");
    await sys(" 3  72.14.215.85 (72.14.215.85)  12.567 ms  12.534 ms  12.501 ms");
    await sys(` 4  ${host} (93.184.216.34)  18.789 ms  18.756 ms  18.723 ms`);
  }

  async function cmdNslookup(host) {
    if (!host) {
      return err("Usage: nslookup <host>");
    }
    await sys("Server:         8.8.8.8");
    await sys("Address:        8.8.8.8#53");
    await sys("");
    await sys("Non-authoritative answer:");
    await sys(`Name:   ${host}`);
    await sys("Address: 93.184.216.34");
  }

  async function cmdDig(host) {
    if (!host) {
      return err("Usage: dig <host>");
    }
    await sys("; <<>> DiG 9.18.18 <<>> " + host);
    await sys(";; global options: +cmd");
    await sys(";; Got answer:");
    await sys(";; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345");
    await sys(";; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1");
    await sys("");
    await sys(";; QUESTION SECTION:");
    await sys(`;${host}.                IN      A`);
    await sys("");
    await sys(";; ANSWER SECTION:");
    await sys(`${host}.         3600    IN      A       93.184.216.34`);
    await sys("");
    await sys(";; Query time: 23 msec");
    await sys(";; SERVER: 8.8.8.8#53(8.8.8.8)");
    await sys(";; WHEN: " + new Date().toString());
    await sys(";; MSG SIZE  rcvd: 56");
  }

  async function cmdHost(host) {
    if (!host) {
      return err("Usage: host <hostname>");
    }
    await sys(`${host} has address 93.184.216.34`);
    await sys(`${host} has IPv6 address 2606:2800:220:1:248:1893:25c8:1946`);
  }

  async function cmdRoute() {
    await sys("Kernel IP routing table");
    await sys("Destination     Gateway         Genmask         Flags Metric Ref    Use Iface");
    await sys("default         192.168.1.1     0.0.0.0         UG    100    0        0 eth0");
    await sys("192.168.1.0     0.0.0.0         255.255.255.0   U     100    0        0 eth0");
  }

  async function cmdArp() {
    await sys("Address                  HWtype  HWaddress           Flags Mask            Iface");
    await sys("192.168.1.1              ether   00:11:22:33:44:55   C                     eth0");
    await sys("192.168.1.50             ether   aa:bb:cc:dd:ee:ff   C                     eth0");
  }

  async function cmdNmap(target) {
    if (!target) {
      return err("Usage: nmap <target>");
    }
    await sys("Starting Nmap 7.94 ( https://nmap.org )");
    await sys(`Nmap scan report for ${target}`);
    await sys("Host is up (0.0012s latency).");
    await sys("Not shown: 997 closed ports");
    await sys("PORT    STATE SERVICE");
    await sys("22/tcp  open  ssh");
    await sys("80/tcp  open  http");
    await sys("443/tcp open  https");
    await sys("");
    await sys("Nmap done: 1 IP address (1 host up) scanned in 0.23 seconds");
  }

  async function cmdWhois(domain) {
    if (!domain) {
      return err("Usage: whois <domain>");
    }
    await sys(`Domain Name: ${domain.toUpperCase()}`);
    await sys("Registry Domain ID: 12345678_DOMAIN_COM-VRSN");
    await sys("Registrar WHOIS Server: whois.registrar.com");
    await sys("Registrar URL: http://www.registrar.com");
    await sys("Updated Date: 2024-01-15T00:00:00Z");
    await sys("Creation Date: 2020-01-01T00:00:00Z");
    await sys("Registrar Registration Expiration Date: 2025-01-01T00:00:00Z");
    await sys("Registrar: Example Registrar, Inc.");
    await sys("Domain Status: clientTransferProhibited");
  }

  // Process management
  async function cmdCrontab(args) {
    if (!args[0] || args[0] === "-l") {
      await sys("# Edit this file to introduce tasks to be run by cron.");
      await sys("# m h  dom mon dow   command");
      await sys("0 2 * * * /usr/local/bin/backup.sh");
      return sys("*/15 * * * * /usr/local/bin/monitor.sh");
    }
    return sys("crontab: editing not available in web terminal");
  }

  async function cmdPgrep(name) {
    if (!name) {
      return err("Usage: pgrep <pattern>");
    }
    const pids = [1234, 5678, 9012];
    for (const pid of pids) {
      await sys(pid.toString());
    }
  }

  async function cmdPstree() {
    await sys("systemd─┬─NetworkManager───2*[{NetworkManager}]");
    await sys("        ├─accounts-daemon───2*[{accounts-daemon}]");
    await sys("        ├─cron");
    await sys("        ├─dbus-daemon");
    await sys("        ├─nginx───4*[nginx]");
    await sys("        ├─sshd───sshd───bash───pstree");
    await sys("        ├─systemd-journal");
    await sys("        └─systemd-logind");
  }

  async function cmdLsof() {
    await sys("COMMAND    PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME");
    await sys("systemd      1 root  cwd    DIR  259,2     4096    2 /");
    await sys("nginx     1234 www   mem    REG  259,2   142856  123 /usr/sbin/nginx");
    await sys("sshd      5678 root    3u  IPv4  12345      0t0  TCP *:22 (LISTEN)");
    await sys("bash      9012 topp  cwd    DIR  259,2     4096  456 /home/topp");
  }

  async function cmdPs(args) {
    const aux = args.includes('aux') || args.includes('-aux');
    const ef = args.includes('-ef') || args.includes('ef');
    
    if (aux) {
      await sys("USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND");
      await sys("root           1  0.0  0.1 169488  9240 ?        Ss   Jan15   0:02 /sbin/init");
      await sys("root         234  0.0  0.2 289744 17584 ?        Ssl  Jan15   0:12 /usr/bin/systemd");
      await sys("www-data    1234  0.1  0.5 125380 41232 ?        S    10:30   0:15 nginx: worker process");
      await sys("root        1337  0.0  0.1  72304  8192 ?        Ss   Jan15   0:00 /usr/sbin/sshd -D");
      await sys("topp        2024  0.2  0.3 115644 25088 pts/0    Ss   11:45   0:01 -zsh");
      await sys("topp        2156  0.0  0.1  51060  3440 pts/0    R+   11:48   0:00 ps aux");
    } else if (ef) {
      await sys("UID          PID    PPID  C STIME TTY          TIME CMD");
      await sys("root           1       0  0 Jan15 ?        00:00:02 /sbin/init");
      await sys("root         234       1  0 Jan15 ?        00:00:12 /usr/bin/systemd");
      await sys("www-data    1234     234  0 10:30 ?        00:00:15 nginx: worker");
      await sys("root        1337       1  0 Jan15 ?        00:00:00 /usr/sbin/sshd");
      await sys("topp        2024    1337  0 11:45 pts/0    00:00:01 -zsh");
      await sys("topp        2156    2024  0 11:48 pts/0    00:00:00 ps -ef");
    } else {
      await sys("    PID TTY          TIME CMD");
      await sys("   2024 pts/0    00:00:01 zsh");
      await sys("   2156 pts/0    00:00:00 ps");
    }
  }

  async function cmdTop() {
    const now = new Date();
    const uptime = "15:42:33 up 5 days, 3:27";
    await sys(`top - ${uptime}, 1 user, load average: 0.15, 0.08, 0.05`);
    await sys("Tasks: 142 total,   1 running, 141 sleeping,   0 stopped,   0 zombie");
    await sys("%Cpu(s):  2.3 us,  0.7 sy,  0.0 ni, 96.8 id,  0.2 wa,  0.0 hi,  0.0 si,  0.0 st");
    await sys("MiB Mem :   7891.2 total,   3421.5 free,   2156.3 used,   2313.4 buff/cache");
    await sys("MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   5234.9 avail Mem");
    await sys("");
    await sys("    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND");
    await sys("      1 root      20   0  169488   9240   6724 S   0.0   0.1   0:02.34 systemd");
    await sys("    234 root      20   0  289744  17584  12456 S   0.0   0.2   0:12.45 systemd-journal");
    await sys("   1234 www-data  20   0  125380  41232  12344 S   0.3   0.5   0:15.67 nginx");
    await sys("   1337 root      20   0   72304   8192   6144 S   0.0   0.1   0:00.12 sshd");
    await sys("   2024 topp      20   0  115644  25088  18432 S   0.1   0.3   0:01.23 zsh");
    await sys("   2156 topp      20   0   51060   3440   2816 R   0.2   0.0   0:00.01 top");
  }

  async function cmdUptime() {
    const uptime = Math.floor(Math.random() * 10) + 1;
    const days = uptime;
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const users = 1;
    const load1 = (Math.random() * 0.5).toFixed(2);
    const load5 = (Math.random() * 0.3).toFixed(2);
    const load15 = (Math.random() * 0.2).toFixed(2);
    
    const now = new Date().toLocaleTimeString();
    await sys(`${now} up ${days} days, ${hours}:${minutes}, ${users} user, load average: ${load1}, ${load5}, ${load15}`);
  }

  async function cmdWho() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
    await sys(`topp     pts/0        ${dateStr} ${timeStr} (portfolio-terminal)`);
  }

  async function cmdLast() {
    await sys("topp     pts/0        192.168.1.100    Thu Jan 16 11:45   still logged in");
    await sys("topp     pts/0        192.168.1.100    Wed Jan 15 09:23 - 18:45  (09:22)");
    await sys("topp     pts/0        192.168.1.100    Tue Jan 14 13:15 - 22:30  (09:15)");
    await sys("topp     pts/0        192.168.1.100    Mon Jan 13 08:00 - 17:00  (09:00)");
    await sys("");
    await sys("wtmp begins Mon Jan 13 08:00:00 2025");
  }

  // System info commands
  async function cmdLscpu() {
    await sys("Architecture:            x86_64");
    await sys("  CPU op-mode(s):        32-bit, 64-bit");
    await sys("  Address sizes:         46 bits physical, 48 bits virtual");
    await sys("  Byte Order:            Little Endian");
    await sys("CPU(s):                  8");
    await sys("  On-line CPU(s) list:   0-7");
    await sys("Vendor ID:               GenuineIntel");
    await sys("  Model name:            Intel(R) Core(TM) i7-9700K CPU @ 3.60GHz");
    await sys("    CPU family:          6");
    await sys("    Model:               158");
    await sys("    Thread(s) per core:  2");
    await sys("    Core(s) per socket:  4");
    await sys("    Socket(s):           1");
    await sys("Virtualization features:");
    await sys("  Virtualization:        VT-x");
  }

  async function cmdLsblk() {
    await sys("NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS");
    await sys("sda      8:0    0 465.8G  0 disk");
    await sys("├─sda1   8:1    0   512M  0 part /boot/efi");
    await sys("├─sda2   8:2    0    16G  0 part [SWAP]");
    await sys("└─sda3   8:3    0 449.3G  0 part /");
    await sys("sr0     11:0    1  1024M  0 rom");
  }

  async function cmdLsusb() {
    await sys("Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub");
    await sys("Bus 001 Device 004: ID 046d:c52b Logitech, Inc. Unifying Receiver");
    await sys("Bus 001 Device 003: ID 8087:0a2b Intel Corp. Bluetooth wireless interface");
    await sys("Bus 001 Device 002: ID 0bda:5689 Realtek Semiconductor Corp. Integrated Webcam");
    await sys("Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub");
  }

  async function cmdLspci() {
    await sys("00:00.0 Host bridge: Intel Corporation 8th Gen Core Processor Host Bridge/DRAM Registers");
    await sys("00:02.0 VGA compatible controller: Intel Corporation UHD Graphics 630");
    await sys("00:14.0 USB controller: Intel Corporation Cannon Lake PCH USB 3.1 xHCI Host Controller");
    await sys("00:16.0 Communication controller: Intel Corporation Cannon Lake PCH HECI Controller");
    await sys("00:1f.0 ISA bridge: Intel Corporation Z390 Chipset LPC/eSPI Controller");
    await sys("00:1f.3 Audio device: Intel Corporation Cannon Lake PCH cAVS");
    await sys("01:00.0 Ethernet controller: Realtek Semiconductor Co., Ltd. RTL8111/8168/8411 PCI Express Gigabit Ethernet Controller");
  }

  async function cmdLsmod() {
    await sys("Module                  Size  Used by");
    await sys("nvidia_uvm           1228800  0");
    await sys("nvidia_drm             69632  2");
    await sys("nvidia_modeset       1212416  3 nvidia_drm");
    await sys("nvidia              40591360  103 nvidia_uvm,nvidia_modeset");
    await sys("drm_kms_helper        311296  1 nvidia_drm");
    await sys("drm                   622592  5 drm_kms_helper,nvidia,nvidia_drm");
    await sys("i2c_nvidia_gpu         16384  0");
  }

  async function cmdJournalctl(args) {
    await sys("-- Logs begin at Mon 2024-01-01 00:00:00 EST, end at " + new Date().toDateString() + " --");
    await sys("Jan 10 10:23:45 portfolio systemd[1]: Started Session 1 of user topp.");
    await sys("Jan 10 10:23:46 portfolio sshd[1234]: Accepted publickey for topp from 192.168.1.50 port 54321");
    await sys("Jan 10 10:24:12 portfolio nginx[5678]: 192.168.1.50 - - [10/Jan/2025:10:24:12 +0000] \"GET / HTTP/1.1\" 200 4096");
    await sys("Jan 10 10:25:33 portfolio systemd[1]: Started Daily apt download activities.");
  }

  async function cmdHostnamectl() {
    await sys("   Static hostname: portfolio.martintopp.com");
    await sys("         Icon name: computer-laptop");
    await sys("           Chassis: laptop");
    await sys("        Machine ID: a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6");
    await sys("           Boot ID: f6e5d4c3b2a1f0e9d8c7b6a5e4d3c2b1");
    await sys("  Operating System: Portfolio Linux (Cybersecurity Edition)");
    await sys("            Kernel: Linux 6.1.0-martin-custom");
    await sys("      Architecture: x86-64");
  }

  async function cmdTimedatectl() {
    const now = new Date();
    await sys("               Local time: " + now.toString());
    await sys("           Universal time: " + now.toUTCString());
    await sys("                 RTC time: " + now.toUTCString());
    await sys("                Time zone: America/New_York (EST, -0500)");
    await sys("System clock synchronized: yes");
    await sys("              NTP service: active");
    await sys("          RTC in local TZ: no");
  }

  async function cmdLocalectl() {
    await sys("   System Locale: LANG=en_US.UTF-8");
    await sys("       VC Keymap: us");
    await sys("      X11 Layout: us");
  }

  async function cmdVmstat() {
    await sys("procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----");
    await sys(" r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st");
    await sys(" 2  0      0 2048576 524288 4194304   0    0    12    34  567  890 15  5 78  2  0");
  }

  async function cmdIostat() {
    await sys("Linux 6.1.0-martin-custom (portfolio)    " + new Date().toDateString());
    await sys("");
    await sys("avg-cpu:  %user   %nice %system %iowait  %steal   %idle");
    await sys("          15.23    0.00    5.67    2.34    0.00   76.76");
    await sys("");
    await sys("Device            tps    kB_read/s    kB_wrtn/s    kB_dscd/s    kB_read    kB_wrtn    kB_dscd");
    await sys("sda             23.45       123.45       456.78         0.00    1234567    4567890          0");
  }

  async function cmdBlkid() {
    await sys("/dev/sda1: UUID=\"ABCD-1234\" BLOCK_SIZE=\"512\" TYPE=\"vfat\" PARTLABEL=\"EFI System Partition\" PARTUUID=\"a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6\"");
    await sys("/dev/sda2: UUID=\"f6e5d4c3-b2a1-f0e9-d8c7-b6a5e4d3c2b1\" TYPE=\"swap\" PARTUUID=\"b2c3d4e5-f6a7-b8c9-d0e1-f2a3b4c5d6e7\"");
    await sys("/dev/sda3: UUID=\"c3d4e5f6-a7b8-c9d0-e1f2-a3b4c5d6e7f8\" BLOCK_SIZE=\"4096\" TYPE=\"ext4\" PARTUUID=\"d4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9\"");
  }

  // File operation commands
  async function cmdCut(args) {
    return sys("cut: Requires input redirection not available in web terminal");
  }

  async function cmdBasename(path) {
    if (!path) {
      return err("Usage: basename <path>");
    }
    const parts = path.split("/");
    return sys(parts[parts.length - 1] || "/");
  }

  async function cmdDirname(path) {
    if (!path) {
      return err("Usage: dirname <path>");
    }
    const parts = path.split("/");
    parts.pop();
    return sys(parts.join("/") || "/");
  }

  async function cmdStat(filename) {
    if (!filename) {
      return err("Usage: stat <file>");
    }
    
    const node = resolvePath(currentPath);
    if (!node || !node.contents[filename]) {
      return err(`stat: cannot stat '${filename}': No such file or directory`);
    }
    
    const file = node.contents[filename];
    await sys(`  File: ${filename}`);
    await sys(`  Size: ${file.content?.length || 4096}     Blocks: 8          IO Block: 4096   ${file.type === "dir" ? "directory" : "regular file"}`);
    await sys(`Device: 8,3    Inode: 123456      Links: ${file.type === "dir" ? "2" : "1"}`);
    await sys(`Access: (0${file.type === "dir" ? "755" : "644"}/${file.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--"})  Uid: ( 1000/    topp)   Gid: ( 1000/    topp)`);
    await sys("Access: 2025-01-10 10:00:00.000000000 -0500");
    await sys("Modify: 2025-01-10 10:00:00.000000000 -0500");
    await sys("Change: 2025-01-10 10:00:00.000000000 -0500");
    await sys(" Birth: 2025-01-01 00:00:00.000000000 -0500");
  }

  async function cmdFile(filename) {
    if (!filename) {
      return err("Usage: file <file>");
    }
    
    const node = resolvePath(currentPath);
    if (!node || !node.contents[filename]) {
      return err(`file: cannot open '${filename}' (No such file or directory)`);
    }
    
    const file = node.contents[filename];
    if (file.type === "dir") {
      return sys(`${filename}: directory`);
    }
    
    const content = file.content || "";
    if (content.startsWith("#!")) {
      return sys(`${filename}: shell script, ASCII text executable`);
    }
    return sys(`${filename}: ASCII text`);
  }

  async function cmdMd5sum(filename) {
    if (!filename) {
      return err("Usage: md5sum <file>");
    }
    
    const node = resolvePath(currentPath);
    if (!node || !node.contents[filename]) {
      return err(`md5sum: ${filename}: No such file or directory`);
    }
    
    return sys(`d41d8cd98f00b204e9800998ecf8427e  ${filename}`);
  }

  async function cmdSha256sum(filename) {
    if (!filename) {
      return err("Usage: sha256sum <file>");
    }
    
    const node = resolvePath(currentPath);
    if (!node || !node.contents[filename]) {
      return err(`sha256sum: ${filename}: No such file or directory`);
    }
    
    return sys(`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  ${filename}`);
  }

  // User management
  async function cmdPasswd(args) {
    if (!args[0]) {
      await sys("Changing password for topp.");
      await sys("Current password: ");
      return sys("passwd: Authentication token manipulation error");
    }
    return sys("passwd: Permission denied");
  }

  async function cmdId(user) {
    const username = user || "topp";
    return sys(`uid=1000(${username}) gid=1000(${username}) groups=1000(${username}),4(adm),27(sudo),999(docker)`);
  }

  async function cmdGroups(user) {
    const username = user || "topp";
    return sys(`${username} : ${username} adm sudo docker`);
  }

  async function cmdFinger(user) {
    const username = user || "topp";
    if (username === "topp") {
      await sys(`Login: topp                             Name: Martin Topp`);
      await sys(`Directory: /home/topp                   Shell: /bin/bash`);
      await sys(`On since Mon Nov 10 10:00 (EST) on pts/0 from recruiter.company.com`);
      await sys(`Mail: Full inbox - recruiters welcome!`);
      await sys(`Plan:`);
      await sys(`  1. Graduate with honors from Indiana Tech`);
      await sys(`  2. Win more cybersecurity competitions`);
      await sys(`  3. Land an amazing cybersecurity role`);
      await sys(`  4. Make systems more secure, one network at a time`);
      return sys(`  Currently seeking: Full-time Cybersecurity positions!`);
    }
    return err(`finger: ${username}: no such user`);
  }

  async function cmdGetent(args) {
    if (!args[0]) {
      return err("Usage: getent database [key ...]");
    }
    
    if (args[0] === "passwd") {
      if (args[1]) {
        if (args[1] === "topp") {
          return sys("topp:x:1000:1000:Martin Topp:/home/topp:/bin/bash");
        }
        return err(`getent: ${args[1]}: no such user`);
      }
      await sys("root:x:0:0:root:/root:/bin/bash");
      return sys("topp:x:1000:1000:Martin Topp:/home/topp:/bin/bash");
    }
    
    if (args[0] === "group") {
      await sys("root:x:0:");
      await sys("adm:x:4:topp");
      await sys("sudo:x:27:topp");
      return sys("topp:x:1000:");
    }
    
    return err(`getent: Unknown database: ${args[0]}`);
  }

  // Permission commands
  async function cmdUmask(value) {
    if (!value) {
      return sys("0022");
    }
    return sys(`umask: cannot set umask in read-only web terminal`);
  }

  // Shell utility commands
  async function cmdExit() {
    await sys("logout");
    await sleep(500);
    return sys("\x1b[2mRefresh the page to restart the terminal\x1b[0m");
  }

  async function cmdSeq(args) {
    if (!args[0]) {
      return err("Usage: seq [FIRST] [INCREMENT] LAST");
    }
    
    const last = parseInt(args[args.length - 1]);
    const first = args.length > 1 ? parseInt(args[0]) : 1;
    const increment = args.length > 2 ? parseInt(args[1]) : 1;
    
    if (isNaN(first) || isNaN(last) || isNaN(increment)) {
      return err("seq: invalid number");
    }
    
    if (Math.abs(last - first) > 100) {
      return err("seq: sequence too long for web terminal");
    }
    
    for (let i = first; increment > 0 ? i <= last : i >= last; i += increment) {
      await sys(i.toString());
    }
  }

  async function cmdFactor(num) {
    if (!num) {
      return err("Usage: factor <number>");
    }
    
    const n = parseInt(num);
    if (isNaN(n) || n < 2) {
      return err("factor: invalid number");
    }
    
    const factors = [];
    let temp = n;
    
    for (let i = 2; i <= Math.sqrt(temp); i++) {
      while (temp % i === 0) {
        factors.push(i);
        temp /= i;
      }
    }
    
    if (temp > 1) {
      factors.push(temp);
    }
    
    return sys(`${n}: ${factors.join(" ")}`);
  }

  async function cmdExpr(args) {
    if (args.length < 3) {
      return err("Usage: expr <number> <operator> <number>");
    }
    
    const a = parseFloat(args[0]);
    const op = args[1];
    const b = parseFloat(args[2]);
    
    if (isNaN(a) || isNaN(b)) {
      return err("expr: non-numeric argument");
    }
    
    let result;
    switch (op) {
      case "+": result = a + b; break;
      case "-": result = a - b; break;
      case "*": result = a * b; break;
      case "/": result = b !== 0 ? Math.floor(a / b) : "division by zero"; break;
      case "%": result = b !== 0 ? a % b : "division by zero"; break;
      default: return err(`expr: unknown operator '${op}'`);
    }
    
    return sys(result.toString());
  }

  // System control
  async function cmdReboot() {
    await sys("\x1b[33mBroadcast message from topp@portfolio\x1b[0m");
    await sys("");
    await sys("The system is going down for reboot NOW!");
    await sleep(1000);
    await sys("\x1b[2mJust kidding! This is a web terminal.\x1b[0m");
    await sleep(500);
    return sys("\x1b[2mRefresh the page if you want to 'reboot'\x1b[0m");
  }

  // Misc utility commands
  async function cmdCal(args) {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const monthName = now.toLocaleString('default', { month: 'long' });
    
    await sys(`      ${monthName} ${year}`);
    await sys("Su Mo Tu We Th Fr Sa");
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let week = " ".repeat(firstDay * 3);
    for (let day = 1; day <= daysInMonth; day++) {
      week += day.toString().padStart(2, " ") + " ";
      if ((firstDay + day) % 7 === 0) {
        await sys(week);
        week = "";
      }
    }
    if (week.trim()) {
      await sys(week);
    }
  }

  async function cmdBanner(text) {
    if (!text) {
      text = "HIRE MARTIN";
    }
    
    const msg = text.slice(0, 15).toUpperCase();
    await sys("");
    await sys(" #     #    #    ######  ####### ### #     #");
    await sys(" ##   ##   # #   #     #    #     #  ##    #");
    await sys(" # # # #  #   #  #     #    #     #  # #   #");
    await sys(" #  #  # #     # ######     #     #  #  #  #");
    await sys(" #     # ####### #   #      #     #  #   # #");
    await sys(" #     # #     # #    #     #     #  #    ##");
    await sys(" #     # #     # #     #    #    ### #     #");
    await sys("");
    return sys(`         >>> ${msg} <<<`);
  }

  async function cmdFiglet(text) {
    if (!text) {
      text = "Martin Topp";
    }
    
    if (text.toLowerCase().includes("martin") || text.toLowerCase().includes("topp")) {
      await sys("  __  __            _   _         _____                   ");
      await sys(" |  \\/  | __ _ _ __| |_(_)_ __   |_   _|__  _ __  _ __   ");
      await sys(" | |\\/| |/ _` | '__| __| | '_ \\    | |/ _ \\| '_ \\| '_ \\  ");
      await sys(" | |  | | (_| | |  | |_| | | | |   | | (_) | |_) | |_) | ");
      await sys(" |_|  |_|\\__,_|_|   \\__|_|_| |_|   |_|\\___/| .__/| .__/  ");
      await sys("                                            |_|   |_|     ");
    } else {
      await sys("  ____            _    __       _ _       ");
      await sys(" |  _ \\ ___  _ __| |_ / _| ___ | (_) ___  ");
      await sys(" | |_) / _ \\| '__| __| |_ / _ \\| | |/ _ \\ ");
      await sys(" |  __/ (_) | |  | |_|  _| (_) | | | (_) |");
      await sys(" |_|   \\___/|_|   \\__|_|  \\___/|_|_|\\___/ ");
    }
  }

  async function cmdCowsay(text) {
    if (!text) {
      text = "Hire Martin Topp - CCDC Top 6 | NCAE MVP";
    }
    
    const len = text.length;
    await sys(" " + "_".repeat(len + 2));
    await sys("< " + text + " >");
    await sys(" " + "-".repeat(len + 2));
    await sys("        \\   ^__^");
    await sys("         \\  (oo)\\_______");
    await sys("            (__)\\       )\\/\\");
    await sys("                ||----w |");
    await sys("                ||     ||");
  }

  async function cmdFortune() {
    const fortunes = [
      "Recruiters: Martin Topp is available for hire - CCDC Top 6, NCAE MVP!",
      "Looking for a cybersecurity professional? Martin has a 3.9 GPA and competition wins!",
      "Martin: Turning vulnerabilities into victories since joining Indiana Tech Cyber Warriors",
      "Fun fact: Martin redesigned a datacenter to 99.98% uptime. Your infrastructure could be next!",
      "Martin Topp - Where offensive security meets defensive excellence",
      "Hiring tip: Candidates who build interactive terminal portfolios are keepers!",
      "CCDC Top 6 | NCAE MVP | 3.9 GPA - Martin is your next cybersecurity hire",
      "Martin can secure your Active Directory while automating with Python. What more do you need?",
      "Indiana Tech Cyber Warriors don't just compete - they dominate. Ask Martin about it!",
      "Red team skills + Blue team mindset = Martin Topp",
      "Defense wins championships. Martin wins CCDC competitions.",
      "Martin's hidden talents: Penetration testing, Python automation, and making recruiters smile",
      "mtopp887@gmail.com - The email address that could solve your security problems",
      "If you're reading this, Martin's portfolio already impressed you. Now imagine him on your team!",
      "Martin Topp: Making cybersecurity look easy since 2020"
    ];
    
    const random = fortunes[Math.floor(Math.random() * fortunes.length)];
    return sys(random);
  }

  async function cmdSl() {
    await sys("   (  ) (@@) ( )  (@)  ()    @@    O     @     O     @      O");
    await sys("  (@@@)");
    await sys("(    )");
    await sys("  (@@@@)");
    await sys("(    )");
    await sys("====        ________                ___________");
    await sys("_D _|  |_______/        \\__I_I_____===__|_________|");
    await sys(" |(_)---  |   H\\________/ |   |        =|___ ___|      _________________");
    await sys(" /     |  |   H  |  |     |   |         ||_| |_||     _|                \\_____A");
    await sys("|      |  |   H  |__--------------------| [___] |   =|                        |");
    await sys("| ________|___H__/__|_____/[][]~\\_______|       |   -|                        |");
    await sys("|/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_");
    await sleep(300);
    await sys("\x1b[2mYou meant to type 'ls', didn't you?\x1b[0m");
  }

  async function cmdRev(text) {
    if (!text) {
      return err("Usage: rev <text>");
    }
    return sys(text.split("").reverse().join(""));
  }

  async function cmdBase64(args) {
    if (!args[0]) {
      return err("Usage: base64 <text> or base64 -d <encoded>");
    }
    
    if (args[0] === "-d" && args[1]) {
      try {
        return sys(atob(args[1]));
      } catch (e) {
        return err("base64: invalid input");
      }
    }
    
    return sys(btoa(args.join(" ")));
  }

  async function cmdSleep(seconds) {
    if (!seconds) {
      return err("Usage: sleep <seconds>");
    }
    
    const sec = parseFloat(seconds);
    if (isNaN(sec) || sec < 0) {
      return err("sleep: invalid time interval");
    }
    
    if (sec > 5) {
      return err("sleep: interval too long for web terminal (max 5s)");
    }
    
    await sys(`Sleeping for ${sec} seconds...`);
    await sleep(sec * 1000);
    return sys("Done!");
  }

  // ---------- Easter Eggs ----------
  async function cmdHack() {
    term.write("\x1b[32m");
    await sysTyped("Initializing hack sequence...", 40);
    await sleep(300);
    await sysTyped("Connecting to mainframe...", 35);
    await sleep(300);
    await sysTyped("Bypassing firewall...", 35);
    await sleep(400);
    await sysTyped("Decrypting passwords...", 30);
    await sleep(400);
    await sysTyped("Uploading backdoor...", 35);
    await sleep(500);
    await sysTyped("Access granted!", 50);
    await sleep(300);
    term.write("\x1b[0m");
    await sys("");
    await sys("Just kidding! This is a portfolio website.");
    await sys("But Martin does know how to do the real thing.");
    await sys("\x1b[33mHire him to protect your systems, not hack them!\x1b[0m");
  }

  async function cmdMatrix() {
    await sys("\x1b[32m");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()";
    
    for (let i = 0; i < 15; i++) {
      let line = "";
      for (let j = 0; j < 80; j++) {
        line += chars[Math.floor(Math.random() * chars.length)];
      }
      await sys(line);
      await sleep(50);
    }
    
    await sys("\x1b[0m");
    await sys("");
    await sys("Wake up, Neo...");
    await sys("The Matrix has you...");
    await sys("");
    await sys("\x1b[33mHiring Martin Topp = Red Pill\x1b[0m");
  }

  async function cmdStarwars() {
    await sys("\x1b[33m");
    await sys("          .  +    .     .     .          .");
    await sys("     .          _\\/_    +  *");
    await sys(" +          .    /\\   .");
    await sys("    .  *        -->*<--    . *");
    await sys("     .   .     .'/|\\'      .");
    await sys("  .   +     +   /_|_\\");
    await sys("");
    await sys("    _____ ______________  _    _____  ____________");
    await sys("   / ___//_  __/  _/  _ \\| |  / /  _ \\/ __/ __/  _/");
    await sys("   \\___ \\  / /  / /| |  || | / /  ___/  _/\\__ \\/  / ");
    await sys("  /____/ / / / /_/ | |__|| |/ / | |  / /__/___/ /_/ ");
    await sys(" /______/ /_/ /_____\\____/|___/|_|  /_____/____/_/");
    await sys("");
    await sys("          A long time ago in a galaxy");
    await sys("            far, far away....");
    await sys("");
    await sys("      Martin Topp defended systems against");
    await sys("      the dark forces of cyber attackers.");
    await sys("");
    await sys("\x1b[32m      May the Cybersecurity be with you.\x1b[0m");
  }

  async function cmdMan(topic) {
    if (!topic) {
      await sys("What manual page do you want?");
      await sys("Usage: man <command>");
      return;
    }
    
    const manPages = {
      ls: `NAME
       ls - list directory contents

SYNOPSIS
       ls [OPTIONS] [FILE]...

DESCRIPTION
       List information about FILEs (the current directory by default).

OPTIONS
       -a, --all
              do not ignore entries starting with .
       -l     use a long listing format
       -la    combination of -l and -a

EXAMPLES
       ls
       ls -la
       ls /home/topp`,

      cd: `NAME
       cd - change directory

SYNOPSIS
       cd [DIRECTORY]

DESCRIPTION
       Change the current working directory to DIRECTORY.
       If DIRECTORY is not specified, change to home directory.

OPTIONS
       -      Change to previous directory

EXAMPLES
       cd /home/topp
       cd projects
       cd ..
       cd -`,

      cat: `NAME
       cat - concatenate files and print

SYNOPSIS
       cat [FILE]...

DESCRIPTION
       Concatenate FILE(s) to standard output.

EXAMPLES
       cat about.txt
       cat contact.txt`,

      echo: `NAME
       echo - display a line of text

SYNOPSIS
       echo [STRING]...

DESCRIPTION
       Echo the STRING(s) to standard output.
       Supports environment variable expansion with $.

EXAMPLES
       echo Hello World
       echo $USER
       echo $HOME`,

      grep: `NAME
       grep - search for patterns in files

SYNOPSIS
       grep [PATTERN] [FILE]

DESCRIPTION
       Search for PATTERN in each FILE.

EXAMPLES
       grep security about.txt
       grep Martin contact.txt`,

      help: `NAME
       help - display available commands

SYNOPSIS
       help

DESCRIPTION
       Show all available terminal commands organized by category.
       Use 'man <command>' for detailed help on specific commands.`,

      neofetch: `NAME
       neofetch - display system information

SYNOPSIS
       neofetch

DESCRIPTION
       Displays detailed information about Martin Topp including
       education, skills, achievements, and contact information.

SEE ALSO
       about, resume, skills, contact`,

      alias: `NAME
       alias - create command aliases

SYNOPSIS
       alias [NAME[=VALUE]]...

DESCRIPTION
       Define or display aliases. Without arguments, prints all aliases.

EXAMPLES
       alias
       alias ll='ls -la'
       alias g='git'`,

      export: `NAME
       export - set environment variables

SYNOPSIS
       export [VAR=VALUE]...

DESCRIPTION
       Set environment variables. Without arguments, prints all variables.

EXAMPLES
       export
       export MY_VAR=hello
       echo $MY_VAR`,

      theme: `NAME
       theme - change terminal color scheme

SYNOPSIS
       theme [THEME_NAME]

DESCRIPTION
       Change the terminal appearance. Without arguments, shows available themes.

THEMES
       dark - Default dark theme
       light - Light theme  
       matrix - Green on black (Matrix style)
       cyberpunk - Purple/cyan cyberpunk theme
       hacker - Hacker green

EXAMPLES
       theme
       theme matrix
       theme cyberpunk`
    };
    
    const page = manPages[topic.toLowerCase()];
    
    if (page) {
      await sys("\x1b[1m" + page + "\x1b[0m");
    } else {
      await err(`No manual entry for ${topic}`);
      await sys("Try 'man help' for available commands");
    }
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

  async function typewriter(text, speed = 30) {
    return new Promise(resolve => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          term.write(text[i]);
          i++;
        } else {
          clearInterval(interval);
          term.write('\r\n');
          resolve();
        }
      }, speed);
    });
  }

  async function sys(msg) {
    term.write(msg + "\r\n");
    scrollBottom();
    return sleep(10);
  }

  async function sysTyped(msg, speed = 30) {
    await typewriter(msg, speed);
    scrollBottom();
    return sleep(10);
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

  function err(text) {
    term.write(`\x1b[31m${text}\x1b[0m\r\n`);
    scrollBottom();
    return Promise.resolve();
  }

  function openExternal(url) {
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (w) { try { w.opener = null; } catch (_) {} }
  }

  function getCommandDescription(cmd) {
    const descriptions = {
      "ls": "list directory contents",
      "cd": "change the working directory",
      "pwd": "print name of current/working directory",
      "cat": "concatenate files and print on the standard output",
      "grep": "print lines that match patterns",
      "find": "search for files in a directory hierarchy",
      "echo": "display a line of text",
      "whoami": "print effective userid",
      "date": "print or set the system date and time",
      "history": "display or manipulate the history list",
      "ps": "report a snapshot of the current processes",
      "top": "display Linux processes",
      "df": "report file system disk space usage",
      "free": "display amount of free and used memory in the system",
      "uptime": "tell how long the system has been running",
      "ifconfig": "configure a network interface",
      "ping": "send ICMP ECHO_REQUEST to network hosts",
      "netstat": "print network connections, routing tables, interface statistics",
      "git": "the stupid content tracker",
      "docker": "a self-sufficient runtime for containers",
      "help": "display help information about portfolio terminal",
      "neofetch": "fast, highly customizable system info script",
      "clear": "clear the terminal screen"
    };
    
    return descriptions[cmd] || "command line utility";
  }

  function getCommandHelp(cmd) {
    const help = {
      "ls": "List information about files (the current directory by default).\nUse -a to show hidden files, -l for long format.",
      "cd": "Change the shell working directory.\nUse 'cd ..' to go up one level, 'cd ~' to go home, 'cd -' to go back.",
      "cat": "Concatenate FILE(s) to standard output.\nUse to view file contents in the terminal.",
      "grep": "Search for PATTERN in each FILE.\nExample: grep 'text' filename.txt",
      "find": "Search for files in a directory hierarchy.\nExample: find 'pattern' to search all files.",
      "ps": "Display information about active processes.\nUse 'ps aux' for detailed information.",
      "man": "Display manual pages for commands.\nExample: man ls",
      "git": "Version control system for tracking changes in source code.\nCommon commands: status, log, branch",
      "docker": "Container management platform.\nCommon commands: ps, images, logs",
      "help": "Show available commands and usage information.\nThis is your starting point for using the terminal."
    };
    
    return help[cmd] || `The ${cmd} command is available in this terminal.\nType '${cmd} --help' for usage information.`;
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
