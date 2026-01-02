import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { evaluate, format } from "mathjs";

// Calculator tool input schema
const CalculatorInputSchema = z.object({
  expression: z
    .string()
    .min(1, "计算表达式不能为空")
    .describe(
      "Mathematical expression to evaluate. Supports basic arithmetic, functions, units, and more."
    ),
});

/**
 * Execute calculation using mathjs and format the result.
 *
 * @param {string} expression - Raw mathematical expression.
 * @returns {string} - Human readable calculation result.
 */
function calculate(expression) {
  try {
    const cleanExpression = expression.trim();

    if (!cleanExpression) {
      throw new Error("计算表达式不能为空");
    }

    // Evaluate expression using mathjs
    const result = evaluate(cleanExpression);

    // Format result
    let formattedResult;

    if (typeof result === "number") {
      // For numeric results, keep reasonable precision
      if (Number.isInteger(result)) {
        formattedResult = result.toString();
      } else {
        formattedResult = Number(result.toPrecision(3)).toString();
      }
    } else if (typeof result === "object" && result !== null) {
      // For complex objects (matrices, complex numbers, etc.), use mathjs format
      formattedResult = format(result, { precision: 3 });
    } else {
      formattedResult = String(result);
    }

    return `计算结果: ${cleanExpression} = ${formattedResult}`;
  } catch (error) {
    // Use console.error for visibility in server logs
    // eslint-disable-next-line no-console
    console.error("Calculation failed:", error);
    const message =
      error instanceof Error ? error.message : String(error ?? "Unknown error");
    return `计算失败: ${message}`;
  }
}

// Initialize MCP server
const server = new McpServer({
  name: "calculator",
  version: "1.0.0",
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

