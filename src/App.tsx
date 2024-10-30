import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import Battle from './components/Battle';
import World from './components/World';
import GameHUD from './components/GameHUD';
import { soundEngine } from './audio/SoundEngine';

function App() {
  const [gameState, setGameState] = useState<'intro' | 'explore' | 'battle'>('intro');
  const [playerStats, setPlayerStats] = useState({
    health: 100,
    creativity: 0,
    stickers: 0
  });

  useEffect(() => {
    if (gameState === 'explore') {
      soundEngine.startBackgroundMusic();
    }
  }, [gameState]);

  const handleCollectItem = (type: 'sticker' | 'coffee') => {
    soundEngine.playCollectSound();
    setPlayerStats(prev => ({
      ...prev,
      creativity: type === 'coffee' ? Math.min(prev.creativity + 10, 100) : prev.creativity,
      stickers: type === 'sticker' ? prev.stickers + 1 : prev.stickers
    }));
  };

  const startBattle = () => {
    soundEngine.playBattleStart();
    setGameState('battle');
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-400/5 to-transparent bg-repeat-y" 
           style={{ backgroundSize: '100% 2px' }} />
      
      <div className="container mx-auto px-4 py-8">
        {gameState === 'intro' && (
          <div className="text-center space-y-4 animate-pulse">
            <Terminal className="w-16 h-16 mx-auto" />
            <h1 className="text-4xl font-bold mb-8">SUPER CREATIVE ADVENTURE!</h1>
            <p className="text-xl mb-8">Help our hero bring color and fun to the boring office!</p>
            <button
              onClick={() => {
                setGameState('explore');
                soundEngine.startBackgroundMusic();
              }}
              className="px-6 py-3 bg-green-400 text-black hover:bg-green-300 transition-colors rounded-none"
            >
              START ADVENTURE!
            </button>
          </div>
        )}

        {gameState === 'explore' && (
          <>
            <GameHUD stats={playerStats} />
            <World onCollectItem={handleCollectItem} onStartBattle={startBattle} />
          </>
        )}

        {gameState === 'battle' && (
          <Battle 
            playerStats={playerStats}
            onBattleEnd={(won) => {
              setGameState('explore');
              setPlayerStats(prev => ({
                ...prev,
                health: won ? prev.health + 20 : prev.health - 20
              }));
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;