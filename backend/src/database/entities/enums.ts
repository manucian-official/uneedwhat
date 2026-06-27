export enum UserRole {
  JOB_SEEKER = 'job_seeker',
  HR_PROFESSIONAL = 'hr_professional',
  RECRUITER = 'recruiter',
  ADMIN = 'admin',
}

export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  SCREENING = 'screening',
  SHORTLISTED = 'shortlisted',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export enum JobStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}

export enum InterviewType {
  PHONE = 'phone',
  VIDEO = 'video',
  IN_PERSON = 'in-person',
  PANEL = 'panel',
}
