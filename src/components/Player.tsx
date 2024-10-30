import React from 'react';
import { User } from 'lucide-react';

interface PlayerProps {
  health: number;
  creativity: number;
}

const Player: React.FC<PlayerProps> = ({ health, creativity }) => {
  return (
    <div className="text-center space-y-4">
      <div className="relative inline-block">
        <User className="w-32 h-32" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold">CREATIVE.MIND</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="border border-green-400 p-2">
          <div className="h-2 bg-red-400" style={{ width: `${health}%` }} />
          <div className="text-xs mt-1">HEALTH: {health}%</div>
        </div>
        <div className="border border-green-400 p-2">
          <div className="h-2 bg-blue-400" style={{ width: `${creativity}%` }} />
          <div className="text-xs mt-1">CREATIVITY: {creativity}%</div>
        </div>
      </div>
    </div>
  );
}

export default Player;