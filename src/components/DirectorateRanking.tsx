import { motion } from 'motion/react';
import { Swords, Flame, Target } from 'lucide-react';
import { getDirectorateConfig } from '../constants/directorates';

interface DirectorateRankingProps {
  ranking: { name: string; count: number }[];
}

export default function DirectorateRanking({ ranking }: DirectorateRankingProps) {
  // Identify "Brigas" (Only show if 1st and 2nd are close or tied)
  const brigas = [];
  
  if (ranking.length >= 2) {
    const first = ranking[0];
    const second = ranking[1];
    
    if (first.count === second.count) {
      brigas.push({
        type: 'tie',
        message: `BRIGA PELO TOPO! EMPATE: ${first.name} vs ${second.name}`,
        icon: <Swords className="text-red-500" size={16} />
      });
    } else if (first.count - second.count <= 2) { // 1 or 2 difference is "close" for top tier
      brigas.push({
        type: 'close',
        message: `${second.name} PODE TOMAR O TRONO DE ${first.name}!`,
        icon: <Flame className="text-orange-600" size={16} />
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between mb-2">
         <h3 className="font-black text-sm tracking-tight italic uppercase text-brand-dark flex items-center gap-2">
           <Target size={16} className="text-brand-blue" />
           Batalha de Diretorias
         </h3>
      </div>

      {/* Briga Alerts */}
      <div className="space-y-1 mb-2 h-10">
        {brigas.length > 0 && (
          brigas.slice(0, 1).map((briga, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-brand-dark/5 border border-brand-accent/20 p-2 rounded-xl flex items-center gap-2 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent" />
              {briga.icon}
              <p className="text-[9px] font-black uppercase tracking-tight text-brand-dark leading-none italic truncate">
                {briga.message}
              </p>
            </motion.div>
          ))
        )}
      </div>

      {/* Directorate List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pr-1">
        <div className="space-y-1">
          {ranking.map((dir, idx) => {
            const config = getDirectorateConfig(dir.name);
            const isTop3 = idx < 3;
            
            return (
              <motion.div
                key={dir.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-2 p-2 hover:bg-white/40 rounded-xl transition-all"
              >
                {/* Rank Badge */}
                <div className={`w-6 h-6 shrink-0 flex items-center justify-center rounded-lg font-black text-[10px] ${idx === 0 ? 'bg-brand-accent text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {idx + 1}
                </div>
  
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-center mb-1">
                     {/* Logo as Title */}
                     <div className="h-5 w-20">
                       {config.logo && (
                         <img 
                            src={config.logo} 
                            alt={dir.name} 
                            className="h-full w-full object-contain object-left" 
                            referrerPolicy="no-referrer" 
                         />
                       )}
                     </div>
                     <p className="text-xs font-black text-brand-dark tabular-nums tracking-tighter">{dir.count}</p>
                   </div>
                   <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${(dir.count / (ranking[0]?.count || 1)) * 100}%` }}
                       className="h-full rounded-full hubon-gradient shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                     />
                   </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
