import React, { useState, useEffect } from 'react';

/**
 * GitHubGraph
 * Fetches the last 6 months of contribution data from GitHub's SVG calendar
 * and renders it as a styled pixel grid inside the Profile bento panel.
 *
 * - Uses GitHub's public API (no token needed for public repos)
 * - Fails silently — if the fetch fails, renders nothing visible
 * - Styled to match the dark portfolio aesthetic
 */

const GITHUB_USERNAME = 'Aethron-fr';

function parseContributions(data) {
  // Parse contribution data from GitHub's contribution API via cors proxy
  const weeks = data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
  return weeks;
}

export default function GitHubGraph() {
  const [weeks, setWeeks] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Use GitHub's calendar SVG as a simple data source
    // We fetch from a public CORS-friendly proxy that parses the contribution data
    const CACHE_KEY = '_gh_graph_v1';
    const cached = sessionStorage.getItem(CACHE_KEY);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setWeeks(parsed.weeks || []);
        setTotalContributions(parsed.total || 0);
        setLoaded(true);
        return;
      } catch {
        sessionStorage.removeItem(CACHE_KEY);
      }
    }

    // Use github-contributions-api (unofficial but public, no auth needed)
    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`)
      .then(res => {
        if (!res.ok) throw new Error('fetch failed');
        return res.json();
      })
      .then(json => {
        // This API returns { total: {year: count}, contributions: [{date, count, color, level}] }
        const contributions = json.contributions || [];
        const total = json.total?.lastYear || Object.values(json.total || {}).reduce((a, b) => a + b, 0);

        // Group contributions into weeks (7-day chunks)
        const weekGroups = [];
        for (let i = 0; i < contributions.length; i += 7) {
          weekGroups.push(contributions.slice(i, i + 7));
        }

        const cacheData = { weeks: weekGroups, total };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

        setWeeks(weekGroups);
        setTotalContributions(total);
        setLoaded(true);
      })
      .catch(() => {
        // Silent failure — nothing is shown if the fetch fails
        setLoaded(false);
      });
  }, []);

  // Don't render anything if data failed to load
  if (!loaded || weeks.length === 0) return null;

  const getColor = (level) => {
    const colors = {
      0: 'rgba(255,255,255,0.05)',
      1: '#0e4429',
      2: '#006d32',
      3: '#26a641',
      4: '#39d353',
    };
    return colors[level] || colors[0];
  };

  return (
    <div style={{
      marginTop: '20px',
      padding: '0',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
      }}>
        <span style={{
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-dim)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          GitHub Activity
        </span>
        <span style={{
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-cyber)',
          letterSpacing: '1px',
        }}>
          {totalContributions.toLocaleString()} contributions
        </span>
      </div>

      {/* Contribution Grid */}
      <div style={{
        display: 'flex',
        gap: '3px',
        overflowX: 'auto',
        overflowY: 'hidden',
        paddingBottom: '4px',
        scrollbarWidth: 'none',
      }}>
        {weeks.map((week, wi) => (
          <div
            key={wi}
            style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}
          >
            {week.map((day, di) => (
              <div
                key={di}
                title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: getColor(day.level),
                  transition: 'transform 0.15s ease',
                  cursor: 'default',
                  flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.4)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginTop: '10px',
        justifyContent: 'flex-end',
      }}>
        <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginRight: '4px' }}>Less</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div key={level} style={{
            width: '10px', height: '10px', borderRadius: '2px',
            backgroundColor: getColor(level),
          }} />
        ))}
        <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginLeft: '4px' }}>More</span>
      </div>
    </div>
  );
}
