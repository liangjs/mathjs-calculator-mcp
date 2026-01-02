# Mathjs Calculator MCP

A simple **MCP (Model Context Protocol)** server that evaluates math expressions, using [mathjs](https://mathjs.org/index.html) as the calculator backend.

## What it does

- Exposes an MCP tool named **`calculator`**
- Accepts a single input: **`expression`** (string)
- Returns a formatted text result

## Install

```bash
yarn install
```

## Run

```bash
yarn run start
```

The server runs over **stdio**, so it’s meant to be launched by an MCP-capable client/host.

## Examples

Try expressions like:

- `1 + 2 * 3`
- `sqrt(2)`
- `sin(pi / 4)`
- `2 cm + 3 mm`
