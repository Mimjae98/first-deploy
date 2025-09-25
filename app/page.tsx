import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// 기본 이력 JSON
async function getResumeInfo() {
  const url =
    "https://raw.githubusercontent.com/Mimjae98/first-deploy/0.3/resume/service/resume_general_info_service.json";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error("fetch failed:", res.status, res.statusText);
    throw new Error("Failed to fetch data");
  }
  return res.json() as Promise<{
    name?: string;
    github?: string;
    intro?: string;
  }>;
}

// 포트폴리오 JSON
async function getPortfolioInfo() {
  const url =
    "https://raw.githubusercontent.com/Mimjae98/first-deploy/refs/heads/main/service/resume_portfolio_service.json";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error("fetch failed:", res.status, res.statusText);
    throw new Error("Failed to fetch portfolio data");
  }
  return res.json() as Promise<{
    project_name?: string;
    project_introduction?: string;
    project_github_url?: string;
  }>;
}

// github URL에서 사용자명 추출
function extractGithubId(github?: string) {
  if (!github) return "";
  try {
    const u = new URL(github);
    return u.pathname.replace(/^\//, "");
  } catch {
    return github.split("/").filter(Boolean).pop() ?? github;
  }
}

export default async function Home() {
  const data = await getResumeInfo();
  const portfolio = await getPortfolioInfo();

  const name = data.name ?? "";
  const githubUrl = data.github ?? "";
  const githubId = extractGithubId(githubUrl);
  const intro = data.intro ?? "";

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image src="/karina.png" alt="karina" width={260} height={340} priority />

        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left space-y-2">
          <li>
            안녕하세요{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              김민재
            </code>{" "}
            입니다.
          </li>
          <li>
            github 닉네임은{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              {name}
            </code>{" "}
            입니다.
          </li>
          <li>
            github 아이디는{" "}
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              {githubId}
            </a>{" "}
            입니다.
          </li>
          <li>{intro}</li>
          {/* 기존 5,6 삭제 → 포트폴리오 추가 */}
          <li>
            프로젝트 이름:{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              {portfolio.project_name}
            </code>
          </li>
          <li>
            프로젝트 소개:{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              {portfolio.project_introduction}
            </code>
          </li>
          <li>
            프로젝트 깃허브:{" "}
            <a
              href={portfolio.project_github_url}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 text-blue-500"
            >
              {portfolio.project_github_url}
            </a>
          </li>
        </ol>
      </main>
    </div>
  );
}
