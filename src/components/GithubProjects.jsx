import { useState, useEffect } from 'react';
import { ExternalLink, Star, GitFork, Search, Sparkles } from 'lucide-react';

const FALLBACK_PROJECTS = [
  {
    id: 1,
    name: "PortFolioMaker",
    description: "An advanced, fully responsive MERN and standard templates engine to create stunning developer portfolios in minutes.",
    language: "JavaScript",
    stargazers_count: 14,
    forks_count: 5,
    html_url: "https://github.com/ghoshswapnadip7-coder/PortFolioMaker"
  },
  {
    id: 2,
    name: "rock-paper-scissor-python",
    description: "A Python interactive game with rich terminal feedback, keeping track of scores and executing smart machine algorithms.",
    language: "Python",
    stargazers_count: 8,
    forks_count: 2,
    html_url: "https://github.com/ghoshswapnadip7-coder/rock-paper-scissor-python"
  },
  {
    id: 3,
    name: "MERN-Cloud-Sphere",
    description: "Advanced cloud file management system utilizing React, Node.js, Express, and MongoDB with secure JWT auth.",
    language: "JavaScript",
    stargazers_count: 12,
    forks_count: 4,
    html_url: "https://github.com/ghoshswapnadip7-coder"
  },
  {
    id: 4,
    name: "Smart-Django-Blog",
    description: "Fully-featured community portal built with Django, featuring rich text editing, profile configurations, and comment sections.",
    language: "Python",
    stargazers_count: 10,
    forks_count: 3,
    html_url: "https://github.com/ghoshswapnadip7-coder"
  },
  {
    id: 5,
    name: "Canvas-Particles-Sandbox",
    description: "High-performance 60 FPS interactive visual physics sandbox built using HTML5 Canvas and Vanilla JS.",
    language: "HTML",
    stargazers_count: 15,
    forks_count: 1,
    html_url: "https://github.com/ghoshswapnadip7-coder"
  },
  {
    id: 6,
    name: "Express-API-Shield",
    description: "Production-ready boilerplate for Node/Express API with built-in rate-limiting, security headers, and JWT middleware.",
    language: "JavaScript",
    stargazers_count: 9,
    forks_count: 2,
    html_url: "https://github.com/ghoshswapnadip7-coder"
  }
];

export default function GithubProjects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  useEffect(() => {
    fetch('https://api.github.com/users/ghoshswapnadip7-coder/repos')
      .then((res) => {
        if (!res.ok) throw new Error('API Rate Limit or Error');
        return res.json();
      })
      .then((data) => {
        // Sort by stars descending
        const sortedData = data
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 12);
        
        // If the user has empty repositories list, use fallbacks
        if (sortedData.length === 0) {
          setRepos(FALLBACK_PROJECTS);
        } else {
          setRepos(sortedData);
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
