/**
 * UNEEDWHAT - Modern Frontend Components
 * 
 * Design System:
 * - Color Palette: Slate (primary), Cyan (accent), Emerald (success), Amber (warning)
 * - Typography: Inter (body), Space Mono (data), Sora (display)
 * - Motion: Smooth transitions (0.3s cubic-bezier), entrance animations
 * - Signature: Gradient talent cards with floating badge animations
 */

// ============================================================================
// 1. DESIGN TOKENS & THEME
// ============================================================================

export const theme = {
  colors: {
    // Primary palette
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    // Accent palette
    cyan: {
      50: '#ecf9ff',
      400: '#06b6d4',
      500: '#0891b2',
      600: '#0e7490',
    },
    emerald: {
      50: '#f0fdf4',
      500: '#10b981',
      600: '#059669',
    },
    amber: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
    },
    white: '#ffffff',
    black: '#000000',
  },
  typography: {
    fontFamily: {
      display: "'Sora', -apple-system, BlinkMacSystemFont",
      body: "'Inter', -apple-system, BlinkMacSystemFont",
      mono: "'Space Mono', monospace",
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
    md: '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)',
    lg: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
    xl: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
  },
  transitions: {
    fast: 'all 0.15s ease-in-out',
    base: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ============================================================================
// 2. ANIMATION STYLES (CSS-in-JS / Tailwind)
// ============================================================================

export const animationStyles = `
  /* Entrance animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 1rem, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translate3d(0, -1rem, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translate3d(-1.5rem, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translate3d(1.5rem, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  /* Floating badge animation (signature element) */
  @keyframes floatingBadge {
    0%, 100% {
      transform: translateY(0px) scale(1);
      opacity: 1;
    }
    50% {
      transform: translateY(-8px) scale(1.05);
      opacity: 0.9;
    }
  }

  /* Gradient pulse */
  @keyframes gradientPulse {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  /* Shimmer loading effect */
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  /* Bounce scale on interaction */
  @keyframes bounceScale {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  /* Utility classes */
  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-fade-in-down {
    animation: fadeInDown 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-slide-in-right {
    animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-floating-badge {
    animation: floatingBadge 3s ease-in-out infinite;
  }

  .animate-gradient-pulse {
    background-size: 200% 200%;
    animation: gradientPulse 3s ease infinite;
  }

  .animate-shimmer {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }

  .animate-bounce-scale {
    animation: bounceScale 0.3s ease-out;
  }
`;

// ============================================================================
// 3. CORE LAYOUT COMPONENTS
// ============================================================================

import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * MainLayout - Primary layout wrapper with header, sidebar, and content
 */
export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 bg-white border-r border-slate-200 flex flex-col`}
      >
        <div className="p-6 border-b border-slate-200">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
            {sidebarOpen ? 'uneedwhat' : 'un'}
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink icon="🔍" label="Jobs" sidebarOpen={sidebarOpen} />
          <NavLink icon="📋" label="Applications" sidebarOpen={sidebarOpen} />
          <NavLink icon="👤" label="Profile" sidebarOpen={sidebarOpen} />
          <NavLink icon="📊" label="Dashboard" sidebarOpen={sidebarOpen} />
        </nav>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="m-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? '←' : '→'}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between animate-fade-in-down">
          <h1 className="text-xl font-semibold text-slate-900">Welcome Back</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              🔔
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const NavLink: React.FC<{ icon: string; label: string; sidebarOpen: boolean }> = ({
  icon,
  label,
  sidebarOpen,
}) => (
  <a
    href="#"
    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors group"
  >
    <span className="text-xl">{icon}</span>
    {sidebarOpen && <span className="font-medium">{label}</span>}
  </a>
);

// ============================================================================
// 4. JOB CARD COMPONENT (Signature Design Element)
// ============================================================================

/**
 * TalentCard - Modern job/talent card with gradient background and floating badge
 * This is the signature element that defines the uneedwhat visual identity
 */
interface TalentCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract';
  salary?: string;
  skills: string[];
  isBookmarked?: boolean;
  isNew?: boolean;
  onBookmark?: (id: string) => void;
}

export const TalentCard: React.FC<TalentCardProps> = ({
  id,
  title,
  company,
  location,
  jobType,
  salary,
  skills,
  isBookmarked = false,
  isNew = false,
  onBookmark,
}) => {
  const [hovered, setHovered] = React.useState(false);

  const jobTypeColors = {
    'full-time': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'part-time': 'bg-amber-50 text-amber-700 border-amber-200',
    contract: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden rounded-2xl bg-white border border-slate-200 transition-all duration-300 cursor-pointer hover:shadow-xl ${
        hovered ? 'scale-105' : 'scale-100'
      }`}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />

      {/* Floating badge (signature animation) */}
      {isNew && (
        <div className="absolute top-4 right-4 animate-floating-badge">
          <div className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg">
            New
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
            <p className="text-sm font-medium text-slate-600">{company}</p>
          </div>
          <button
            onClick={() => onBookmark?.(id)}
            className={`p-2 rounded-lg transition-all ${
              isBookmarked
                ? 'bg-cyan-100 text-cyan-600'
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
          >
            {isBookmarked ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Location and type */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-slate-600 flex items-center gap-1">
            📍 {location}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full border ${jobTypeColors[jobType]}`}>
            {jobType}
          </span>
        </div>

        {/* Salary */}
        {salary && (
          <p className="text-sm font-semibold text-emerald-600 mb-4">{salary}</p>
        )}

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-xs text-slate-500 px-2 py-1">
              +{skills.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. APPLICATION STATUS COMPONENT
// ============================================================================

interface ApplicationStatusProps {
  status:
    | 'draft'
    | 'submitted'
    | 'screening'
    | 'shortlisted'
    | 'interview'
    | 'offer'
    | 'rejected'
    | 'accepted';
}

export const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ status }) => {
  const statusConfig = {
    draft: { color: 'bg-slate-100 text-slate-600', icon: '📝', label: 'Draft' },
    submitted: { color: 'bg-blue-100 text-blue-600', icon: '📤', label: 'Submitted' },
    screening: { color: 'bg-cyan-100 text-cyan-600', icon: '🔍', label: 'Screening' },
    shortlisted: { color: 'bg-purple-100 text-purple-600', icon: '⭐', label: 'Shortlisted' },
    interview: { color: 'bg-orange-100 text-orange-600', icon: '📞', label: 'Interview' },
    offer: { color: 'bg-emerald-100 text-emerald-600', icon: '🎉', label: 'Offer' },
    rejected: { color: 'bg-red-100 text-red-600', icon: '❌', label: 'Rejected' },
    accepted: { color: 'bg-green-100 text-green-600', icon: '✅', label: 'Accepted' },
  };

  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium text-sm ${config.color}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
};

// ============================================================================
// 6. FILTER & SEARCH COMPONENT
// ============================================================================

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Record<string, any>) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onFilterChange }) => {
  const [query, setQuery] = React.useState('');
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search jobs, companies, skills..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder-slate-500"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
            🔍
          </span>
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`px-4 py-3 rounded-lg font-medium transition-all ${
            filtersOpen
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          ⚙️ Filters
        </button>
      </div>

      {/* Filter Panel */}
      {filtersOpen && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white border border-slate-200 rounded-lg animate-fade-in-down">
          <FilterSelect
            label="Job Type"
            options={['Full-time', 'Part-time', 'Contract']}
            onChange={(value) => onFilterChange({ jobType: value })}
          />
          <FilterSelect
            label="Work Location"
            options={['On-site', 'Remote', 'Hybrid']}
            onChange={(value) => onFilterChange({ workplaceType: value })}
          />
          <FilterSelect
            label="Salary Range"
            options={['$30k - $50k', '$50k - $100k', '$100k+']}
            onChange={(value) => onFilterChange({ salaryRange: value })}
          />
          <FilterSelect
            label="Experience"
            options={['Entry-level', 'Mid-level', 'Senior']}
            onChange={(value) => onFilterChange({ experienceLevel: value })}
          />
        </div>
      )}
    </div>
  );
};

const FilterSelect: React.FC<{
  label: string;
  options: string[];
  onChange: (value: string) => void;
}> = ({ label, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
    <select
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
    >
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

// ============================================================================
// 7. PROFILE COMPLETION INDICATOR
// ============================================================================

interface ProfileCompletionProps {
  percentage: number;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ percentage }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">Profile Completion</h3>
        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
          {percentage}%
        </span>
      </div>

      {/* Progress bar with gradient */}
      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Completion tips */}
      <div className="mt-4 space-y-2 text-sm">
        {percentage < 100 && (
          <>
            <p className="text-slate-600">
              ✓ Complete your profile to improve job matching
            </p>
            <p className="text-slate-500">Missing: Resume, Portfolio, Recommendations</p>
          </>
        )}
        {percentage === 100 && (
          <p className="text-emerald-600 font-medium">
            ✓ Your profile is complete! You're ready to apply.
          </p>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 8. INTERVIEW SCHEDULER
// ============================================================================

interface InterviewSchedulerProps {
  applicationId: string;
  onSchedule: (date: Date, time: string, type: string) => void;
}

export const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({
  applicationId,
  onSchedule,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState('');
  const [interviewType, setInterviewType] = React.useState('video');

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 animate-fade-in-up">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Schedule Interview</h3>

      <div className="space-y-6">
        {/* Interview Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Interview Type
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['video', 'phone', 'in-person', 'panel'].map((type) => (
              <button
                key={type}
                onClick={() => setInterviewType(type)}
                className={`p-3 rounded-lg font-medium capitalize transition-all ${
                  interviewType === type
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {type === 'video' && '📹'}
                {type === 'phone' && '📞'}
                {type === 'in-person' && '🤝'}
                {type === 'panel' && '👥'}
                <span className="ml-1">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
            <input
              type="date"
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => {
            if (selectedDate && selectedTime) {
              onSchedule(selectedDate, selectedTime, interviewType);
            }
          }}
          className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all active:scale-95"
        >
          Schedule Interview
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 9. LOADING SKELETON
// ============================================================================

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200 animate-shimmer">
    <div className="space-y-4">
      <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
      <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
      <div className="flex gap-2">
        <div className="h-8 bg-slate-200 rounded-full flex-1" />
        <div className="h-8 bg-slate-200 rounded-full flex-1" />
      </div>
    </div>
  </div>
);

export const ListSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

// ============================================================================
// 10. RESPONSIVE GRID & UTILITIES
// ============================================================================

export const JobGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
    {children}
  </div>
);

export const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
);

export const Section: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <section className="py-12">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
      {description && <p className="text-slate-600">{description}</p>}
    </div>
    {children}
  </section>
);

// ============================================================================
// 11. EXPORT CONFIGURATION
// ============================================================================

export default {
  theme,
  animationStyles,
  components: {
    MainLayout,
    TalentCard,
    ApplicationStatus,
    SearchFilter,
    ProfileCompletion,
    InterviewScheduler,
    CardSkeleton,
    ListSkeleton,
    JobGrid,
    Container,
    Section,
  },
};
