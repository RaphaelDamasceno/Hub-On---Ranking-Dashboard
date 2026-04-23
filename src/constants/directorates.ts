export const DIRECTORATE_CONFIG: Record<string, { logo: string; color: string; hover: string; border: string; text: string }> = {
  'GEORGII': { 
    logo: 'https://i.postimg.cc/2y4bK7BG/GEORGII.png',
    color: 'bg-black',
    hover: 'hover:bg-slate-900',
    border: 'border-black',
    text: 'text-white'
  },
  'SANTOS': { 
    logo: 'https://i.postimg.cc/rsS0PNtn/SANTOS.png',
    color: 'bg-orange-500',
    hover: 'hover:bg-orange-600',
    border: 'border-orange-500',
    text: 'text-white'
  },
  'SEVERO': { 
    logo: 'https://i.postimg.cc/brQDB92B/SEVERO.png',
    color: 'bg-blue-900',
    hover: 'hover:bg-blue-950',
    border: 'border-blue-900',
    text: 'text-white'
  },
  'ALMEIDA': { 
    logo: 'https://i.postimg.cc/QCLKmyVw/ALMEIDA.png',
    color: 'bg-red-600',
    hover: 'hover:bg-red-700',
    border: 'border-red-600',
    text: 'text-white'
  },
  'DINIZ': { 
    logo: 'https://i.postimg.cc/fy4SCrk1/DINIZ.png',
    color: 'bg-[#F5F5DC]',
    hover: 'hover:bg-[#E5E5CC]',
    border: 'border-[#F5F5DC]',
    text: 'text-brand-dark'
  },
  'HENRIQUE': { 
    logo: 'https://i.postimg.cc/QCp9yJWb/HENRIQUE.png',
    color: 'bg-[#F5F5DC]',
    hover: 'hover:bg-[#E5E5CC]',
    border: 'border-[#F5F5DC]',
    text: 'text-brand-dark'
  },
  'LUNA': { 
    logo: 'https://i.postimg.cc/XqwGzkyQ/LUNA.png',
    color: 'bg-[#8B4513]',
    hover: 'hover:bg-[#7A3E11]',
    border: 'border-[#8B4513]',
    text: 'text-white'
  },
  'MONTEIRO': { 
    logo: 'https://i.postimg.cc/KjnkHDgp/MONTEIRO.png',
    color: 'bg-sky-400',
    hover: 'hover:bg-sky-500',
    border: 'border-sky-400',
    text: 'text-white'
  },
  'TALMON': { 
    logo: 'https://i.postimg.cc/j2zwF4JB/TALMON.png',
    color: 'bg-[#FA8072]',
    hover: 'hover:bg-[#EA7062]',
    border: 'border-[#FA8072]',
    text: 'text-white'
  },
  'STUPP': { 
    logo: 'https://i.postimg.cc/90WCcdkH/STUPP.png',
    color: 'bg-slate-900',
    hover: 'hover:bg-slate-800',
    border: 'border-slate-900',
    text: 'text-white'
  },
  'NASCIMENTO': { 
    logo: 'https://i.postimg.cc/6p0rCpQr/NASCIMENTO.png',
    color: 'bg-black',
    hover: 'hover:bg-slate-900',
    border: 'border-black',
    text: 'text-white'
  },
  'ALBUQUERQUE': { 
    logo: 'https://i.postimg.cc/4Nm90Qw8/ALBUQUERQUE.png',
    color: 'bg-brand-blue',
    hover: 'hover:bg-blue-600',
    border: 'border-brand-blue',
    text: 'text-white'
  },
  'MOURA': { 
    logo: 'https://i.postimg.cc/vHcVKtXp/MOURA.png',
    color: 'bg-brand-accent',
    hover: 'hover:bg-green-600',
    border: 'border-brand-accent',
    text: 'text-white'
  },
  'RIBEIRO': { 
    logo: 'https://i.postimg.cc/Nf5HnkbV/RIBEIRO.png',
    color: 'bg-slate-800',
    hover: 'hover:bg-slate-950',
    border: 'border-slate-800',
    text: 'text-white'
  }
};

export const getDirectorateConfig = (name: string) => {
  const normalized = name.toUpperCase().trim();
  // Try to find by partial match since the CSV might have extra spaces or text
  const key = Object.keys(DIRECTORATE_CONFIG).find(k => normalized.includes(k));
  return key ? DIRECTORATE_CONFIG[key] : {
    logo: 'https://i.postimg.cc/6p0rCpQr/NASCIMENTO.png', // Default
    color: 'bg-slate-500',
    hover: 'hover:bg-slate-600',
    border: 'border-slate-500',
    text: 'text-white'
  };
};
