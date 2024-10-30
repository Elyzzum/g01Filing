import React, { useState, useEffect } from 'react';
import { Coffee, Star, FileText, User, Sparkle } from 'lucide-react';
import { soundEngine } from '../audio/SoundEngine';

interface WorldProps {
  onCollectItem: (type: 'sticker' | 'coffee') => void;
  onStartBattle: () => void;
}

interface Position {
  x: number;
  y: number;
}

interface Projectile extends Position {
  direction: 'up' | 'down' | 'left' | 'right';
}

const GRID_SIZE = 12;
const CELL_SIZE = 48;
const PROJECTILE_SPEED = 200; // ms per cell

const World: React.FC<WorldProps> = ({ onCollectItem, onStartBattle }) => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });
  const [items, setItems] = useState<Array<Position & { type: 'coffee' | 'sticker' }>>([]);
  const [enemies, setEnemies] = useState<Position[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [lastDirection, setLastDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');

  useEffect(() => {
    // Generate random items and enemies
    const newItems = [];
    const newEnemies = [];
    
    for (let i = 0; i < 5; i++) {
      newItems.push({
        x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
        y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
        type: Math.random() > 0.5 ? 'coffee' : 'sticker'
      });
      
      newEnemies.push({
        x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
        y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1
      });
    }
    
    setItems(newItems);
    setEnemies(newEnemies);
  }, []);

  // Handle projectile movement
  useEffect(() => {
    const moveProjectiles = setInterval(() => {
      setProjectiles(prev => {
        const updated = prev.map(p => {
          const newPos = { ...p };
          switch (p.direction) {
            case 'up': newPos.y--; break;
            case 'down': newPos.y++; break;
            case 'left': newPos.x--; break;
            case 'right': newPos.x++; break;
          }
          return newPos;
        }).filter(p => 
          p.x >= 0 && p.x < GRID_SIZE && 
          p.y >= 0 && p.y < GRID_SIZE
        );

        // Check for enemy hits
        const remainingEnemies = enemies.filter(enemy => {
          const hit = updated.some(p => p.x === enemy.x && p.y === enemy.y);
          if (hit) {
            soundEngine.playEnemyHit();
          }
          return !hit;
        });

        if (remainingEnemies.length !== enemies.length) {
          setEnemies(remainingEnemies);
        }

        return updated;
      });
    }, PROJECTILE_SPEED);

    return () => clearInterval(moveProjectiles);
  }, [enemies]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newPos = { ...playerPos };
      let newDirection = lastDirection;
      
      switch (e.key) {
        case 'ArrowUp':
          newPos.y = Math.max(0, newPos.y - 1);
          newDirection = 'up';
          break;
        case 'ArrowDown':
          newPos.y = Math.min(GRID_SIZE - 1, newPos.y + 1);
          newDirection = 'down';
          break;
        case 'ArrowLeft':
          newPos.x = Math.max(0, newPos.x - 1);
          newDirection = 'left';
          break;
        case 'ArrowRight':
          newPos.x = Math.min(GRID_SIZE - 1, newPos.x + 1);
          newDirection = 'right';
          break;
        case ' ': // Spacebar to shoot
          e.preventDefault();
          soundEngine.playShoot();
          setProjectiles(prev => [...prev, {
            x: playerPos.x,
            y: playerPos.y,
            direction: lastDirection
          }]);
          return;
      }

      setLastDirection(newDirection);
      setPlayerPos(newPos);

      // Check for item collection
      const itemIndex = items.findIndex(item => item.x === newPos.x && item.y === newPos.y);
      if (itemIndex !== -1) {
        onCollectItem(items[itemIndex].type);
        setItems(items.filter((_, index) => index !== itemIndex));
      }

      // Check for enemy encounters
      if (enemies.some(enemy => enemy.x === newPos.x && enemy.y === newPos.y)) {
        onStartBattle();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPos, items, enemies, lastDirection]);

  return (
    <div 
      className="relative border-2 border-green-400 mx-auto overflow-hidden"
      style={{ 
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE
      }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <div key={i} className="border border-green-400/20" />
        ))}
      </div>

      {/* Items */}
      {items.map((item, index) => (
        <div
          key={`item-${index}`}
          className="absolute transition-all duration-200"
          style={{
            left: item.x * CELL_SIZE,
            top: item.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        >
          {item.type === 'coffee' ? (
            <Coffee className="w-full h-full p-2 text-yellow-400 animate-bounce" />
          ) : (
            <Star className="w-full h-full p-2 text-pink-400 animate-pulse" />
          )}
        </div>
      ))}

      {/* Enemies */}
      {enemies.map((enemy, index) => (
        <div
          key={`enemy-${index}`}
          className="absolute transition-all duration-200"
          style={{
            left: enemy.x * CELL_SIZE,
            top: enemy.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        >
          <FileText className="w-full h-full p-2 text-red-400" />
        </div>
      ))}

      {/* Projectiles */}
      {projectiles.map((projectile, index) => (
        <div
          key={`projectile-${index}`}
          className="absolute transition-all duration-200"
          style={{
            left: projectile.x * CELL_SIZE,
            top: projectile.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        >
          <Sparkle className="w-full h-full p-3 text-green-400 animate-pulse" />
        </div>
      ))}

      {/* Player */}
      <div
        className={`absolute transition-all duration-200 transform ${
          lastDirection === 'left' ? '-scale-x-100' : ''
        }`}
        style={{
          left: playerPos.x * CELL_SIZE,
          top: playerPos.y * CELL_SIZE,
          width: CELL_SIZE,
          height: CELL_SIZE,
        }}
      >
        <User className="w-full h-full p-2 text-green-400" />
      </div>

      {/* Instructions */}
      <div className="absolute top-2 right-2 text-xs text-green-400/80">
        SPACE to shoot!
      </div>
    </div>
  );
};

export default World;