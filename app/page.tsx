import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// JSON 불러오기
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

// github URL에서 사용자명 추출 (예: https://github.com/Mimjae98 -> Mimjae98)
function extractGithubId(github?: string) {
  if (!github) return "";
  try {
    const u = new URL(github);
    // "/Mimjae98" -> "Mimjae98"
    return u.pathname.replace(/^\//, "");
  } catch {
    // URL이 아닐 때 대비: 마지막 슬래시 이후
    return github.split("/").filter(Boolean).pop() ?? github;
  }
}

export default async function Home() {
  const data = await getResumeInfo();

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
              {name}
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
          <li>테스트 할 수 없는 건 만들 수 없다</li>
          <li>제가 진행한 프로젝트는 곧 추가 예정입니다.</li>
        </ol>
      </main>
    </div>
  );
}
