export function formatKoreanDate(dateStr: string): string {
  // "YYYY-MM-DD T HH:mm:ss"로 들어옴을 가정
  const pattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/;
  const match = dateStr.match(pattern);
  if (!match) return dateStr; // 형식이 다르면 그냥 원본 반환

  const [, year, month, day, hour, minute] = match;
  // parseInt로 불필요한 0 제거
  return `${parseInt(year)}년 ${parseInt(month)}월 ${parseInt(day)}일 ${parseInt(hour)}시 ${parseInt(minute)}분`;
}
