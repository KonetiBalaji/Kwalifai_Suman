/**
 * @file index.ts
 * @author Balaji Koneti
 * @linkedin https://www.linkedin.com/in/balaji-koneti/
 * @github https://github.com/KonetiBalaji/kwalifai
 * 
 * Copyright (C) 2026 Balaji Koneti
 * All Rights Reserved.
 * 
 * This software is proprietary and confidential.
 * Unauthorized copying, modification, distribution, or use is prohibited.
 */

// Placeholder types - will be expanded in next phase
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface RateAlert {
  id: string;
  email: string;
  loanType: string;
  targetRate: number;
  status: 'active' | 'triggered' | 'inactive';
}
