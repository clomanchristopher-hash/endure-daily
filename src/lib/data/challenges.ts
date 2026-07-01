// General "life" challenges for the Home screen — distinct from the devotion's
// leisure/athlete movement challenge. Rotates deterministically day to day.
export const dailyChallenges: string[] = [
  "Encourage one person today.",
  "Send a text to someone you've been meaning to check on.",
  "Thank God out loud for three specific things.",
  "Do one act of kindness with no expectation of return.",
  "Pray for someone who has wronged you.",
  "Put your phone away and be fully present with someone.",
  "Speak life over yourself instead of criticism today.",
  "Forgive someone — even if only in your own heart.",
  "Serve your family or a friend without being asked.",
  "Memorize one short verse and carry it through your day.",
];

export function getChallengeForDate(date: Date, list: string[] = dailyChallenges): string {
  const start = Date.UTC(2026, 0, 1);
  const day = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) / 86400000
  );
  const index = ((day % list.length) + list.length) % list.length;
  return list[index];
}
