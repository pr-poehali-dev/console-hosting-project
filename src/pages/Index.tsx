import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CommandHistory {
  command: string;
  output: string[];
  timestamp: string;
}

interface SystemStats {
  cpu: number;
  ram: number;
  disk: number;
  network: number;
}

const Index = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [currentSection, setCurrentSection] = useState('home');
  const [stats, setStats] = useState<SystemStats>({ cpu: 45, ram: 62, disk: 78, network: 23 });
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sections = [
    { id: 'files', name: 'Файлы', icon: 'FolderTree', color: 'text-[#00ff00]' },
    { id: 'settings', name: 'Настройки', icon: 'Settings', color: 'text-[#00ffff]' },
    { id: 'stats', name: 'Статистика', icon: 'BarChart3', color: 'text-[#a855f7]' },
    { id: 'domains', name: 'Домены', icon: 'Globe', color: 'text-[#00ff00]' },
    { id: 'databases', name: 'БД', icon: 'Database', color: 'text-[#00ffff]' },
    { id: 'servers', name: 'Сервера', icon: 'Server', color: 'text-[#a855f7]' },
    { id: 'logs', name: 'Логи', icon: 'FileText', color: 'text-[#00ff00]' },
    { id: 'api', name: 'API', icon: 'Code2', color: 'text-[#00ffff]' },
  ];

  useEffect(() => {
    setHistory([
      {
        command: 'system',
        output: [
          '╔═══════════════════════════════════════════════════╗',
          '║   HOSTING CONTROL TERMINAL v2.0.1               ║',
          '║   System online • All services operational       ║',
          '╚═══════════════════════════════════════════════════╝',
          '',
          'Type "help" for available commands',
          'Type "section <name>" to navigate sections',
        ],
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 40 + 30),
        ram: Math.floor(Math.random() * 30 + 50),
        disk: Math.floor(Math.random() * 20 + 70),
        network: Math.floor(Math.random() * 50 + 10),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output: string[] = [];

    if (trimmedCmd === 'help') {
      output = [
        'Available commands:',
        '  help           - Show this help message',
        '  clear          - Clear terminal',
        '  status         - Show system status',
        '  section <name> - Navigate to section (files, settings, stats, etc)',
        '  ls             - List current resources',
        '  uptime         - Show system uptime',
        '  whoami         - Show current user',
        '  exit           - Close terminal (unavailable)',
      ];
    } else if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    } else if (trimmedCmd === 'status') {
      output = [
        `CPU Usage:     ${stats.cpu}% ${'█'.repeat(Math.floor(stats.cpu / 5))}`,
        `RAM Usage:     ${stats.ram}% ${'█'.repeat(Math.floor(stats.ram / 5))}`,
        `Disk Usage:    ${stats.disk}% ${'█'.repeat(Math.floor(stats.disk / 5))}`,
        `Network Load:  ${stats.network}% ${'█'.repeat(Math.floor(stats.network / 5))}`,
        '',
        'Status: ✓ All systems operational',
      ];
    } else if (trimmedCmd.startsWith('section ')) {
      const sectionName = trimmedCmd.split(' ')[1];
      const section = sections.find(s => s.id === sectionName);
      if (section) {
        setCurrentSection(sectionName);
        output = [`Navigated to section: ${section.name}`];
      } else {
        output = [`Error: Section '${sectionName}' not found`];
      }
    } else if (trimmedCmd === 'ls') {
      output = [
        'Current section resources:',
        '  ./var/www/html',
        '  ./etc/nginx/sites-enabled',
        '  ./home/user/backups',
        '  ./opt/applications',
      ];
    } else if (trimmedCmd === 'uptime') {
      output = ['System uptime: 47 days, 12:34:56'];
    } else if (trimmedCmd === 'whoami') {
      output = ['root@hosting-control'];
    } else if (trimmedCmd === '') {
      return;
    } else {
      output = [`Command not found: ${cmd}`, 'Type "help" for available commands'];
    }

    setHistory(prev => [
      ...prev,
      {
        command: cmd,
        output,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput('');
    }
  };

  const handleSectionClick = (sectionId: string) => {
    setCurrentSection(sectionId);
    executeCommand(`section ${sectionId}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ff00] p-4 relative overflow-hidden">
      <div className="scanline" />
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDI1NSwgMCwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Terminal" className="text-[#00ff00] text-glow" size={32} />
            <h1 className="text-3xl font-bold text-glow">HOSTING CONTROL TERMINAL</h1>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`flex items-center gap-2 px-4 py-2 border ${section.color} hover:bg-opacity-10 hover:bg-white transition-all ${
                  currentSection === section.id ? 'border-glow bg-opacity-20 bg-white' : 'border-opacity-50'
                }`}
              >
                <Icon name={section.icon} size={16} />
                <span className="text-sm font-semibold">{section.name}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Card className="bg-[#0f0f0f] border-[#00ff00] border-opacity-30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#00ff00] text-sm font-semibold">CPU</span>
                <Badge variant="outline" className="text-[#00ff00] border-[#00ff00]">{stats.cpu}%</Badge>
              </div>
              <Progress value={stats.cpu} className="h-2" />
            </Card>
            
            <Card className="bg-[#0f0f0f] border-[#00ffff] border-opacity-30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#00ffff] text-sm font-semibold">RAM</span>
                <Badge variant="outline" className="text-[#00ffff] border-[#00ffff]">{stats.ram}%</Badge>
              </div>
              <Progress value={stats.ram} className="h-2 [&>div]:bg-[#00ffff]" />
            </Card>
            
            <Card className="bg-[#0f0f0f] border-[#a855f7] border-opacity-30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#a855f7] text-sm font-semibold">DISK</span>
                <Badge variant="outline" className="text-[#a855f7] border-[#a855f7]">{stats.disk}%</Badge>
              </div>
              <Progress value={stats.disk} className="h-2 [&>div]:bg-[#a855f7]" />
            </Card>
            
            <Card className="bg-[#0f0f0f] border-[#00ff00] border-opacity-30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#00ff00] text-sm font-semibold">NET</span>
                <Badge variant="outline" className="text-[#00ff00] border-[#00ff00]">{stats.network}%</Badge>
              </div>
              <Progress value={stats.network} className="h-2" />
            </Card>
          </div>
        </div>

        <Card className="bg-[#0f0f0f] border-[#00ff00] border-opacity-50 border-glow min-h-[500px] flex flex-col">
          <div
            ref={terminalRef}
            className="flex-1 p-6 overflow-y-auto font-mono text-sm space-y-4"
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((entry, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#00ffff] text-glow-sm">root@hosting</span>
                  <span className="text-[#a855f7]">~</span>
                  <span className="text-white">$</span>
                  <span className="text-[#00ff00]">{entry.command}</span>
                  <span className="text-[#666] text-xs ml-auto">{entry.timestamp}</span>
                </div>
                {entry.output.map((line, lineIdx) => (
                  <div key={lineIdx} className="text-[#00ff00] opacity-80 pl-4">
                    {line}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-[#00ff00] border-opacity-30 p-4">
            <div className="flex items-center gap-2">
              <span className="text-[#00ffff] text-glow-sm font-semibold">root@hosting</span>
              <span className="text-[#a855f7]">~</span>
              <span className="text-white">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[#00ff00] font-mono caret-[#00ff00]"
                placeholder="Type a command..."
                autoFocus
              />
              <span className="animate-blink text-[#00ff00]">█</span>
            </div>
          </form>
        </Card>

        <div className="mt-4 text-center text-[#00ff00] text-xs opacity-50">
          <p>System Status: ONLINE • Latency: 12ms • Uptime: 99.98% • Press TAB for autocomplete</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
