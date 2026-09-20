export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="font-semibold text-2xl text-foreground tracking-tight">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 text-muted-foreground text-sm">{description}</p>
      ) : null}
    </div>
  );
}
