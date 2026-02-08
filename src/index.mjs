#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { evaluate, format } from "mathjs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

// Display precision for calculation results (significant figures for decimals)
const OUTPUT_PRECISION = 3;

// Calculator tool input schema
const CalculatorInputSchema = z.object({
  expression: z
    .string()
    .min(1, "Expression cannot be empty")
    .describe(
      "Mathematical expression to evaluate. Supports basic arithmetic, functions, units, and more."
    ),
});

/**
 * Execute calculation using mathjs and format the result.
 *
 * @param {string} expression - Raw mathematical expression.
 * @returns {string} - Success: "Result: <expression> = <value>". Failure: "Calculation failed: <error message>".
 */
function calculate(expression) {
  try {
    const cleanExpression = expression.trim();

    // Evaluate expression using mathjs
    const result = evaluate(cleanExpression);

    // Format result
    let displayValue;

    if (typeof result === "number") {
      // For numeric results, keep reasonable precision
      if (Number.isInteger(result)) {
        displayValue = result.toString();
      } else {
        displayValue = Number(result.toPrecision(OUTPUT_PRECISION)).toString();
      }
    } else if (typeof result === "object" && result !== null) {
      // For complex objects (matrices, complex numbers, etc.), use mathjs format
      displayValue = format(result, { precision: OUTPUT_PRECISION });
    } else {
      displayValue = String(result);
    }

    return `Result: ${cleanExpression} = ${displayValue}`;
  } catch (error) {
    // Use console.error for visibility in server logs
    // eslint-disable-next-line no-console
    console.error("Calculation failed:", error);
    const message =
      error instanceof Error ? error.message : String(error ?? "Unknown error");
    return `Calculation failed: ${message}`;
  }
}

// Initialize MCP server
const server = new McpServer({
  name: "calculator",
  version: pkg.version,
});

// Register calculator tool
server.registerTool(
  "calculator",
  {
    title: "calculator",
    description: "Execute mathematical calculations using mathjs.",
    inputSchema: CalculatorInputSchema,
  },
  async ({ expression }) => {
    const resultText = calculate(expression);

    return {
      content: [
        {
          type: "text",
          text: resultText,
        },
      ],
    };
  }
);

// Start server over stdio
const transport = new StdioServerTransport();
server.connect(transport).catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start calculator MCP server:", error);
  process.exit(1);
});

