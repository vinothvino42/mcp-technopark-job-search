import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { fetchJobs } from "./job-scraper";
import { Job } from "./types/job";
import { z } from "zod";

const server = new Server(
  {
    name: "Technopark Job Search",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {
        callSchema: CallToolRequestSchema,
      },
    },
  }
);

const TECHNOPARK_BASE_URL = "https://technopark.in";

const JobSearchSchema = z.object({
  role: z.string({
    required_error: "Role is required",
    description: "Search query for job titles",
  }),
});

type JobSearchInput = z.infer<typeof JobSearchSchema>;

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

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "technopark-job-search",
        description: "Search for jobs by title or keyword",
        inputSchema: {
          type: "object",
          properties: {
            role: {
              type: "string",
              description: "Search role",
            },
          },
          required: ["role"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request, _extra) => {
  try {
    switch (request.params.name) {
      case "technopark-job-search": {
        const role = request.params.arguments?.role as string;
        const jobs: Job[] = await jobSearch("/job-search", {
          search: role,
        });
        const jobsData = JSON.stringify(jobs, null, 2);
        return {
          content: [
            {
              type: "text",
              text: jobsData,
              mimeType: "application/json",
            },
          ],
        };
      }
      default:
        throw new Error("Tool not found");
    }
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
});

async function main() {
  const transport = new StdioServerTransport();
  server.connect(transport).catch((error) => {
    console.error("Server connection error:", error);
    process.exit(1);
  });
}

main();
