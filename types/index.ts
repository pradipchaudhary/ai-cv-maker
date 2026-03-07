export interface PassportData {
  fullName: string;
  passportNumber: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  placeOfBirth: string;
  dateOfIssue: string;
  dateOfExpiry: string;
  issuingAuthority: string;
  placeOfIssue?: string;
  personalNumber?: string;
  type?: string;
  address?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  country: string;
}

export interface CVData extends PassportData {
  email: string;
  phone: string;
  address: string;
  applyingFor: string;
  educationLevel: string;
  experienceYears: string;
  experienceCountry: string;
  height: string;
  weight: string;
  languages: string;
  template: 'elegant' | 'professional' | 'classic';
  education: Education[];
  experiences: Experience[];
  profilePhoto?: string;
  passportImage?: string;
  certificates: { id: string; url: string; name: string }[];
}

export type AppStep = 'upload-passport' | 'extracting' | 'edit-data' | 'upload-docs' | 'preview';
