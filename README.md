# MCP Technopark Job Search

A Model Context Protocol (MCP) server that provides job search functionality for Technopark (technopark.in). This server enables AI assistants to search and retrieve job listings from Technopark's job portal.

## Features

- 🔍 Search jobs by role/title keywords
- 📊 Retrieve job details including title, company, closing date, and posted date
- 🤖 MCP-compatible server for seamless integration with AI assistants
- 🕷️ Web scraping using Puppeteer for real-time data
- 📝 TypeScript implementation with type safety

## Installation

1. Clone the repository:

```bash
git clone https://github.com/vinothvino42/mcp-technopark-job-search.git
cd mcp-technopark-job-search
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

## Usage

### Development Mode

Run the server in development mode with hot reloading:

```bash
npm run dev
```

### Production Mode

Build and run the server:

```bash
npm run build
node build/index.js
```

### MCP Inspector

Debug and test the server using the MCP Inspector:

```bash
npm run inspect
```

## MCP Server Configuration

To use this server with an MCP-compatible client, add it to your MCP configuration:

```json
{
  "mcpServers": {
    "technopark-job-search": {
      "command": "node",
      "args": ["path/to/mcp-technopark-job-search/build/index.js"]
    }
  }
}
```

## Tools

The server provides the following tool:

### `technopark-job-search`

Search for jobs on Technopark by role or keyword.

**Parameters:**

- `role` (string, required): The job role or keyword to search for

**Response format:**

```json
[
  {
    "title": "Software Engineer",
    "company": "TechCorp Solutions",
    "closingDate": "2025-08-15",
    "postedDate": "2025-07-20"
  }
]
```

## License

This project is licensed under the ISC License.

## Author

**Vinoth**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
