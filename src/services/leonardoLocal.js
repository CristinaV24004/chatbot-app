import scripts from "../data/leonardoScripts.json";

export function generateLocalReply(userText) {
  if (!userText || typeof userText !== "string") {
    return scripts.fallback;
  }

  const input = userText.toLowerCase();

  for (const topic of scripts.topics) {
    const { keywords, reply } = topic;

    const matches = keywords.some((keyword) => input.includes(keyword));

    if (matches) {
      return reply;
    }
  }

  return scripts.fallback;
}
