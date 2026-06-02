const fs = require('fs');
const path = require('path');

const indexCssPath = path.join('C:\\\\Users\\\\ghosh\\\\OneDrive\\\\Desktop\\\\codes\\\\portfolio\\\\src', 'index.css');
const appCssPath = path.join('C:\\\\Users\\\\ghosh\\\\OneDrive\\\\Desktop\\\\codes\\\\portfolio\\\\src', 'App.css');
const atmosphereLayerPath = path.join('C:\\\\Users\\\\ghosh\\\\OneDrive\\\\Desktop\\\\codes\\\\portfolio\\\\src\\\\components', 'AtmosphereLayer.jsx');
const featuredSpotlightPath = path.join('C:\\\\Users\\\\ghosh\\\\OneDrive\\\\Desktop\\\\codes\\\\portfolio\\\\src\\\\components', 'FeaturedSpotlight.jsx');

// 1. Patch index.css
let indexCss = fs.readFileSync(indexCssPath, 'utf8');

// Update Night Mode Shadows
indexCss = indexCss.replace(
  /--shadow-sm:\s*0 2px 8px rgba\(0,0,0,0\.6\);/,
  '--shadow-sm:  0 2px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03);'
);
indexCss = indexCss.replace(
  /--shadow-md:\s*0 8px 32px rgba\(0,0,0,0\.7\);/,
  '--shadow-md:  0 10px 30px -10px rgba(0,0,0,0.6), 0 4px 14px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);'
);
indexCss = indexCss.replace(
  /--shadow-lg:\s*0 20px 60px rgba\(0,0,0,0\.8\);/,
  '--shadow-lg:  0 30px 60px -15px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);'
);

// Update Day Mode Shadows
indexCss = indexCss.replace(
  /--shadow-sm:\s*0 4px 12px rgba\(0, 0, 0, 0\.03\);/,
  '--shadow-sm:  0 2px 10px rgba(15, 23, 42, 0.03), inset 0 1px 0 rgba(255,255,255,0.7);'
);
indexCss = indexCss.replace(
  /--shadow-md:\s*0 10px 30px rgba\(0, 0, 0, 0\.05\);/,
  '--shadow-md:  0 12px 32px -10px rgba(15, 23, 42, 0.06), 0 4px 14px rgba(15, 23, 42, 0.03), inset 0 1px 0 rgba(255,255,255,0.8);'
);
indexCss = indexCss.replace(
  /--shadow-lg:\s*0 24px 64px rgba\(0, 0, 0, 0\.08\);/,
  '--shadow-lg:  0 30px 60px -15px rgba(15, 23, 42, 0.08), 0 10px 30px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255,255,255,1);'
);

// Update Transitions
indexCss = indexCss.replace(
  /--transition-smooth:\s*cubic-bezier\(0\.23, 1, 0\.32, 1\);/,
  '--transition-smooth:  cubic-bezier(0.16, 1, 0.3, 1);'
);

// Update Glass Panel and Hover states to feel heavier
indexCss = indexCss.replace(
  /box-shadow:\s*0 10px 30px -10px rgba\(0, 0, 0, 0\.5\), 0 0 0 1px rgba\(255, 255, 255, 0\.02\);/,
  'box-shadow: var(--shadow-md);'
);
indexCss = indexCss.replace(
  /box-shadow:\s*0 15px 40px -10px rgba\(0, 0, 0, 0\.6\), 0 0 0 1px rgba\(255, 255, 255, 0\.05\);/,
  'box-shadow: var(--shadow-lg);'
);

// Modify buttons to be less jumpy, more physical
indexCss = indexCss.replace(
  /transform: translateY\(-2px\) scale\(1\.02\);/g,
  'transform: translateY(-2px) scale(1.01);'
);
indexCss = indexCss.replace(
  /transform: translateY\(0\) scale\(0\.98\);/g,
  'transform: translateY(1px) scale(0.97);'
);

// Make grain finer
indexCss = indexCss.replace(
  /baseFrequency='0\.88' numOctaves='4'/,
  "baseFrequency='0.95' numOctaves='3'"
);

// Make mobile container padding slightly better to avoid overflow
if (!indexCss.includes('overflow-x: clip;')) {
    indexCss = indexCss.replace(
        /body \{/,
        'body {\n  overflow-x: clip;\n  width: 100vw;'
    );
}

fs.writeFileSync(indexCssPath, indexCss, 'utf8');


// 2. Patch App.css
let appCss = fs.readFileSync(appCssPath, 'utf8');

// Slow down pulseBlob
appCss = appCss.replace(
  /animation: pulseBlob 10s ease-in-out infinite alternate;/,
  'animation: pulseBlob 20s ease-in-out infinite alternate;'
);

// Add inner image scaling for project cards
if (!appCss.includes('.project-card img')) {
    appCss += `\n
.project-card {
  overflow: hidden;
}
.project-card img, .project-card .glass-panel img {
  transition: transform 0.8s var(--transition-smooth);
}
.project-card:hover img, .project-card:hover .glass-panel img {
  transform: scale(1.03);
}
`;
}

// Adjust hover lifts to be more subtle and premium
appCss = appCss.replace(
  /transform: translateY\(-4px\);/g,
  'transform: translateY(-3px);'
);

appCss = appCss.replace(
  /box-shadow: var\(--shadow-lg\) !important;/g,
  'box-shadow: var(--shadow-lg) !important;'
);

// Improve scanline / grain in memory cards
appCss = appCss.replace(
  /baseFrequency='0\.85' numOctaves='4'/,
  "baseFrequency='0.95' numOctaves='3'"
);
appCss = appCss.replace(
  /opacity: 0\.06;/g,
  'opacity: 0.04;'
);

fs.writeFileSync(appCssPath, appCss, 'utf8');


// 3. Patch AtmosphereLayer.jsx for the moon phrase
let atmosphereLayer = fs.readFileSync(atmosphereLayerPath, 'utf8');
atmosphereLayer = atmosphereLayer.replace(
  /"Not everything I loved stayed\. The moon did\."/,
  `"I've always liked the moon. Maybe because some people shine quietly too."`
);
// Make the font size slightly smaller and more elegant
atmosphereLayer = atmosphereLayer.replace(
  /fontSize: '0\.55rem',/,
  "fontSize: '0.52rem', letterSpacing: '1.2px', opacity: 0.9,"
);
fs.writeFileSync(atmosphereLayerPath, atmosphereLayer, 'utf8');


// 4. Patch FeaturedSpotlight.jsx for hierarchy
let featuredSpotlight = fs.readFileSync(featuredSpotlightPath, 'utf8');
// Increase top margin and padding to make it a distinct peak
featuredSpotlight = featuredSpotlight.replace(
  /padding: '50px 0 60px'/,
  "padding: '80px 0 100px'"
);
// Make the panel float more with lg shadow instead of md
featuredSpotlight = featuredSpotlight.replace(
  /boxShadow: 'var\(--shadow-md\)'/,
  "boxShadow: 'var(--shadow-lg)'"
);
featuredSpotlight = featuredSpotlight.replace(
  /marginTop: '40px'/,
  "marginTop: '70px'"
);

fs.writeFileSync(featuredSpotlightPath, featuredSpotlight, 'utf8');

console.log("Polish patches applied successfully.");
