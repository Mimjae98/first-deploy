// app/page.tsx
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// 기본 이력 JSON
async function getResumeInfo() {
  const url =
    "https://raw.githubusercontent.com/Mimjae98/first-deploy/0.3/resume/service/resume_general_info_service.json";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch resume info");
  return res.json() as Promise<{ name?: string; github?: string; intro?: string }>;
}

// 포트폴리오 JSON
async function getPortfolioInfo() {
  const url =
    "https://raw.githubusercontent.com/Mimjae98/first-deploy/main/service/resume_portfolio_service.json";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch portfolio info");
  return res.json() as Promise<{
    project_name?: string;
    project_introduction?: string;
    project_github_url?: string;
  }>;
}

// github URL에서 사용자명만 뽑기
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
  const [resume, portfolio] = await Promise.all([getResumeInfo(), getPortfolioInfo()]);

  const name = resume.name ?? "";
  const githubUrl = resume.github ?? "";
  const githubId = extractGithubId(githubUrl);
  const intro = resume.intro ?? "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 font-sans">
      {/* 동그란 증명사진 (public/me.jpg) */}
      <Image
        src="/me.jpg"
        alt="증명사진"
        width={220}
        height={220}
        className="rounded-full object-cover shadow-lg"
        priority
      />

      {/* 소개 섹션 */}
      <div className="mt-8 text-center space-y-3 text-base sm:text-lg leading-relaxed">
        <p>
          안녕하세요 <span className="font-bold">김민재</span> 입니다.
        </p>
        <p>
          github 닉네임은 <span className="font-mono font-semibold">{name}</span> 입니다.
        </p>
        <p>
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
        </p>
        <p>{intro}</p>
      </div>

      {/* 구분선 */}
      <div className="h-px w-40 my-6 bg-white/20 dark:bg-white/20" />

      {/* 프로젝트 섹션 */}
      <div className="text-center space-y-3 text-base sm:text-lg leading-relaxed">
        <p>
          프로젝트 이름:{" "}
          <span className="font-mono font-semibold">
            {portfolio.project_name}
          </span>
        </p>
        <p>프로젝트 소개: {portfolio.project_introduction}</p>
        <p>
          프로젝트 깃허브:{" "}
          <a
            href={portfolio.project_github_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 underline underline-offset-4 break-all"
          >
            {portfolio.project_github_url}
          </a>
        </p>
      </div>
    </div>
  );
}
