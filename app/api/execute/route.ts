import { execSync, spawnSync } from "child_process";
import fs from "fs";
import path from "path";

async function executeScript(code: string, input: string, scriptType: string) {
  const currentFolder: string = __dirname;
  const idx: string = String(Math.floor(Math.random() * 1000000000000 + 1));

  let filePath: string, programPath: string, cmd: string;

  switch (scriptType) {
    case "CPP":
      filePath = path.join(currentFolder, `${idx}.cpp`);
      programPath = path.join(currentFolder, idx);
      cmd = `g++ ${filePath} -o ${programPath}`;
      break;
    case "Python":
      filePath = path.join(currentFolder, `${idx}.py`);
      programPath = "python";
      cmd = `python ${filePath}`;
      break;
    case "Javascript":
      filePath = path.join(currentFolder, `${idx}.js`);
      programPath = "node";
      cmd = `node ${filePath}`;
      break;
    default:
      throw new Error("Unsupported script type");
  }

  fs.writeFileSync(filePath, code);

  try {
    if (scriptType == "CPP") {
      execSync(cmd);
    }
  } catch (error: any) {
    let compilation_error = JSON.parse(JSON.stringify(error.stderr));
    const error_desc = compilation_error.data
      .map((buffcode: number) => String.fromCharCode(buffcode))
      .join("");
    // console.error("Compilation error:", error_desc);
    cleanup();
    return new Response(JSON.stringify({ output: error_desc }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  let output: string = "";

  try {
    const runtimeProcess = spawnSync(programPath, [filePath], {
      input: input,
      timeout: 2000,
      killSignal: "SIGTERM",
      maxBuffer: 10 * 1024 * 1024,
    });
    if (runtimeProcess.signal === "SIGTERM") {
      console.error(
        "Execution timed out: Execution took longer than 2 seconds."
      );
      output =
        "Execution timed out: code execution took longer than 2 seconds.";
    } else if (runtimeProcess.error) {
      // console.error("Memory limit exceeded");
      output = "Memory limit exceeded";
    } else if (
      (runtimeProcess.status !== null && runtimeProcess.status > 0) ||
      runtimeProcess.signal
    ) {
      let runtime_error = JSON.parse(JSON.stringify(runtimeProcess.stderr));
      const runtime_error_desc: string = String(
        runtime_error.data
          .map((buffcode: number) => String.fromCharCode(buffcode))
          .join("")
      );
      console.error("Runtime error:", runtime_error_desc);
      if (runtime_error_desc.trim() == "") {
        output = "Runtime error";
      } else {
        output = runtime_error_desc;
      }
    } else {
      output = runtimeProcess.stdout.toString();
    }
    console.log(runtimeProcess);
  } catch (error) {
    console.log(error);
  }

  cleanup();

  function cleanup() {
    const scriptFilePath = path.join(currentFolder, `${idx}.${scriptType}`);
    if (fs.existsSync(scriptFilePath)) {
      fs.unlinkSync(scriptFilePath);
    }
  }

  return new Response(JSON.stringify({ output }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  try {
    const resp = await request.json();
    const code: string = resp.code;
    const input: string = resp.input;
    const scriptType: string = resp.lang; // assuming 'lang' contains script type (CPP, Python, Javascript)
    const response = await executeScript(code, input, scriptType);
    return response;
  } catch (error: any) {
    console.error("Error during script execution:", error.message);
    return new Response(JSON.stringify({ output: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
