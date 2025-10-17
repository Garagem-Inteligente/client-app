// Auth Types
export interface User {
  id: string
  email: string
  name: string
  type: 'client' | 'workshop'
  createdAt: Date
  updatedAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  type: 'client' | 'workshop'
}

// Vehicle Types
export type VehicleType = 'car' | 'motorcycle' | 'van' | 'truck' | 'bus' | 'pickup'
export type FuelType = 'flex' | 'gasoline' | 'ethanol' | 'diesel' | 'electric' | 'hybrid-plugin' | 'hybrid-mild' | 'gnv'

// Maintenance Types
export type MaintenanceType =
  | 'oil_change'
  | 'oil_filter'
  | 'air_filter'
  | 'fuel_filter'
  | 'cabin_filter'
  | 'tire_rotation'
  | 'tire_replacement'
  | 'wheel_alignment'
  | 'wheel_balancing'
  | 'brake_pads'
  | 'brake_discs'
  | 'brake_fluid'
  | 'battery'
  | 'spark_plugs'
  | 'timing_belt'
  | 'serpentine_belt'
  | 'coolant'
  | 'transmission_fluid'
  | 'power_steering_fluid'
  | 'windshield_wipers'
  | 'air_conditioning'
  | 'suspension'
  | 'exhaust_system'
  | 'general_inspection'
  | 'other'

// API Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'maintenance' | 'transfer' | 'order' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: Date
  data?: Record<string, any>
}

// Transfer Types
export interface Transfer {
  id: string
  vehicleId: string
  fromUserId: string
  toEmail: string
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  message?: string
  createdAt: Date
  updatedAt: Date
}

// Order/Service Types
export interface ServiceOrder {
  id: string
  vehicleId: string
  workshopId: string
  userId: string
  type: 'maintenance' | 'repair' | 'inspection'
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  description: string
  scheduledDate: Date
  completedDate?: Date
  estimatedCost?: number
  finalCost?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Form Types
export interface FormError {
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: FormError[]
}

// File Types
export interface FileData {
  name: string
  type: string
  size: number
  data: string // Base64
  url?: string
}

// Chart Data Types
export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface TimeSeriesDataPoint {
  date: Date
  value: number
  label?: string
}

// Filter Types
export interface FilterOption {
  label: string
  value: string | number
  count?: number
}

export interface SortOption {
  label: string
  value: string
  direction: 'asc' | 'desc'
}

// Search Types
export interface SearchParams {
  query?: string
  filters?: Record<string, any>
  sort?: SortOption
  page?: number
  pageSize?: number
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  value?: string | number
  error?: string
  disabled?: boolean
  required?: boolean
}

export interface SelectProps {
  label?: string
  placeholder?: string
  options: Array<{ value: string | number; label: string }>
  value?: string | number
  error?: string
  disabled?: boolean
  required?: boolean
  searchable?: boolean
}

// State Types
export interface LoadingState {
  isLoading: boolean
  message?: string
}

export interface ErrorState {
  hasError: boolean
  message?: string
  code?: string
}

// Navigation Types
export interface RouteParams {
  [key: string]: string | number | undefined
}

export interface RouteQuery {
  [key: string]: string | string[] | undefined
}

// Storage Keys
export enum StorageKeys {
  USER = 'user',
  TOKEN = 'token',
  THEME = 'theme',
  LANGUAGE = 'language',
  SETTINGS = 'settings'
}

// Event Types
export interface CustomEvent<T = any> {
  type: string
  data: T
  timestamp: Date
}

// Utility Types
export type Optional<T> = T | undefined
export type Nullable<T> = T | null
export type ID = string | number

// Response Status
export type ResponseStatus = 'idle' | 'loading' | 'success' | 'error'

// Date Range
export interface DateRange {
  start: Date
  end: Date
}

// Color Variants
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark'

// Size Variants
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Position Types
export type Position = 'top' | 'right' | 'bottom' | 'left'
export type Alignment = 'start' | 'center' | 'end'

// Theme Types
export type Theme = 'light' | 'dark' | 'auto'

// Language Types
export type Language = 'pt-BR' | 'en-US' | 'es-ES'

