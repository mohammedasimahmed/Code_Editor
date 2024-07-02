"use client";
import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import SelectLanguage from "./SelectLanguage";

const CodeEditor = () => {
  const editorRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const [output, setOutput] = useState<string>("");
  const [lang, setLang] = useState<string>("Select Language");

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };
  const handleInputDidMount = (editor: any, monaco: any) => {
    inputRef.current = editor;
  };

  const runProgram = async () => {
    if (editorRef.current) {
      if (lang == "Select Language") {
        alert("Please select a language");
        return;
      }
      setOutput("Loading...");
      const program = editorRef.current?.getValue();
      const input = inputRef.current?.getValue();
      console.log(program);
      let resp = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ code: program, input: input, lang: lang }),
      });

      let output = (await resp.json()).output;
      // document.getElementById("output")?.textContent=output
      console.log(output);
      setOutput(output);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen">
      <div className="text-center text-2xl bg-gray-900 text-white p-2">
        Neon Code
      </div>
      <div className=" flex flex-col sm:flex-row">
        <div
          style={{
            borderRight: "0.1px solid white",
            borderBottom: "0.1px solid white",
          }}
          className="w-full sm:w-[50vw] "
        >
          <div className="w-full h-fit flex justify-between items-center bg-green-900 py-1 pr-1">
            <div className="flex-1 text-center text-xl text-white border-none">
              Code
            </div>
            <SelectLanguage lang={lang} setLang={setLang} />
          </div>
          <div className="h-[86vh]">
            <Editor
              // height="86.0vh"
              defaultLanguage="cpp"
              // defaultValue="// some comment"
              theme="vs-dark"
              onMount={handleEditorDidMount}
            />
          </div>
        </div>
        <div>
          <div className="flex-1 text-center bg-purple-900 text-xl py-2 text-white">
            Input
          </div>
          <div className="w-full sm:w-[50vw]">
            <Editor
              height="32.5vh"
              defaultLanguage="cpp"
              theme="vs-dark"
              onMount={handleInputDidMount}
            />
          </div>
          <div className="text-center bg-green-900 text-white text-xl py-2">
            Output
          </div>
          <div className="w-full sm:w-[50vw]">
            <Editor
              height="47.5vh"
              defaultLanguage="cpp"
              theme="vs-dark"
              value={output}
              options={{ readOnly: true }}
            />
          </div>
          {/* <div
            style={{ backgroundColor: "#1e1e1e" }}
            className="w-[50vw] h-[50vh] p-2 text-white whitespace-pre"
          >
            {output}
          </div> */}
        </div>
      </div>
      <div
        // style={{ borderTopColor: "white" }}
        className="flex justify-center mt-[0.2px] bg-gray-900"
      >
        <button
          onClick={runProgram}
          className="bg-green-900 text-white w-32 p-2 rounded"
        >
          Run Program
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
