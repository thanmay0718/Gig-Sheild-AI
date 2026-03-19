import { Toaster, toast } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      theme="dark"
      position="top-right"
      toastOptions={{
        style: {
          background: "#111111",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.08)",
        },
      }}
    />
  );
}

export { toast };
