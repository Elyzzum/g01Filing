import React from 'react';
import { Monitor } from 'lucide-react';

interface EnemyProps {
  health: number;
}

const Enemy: React.FC<EnemyProps> = ({ health }) => {
  return (
    <div className="text-center space-y-4">
      <div className="relative inline-block">
        <Monitor className="w-32 h-32 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold">BUREAUCRAT.EXE</span>
        </div>
      </div>
      <div className="border border-green-400 p-2">
        <div className="h-2 bg-green-400" style={{ width: `${health}%` }} />
      </div>
    </div>
  );
}

export default Enemy;