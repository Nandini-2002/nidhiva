"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [display, setDisplay] = useState(children);
  const [animKey, setAnimKey] = useState(pathname);

  useEffect(() => {
    setDisplay(children);
    setAnimKey(pathname);
  }, [children, pathname]);

  return (
    <div key={animKey} className="page-enter">
      {display}
    </div>
  );
}
