/**
 * UNEEDWHAT - Dashboard & Data Visualization Components
 * Real-time analytics, charts, and performance metrics
 */

import React, { useEffect, useState } from 'react';
import { useJobStore, useApplicationStore } from './frontend-hooks-services';

// ============================================================================
// 1. ANIMATED STATISTICS CARD
// ============================================================================

interface StatCardProps {
  label: string;
  value: number | string;
  change?: number;
  icon: string;
  color: 'cyan' | 'emerald' | 'amber' | 'purple';
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  icon,
  color,
  isLoading = false,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Animated counter
  useEffect(() => {
    if (typeof value !== 'number' || isLoading) return;

    let start = 0;
    const end = value;
    const duration = 800;
    const increment = end / (duration / 16);

    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, isLoading]);

  const colorClasses = {
    cyan: 'from-cyan-500/10 to-cyan-500/5',
    emerald: 'from-emerald-500/10 to-emerald-500/5',
    amber: 'from-amber-500/10 to-amber-500/5',
    purple: 'from-purple-500/10 to-purple-500/5',
  };

  const iconColors = {
    cyan: 'text-cyan-600',
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    purple: 'text-purple-600',
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${colorClasses[color]} border border-slate-200 transition-all duration-300 hover:shadow-lg`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-pulse" />

      {/* Content */}
      <div className="relative space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {isLoading ? '—' : displayValue}
              </span>
              {change !== undefined && (
                <span
                  className={`text-sm font-semibold ${
                    change >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                </span>
              )}
            </div>
          </div>
          <div className={`text-2xl p-3 rounded-lg bg-white ${iconColors[color]}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. APPLICATION FUNNEL CHART
// ============================================================================

interface FunnelStage {
  label: string;
  value: number;
  color: string;
}

export const ApplicationFunnel: React.FC<{ stages: FunnelStage[] }> = ({ stages }) => {
  const maxValue = Math.max(...stages.map((s) => s.value));

  return (
    <div className="bg-white rounded-xl p-8 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-8">Application Funnel</h3>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const percentage = (stage.value / maxValue) * 100;
          const width = Math.max(30 + (percentage / 100) * 70, 30); // Min 30%, Max 100%

          return (
            <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">{stage.label}</span>
                <span className="text-sm font-bold text-slate-900">{stage.value}</span>
              </div>

              <div className="h-12 bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className={`h-full ${stage.color} transition-all duration-500 ease-out flex items-center justify-end pr-4 relative group`}
                  style={{ width: `${width}%` }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 animate-shimmer opacity-50" />

                  {/* Percentage display */}
                  {width > 40 && (
                    <span className="relative text-sm font-semibold text-white">
                      {Math.round(percentage)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion metrics */}
      <div className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-3 gap-4">
        {stages.length > 1 && (
          <>
            <div>
              <p className="text-xs text-slate-600 mb-1">Total Submitted</p>
              <p className="text-xl font-bold text-slate-900">{stages[0]?.value || 0}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">To Interview</p>
              <p className="text-xl font-bold text-slate-900">
                {stages[1]?.value || 0} (
                {stages[0]?.value
                  ? Math.round(((stages[1]?.value || 0) / stages[0].value) * 100)
                  : 0}
                %)
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Offers Sent</p>
              <p className="text-xl font-bold text-slate-900">
                {stages[stages.length - 1]?.value || 0}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 3. TIME-TO-HIRE CHART (Line Chart)
// ============================================================================

interface TimeToHirePoint {
  label: string;
  days: number;
}

export const TimeToHireChart: React.FC<{ data: TimeToHirePoint[] }> = ({ data }) => {
  const maxDays = Math.max(...data.map((d) => d.days));
  const minDays = Math.min(...data.map((d) => d.days));

  return (
    <div className="bg-white rounded-xl p-8 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-8">Time-to-Hire Trend</h3>

      {/* Chart grid */}
      <div className="relative h-64 mb-8">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500 -ml-8">
          <span>{Math.ceil(maxDays)} days</span>
          <span>{Math.round((maxDays + minDays) / 2)} days</span>
          <span>{Math.floor(minDays)} days</span>
        </div>

        {/* Chart area */}
        <svg className="w-full h-full" viewBox={`0 0 ${data.length * 50} 200`} preserveAspectRatio="none">
          {/* Grid lines */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={`grid-${i}`}
              x1="0"
              y1={50 + i * 50}
              x2="100%"
              y2={50 + i * 50}
              stroke="rgb(226, 232, 240)"
              strokeWidth="1"
            />
          ))}

          {/* Area under curve */}
          {data.length > 0 && (
            <path
              d={`M ${data
                .map((d, i) => {
                  const x = i * (100 / (data.length - 1 || 1));
                  const y = 200 - ((d.days - minDays) / (maxDays - minDays || 1)) * 180 - 10;
                  return `${x} ${y}`;
                })
                .join('L')} L ${(data.length - 1) * (100 / (data.length - 1 || 1))} 200 L 0 200 Z`}
              fill="url(#areaGradient)"
            />
          )}

          {/* Line */}
          <polyline
            points={data
              .map((d, i) => {
                const x = i * (100 / (data.length - 1 || 1));
                const y = 200 - ((d.days - minDays) / (maxDays - minDays || 1)) * 180 - 10;
                return `${x},${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="rgb(6, 182, 212)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />

          {/* Data points */}
          {data.map((d, i) => {
            const x = i * (100 / (data.length - 1 || 1));
            const y = 200 - ((d.days - minDays) / (maxDays - minDays || 1)) * 180 - 10;
            return (
              <g key={`point-${i}`}>
                <circle cx={x} cy={y} r="3" fill="rgb(6, 182, 212)" />
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="none"
                  stroke="rgb(6, 182, 212)"
                  strokeWidth="2"
                  opacity="0.5"
                  className="animate-pulse"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-slate-600">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>

      {/* Average indicator */}
      <div className="mt-8 p-4 bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-lg border border-cyan-200">
        <p className="text-sm text-slate-600 mb-1">Average Time-to-Hire</p>
        <p className="text-2xl font-bold text-slate-900">
          {(data.reduce((sum, d) => sum + d.days, 0) / data.length).toFixed(1)} days
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// 4. JOB PERFORMANCE HEATMAP
// ============================================================================

interface JobPerformance {
  jobTitle: string;
  applications: number;
  interviews: number;
  offers: number;
  acceptanceRate: number;
}

export const JobPerformanceHeatmap: React.FC<{ jobs: JobPerformance[] }> = ({ jobs }) => {
  const metrics = [
    { key: 'applications', label: 'Applications' },
    { key: 'interviews', label: 'Interviews' },
    { key: 'offers', label: 'Offers' },
    { key: 'acceptanceRate', label: 'Acceptance %' },
  ];

  const getHeatmapColor = (value: number, max: number): string => {
    const ratio = value / max;
    if (ratio > 0.7) return 'bg-emerald-500';
    if (ratio > 0.4) return 'bg-cyan-500';
    if (ratio > 0.2) return 'bg-amber-500';
    return 'bg-slate-300';
  };

  const maxValues = {
    applications: Math.max(...jobs.map((j) => j.applications)),
    interviews: Math.max(...jobs.map((j) => j.interviews)),
    offers: Math.max(...jobs.map((j) => j.offers)),
    acceptanceRate: 100,
  };

  return (
    <div className="bg-white rounded-xl p-8 border border-slate-200 overflow-x-auto">
      <h3 className="text-lg font-bold text-slate-900 mb-8">Job Performance Matrix</h3>

      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 font-semibold text-slate-900 min-w-32">
              Position
            </th>
            {metrics.map((metric) => (
              <th key={metric.key} className="text-center py-3 px-4 font-semibold text-slate-900">
                {metric.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, idx) => (
            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="py-4 px-4 font-medium text-slate-900">{job.jobTitle}</td>
              {metrics.map((metric) => {
                const value = job[metric.key as keyof JobPerformance] as number;
                const max = maxValues[metric.key as keyof typeof maxValues];
                const bgColor = getHeatmapColor(value, max);

                return (
                  <td key={metric.key} className="py-4 px-4 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-10 rounded-lg ${bgColor} text-white font-semibold transition-all duration-300 hover:scale-110`}
                    >
                      {metric.key === 'acceptanceRate'
                        ? `${value.toFixed(0)}%`
                        : value}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-8 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500" />
          <span className="text-slate-600">High Performance (71-100%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-cyan-500" />
          <span className="text-slate-600">Good (41-70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500" />
          <span className="text-slate-600">Fair (21-40%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-300" />
          <span className="text-slate-600">Low (0-20%)</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. HR DASHBOARD
// ============================================================================

export const HRDashboard: React.FC = () => {
  const { jobs, isLoading } = useJobStore();
  const [dashboardData, setDashboardData] = useState({
    activeJobs: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
    offersExtended: 0,
    funnelStages: [] as any[],
    timeToHire: [] as any[],
    jobPerformance: [] as any[],
  });

  // Simulated data fetch
  useEffect(() => {
    // In production, fetch from API
    setDashboardData({
      activeJobs: 12,
      totalApplications: 248,
      interviewsScheduled: 45,
      offersExtended: 8,
      funnelStages: [
        { label: 'Submitted', value: 248, color: 'bg-blue-500' },
        { label: 'Screening', value: 124, color: 'bg-cyan-500' },
        { label: 'Interview', value: 45, color: 'bg-purple-500' },
        { label: 'Offer', value: 8, color: 'bg-emerald-500' },
      ],
      timeToHire: [
        { label: 'Jan', days: 18 },
        { label: 'Feb', days: 16 },
        { label: 'Mar', days: 15 },
        { label: 'Apr', days: 17 },
        { label: 'May', days: 14 },
        { label: 'Jun', days: 13 },
      ],
      jobPerformance: [
        {
          jobTitle: 'Senior React Developer',
          applications: 45,
          interviews: 12,
          offers: 3,
          acceptanceRate: 67,
        },
        {
          jobTitle: 'Product Manager',
          applications: 38,
          interviews: 8,
          offers: 2,
          acceptanceRate: 50,
        },
        {
          jobTitle: 'UX Designer',
          applications: 32,
          interviews: 9,
          offers: 2,
          acceptanceRate: 100,
        },
        {
          jobTitle: 'DevOps Engineer',
          applications: 28,
          interviews: 6,
          offers: 1,
          acceptanceRate: 100,
        },
      ],
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Hiring Dashboard</h1>
        <p className="text-slate-600">Real-time recruitment metrics and insights</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
        <StatCard
          label="Active Jobs"
          value={dashboardData.activeJobs}
          icon="📌"
          color="cyan"
          change={12}
          isLoading={isLoading}
        />
        <StatCard
          label="Applications"
          value={dashboardData.totalApplications}
          icon="📋"
          color="emerald"
          change={8}
          isLoading={isLoading}
        />
        <StatCard
          label="Scheduled Interviews"
          value={dashboardData.interviewsScheduled}
          icon="📞"
          color="amber"
          change={5}
          isLoading={isLoading}
        />
        <StatCard
          label="Offers Sent"
          value={dashboardData.offersExtended}
          icon="🎉"
          color="purple"
          change={25}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="animate-slide-in-left">
          <ApplicationFunnel stages={dashboardData.funnelStages} />
        </div>
        <div className="animate-slide-in-right">
          <TimeToHireChart data={dashboardData.timeToHire} />
        </div>
      </div>

      {/* Job Performance */}
      <div className="animate-fade-in-up">
        <JobPerformanceHeatmap jobs={dashboardData.jobPerformance} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
        <RecentActivityCard
          title="Latest Applications"
          items={[
            { name: 'John Doe', position: 'React Developer', time: '2 hours ago' },
            { name: 'Jane Smith', position: 'Product Manager', time: '4 hours ago' },
            { name: 'Alex Johnson', position: 'UX Designer', time: '6 hours ago' },
          ]}
        />
        <RecentActivityCard
          title="Upcoming Interviews"
          items={[
            { name: 'Sarah Connor', position: 'DevOps Engineer', time: 'Today at 2 PM' },
            { name: 'Tom Hardy', position: 'React Developer', time: 'Tomorrow at 10 AM' },
            { name: 'Emma Watson', position: 'Product Manager', time: 'Tomorrow at 3 PM' },
          ]}
        />
        <RecentActivityCard
          title="Offers to Review"
          items={[
            { name: 'Mike Johnson', position: 'Senior React Dev', time: 'Pending approval' },
            { name: 'Lisa Chen', position: 'UX Designer', time: 'Pending approval' },
          ]}
        />
      </div>
    </div>
  );
};

// ============================================================================
// 6. RECENT ACTIVITY CARD
// ============================================================================

interface RecentActivityItem {
  name: string;
  position: string;
  time: string;
}

export const RecentActivityCard: React.FC<{
  title: string;
  items: RecentActivityItem[];
}> = ({ title, items }) => (
  <div className="bg-white rounded-xl p-6 border border-slate-200">
    <h3 className="font-bold text-slate-900 mb-4">{title}</h3>
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-start justify-between pb-3 border-b border-slate-100 last:pb-0 last:border-0 animate-fade-in-up"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="flex-1">
            <p className="font-medium text-slate-900 text-sm">{item.name}</p>
            <p className="text-xs text-slate-600">{item.position}</p>
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{item.time}</span>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// 7. JOB SEEKER DASHBOARD
// ============================================================================

export const JobSeekerDashboard: React.FC = () => {
  const { applications, isLoading } = useApplicationStore();
  const [profileCompletion] = useState(78);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Dashboard</h1>
        <p className="text-slate-600">Track your job search progress</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
        <StatCard
          label="Applications Sent"
          value={applications.length}
          icon="📤"
          color="cyan"
          isLoading={isLoading}
        />
        <StatCard
          label="Interviews Scheduled"
          value={applications.filter((a) => a.status === 'interview').length}
          icon="📞"
          color="emerald"
          isLoading={isLoading}
        />
        <StatCard
          label="Offers Received"
          value={applications.filter((a) => a.status === 'offer').length}
          icon="🎉"
          color="amber"
          isLoading={isLoading}
        />
      </div>

      {/* Profile & Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 animate-slide-in-left">
          <ProfileCompletionSimple percentage={profileCompletion} />
        </div>

        <div className="lg:col-span-2 animate-slide-in-right">
          <ApplicationStatusOverview applications={applications} />
        </div>
      </div>
    </div>
  );
};

const ProfileCompletionSimple: React.FC<{ percentage: number }> = ({ percentage }) => (
  <div className="bg-white rounded-xl p-6 border border-slate-200">
    <h3 className="font-semibold text-slate-900 mb-6">Profile Completion</h3>

    <div className="relative w-32 h-32 mx-auto mb-6">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgb(226, 232, 240)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="url(#grad)"
          strokeWidth="8"
          strokeDasharray={`${(percentage / 100) * 339.3} 339.3`}
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(6, 182, 212)" />
            <stop offset="100%" stopColor="rgb(16, 185, 129)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-slate-900">{percentage}%</span>
      </div>
    </div>

    <div className="space-y-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-emerald-600">✓</span>
        <span className="text-slate-600">Personal Information</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-emerald-600">✓</span>
        <span className="text-slate-600">Resume Uploaded</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-slate-300">◯</span>
        <span className="text-slate-600">Portfolio Link</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-slate-300">◯</span>
        <span className="text-slate-600">Recommendations</span>
      </div>
    </div>
  </div>
);

const ApplicationStatusOverview: React.FC<{ applications: any[] }> = ({ applications }) => {
  const statuses = ['submitted', 'screening', 'interview', 'offer', 'rejected'];
  const statusCounts = statuses.map((status) => ({
    status,
    count: applications.filter((a) => a.status === status).length,
  }));

  const statusEmojis: Record<string, string> = {
    submitted: '📤',
    screening: '🔍',
    interview: '📞',
    offer: '🎉',
    rejected: '❌',
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-6">Application Pipeline</h3>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {statusCounts.map((item) => (
          <div
            key={item.status}
            className="text-center p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors animate-fade-in-up"
          >
            <div className="text-2xl mb-2">{statusEmojis[item.status]}</div>
            <div className="text-lg font-bold text-slate-900">{item.count}</div>
            <div className="text-xs text-slate-600 capitalize">{item.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 8. EXPORT
// ============================================================================

export default {
  HRDashboard,
  JobSeekerDashboard,
  StatCard,
  ApplicationFunnel,
  TimeToHireChart,
  JobPerformanceHeatmap,
  RecentActivityCard,
};
