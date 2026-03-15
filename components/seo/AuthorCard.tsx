export default function AuthorCard({ updated }: { updated: string }) {
  return (
    <div className="mt-10 rounded-xl border border-dt-border bg-dt-surface p-4">
      <p className="text-xs uppercase tracking-wider text-dt-text-dim">About the Author</p>
      <h3 className="text-lg font-semibold text-dt-text mt-2">Formatterjson.org Editorial Team</h3>
      <p className="text-sm text-dt-text-muted mt-1">
        We build and maintain formatterjson.org, a privacy-first suite of JSON, XML, YAML, and conversion tools used by
        developers and data teams. Our guides are based on real debugging workflows and tool usage patterns.
      </p>
      <p className="text-xs text-dt-text-dim mt-2">Last updated: {updated}</p>
    </div>
  );
}
