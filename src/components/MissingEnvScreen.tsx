import { AlertCircle } from "lucide-react";

export const MissingEnvScreen = ({ missing }: { missing: string[] }) => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Configuration Required</h1>
        <p className="mb-8 max-w-[600px] text-muted-foreground">
            The application has been deployed successfully, but it requires some environment variables to function correctly.
        </p>

        <div className="mx-auto w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 font-semibold">Missing Variables</h2>
            <ul className="space-y-3 text-left">
                {missing.map((env) => (
                    <li key={env} className="flex items-center gap-3 rounded-md border bg-muted/50 p-2 text-sm font-mono text-foreground">
                        <span className="h-2 w-2 rounded-full bg-destructive"></span>
                        {env}
                    </li>
                ))}
            </ul>
        </div>

        <div className="mt-8 space-y-4">
            <div className="rounded-lg bg-blue-500/10 p-4 text-sm text-blue-600 dark:text-blue-400">
                <p className="font-semibold">How to fix this in Netlify:</p>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-left">
                    <li>Go to your <strong>Netlify Dashboard</strong></li>
                    <li>Navigate to <strong>Site Configuration &gt; Environment variables</strong></li>
                    <li>Add the variables listed above</li>
                    <li>Go to <strong>Deploys</strong> and click <strong>Trigger deploy</strong></li>
                </ol>
            </div>
        </div>
    </div>
);
