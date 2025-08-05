import puppeteer, { Browser } from "puppeteer";

export async function fetchJobs(url: string): Promise<
  {
    title: string;
    company: string;
    closingDate: string;
  }[]
> {
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({
      width: 1080,
      height: 768,
    });

    page.setDefaultNavigationTimeout(2 * 60 * 1000);

    await page.goto(url);

    const jobs: {
      title: string;
      company: string;
      closingDate: string;
    }[] = [];

    page.waitForSelector(
      "div > div:nth-child(4) > div:nth-child(1) > div:nth-child(5)"
    );

    const jobElements = await page.$$(
      "div > div:nth-child(4) > div:nth-child(1) > div:nth-child(5)"
    );

    console.log("Job elements found:", jobElements.length);

    for (const el of jobElements) {
      const title =
        (await el.$eval("h4", (el) => el.textContent?.trim() || "")) ?? "";
      const company =
        (await el.$eval("h2", (el) => el.textContent?.trim() || "")) ?? "";
      const closingDate =
        (await el.$eval("p", (el) => el.textContent?.trim() || "")) ?? "";

      jobs.push({
        title,
        company,
        closingDate,
      });
    }
    console.log("Jobs fetched:", jobs.length);

    await browser.close();
    return Promise.resolve(jobs);
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    return Promise.reject(error);
  }
}
