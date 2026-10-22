import Link from "next/link";
import RollText from "./components/ui/RollText";
import PageShell from "./components/ui/PageShell";

/*
 * 404, in the floor's language: a task set off across the modules and never landed.
 * A short trail of lit tiles runs to an empty slot where the page should have been.
 */
const COLS = 9;
const TRAIL = [10, 11, 12, 21, 30, 31]; // the route the task took; it stops one short of 32
const HOLE = 32;

export default function NotFound() {
  return (
    <PageShell>
      <div className="nf">
        <div className="nf-floor" aria-hidden>
          {Array.from({ length: COLS * 5 }, (_, i) => {
            const step = TRAIL.indexOf(i);
            return <i key={i} className={i === HOLE ? "hole" : step >= 0 ? "lit" : undefined} style={step >= 0 ? { animationDelay: `${step * 0.18}s` } : undefined} />;
          })}
        </div>

        <p className="nf-meta">Error 404 · route not found</p>
        <h1 className="nf-title">
          This task never <em>landed.</em>
        </h1>
        <p className="nf-copy">There is no page at this address. It may have moved, or the link was mistyped.</p>
        <div className="nf-actions">
          <Link href="/" className="btn-primary" data-cursor-hover>
            <RollText>Back to Orvantia</RollText>
          </Link>
          <Link href="/#contact" className="btn-secondary" data-cursor-hover>
            <RollText>Start a project</RollText>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
