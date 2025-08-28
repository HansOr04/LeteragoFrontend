export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  parentCategory?: string | Category;
  order: number;
  isActive: boolean;
  metadata: {
    tactics?: string[];
    platforms?: string[];
    killChainPhases?: string[];
  };
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
  subcategories?: Category[];
  techniquesCount?: number;
}

export interface Technique {
  _id: string;
  name: string;
  mitreid?: string;
  description: string;
  category: string | Category;
  fileLocation?: string;
  image?: string;
  tags: string[];
  platforms: Platform[];
  datasources: DataSource[];
  mitigation: {
    description: string;
    techniques?: string[];
  };
  detection: {
    description: string;
    queries?: DetectionQuery[];
  };
  references: Reference[];
  tactics: Tactic[];
  killChainPhases: KillChainPhase[];
  revisionHistory: RevisionHistory[];
  isActive: boolean;
  version: string;
  createdBy: string | User;
  lastModifiedBy?: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface DataSource {
  name: string;
  description?: string;
}

export interface DetectionQuery {
  platform: string;
  query: string;
  description?: string;
}

export interface Reference {
  name: string;
  url: string;
  description?: string;
}

export interface KillChainPhase {
  killChainName: string;
  phaseName: string;
}

export interface RevisionHistory {
  version: string;
  changes: string;
  changedBy: string | User;
  changedAt: string;
}

export type Platform = 
  | 'Windows' 
  | 'Linux' 
  | 'macOS' 
  | 'Android' 
  | 'iOS' 
  | 'Cloud' 
  | 'Network' 
  | 'Container';

export type Tactic = 
  | 'Reconnaissance'
  | 'Resource Development'
  | 'Initial Access'
  | 'Execution'
  | 'Persistence'
  | 'Privilege Escalation'
  | 'Defense Evasion'
  | 'Credential Access'
  | 'Discovery'
  | 'Lateral Movement'
  | 'Collection'
  | 'Command and Control'
  | 'Exfiltration'
  | 'Impact';

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
  details?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

export interface CategoriesResponse {
  categories: Category[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface TechniquesResponse {
  techniques: Technique[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters?: {
    search?: string;
    category?: string;
    platforms?: string[];
    tactics?: string[];
    tags?: string[];
  };
}

export interface HierarchyResponse {
  message: string;
  hierarchy: Category[];
}

export interface StatsResponse {
  stats: {
    totalTechniques: number;
    platformDistribution: Array<{ _id: string; count: number }>;
    tacticDistribution: Array<{ _id: string; count: number }>;
    categoryDistribution: Array<{ 
      _id: string; 
      categoryName: string; 
      count: number 
    }>;
    popularTags: Array<{ _id: string; count: number }>;
    recentActivity: Technique[];
  };
}