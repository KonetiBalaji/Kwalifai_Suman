/**
 * @file calculatorService.ts
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

import { prisma, CalculatorType } from '@mortgage-platform/db';
import { calculateMortgage, calculateAffordability } from '../utils/calculator';
import {
  MortgageCalculateInput,
  AffordabilityCalculateInput,
  SaveScenarioInput,
} from '../validators/calculator';

/**
 * Calculate mortgage payment
 */
export async function calculateMortgagePayment(inputs: MortgageCalculateInput) {
  const results = calculateMortgage(inputs);
  return {
    success: true,
    results,
  };
}

/**
 * Calculate affordability
 */
export async function calculateAffordabilityAmount(inputs: AffordabilityCalculateInput) {
  const results = calculateAffordability(
    inputs.monthlyIncome,
    inputs.monthlyDebts,
    inputs.interestRate,
    inputs.loanTerm,
    inputs.downPaymentPercent
  );
  return {
    success: true,
    results,
  };
}

/**
 * Save calculator scenario
 */
export async function saveScenario(userId: string, input: SaveScenarioInput) {
  const scenario = await prisma.calculatorScenario.create({
    data: {
      userId,
      type: input.type as CalculatorType,
      name: input.name || null,
      inputs: input.inputs,
      results: input.results,
    },
  });

  return {
    success: true,
    scenario: {
      id: scenario.id,
      type: scenario.type,
      name: scenario.name,
      inputs: scenario.inputs,
      results: scenario.results,
      createdAt: scenario.createdAt,
      updatedAt: scenario.updatedAt,
    },
  };
}

/**
 * Get user's saved scenarios
 */
export async function getScenarios(userId: string, type?: CalculatorType) {
  const scenarios = await prisma.calculatorScenario.findMany({
    where: {
      userId,
      ...(type ? { type } : {}),
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      type: true,
      name: true,
      inputs: true,
      results: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    success: true,
    scenarios,
  };
}

/**
 * Get scenario by ID
 */
export async function getScenarioById(userId: string, scenarioId: string) {
  const scenario = await prisma.calculatorScenario.findFirst({
    where: {
      id: scenarioId,
      userId,
    },
  });

  if (!scenario) {
    return {
      success: false,
      message: 'Scenario not found',
    };
  }

  return {
    success: true,
    scenario: {
      id: scenario.id,
      type: scenario.type,
      name: scenario.name,
      inputs: scenario.inputs,
      results: scenario.results,
      createdAt: scenario.createdAt,
      updatedAt: scenario.updatedAt,
    },
  };
}

/**
 * Delete scenario
 */
export async function deleteScenario(userId: string, scenarioId: string) {
  const scenario = await prisma.calculatorScenario.findFirst({
    where: {
      id: scenarioId,
      userId,
    },
  });

  if (!scenario) {
    return {
      success: false,
      message: 'Scenario not found',
    };
  }

  await prisma.calculatorScenario.delete({
    where: { id: scenarioId },
  });

  return {
    success: true,
    message: 'Scenario deleted successfully',
  };
}
