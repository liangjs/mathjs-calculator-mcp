# Mathjs Calculator MCP

A simple **MCP (Model Context Protocol)** server that evaluates math expressions, using [mathjs](https://mathjs.org/index.html) as the calculator backend.

## What it does

- Exposes an MCP tool named **`calculator`**
- Accepts a single input: **`expression`** (string)
- Returns a formatted text result

## Quick Start with npx

You can run this MCP server directly without installation using npx:

```bash
npx @liangjs/mathjs-calculator-mcp
```

This is useful for quickly testing or using the calculator MCP in your MCP client configuration.

## Install

```bash
yarn install
```

## Run

```bash
yarn run start
```

The server runs over **stdio**, so it's meant to be launched by an MCP-capable client/host.

## Configuration

To use this MCP server in your MCP client (e.g., Claude Desktop), add it to your configuration file:

```json
{
  "mcpServers": {
    "calculator": {
      "command": "npx",
      "args": ["@liangjs/mathjs-calculator-mcp"]
    }
  }
}
```

## Examples

Try expressions like:

- `1 + 2 * 3`
- `sqrt(2)`
- `sin(pi / 4)`
- `2 cm + 3 mm`
