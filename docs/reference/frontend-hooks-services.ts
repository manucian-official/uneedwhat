/**
 * UNEEDWHAT - Advanced Frontend Hooks & Services
 * Real-time data fetching, caching, state management, and API integration
 */

// ============================================================================
// 1. CUSTOM HOOKS
// ============================================================================

import { useState, useEffect, useCallback, useRef, useReducer } from 'react';
import axios, { AxiosError } from 'axios';
import { useShallow } from 'zustand/react/shallow';

/**
 * useAsync - Generic async data fetching hook with loading, error, and retry
 */
interface UseAsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  dependencies: any[] = []
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ status: 'pending', data: null, error: null });
    try {
      const response = await asyncFunction();
      setState({ status: 'success', data: response, error: null });
      return response;
    } catch (error) {
      setState({ status: 'error', data: null, error: error as Error });
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate, ...dependencies]);

  return { ...state, execute };
}

/**
 * useFetch - Specialized hook for API calls with caching
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const fetchCache = new Map<string, CacheEntry<any>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useFetch<T>(
  url: string | null,
  options?: { cache?: boolean; immediate?: boolean }
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    status: url ? 'pending' : 'idle',
    data: null,
    error: null,
  });

  const cacheEnabled = options?.cache ?? true;
  const immediate = options?.immediate ?? true;

  useEffect(() => {
    if (!url) {
      setState({ status: 'idle', data: null, error: null });
      return;
    }

    // Check cache first
    if (cacheEnabled && fetchCache.has(url)) {
      const cached = fetchCache.get(url);
      if (Date.now() - cached!.timestamp < CACHE_DURATION) {
        setState({ status: 'success', data: cached!.data, error: null });
        return;
      }
    }

    let isMounted = true;

    const fetchData = async () => {
      setState({ status: 'pending', data: null, error: null });
      try {
        const response = await axios.get<T>(url);
        if (isMounted) {
          if (cacheEnabled) {
            fetchCache.set(url, { data: response.data, timestamp: Date.now() });
          }
          setState({ status: 'success', data: response.data, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            status: 'error',
            data: null,
            error: error instanceof Error ? error : new Error('Unknown error'),
          });
        }
      }
    };

    if (immediate) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [url, cacheEnabled, immediate]);

  return state;
}

/**
 * useDebounce - Debounce values for search and real-time filtering
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * usePagination - Manage pagination state with prev/next navigation
 */
interface UsePaginationState {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function usePagination(pageSize: number = 10) {
  const [state, setState] = useState<UsePaginationState>({
    currentPage: 1,
    pageSize,
    total: 0,
    totalPages: 0,
  });

  const goToPage = useCallback((page: number) => {
    setState((prev) => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.totalPages)),
    }));
  }, []);

  const nextPage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, prev.totalPages),
    }));
  }, []);

  const prevPage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 1),
    }));
  }, []);

  const setTotal = useCallback((total: number) => {
    const totalPages = Math.ceil(total / pageSize);
    setState((prev) => ({
      ...prev,
      total,
      totalPages,
    }));
  }, [pageSize]);

  return {
    ...state,
    goToPage,
    nextPage,
    prevPage,
    setTotal,
    offset: (state.currentPage - 1) * state.pageSize,
  };
}

/**
 * useFormState - Advanced form state management with validation
 */
interface FormField {
  value: any;
  error?: string;
  touched: boolean;
  isDirty: boolean;
}

interface UseFormStateReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isDirty: boolean;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void>) => (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setFieldValue: (field: keyof T, value: any) => void;
}

export function useFormState<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Partial<Record<keyof T, string>>
): UseFormStateReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));
      setIsDirty(true);

      // Validate on change
      if (validate) {
        const newErrors = validate({ ...values, [name]: fieldValue });
        setErrors(newErrors);
      }
    },
    [values, validate]
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void>) =>
      async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        );
        setTouched(allTouched as any);

        // Validate all fields
        if (validate) {
          const newErrors = validate(values);
          setErrors(newErrors);
          if (Object.keys(newErrors).length > 0) {
            return;
          }
        }

        setIsSubmitting(true);
        try {
          await onSubmit(values);
          setIsDirty(false);
        } finally {
          setIsSubmitting(false);
        }
      },
    [values, validate]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialValues]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  }, []);

  return {
    values,
    errors,
    touched,
    isDirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
  };
}

/**
 * useLocalStorage - Persist state to localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('localStorage error:', error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
}

/**
 * useIntersection - Detect when element enters viewport (lazy loading)
 */
export function useIntersection(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref, isVisible] as const;
}

/**
 * useNotification - Toast/notification management
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) => {
      const id = Math.random().toString(36).substr(2, 9);
      const notification: Notification = { id, type, message, duration };

      setNotifications((prev) => [...prev, notification]);

      if (duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}

/**
 * useAuth - Authentication state management
 */
interface AuthState {
  user: any | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.post('/api/v1/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data.data;

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token: accessToken, refreshToken },
      });

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error as Error });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post('/api/v1/auth/logout');
    } finally {
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }, []);

  const register = useCallback(
    async (userData: any) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const response = await axios.post('/api/v1/auth/register', userData);
        const { accessToken, refreshToken, user } = response.data.data;

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token: accessToken, refreshToken },
        });

        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      } catch (error) {
        dispatch({ type: 'LOGIN_FAILURE', payload: error as Error });
        throw error;
      }
    },
    []
  );

  return {
    ...state,
    login,
    logout,
    register,
  };
}

const initialAuthState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
};

function authReducer(
  state: AuthState,
  action: {
    type: string;
    payload?: any;
  }
): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false };
    case 'LOGOUT':
      return { ...state, user: null, token: null, refreshToken: null, isAuthenticated: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// ============================================================================
// 2. API SERVICE LAYER
// ============================================================================

class ApiClient {
  private instance = axios.create({
    baseURL: process.env.VITE_API_URL || 'http://localhost:3000/api/v1',
    timeout: parseInt(process.env.VITE_API_TIMEOUT || '30000'),
  });

  constructor() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await this.instance.post('/auth/refresh', {
              refreshToken,
            });

            const { accessToken } = response.data.data;
            localStorage.setItem('token', accessToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  auth = {
    register: (data: any) => this.instance.post('/auth/register', data),
    login: (email: string, password: string) =>
      this.instance.post('/auth/login', { email, password }),
    logout: () => this.instance.post('/auth/logout'),
    refresh: (refreshToken: string) =>
      this.instance.post('/auth/refresh', { refreshToken }),
  };

  // Job endpoints
  jobs = {
    list: (filters?: any) => this.instance.get('/jobs', { params: filters }),
    create: (data: any) => this.instance.post('/jobs', data),
    getById: (id: string) => this.instance.get(`/jobs/${id}`),
    update: (id: string, data: any) => this.instance.patch(`/jobs/${id}`, data),
    delete: (id: string) => this.instance.delete(`/jobs/${id}`),
    getAnalytics: (id: string) => this.instance.get(`/jobs/${id}/analytics`),
    search: (query: string, filters?: any) =>
      this.instance.get('/jobs/search', { params: { q: query, ...filters } }),
  };

  // Application endpoints
  applications = {
    list: (filters?: any) => this.instance.get('/applications', { params: filters }),
    create: (data: any) => this.instance.post('/applications', data),
    getById: (id: string) => this.instance.get(`/applications/${id}`),
    updateStatus: (id: string, status: string, feedback?: string) =>
      this.instance.patch(`/applications/${id}/status`, { status, feedback }),
    withdraw: (id: string) => this.instance.delete(`/applications/${id}`),
    getForJob: (jobId: string) => this.instance.get(`/applications/job/${jobId}`),
  };

  // Profile endpoints
  profiles = {
    getJobSeeker: (userId: string) =>
      this.instance.get(`/profiles/job-seeker/${userId}`),
    updateJobSeeker: (data: any) =>
      this.instance.patch('/profiles/job-seeker', data),
    uploadResume: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return this.instance.post('/profiles/resume', formData);
    },
    getHR: (userId: string) => this.instance.get(`/profiles/hr/${userId}`),
    updateHR: (data: any) => this.instance.patch('/profiles/hr', data),
  };

  // Interview endpoints
  interviews = {
    schedule: (data: any) => this.instance.post('/interviews', data),
    list: () => this.instance.get('/interviews'),
    getById: (id: string) => this.instance.get(`/interviews/${id}`),
    updateStatus: (id: string, status: string) =>
      this.instance.patch(`/interviews/${id}/status`, { status }),
    submitFeedback: (id: string, feedback: any) =>
      this.instance.post(`/interviews/${id}/feedback`, feedback),
    cancel: (id: string, reason?: string) =>
      this.instance.delete(`/interviews/${id}`, { data: { reason } }),
  };

  // Bookmark endpoints
  bookmarks = {
    create: (jobId: string) => this.instance.post(`/bookmarks/jobs/${jobId}`),
    remove: (jobId: string) => this.instance.delete(`/bookmarks/jobs/${jobId}`),
    list: () => this.instance.get('/bookmarks'),
  };

  // Analytics endpoints
  analytics = {
    getDashboard: () => this.instance.get('/analytics/dashboard'),
    getJobMetrics: (jobId: string) => this.instance.get(`/analytics/job/${jobId}`),
  };
}

export const apiClient = new ApiClient();

// ============================================================================
// 3. STATE MANAGEMENT (ZUSTAND)
// ============================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Job Store - Manage jobs and filtering
 */
interface JobStoreState {
  jobs: any[];
  selectedJob: any | null;
  filters: Record<string, any>;
  isLoading: boolean;
  error: Error | null;
  // Actions
  setJobs: (jobs: any[]) => void;
  setSelectedJob: (job: any) => void;
  updateFilters: (filters: Record<string, any>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  fetchJobs: (filters?: any) => Promise<void>;
  searchJobs: (query: string) => Promise<void>;
}

export const useJobStore = create<JobStoreState>()(
  devtools(
    (set) => ({
      jobs: [],
      selectedJob: null,
      filters: {},
      isLoading: false,
      error: null,
      setJobs: (jobs) => set({ jobs }),
      setSelectedJob: (job) => set({ selectedJob: job }),
      updateFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      fetchJobs: async (filters) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.jobs.list(filters);
          set({ jobs: response.data.data, error: null });
        } catch (error) {
          set({ error: error as Error });
        } finally {
          set({ isLoading: false });
        }
      },
      searchJobs: async (query) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.jobs.search(query);
          set({ jobs: response.data.data, error: null });
        } catch (error) {
          set({ error: error as Error });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: 'job-store' }
  )
);

/**
 * Application Store - Manage applications
 */
interface ApplicationStoreState {
  applications: any[];
  selectedApplication: any | null;
  isLoading: boolean;
  error: Error | null;
  // Actions
  setApplications: (apps: any[]) => void;
  setSelectedApplication: (app: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  fetchApplications: () => Promise<void>;
  updateApplicationStatus: (id: string, status: string) => Promise<void>;
  createApplication: (jobId: string, data: any) => Promise<void>;
}

export const useApplicationStore = create<ApplicationStoreState>()(
  devtools(
    (set) => ({
      applications: [],
      selectedApplication: null,
      isLoading: false,
      error: null,
      setApplications: (applications) => set({ applications }),
      setSelectedApplication: (app) => set({ selectedApplication: app }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      fetchApplications: async () => {
        set({ isLoading: true });
        try {
          const response = await apiClient.applications.list();
          set({ applications: response.data.data, error: null });
        } catch (error) {
          set({ error: error as Error });
        } finally {
          set({ isLoading: false });
        }
      },
      updateApplicationStatus: async (id, status) => {
        try {
          await apiClient.applications.updateStatus(id, status);
          set((state) => ({
            applications: state.applications.map((app) =>
              app.id === id ? { ...app, status } : app
            ),
          }));
        } catch (error) {
          set({ error: error as Error });
        }
      },
      createApplication: async (jobId, data) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.applications.create({ jobId, ...data });
          set((state) => ({
            applications: [...state.applications, response.data.data],
            error: null,
          }));
        } catch (error) {
          set({ error: error as Error });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: 'application-store' }
  )
);

/**
 * UI Store - Global UI state
 */
interface UIStoreState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  // Actions
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIStoreState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'light' as const,
      notifications: [],
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    { name: 'ui-store' }
  )
);

// ============================================================================
// 4. EXPORT ALL
// ============================================================================

export default {
  hooks: {
    useAsync,
    useFetch,
    useDebounce,
    usePagination,
    useFormState,
    useLocalStorage,
    useIntersection,
    useNotification,
    useAuth,
  },
  services: {
    apiClient,
  },
  stores: {
    useJobStore,
    useApplicationStore,
    useUIStore,
  },
};
