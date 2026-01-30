/**
 * @file statementService.ts
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

import { PrismaClient, StatementStatus, StatementSource, AnalysisVersion } from '@mortgage-platform/db';
import { StatementAnalysisResult, getAnalysisEngine } from './analysisEngine';
import { StoredFile } from './fileStorage';

const prisma = new PrismaClient();

export interface CreateStatementInput {
  sessionId?: string;
  userId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  brokerId?: string;
  loanOfficerId?: string;
  idempotencyKey?: string;
  // Form data
  currentBalance?: string;
  currentRate?: string;
  monthlyPayment?: string;
  propertyAddress?: string;
  lenderName?: string;
  escrowBalance?: string;
  loanNumber?: string;
  nextPaymentDate?: string;
  // File data
  file?: StoredFile;
}

export interface StatementResponse {
  success: boolean;
  statementId: string;
  message: string;
  analysis: StatementAnalysisResult;
  file: {
    filename: string;
    originalName: string;
    size: number;
  } | null;
}

/**
 * Statement Service
 * Handles all database operations for statements
 */
export class StatementService {
  /**
   * Create a new statement with analysis
   * Matches legacy response format exactly
   */
  async createStatement(input: CreateStatementInput): Promise<StatementResponse> {
    // Check idempotency if key provided
    if (input.idempotencyKey) {
      const existing = await prisma.statement.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
        include: {
          files: true,
          analyses: { where: { isActive: true }, take: 1 },
        },
      });

      if (existing && existing.analyses.length > 0) {
        const analysis = existing.analyses[0].results as StatementAnalysisResult;
        return {
          success: true,
          statementId: existing.id,
          message: 'Statement analyzed successfully',
          analysis,
          file: existing.files.length > 0
            ? {
                filename: existing.files[0].filename,
                originalName: existing.files[0].originalName,
                size: existing.files[0].size,
              }
            : null,
        };
      }
    }

    // Create statement
    const statement = await prisma.statement.create({
      data: {
        userId: input.userId || null,
        sessionId: input.sessionId || null,
        status: StatementStatus.UPLOADED,
        source: StatementSource.MANUAL,
        customerName: input.customerName || null,
        customerEmail: input.customerEmail || null,
        customerPhone: input.customerPhone || null,
        brokerId: input.brokerId || null,
        loanOfficerId: input.loanOfficerId || null,
        idempotencyKey: input.idempotencyKey || null,
        files: input.file
          ? {
              create: {
                filename: input.file.filename,
                originalName: input.file.originalName,
                path: input.file.path,
                size: input.file.size,
                mimetype: input.file.mimetype,
                storageType: 'local',
              },
            }
          : undefined,
      },
    });

    // Run analysis
    const engine = getAnalysisEngine('V1');
    const analysisResult = engine.analyze({
      currentBalance: input.currentBalance,
      currentRate: input.currentRate,
      monthlyPayment: input.monthlyPayment,
      propertyAddress: input.propertyAddress,
      lenderName: input.lenderName,
      escrowBalance: input.escrowBalance,
      loanNumber: input.loanNumber,
      nextPaymentDate: input.nextPaymentDate,
    });

    // Save analysis
    await prisma.statementAnalysis.create({
      data: {
        statementId: statement.id,
        version: AnalysisVersion.V1,
        currentBalance: analysisResult.currentLoanBalance,
        currentRate: analysisResult.currentInterestRate,
        monthlyPayment: analysisResult.currentMonthlyPayment,
        propertyAddress: analysisResult.propertyAddress,
        lenderName: analysisResult.lenderName,
        escrowBalance: analysisResult.escrowBalance,
        loanNumber: analysisResult.loanNumber,
        nextPaymentDate: analysisResult.nextPaymentDate,
        results: analysisResult as any, // Prisma Json type
        isActive: true,
      },
    });

    // Update statement status
    await prisma.statement.update({
      where: { id: statement.id },
      data: { status: StatementStatus.ANALYZED },
    });

    // Fetch file info if exists
    const fileInfo = input.file
      ? {
          filename: input.file.filename,
          originalName: input.file.originalName,
          size: input.file.size,
        }
      : null;

    return {
      success: true,
      statementId: statement.id,
      message: 'Statement analyzed successfully',
      analysis: analysisResult,
      file: fileInfo,
    };
  }

  /**
   * Get statement by ID
   * Matches legacy response format
   */
  async getStatementById(statementId: string): Promise<any> {
    const statement = await prisma.statement.findUnique({
      where: { id: statementId },
      include: {
        files: true,
        analyses: { where: { isActive: true }, take: 1, orderBy: { analyzedAt: 'desc' } },
      },
    });

    if (!statement) {
      return null;
    }

    // Transform to legacy format
    const analysis = statement.analyses[0]?.results as StatementAnalysisResult | undefined;
    const file = statement.files[0];

    return {
      id: statement.id,
      uploadedAt: statement.createdAt.toISOString(),
      sessionId: statement.sessionId,
      customerInfo: {
        name: statement.customerName || 'Not provided',
        email: statement.customerEmail || 'Not provided',
        phone: statement.customerPhone || 'Not provided',
      },
      status: statement.status.toLowerCase(),
      analyzed: analysis !== undefined,
      formData: analysis
        ? {
            currentBalance: analysis.currentLoanBalance,
            currentRate: analysis.currentInterestRate,
            monthlyPayment: analysis.currentMonthlyPayment,
            propertyAddress: analysis.propertyAddress,
            lenderName: analysis.lenderName,
            escrowBalance: analysis.escrowBalance,
            loanNumber: analysis.loanNumber,
            nextPaymentDate: analysis.nextPaymentDate,
          }
        : {},
      analysis: analysis || null,
      ...(file && {
        filename: file.filename,
        originalName: file.originalName,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
      }),
    };
  }
}

export const statementService = new StatementService();
