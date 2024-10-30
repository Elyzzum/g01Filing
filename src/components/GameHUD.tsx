import React from 'react';
import { Heart, Sparkles, Star } from 'lucide-react';

interface GameHUDProps {
  stats: {
    health: number;
    creativity: number;
    stickers: number;
  };
}

const GameHUD: React.FC<GameHUDProps> = ({ stats }) => {
  return (
    <div className="flex justify-between items-center mb-4 p-4 border-2 border-green-400">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Heart className="w-6 h-6 text-red-400 mr-2" />
          <span>{stats.health}</span>
        </div>
        <div className="flex items-center">
          <Sparkles className="w-6 h-6 text-yellow-400 mr-2" />
          <span>{stats.creativity}</span>
        </div>
        <div className="flex items-center">
          <Star className="w-6 h-6 text-pink-400 mr-2" />
          <span>{stats.stickers}</span>
        </div>
      </div>
      <div className="text-sm">
        Use arrow keys to move! Collect ✨ and avoid 📄!
      </div>
    </div>
  );
};

export default GameHUD;