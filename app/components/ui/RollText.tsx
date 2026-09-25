/* Hover text-roll: the label slides up and an identical copy rolls in from
   below. Triggered by hovering the nearest parent <a> or <button>. */
export default function RollText({ children }: { children: string }) {
  return (
    <span className="roll">
      <span data-text={children}>{children}</span>
    </span>
  );
}
