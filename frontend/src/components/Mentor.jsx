import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

function Mentor({ codeText }) {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.textContent = codeText;
      hljs.highlightElement(codeRef.current);
    }
  }, [codeText]);

  return (
    <pre>
      <code ref={codeRef} className="language-javascript" />
    </pre>
  );
}

export default Mentor;
