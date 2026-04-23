import Papa from 'papaparse';
import { parse, isToday, isYesterday, isValid } from 'date-fns';

export interface Appointment {
  Responsavel: string;
  DataAgendamento: Date;
  Status: string;
  Diretoria: string;
  Equipe: string;
}

export interface Statistics {
  total: number;
  todayCount: number;
  yesterdayCount: number;
  growth: number;
  ranking: { name: string; count: number; directorate: string; team: string }[];
  statusDistribution: { name: string; value: number }[];
  directorateRanking: { name: string; count: number }[];
}

// Using Google Visualization API for faster, near real-time updates
const SPREADSHEET_IDS = [
  '1kaawrMXJhVr0RWojxZa0eFEig8bRPWJ9v78GkGi0bjs', // Stupp
  '1YF2FjTpUs1qcGTKzkqWFpAV1wRAOiP0xQdeuHWhxSZQ'  // Nascimento
];
const GID = '0';

export async function fetchSheetData(): Promise<Statistics> {
  try {
    const cacheBuster = `&t=${new Date().getTime()}`;
    
    // Fetch from all sources in parallel
    const fetchPromises = SPREADSHEET_IDS.map(id => {
      const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&gid=${GID}${cacheBuster}`;
      return fetch(url).then(async res => {
        if (!res.ok) throw new Error(`Erro na rede para planilha ${id}: ${res.status}`);
        const text = await res.text();
        
        if (text.includes('<!doctype html>') || text.includes('Google Account') || text.includes('login')) {
          throw new Error('Uma das planilhas precisa de acesso público ("Qualquer pessoa com o link").');
        }
        
        return text;
      });
    });

    const csvTexts = await Promise.all(fetchPromises);
    
    // Parse all CSVs and merge the appointment data
    const allAppointments: Appointment[][] = await Promise.all(
      csvTexts.map(text => parseIndividualCsv(text))
    );

    // Flatten carefully
    const mergedAppointments = allAppointments.flat();
    
    return calculateStatistics(mergedAppointments);
  } catch (error) {
    console.error('Erro ao buscar dados das planilhas:', error);
    throw error;
  }
}

async function parseIndividualCsv(csvText: string): Promise<Appointment[]> {
  if (csvText.length < 50) return [];
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: true,
      delimitersToGuess: [',', ';', '\t'],
      complete: (results) => {
        const filteredRows = results.data.filter((row: any) => 
          Object.values(row).some(val => val !== null && val !== undefined && String(val).trim() !== '')
        );

        const data: Appointment[] = filteredRows.map((row: any) => {
          const findValue = (possibleKeys: string[]) => {
            const rowKeys = Object.keys(row);
            const key = rowKeys.find(k => {
              const cleanK = k.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              return possibleKeys.some(pk => {
                const cleanPK = pk.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return cleanK === cleanPK || cleanK.includes(cleanPK) || cleanPK.includes(cleanK);
              });
            });
            return key ? row[key] : null;
          };

          const name = findValue(['NOME DO CORRETOR', 'Responsavel', 'Corretor', 'Nome completo do corretor', 'Broker']) || 'Desconhecido';
          const dateStr = findValue(['Carimbo', 'Data', 'Data do Agendamento', 'Agendamento', 'Timestamp']) || '';
          const status = findValue(['Status', 'Situacao', 'Confirmacao', 'Etapa']) || 'Agendado';
          const diretoria = findValue(['DIRETORIA PARTNER', 'Diretoria', 'Regional', 'Lado', 'Qual sua diretoria']) || 'Outros';
          const equipe = findValue(['INFORME O NOME DO LIDER', 'Equipe', 'Time', 'Grupo', 'Loja', 'Qual sua equipe']) || 'Sem Equipe';

          let date: Date;
          if (dateStr && typeof dateStr === 'string') {
            date = parse(dateStr, 'yyyy/MM/dd HH:mm:ss', new Date());
            if (!isValid(date)) date = parse(dateStr, 'dd/MM/yyyy HH:mm:ss', new Date());
            if (!isValid(date)) date = parse(dateStr, 'dd/MM/yyyy', new Date());
            if (!isValid(date)) date = parse(dateStr, 'yyyy-MM-dd', new Date());
            if (!isValid(date)) date = new Date(dateStr);
          } else if (dateStr instanceof Date) {
            date = dateStr;
          } else {
            date = new Date();
          }

          return {
            Responsavel: String(name).trim(),
            DataAgendamento: isValid(date) ? date : new Date(),
            Status: String(status),
            Diretoria: String(diretoria).trim(),
            Equipe: String(equipe).trim()
          };
        });

        resolve(data);
      },
      error: reject
    });
  });
}

function calculateStatistics(data: Appointment[]): Statistics {
  const total = data.length;
  const todayCount = data.filter(a => isToday(a.DataAgendamento)).length;
  const yesterdayCount = data.filter(a => isYesterday(a.DataAgendamento)).length;

  const growth = yesterdayCount === 0 
    ? (todayCount > 0 ? 100 : 0) 
    : ((todayCount - yesterdayCount) / yesterdayCount) * 100;

  // Ranking with normalized names to avoid duplicates across sheets
  const brokerData: Record<string, { count: number; directorate: string; team: string }> = {};
  data.forEach(a => {
    const normalizedName = a.Responsavel.toUpperCase();
    if (!brokerData[normalizedName]) {
      brokerData[normalizedName] = { count: 0, directorate: a.Diretoria, team: a.Equipe };
    }
    brokerData[normalizedName].count += 1;
  });
  
  const ranking = Object.entries(brokerData)
    .map(([name, info]) => ({ name, count: info.count, directorate: info.directorate, team: info.team }))
    .sort((a, b) => b.count - a.count);

  // Directorate Ranking
  const dirCounts: Record<string, number> = {};
  data.forEach(a => {
    const normalizedDir = a.Diretoria.toUpperCase();
    dirCounts[normalizedDir] = (dirCounts[normalizedDir] || 0) + 1;
  });
  const directorateRanking = Object.entries(dirCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Status Distribution
  const statusCounts: Record<string, number> = {};
  data.forEach(a => {
    statusCounts[a.Status] = (statusCounts[a.Status] || 0) + 1;
  });
  const statusDistribution = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  return {
    total,
    todayCount,
    yesterdayCount,
    growth,
    ranking,
    statusDistribution,
    directorateRanking,
  };
}
