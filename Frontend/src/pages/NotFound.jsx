import { Link } from "react-router-dom";

import Panel from "@/components/Panel";
import Button from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="app-shell flex items-center justify-center px-6">
      <Panel className="w-full max-w-lg p-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">This page does not exist</h1>
        <p className="mt-4 text-zinc-400">The route may have changed. Head back to the main flow.</p>
        <Link to="/" className="mt-8 inline-block">
          <Button variant="primary">Return home</Button>
        </Link>
      </Panel>
    </div>
  );
}
