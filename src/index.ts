import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { fetchJobs } from "./job-scraper";
import { Job } from "./types/job";
import { z } from "zod";

const server = new McpServer({
  name: "mcp-technopark-job-search",
  version: "1.0.0",
});

const TECHNOPARK_BASE_URL = "https://technopark.in";

async function jobSearch(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<Job[]> {
  const url = new URL(`${TECHNOPARK_BASE_URL}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  console.log(`URL : ${url.toString()}`);

  try {
    const jobs: Job[] = await fetchJobs(url.toString());
    return Promise.resolve(jobs);
  } catch (error) {
    return Promise.reject();
  }
}

server.tool(
  "job-search",
  "Search for jobs by title or keyword",
  {
    role: z.string().describe("Enter a job title to search relevant listings"),
  },
  async ({ role }) => {
    try {
      const jobs: Job[] = await jobSearch("/job-search", {
        search: role,
      });

      if (jobs.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `Jobs not found for ${role}.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(jobs, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : "Something went wrong"
            }`,
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  server.connect(transport).catch((error) => {
    console.error("Server connection error:", error);
    process.exit(1);
  });
}

main();
