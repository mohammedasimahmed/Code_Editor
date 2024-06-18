"use client";
import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = () => {
  const editorRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const [output, setOutput] = useState<string>("");

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };
  const handleInputDidMount = (editor: any, monaco: any) => {
    inputRef.current = editor;
  };

  const runProgram = async () => {
    if (editorRef.current) {
      setOutput("Loading...");
      const program = editorRef.current?.getValue();
      const input = inputRef.current?.getValue();
      console.log(program);
      let resp = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ code: program, input: input }),
      });

      let output = (await resp.json()).output;
      // document.getElementById("output")?.textContent=output
      console.log(output);
      setOutput(output);
    }
  };

  return (
    <div>
      <div className="text-center text-2xl bg-gray-900 text-white p-2">
        Neon Code
      </div>
      <div className="flex">
        <div
          style={{
            borderRight: "0.1px solid white",
            borderBottom: "0.1px solid white",
          }}
        >
          <div className="flex-1 text-center text-lg bg-green-900 text-white">
            Code
          </div>
          <Editor
            height="84vh"
            width="50vw"
            defaultLanguage="cpp"
            defaultValue="// some comment"
            theme="vs-dark"
            onMount={handleEditorDidMount}
          />
        </div>
        <div>
          <div className="flex-1 text-center bg-purple-900 text-lg text-white">
            Input
          </div>
          <Editor
            height="33vh"
            width="50vw"
            defaultLanguage="cpp"
            theme="vs-dark"
            onMount={handleInputDidMount}
          />
          <div className="text-center bg-green-900 text-white text-lg">
            Code
          </div>
          <Editor
            height="47.3vh"
            width="50vw"
            defaultLanguage="cpp"
            theme="vs-dark"
            value={output}
            options={{ readOnly: true }}
          />
          {/* <div
            style={{ backgroundColor: "#1e1e1e" }}
            className="w-[50vw] h-[50vh] p-2 text-white whitespace-pre"
          >
            {output}
          </div> */}
        </div>
      </div>
      <div
        style={{ backgroundColor: "#1e1e1e", borderTopColor: "white" }}
        className="flex justify-center mt-[0.2px]"
      >
        <button
          onClick={runProgram}
          className="bg-green-900 text-white w-32 p-2"
        >
          Run Program
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
