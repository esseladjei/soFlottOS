"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/layout/states";
import { useAppContent } from "@/i18n/locale-provider";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const t = useAppContent();

  return (
    <div className="space-y-4">
      <ErrorState message={error.message} />
      <Button onClick={reset}>{t.common.tryAgain}</Button>
    </div>
  );
}
