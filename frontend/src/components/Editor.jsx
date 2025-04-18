import React from "react";

function Editor(props) {
  const { codeText, setCodeText } = props;

  function updateCodeText(event) {
    setCodeText(event.target.value);
  }
  return (
    <div>
      <textarea value={codeText} onChange={updateCodeText} />
    </div>
  );
}

export default Editor;
