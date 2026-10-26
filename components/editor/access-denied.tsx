import Link from "next/link";
import { Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="flex h-screen items-center justify-center bg-base">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-elevated">
          <Lock className="h-8 w-8 text-copy-muted" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-copy-primary">Access Denied</h2>
          <p className="text-sm text-copy-muted">
            This project doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
        </div>
        <Link href="/editor" className={buttonVariants({ variant: "outline" })}>
          Back to Editor
        </Link>
      </div>
    </div>
  );
}
