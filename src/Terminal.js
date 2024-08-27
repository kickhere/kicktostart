import React, { useState, useEffect, useRef } from 'react';

function Terminal() {
  const [lines, setLines] = useState(['']);
  const [currentInput, setCurrentInput] = useState('');
  const [showMatrix, setShowMatrix] = useState(false);
  const terminalRef = useRef(null);
  const canvasRef = useRef(null);

  const commands = {
    ls: 'List directory contents',
    cat: 'Display the contents of a file',
    help: 'Show this help message',
    clear: 'Clear the terminal screen',
    fortune: 'Display a random fortune',
    cmatrix: 'Display matrix rain effect (escape to exit)',
  };

  const files = ['README'];
  const readmeContent = `KickToStart. Real-time embedded and firmware consulting.\nandrew@kicktostart.com`;

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
        newLines = [''];
        setShowMatrix(false); // Stop matrix effect on clear
      } else if (currentInput.trim() === 'fortune') {
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        newLines.push(`$ ${currentInput}`);
        newLines.push(randomFortune);
      } else if (currentInput.trim() === 'cmatrix') {
        setShowMatrix(true); // Start matrix effect
        newLines.push(`$ ${currentInput}`);
        //return;
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

  // Matrix effect implementation
  useEffect(() => {
    if (showMatrix) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width = window.innerWidth;
      const height = canvas.height = window.innerHeight;
      const columns = Math.floor(width / 20);
      const drops = Array(columns).fill(1);

      const drawMatrix = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#0f0';
        ctx.font = '20px monospace';

        for (let i = 0; i < drops.length; i++) {
          const text = String.fromCharCode(Math.random() * 128);
          ctx.fillText(text, i * 20, drops[i] * 20);

          if (drops[i] * 20 > height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
      };

      const interval = setInterval(drawMatrix, 50);

      return () => clearInterval(interval);
    }
  }, [showMatrix]);

  // Event listener for the Escape key to stop the matrix effect
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowMatrix(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

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
      {showMatrix && <canvas ref={canvasRef} style={styles.canvas}></canvas>}
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
    position: 'relative',
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
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
};

export default Terminal;
