export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  fromEmail?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
} 