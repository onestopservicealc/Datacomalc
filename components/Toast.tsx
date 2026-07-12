"use client";

import { useCallback, useRef, useState } from "react";

export type ToastState = { msg: string; danger?: boolean } | null;

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((msg: string, danger?: boolean) => {
    setToast({ msg, danger });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  return { toast, show };
}

export function Toast({ toast }: { toast: ToastState }) {
  return (
    <div className={`toast${toast ? " show" : ""}`}>
      {toast && (
        <>
          <i className={`ti ti-${toast.danger ? "alert-circle" : "check"}`}></i>{" "}
          {toast.msg}
        </>
      )}
    </div>
  );
}
