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

import dotenv from 'dotenv';
import { app } from './app';

dotenv.config();

const PORT = parseInt(process.env.STATEMENT_ANALYSIS_SERVICE_PORT || '3005', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[STATEMENT] Statement Analysis Service running on port ${PORT}`);
});
