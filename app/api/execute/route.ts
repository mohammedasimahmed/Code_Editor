const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
require("console-sync");

export async function POST(request: Request) {
  const resp = await request.json();
  const code = resp.code;
  const input = resp.input;
  //   console.log(code);
  const currentFolder = __dirname; // Get the current directory
  const idx = String(Math.floor(Math.random() * 1000000000000 + 1));

  const filePath = path.join(currentFolder, `${idx}.cpp`); // Construct the file path

  fs.writeFileSync(filePath, code); // Write the file inside the current folder

  let output = "";

  try {
    const cppProcess = execSync(
      `g++ ${filePath} -o ${path.join(currentFolder, idx)}`
    );
  } catch (error: any) {
    let compilation_error = JSON.parse(JSON.stringify(error.stderr));
    const error_desc = compilation_error.data
      .map((buffcode: number) => String.fromCharCode(buffcode))
      .join("");
    console.log("error aya hai", error_desc);
    output = error_desc;
    return new Response(JSON.stringify({ output }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // console.log("cppProcess", await cppProcess.toJSON().data);

  const programPath = path.join(currentFolder, idx); // Construct the full path to the compiled program

  const childProcess = spawnSync(programPath, {
    input: input,
    timeout: 2000,
    killSignal: "SIGTERM",
    maxBuffer: 10 * 1024 * 1024,
  });

  if (childProcess.signal === "SIGTERM") {
    console.error(
      "Execution timed out: Process took longer than 2 seconds. exit"
    );
    output = "Execution timed out: Process took longer than 2 seconds.";
  } else if (childProcess.error) {
    console.log(childProcess.error);
    console.error("Memory limit exceeded");
    output = "Memory limit exceeded";
  } else if (childProcess.status > 0) {
    console.error("Runtime error");
    output = "Runtime error";
  } else {
    // console.log("Output\n" + childProcess.stdout.toString());
    output = childProcess.stdout.toString();
    // console.log(output);
  }

  cleanup();

  function cleanup() {
    const cppFilePath = path.join(currentFolder, `${idx}.cpp`);
    const exeFilePath = path.join(currentFolder, `${idx}.exe`);

    if (fs.existsSync(cppFilePath)) {
      fs.unlinkSync(cppFilePath);
    }

    if (fs.existsSync(exeFilePath)) {
      fs.unlinkSync(exeFilePath);
    }
  }
  // console.log("output", output);

  return new Response(JSON.stringify({ output }), {
    headers: { "Content-Type": "application/json" },
  });
}
