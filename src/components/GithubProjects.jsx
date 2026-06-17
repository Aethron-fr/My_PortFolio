import { useState, useEffect } from 'react';
import { ExternalLink, Star, GitFork, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import SpotlightCard from './SpotlightCard';

// BUG-021: Fallback data uses 0 for stats — avoids showing fake/inflated numbers
const FALLBACK_PROJECTS = [
  {
    id: 1,
    name: "PortFolioMaker",
    description: "An elite, automated MERN stack and modular CSS compiler engine allowing developers to package high-performance portfolio sites in under 20KB.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/Aethron-fr/My_PortFolio",
    isFallback: true,
  },
  {
    id: 2,
    name: "OneLastSmile",
    description: "A gorgeous, deeply cinematic emotional memory portfolio web application built with Framer Motion, JWT token authorization, and custom background particles.",
    language: "React",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/Aethron-fr",
    isFallback: true,
  },
  {
    id: 3,
    name: "School Website Portal",
    description: "A production-grade campus web system featuring secure authentication sessions, student/teacher records databases, and real-time latency diagnostics.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/Aethron-fr",
    isFallback: true,
  },
  {
    id: 4,
    name: "GitHub Cyber Profile",
    description: "A premium, customized cyberpunk-themed developer showcase featuring animated telemetry badges, visual graphs, and dynamic hardware telemetries.",
    language: "HTML",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/Aethron-fr/Aethron-fr",
    isFallback: true,
  }
];

export default function GithubProjects() {
  const [repos, setRepos] = useState(() => {
    const cachedRepos = sessionStorage.getItem('github_repos');
    return cachedRepos ? JSON.parse(cachedRepos) : [];
  });
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('github_repos'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (!loading) return;

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
          setIsOffline(true);
        } else {
          // BUG-022: Use spread to avoid mutating the original API response object
          const mergedData = filteredData.map(repo => {
            if (repo.name.toLowerCase().includes('portfolio')) {
              return { ...repo, language: 'React', description: "An elite MERN stack compiler and Vite-based portfolio website operating on a hardware-accelerated fluid render loop." };
            }
            if (repo.name.toLowerCase().includes('onelastsmile')) {
              return { ...repo, language: 'React', description: "A deeply cinematic emotional memory portfolio web application built with Framer Motion and JWT token authorization." };
            }
            return repo;
          });
          const finalRepos = mergedData.length > 0 ? mergedData : FALLBACK_PROJECTS;
          setRepos(finalRepos);
          if (mergedData.length > 0) {
            sessionStorage.setItem('github_repos', JSON.stringify(finalRepos));
          }
          if (mergedData.length === 0) setIsOffline(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Using fallback repository data due to API limit/error:', err);
        setRepos(FALLBACK_PROJECTS);
        setIsOffline(true);
        setLoading(false);
      });
  }, [loading]);

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
      {/* BUG-021: Offline mode indicator */}
      {isOffline && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 20, marginBottom: 20,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
          color: 'var(--text-dim)', letterSpacing: '2px',
        }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,200,50,0.6)' }} />
          offline mode — cached data
        </div>
      )}

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
            aria-label="Search repositories"
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              borderRadius: '50px',
              border: '1px solid var(--border-glass)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: 'var(--text-primary)',
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
            <motion.button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              aria-pressed={selectedLanguage === lang}
              whileHover={{ scale: 1.05, y: -2, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '8px 18px',
                borderRadius: '50px',
                border: '1px solid',
                borderColor: selectedLanguage === lang ? 'transparent' : 'var(--border-glass)',
                background: selectedLanguage === lang ? 'var(--insta-gradient)' : 'rgba(255, 255, 255, 0.02)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'border-color 0.3s, background 0.3s, color 0.3s',
              }}
            >
              {lang}
            </motion.button>
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
            <SpotlightCard
              key={repo.id}
              className="glass-panel project-card"
              style={{
                padding: '28px',
                transition: 'all 0.4s var(--transition-smooth)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className="project-tag">
                    {repo.language || 'Code'}
                  </span>
                  {/* BUG-021: Only show stats if not in fallback/offline mode */}
                  {!repo.isFallback && (
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
                  )}
                </div>

                <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-primary)' }}>
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
                <motion.a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${repo.name} repository on GitHub`}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <span>View Repository</span>
                  <ExternalLink size={14} />
                </motion.a>
              </div>
            </SpotlightCard>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No repositories found matching &ldquo;{searchTerm}&rdquo; under &ldquo;{selectedLanguage}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
