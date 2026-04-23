import { motion } from 'motion/react';
import { getDirectorateConfig } from '../constants/directorates';

interface RankingListProps {
  winners: { name: string; count: number; directorate: string; team: string }[];
}

export default function RankingList({ winners }: RankingListProps) {
  // Take 4th to 6th (Total Top 6)
  const listItems = winners.slice(3, 6);

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] p-6 border border-white/50 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="grid grid-cols-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4 shrink-0">
        <div className="col-span-1">Pos</div>
        <div className="col-span-2">Corretor</div>
        <div className="col-span-1 text-center">Agend.</div>
        <div className="col-span-1 text-right">Var</div>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide pr-1">
        {listItems.map((item, idx) => {
          const rank = idx + 4;
          const config = getDirectorateConfig(item.directorate);
          
          return (
            <motion.div
              key={item.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="grid grid-cols-5 items-center bg-white p-3 rounded-2xl border border-slate-50 hover:border-brand-accent/20 hover:shadow-md transition-all group"
            >
              <div className="col-span-1 flex items-center gap-3">
                 <span className="w-8 h-8 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400 group-hover:text-brand-accent group-hover:bg-brand-accent/5 transition-all">
                    {rank}º
                 </span>
                 <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-300 uppercase">
                      {item.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                 </div>
              </div>
              
              <div className="col-span-2 flex flex-col min-w-0">
                <p className="font-black text-brand-dark uppercase tracking-tight text-sm truncate leading-tight group-hover:text-brand-accent transition-colors">
                  {item.name.split(' ').slice(0, 2).join(' ')}
                </p>
                <div className="flex items-center gap-1.5">
                   {config.logo && (
                     <img src={config.logo} className="w-3 h-3 object-contain" referrerPolicy="no-referrer" />
                   )}
                   <span className="text-[8px] font-bold text-slate-300 uppercase truncate">{item.team}</span>
                </div>
              </div>

              <div className="col-span-1 text-center">
                 <p className="font-black text-brand-dark text-lg italic tracking-tighter">{item.count}</p>
              </div>

              <div className="col-span-1 text-right">
                 <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block">
                    +5%
                 </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
