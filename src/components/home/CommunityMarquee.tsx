const items = [
  "Palm Jumeirah",
  "Downtown Dubai",
  "Dubai Marina",
  "JBR",
  "Emirates Hills",
  "Dubai Hills",
  "Arabian Ranches",
  "DIFC",
  "Business Bay",
  "Bluewaters",
  "Al Barari",
  "JLT",
];

export function CommunityMarquee() {
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {row.map((name, index) => (
          <span key={`${name}-${index}`}>
            <b>✦</b> {name}
          </span>
        ))}
      </div>
    </div>
  );
}
