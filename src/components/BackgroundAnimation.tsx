const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 will-change-transform">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: 'translateZ(0)' }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--border))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--border))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--border))" stopOpacity="0" />
          </linearGradient>
          
          <linearGradient id="dotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        
        {/* Horizontal lines */}
        <g className="animate-float-slow">
          <line x1="0" y1="100" x2="1200" y2="120" stroke="url(#lineGradient)" strokeWidth="2">
            <animate attributeName="x2" values="1200;800;1200" dur="15s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="250" x2="1200" y2="270" stroke="url(#lineGradient)" strokeWidth="2">
            <animate attributeName="x2" values="1200;600;1200" dur="20s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="450" x2="1200" y2="470" stroke="url(#lineGradient)" strokeWidth="2">
            <animate attributeName="x2" values="1200;900;1200" dur="18s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="650" x2="1200" y2="670" stroke="url(#lineGradient)" strokeWidth="2">
            <animate attributeName="x2" values="1200;700;1200" dur="22s" repeatCount="indefinite" />
          </line>
        </g>
        
        {/* Diagonal lines */}
        <g className="animate-float-reverse">
          <line x1="0" y1="0" x2="400" y2="800" stroke="hsl(var(--border))" strokeWidth="1.5" opacity="0.5">
            <animate attributeName="x1" values="0;200;0" dur="25s" repeatCount="indefinite" />
            <animate attributeName="x2" values="400;600;400" dur="25s" repeatCount="indefinite" />
          </line>
          <line x1="600" y1="0" x2="1000" y2="800" stroke="hsl(var(--border))" strokeWidth="1.5" opacity="0.5">
            <animate attributeName="x1" values="600;800;600" dur="30s" repeatCount="indefinite" />
            <animate attributeName="x2" values="1000;1200;1000" dur="30s" repeatCount="indefinite" />
          </line>
        </g>
        
        {/* Animated dots */}
        <g className="animate-pulse-slow">
          <circle cx="200" cy="150" r="3" fill="url(#dotGradient)">
            <animate attributeName="r" values="3;6;3" dur="8s" repeatCount="indefinite" />
            <animate attributeName="cx" values="200;400;200" dur="12s" repeatCount="indefinite" />
          </circle>
          <circle cx="800" cy="300" r="3" fill="url(#dotGradient)">
            <animate attributeName="r" values="3;5;3" dur="10s" repeatCount="indefinite" />
            <animate attributeName="cx" values="800;600;800" dur="15s" repeatCount="indefinite" />
          </circle>
          <circle cx="500" cy="500" r="3" fill="url(#dotGradient)">
            <animate attributeName="r" values="3;7;3" dur="12s" repeatCount="indefinite" />
            <animate attributeName="cy" values="500;300;500" dur="18s" repeatCount="indefinite" />
          </circle>
          <circle cx="1000" cy="200" r="3" fill="url(#dotGradient)">
            <animate attributeName="r" values="3;5;3" dur="9s" repeatCount="indefinite" />
            <animate attributeName="cx" values="1000;800;1000" dur="14s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* Grid pattern */}
        <g opacity="0.2">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="hsl(var(--border))" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </g>
      </svg>
    </div>
  );
};

export default BackgroundAnimation;