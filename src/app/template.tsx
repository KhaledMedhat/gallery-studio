"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
export default function Template({ children }: { children: React.ReactElement }) {

  const [displayChildren, setDisplayChildren] = useState(children);
  const container = useRef<HTMLDivElement>(null);
  useGSAP(async () => {
    if (children?.key !== displayChildren?.key) {
      await gsap.to(container?.current, { opacity: 0 }).then(() => {
        setDisplayChildren(children)
        window.scrollTo(0, 0)
        gsap.to(container?.current, { opacity: 1 })
      })
    }
  }, [children])

  useGSAP(() => {
    gsap.to(container?.current, { opacity: 1 })
  })
  return (
    <div ref={container} style={{ opacity: 0 }}>
      {displayChildren}
    </div>
  );
}
