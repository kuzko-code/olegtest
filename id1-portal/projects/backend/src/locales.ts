import * as path from "path";

async function main() {
  const fs = require("fs-extra");
  let translateFiles: any[] = [
    {
      name: "ua.json",
      path: path.resolve(__dirname, "../src/locales/ua.json"),
    },
    {
      name: "en.json",
      path: path.resolve(__dirname, "../src/locales/en.json"),
    },
  ];

  function fromDir(startPath: string, filter: RegExp, callback: any) {
    if (!fs.existsSync(startPath)) {
      console.log("no dir ", startPath);
      return;
    }

    let ignoreDirectory = ["node_modules"];

    let files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
      let filename = path.join(startPath, files[i]);
      let stat = fs.lstatSync(filename);
      if (stat.isDirectory()) {
        if (!ignoreDirectory.includes(files[i]))
          fromDir(filename, filter, callback); //recurse
      } else if (filter.test(filename)) callback(filename);
    }
  }

  fromDir(
    path.resolve(__dirname, "../src/plugins"),
    /\.json$/,
    function (filename: string) {
      translateFiles.push({ name: path.basename(filename), path: filename });
    }
  );

  let groupFile = translateFiles.reduce((r, a) => {
    r[a.name] = [...(r[a.name] || []), a];
    return r;
  }, {});

  fs.mkdir(path.resolve(__dirname, "../dist/locales/"), function (err: any) {
    if (err) {
      console.log(err);
    } else {
      console.log("New directory successfully created.");
    }
  });

  Object.keys(groupFile).map(function (key, index) {
    let language = groupFile[key];
    let file = {};

    for (let j = 0; j < language.length; j++) {
      let rowData = fs.readFileSync(language[j].path);
      file = { ...file, ...JSON.parse(rowData) };
    }

    fs.writeFile(
      path.resolve(__dirname, "../dist/locales/", key),
      JSON.stringify(file),
      function (err: any) {
        if (err) throw err;
        console.log("Results Received");
      }
    );
  });
}

main();
