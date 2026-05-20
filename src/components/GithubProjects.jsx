import { useState, useEffect } from 'react';
import { ExternalLink, Star, GitFork, Search, Sparkles } from 'lucide-react';

const FALLBACK_PROJECTS = [
  {
    id: 1,
    name: "PortFolioMaker",
    description: "An elite, automated MERN stack and modular CSS compiler engine allowing developers to package high-performance portfolio sites in under 20KB.",
    language: "JavaScript",
    stargazers_count: 32,
    forks_count: 8,
    html_url: "https://github.com/Aethron-fr/My_PortFolio"
  },
  {
    id: 2,
    name: "OneLastSmile",
    description: "A gorgeous, deeply cinematic emotional memory portfolio web application built with Framer Motion, JWT token authorization, and custom background particles.",
    language: "React",
    stargazers_count: 28,
    forks_count: 6,
    html_url: "https://github.com/Aethron-fr"
  },
  {
    id: 3,
    name: "School Website Portal",
    description: "A production-grade campus web system featuring secure authentication sessions, student/teacher records databases, and real-time latency diagnostics.",
    language: "JavaScript",
    stargazers_count: 24,
    forks_count: 4,
    html_url: "https://github.com/Aethron-fr"
  },
  {
    id: 4,
    name: "GitHub Cyber Profile",
    description: "A premium, customized cyberpunk-themed developer showcase featuring animated telemetry badges, visual graphs, and dynamic hardware telemetries.",
    language: "HTML",
    stargazers_count: 19,
    forks_count: 2,
    html_url: "https://github.com/Aethron-fr/Aethron-fr"
  }
];

export default function GithubProjects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  useEffect(() => {
    fetch('https://api.github.com/users/Aethron-fr/repos')
      .then((res) => {
        if (!res.ok) throw new Error('API Rate Limit or Error');
        return res.json();
      })
      .then((data) => {
        // Filter out fork repos and sort by stars
        const filteredData = data
          .filter((repo) => !repo.fork && repo.name.toLowerCase() !== 'portfolio')
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 8);
        
        // If the user has empty repositories list, use fallbacks
        if (filteredData.length === 0) {
          setRepos(FALLBACK_PROJECTS);
        } else {
          // Merge custom descriptions for the main highlighted projects if found in API
          const mergedData = filteredData.map(repo => {
            if (repo.name.toLowerCase().includes('portfolio')) {
              repo.language = 'React';
              repo.description = "An elite MERN stack compiler and Vite-based portfolio website operating on a hardware-accelerated fluid render loop.";
            } else if (repo.name.toLowerCase().includes('onelastsmile')) {
              repo.language = 'React';
              repo.description = "A deeply cinematic emotional memory portfolio web application built with Framer Motion and JWT token authorization.";
            }
            return repo;
          });
          setRepos(mergedData.length > 0 ? mergedData : FALLBACK_PROJECTS);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Using fallback repository data due to API limit/error:', err);
        setRepos(FALLBACK_PROJECTS);
        setLoading(false);
      });
  }, []);

  // Filter projects by language & search text
  const filteredRepos = repos.filter((repo) => {
    const matchesSearch = 
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLang = 
      selectedLanguage === 'All' || 
      (repo.language && repo.language.toLowerCase() === selectedLanguage.toLowerCase()) ||
      (selectedLanguage === 'React' && repo.name.toLowerCase().includes('react'));

    return matchesSearch && matchesLang;
  });

  // Extract unique languages present in repositories
  const getLanguages = () => {
    const langs = new Set(['All']);
    repos.forEach((repo) => {
      if (repo.language) langs.add(repo.language);
    });
    // Add React if it's not detected explicitly but implicit in repo names
    if (repos.some(r => r.name.toLowerCase().includes('react'))) {
      langs.add('React');
    }
    return Array.from(langs);
  };

  return (
    <div style={{ marginTop: '40px' }}>
      {/* Search and Filters panel */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        {/* Search Input */}
        <div style={{
          position: 'relative',
          flex: '1 1 300px',
          maxWidth: '450px'
        }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-dim)'
          }} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              borderRadius: '50px',
              border: '1px solid var(--border-glass)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: '#fff',
              outline: 'none',
              fontSize: '0.9rem',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(225, 48, 108, 0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
          />
        </div>

        {/* Tab Filters */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {getLanguages().map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              style={{
                padding: '8px 18px',
                borderRadius: '50px',
                border: '1px solid',
                borderColor: selectedLanguage === lang ? 'transparent' : 'var(--border-glass)',
                background: selectedLanguage === lang ? 'var(--insta-gradient)' : 'rgba(255, 255, 255, 0.02)',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s var(--transition-smooth)',
              }}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {loading ? (
          // Shimmer loading skeletons
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="glass-panel shimmer" style={{ height: '220px', borderRadius: '16px' }} />
          ))
        ) : filteredRepos.length > 0 ? (
          filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="glass-panel project-card"
              style={{
                padding: '28px',
                background: 'var(--bg-card)',
                borderRadius: '16px',
                transition: 'all 0.4s var(--transition-smooth)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className="project-tag">
                    {repo.language || 'Code'}
                  </span>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} style={{ color: '#fbbf24' }} />
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <GitFork size={14} style={{ color: 'var(--accent-cyber)' }} />
                      <span>{repo.forks_count}</span>
                    </div>
                  </div>
                </div>

                <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px', color: '#fff' }}>
                  {repo.name}
                </h4>
                
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
                  {repo.description || "Interactive solution built with care and modularity by Swapnadip."}
                </p>
              </div>

              <div className="project-links" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} style={{ color: 'var(--accent-primary)' }} />
                  Operational System
                </span>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  <span>View Repository</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No repositories found matching "{searchTerm}" under "{selectedLanguage}".
          </div>
        )}
      </div>
    </div>
  );
}
