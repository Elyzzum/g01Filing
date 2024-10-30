import React, { useState, useEffect } from 'react';
import { Sparkles, Coffee, Cpu, Lightbulb, Monitor, Wand } from 'lucide-react';
import DialogBox from './DialogBox';
import { soundEngine } from '../audio/SoundEngine';

interface BattleProps {
  playerStats: {
    health: number;
    creativity: number;
    stickers: number;
  };
  onBattleEnd: (won: boolean) => void;
}

const Battle: React.FC<BattleProps> = ({ playerStats, onBattleEnd }) => {
  const [enemyHealth, setEnemyHealth] = useState(200);
  const [currentDialog, setCurrentDialog] = useState("BUREAUCRAT.EXE wants to organize your fun away!");
  const [battlePhase, setBattlePhase] = useState<'player' | 'enemy'>('player');
  const [isDimensionShifted, setIsDimensionShifted] = useState(false);

  const moves = [
    { 
      name: 'RAINBOW BLAST', 
      icon: Sparkles, 
      color: 'text-yellow-400',
      power: isDimensionShifted ? 5 : 20,
      message: isDimensionShifted ? "Your tiny rainbow barely tickles!" : "You unleash a rainbow of creativity!",
      notes: [0, 4, 7, 12, 16]
    },
    { 
      name: 'DIMENSION SHIFT', 
      icon: Wand, 
      color: 'text-purple-400',
      power: 0,
      message: isDimensionShifted ? "You return to normal size!" : "You shrink to microscopic size!",
      notes: [24, 19, 15, 12, 7]
    },
    { 
      name: 'SILLY DANCE', 
      icon: Coffee, 
      color: 'text-pink-400',
      power: isDimensionShifted ? 3 : 15,
      message: isDimensionShifted ? "Your tiny dance is adorable but ineffective!" : "Your dance moves are too fun to handle!",
      notes: [0, 3, 7, 10, 14]
    },
    { 
      name: 'STICKER ATTACK', 
      icon: Lightbulb, 
      color: 'text-green-400',
      power: isDimensionShifted ? playerStats.stickers * 2 : playerStats.stickers * 10,
      message: "You throw sparkly stickers everywhere!",
      notes: [24, 19, 15, 12, 7]
    },
  ];

  const handlePlayerMove = (move: typeof moves[0]) => {
    if (battlePhase === 'enemy') return;

    soundEngine.playArpeggio(move.notes, 0.1);
    
    if (move.name === 'DIMENSION SHIFT') {
      setIsDimensionShifted(!isDimensionShifted);
    } else {
      setEnemyHealth(prev => Math.max(0, prev - move.power));
    }
    
    setCurrentDialog(move.message);
    setBattlePhase('enemy');

    setTimeout(() => {
      if (enemyHealth - move.power <= 0) {
        setCurrentDialog("You won! The power of creativity prevails! 🌈");
        setTimeout(() => onBattleEnd(true), 2000);
      } else {
        const damage = isDimensionShifted ? 5 : 20;
        setCurrentDialog(`BUREAUCRAT.EXE uses BORING PAPERWORK! ${isDimensionShifted ? "It barely hits you!" : ""}`);
        setBattlePhase('player');
      }
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        {/* Player Health Bar - Left Side */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent pointer-events-none" />
          <div className="border-2 border-cyan-400 p-2">
            <div 
              className="h-4 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300" 
              style={{ width: `${playerStats.health}%` }} 
            />
          </div>
        </div>

        {/* Enemy Health Bar - Right Side */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-l from-red-500/20 to-transparent pointer-events-none" />
          <div className="border-2 border-red-400 p-2">
            <div 
              className="h-4 relative overflow-hidden"
              style={{ width: `${(enemyHealth / 200) * 100}%` }}
            >
              <div className="absolute inset-0 bg-red-400 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 items-center">
        {/* Player Character */}
        <div className={`transition-all duration-500 transform ${isDimensionShifted ? 'scale-[0.3]' : 'scale-100'}`}>
          <User className={`w-32 h-32 mx-auto ${isDimensionShifted ? 'animate-bounce' : 'animate-pulse'}`} />
        </div>

        {/* Enemy Character */}
        <div className="relative">
          <Monitor className="w-32 h-32 mx-auto animate-pulse text-red-400" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xs font-bold glitch-text">BUREAUCRAT.EXE</div>
          </div>
          {/* Pixelated Bookworms */}
          <div className="absolute -right-8 top-0 bottom-0 w-16 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-red-400 absolute animate-wiggle"
                style={{
                  top: `${(i * 20) + Math.sin(Date.now() / 1000 + i) * 10}%`,
                  right: `${Math.sin(Date.now() / 500 + i) * 20}%`,
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 25%, 75% 25%, 75% 75%, 100% 75%, 100% 100%, 0% 100%)'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <DialogBox text={currentDialog} />

      <div className="grid grid-cols-2 gap-4">
        {moves.map((move) => (
          <button
            key={move.name}
            onClick={() => handlePlayerMove(move)}
            disabled={battlePhase === 'enemy'}
            className={`
              flex items-center justify-center space-x-2 p-4
              border-2 border-green-400 hover:bg-green-400/20
              transition-colors ${battlePhase === 'enemy' ? 'opacity-50' : ''}
              ${move.color} relative overflow-hidden group
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300" />
            <move.icon className="w-6 h-6" />
            <span>{move.name}</span>
            {move.power > 0 && (
              <span className="absolute top-1 right-1 text-xs">
                PWR: {move.power}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Battle;