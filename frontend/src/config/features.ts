/**
 * @file features.ts
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

/**
 * Feature flags for development
 * Set to false to disable features that are still in development
 */

export const FEATURES = {
  /**
   * Require authentication for navbar items
   * When true: unauthenticated users clicking navbar items will be redirected to login/register
   * When false: navbar items work normally without authentication
   */
  REQUIRE_AUTH_FOR_NAVBAR: false,
  /* set to true before production */
} as const;
