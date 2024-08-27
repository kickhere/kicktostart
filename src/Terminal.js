import React, { useState, useEffect, useRef } from 'react';

function Terminal() {
  const [lines, setLines] = useState(['']);
  const [currentInput, setCurrentInput] = useState('');
  const terminalRef = useRef(null);

  // List of available commands
  const commands = {
    ls: 'List directory contents',
    cat: 'Display the contents of a file',
    help: 'Show this help message',
    clear: 'Clear the terminal screen',
    fortune: 'Display a random fortune',
  };

  const files = ['README'];

  // Example content for the README file
  const readmeContent = `KickToStart. Real-time embedded and firmware consulting.\nandrew@kicktostart.com`;

  // List of fortunes
  const fortunes = [
    "You will have a great day!",
    "Good things come to those who wait.",
    "Fortune favors the bold.",
    "Patience is a virtue.",
    "The early bird gets the worm.",
    "Your hard work will soon pay off.",
  ];

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      let newLines = [...lines];

      if (currentInput.trim() === 'ls') {
        newLines.push(`$ ${currentInput}`);
        newLines.push(files.join('  '));
      } else if (currentInput.trim() === 'cat README') {
        newLines.push(`$ ${currentInput}`);
        newLines.push(readmeContent);
      } else if (currentInput.trim() === 'help') {
        const helpMessage = Object.entries(commands)
          .map(([cmd, description]) => `${cmd}: ${description}`)
          .join('\n');
        newLines.push(`$ ${currentInput}`);
        newLines.push(helpMessage);
      } else if (currentInput.trim() === 'clear') {
        newLines = ['']; // Clear the terminal screen by resetting lines to a single empty string
      } else if (currentInput.trim() === 'fortune') {
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        newLines.push(`$ ${currentInput}`);
        newLines.push(randomFortune);
      } else if (currentInput.trim() === '') {
        newLines.push('$');
      } else {
        newLines.push(`$ ${currentInput}`);
        newLines.push(`bash: ${currentInput}: command not found`);
      }

      setLines(newLines);
      setCurrentInput('');
    }
  };

  // Scroll to the bottom of the terminal whenever the lines change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div style={styles.terminal} ref={terminalRef}>
      {lines.map((line, index) => (
        <div key={index} style={styles.line}>
          {line}
        </div>
      ))}
      <div style={styles.inputLine}>
        <span style={styles.prompt}>$</span>
        <input
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.input}
          autoFocus
        />
      </div>
    </div>
  );
}

const styles = {
  terminal: {
    backgroundColor: '#000',
    color: '#0f0',
    padding: '10px',
    fontFamily: 'monospace',
    fontSize: '16px',
    height: '100vh',
    width: '100vw',
    overflowY: 'auto',
    border: 'none',
    boxSizing: 'border-box',
  },
  line: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    margin: 0,
    padding: 0,
    textAlign: 'left',
    display: 'block',
  },
  inputLine: {
    display: 'flex',
    alignItems: 'center',
  },
  prompt: {
    marginRight: '5px',
  },
  input: {
    backgroundColor: 'transparent',
    color: '#0f0',
    border: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    width: '100%',
  },
};

export default Terminal;
