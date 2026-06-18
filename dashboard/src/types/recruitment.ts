export type CandidateStage = 'sourced' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
export type JobPostingStatus = 'open' | 'paused' | 'closed';

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  status: JobPostingStatus;
  postedDate: string;
  applicants: number;
  description: string;
  requirements: string[];
}

export interface Candidate {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  stage: CandidateStage;
  appliedDate: string;
  experience: number;
  skills: string[];
  source: 'linkedin' | 'website' | 'referral' | 'agency' | 'other';
  rating: number; // 1-5
  notes?: string;
}

export const CANDIDATE_STAGE_LABELS: Record<CandidateStage, { en: string; ar: string; color: string }> = {
  sourced: { en: 'Sourced', ar: 'جديد', color: '#06B6D4' },
  screening: { en: 'Screening', ar: 'فحص أولي', color: '#F59E0B' },
  interview: { en: 'Interview', ar: 'مقابلة', color: '#8B5CF6' },
  offer: { en: 'Offer', ar: 'عرض', color: '#10B981' },
  hired: { en: 'Hired', ar: 'تم التعيين', color: '#10B981' },
  rejected: { en: 'Rejected', ar: 'مرفوض', color: '#EF4444' },
};

export const SOURCE_LABELS: Record<Candidate['source'], { en: string; ar: string }> = {
  linkedin: { en: 'LinkedIn', ar: 'لينكدإن' },
  website: { en: 'Website', ar: 'الموقع' },
  referral: { en: 'Referral', ar: 'توصية' },
  agency: { en: 'Agency', ar: 'وكالة' },
  other: { en: 'Other', ar: 'أخرى' },
};