import React, { useState, useEffect } from 'react';

interface DialogBoxProps {
  text: string;
}

const DialogBox: React.FC<DialogBoxProps> = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [text, charIndex]);

  return (
    <div className="border border-green-400 p-4 min-h-[100px] relative">
      <div className="typewriter-text">{displayText}</div>
      {charIndex < text.length && (
        <div className="absolute bottom-2 right-2 animate-pulse">▼</div>
      )}
    </div>
  );
}

export default DialogBox;