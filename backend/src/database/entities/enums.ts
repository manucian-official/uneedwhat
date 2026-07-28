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

export enum PlanTier {
  FREE = 'free',
  TEAM = 'team',
  PRO = 'pro',
  BUSINESS = 'business',
  VIP = 'vip',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum PaymentMethod {
  STRIPE_CARD = 'stripe_card',
  MOMO = 'momo',
  VNPAY = 'vnpay',
  BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  REFUNDED = 'refunded',
}

export enum OrgMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}
