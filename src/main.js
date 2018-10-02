function initialize() {
  const $file = document.querySelector("input[name=sourcemap]");
  const $lineNo = document.querySelector("input[name=lineNo]");
  const $columnNo = document.querySelector("input[name=columnNo]");
  const $button = document.querySelector("button");
  const $result = document.querySelector(".result");

  let file;

  $file.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length === 1) {
      const reader = new FileReader();
      reader.onloadstart = () => {
        $result.textContent = "Reading...";
      };
      reader.onloadend = (e) => {
        $result.textContent = "File read successfully done";
        file = e.target.result;
      }
      reader.onerror = (e) => {
        console.error(e);
      }
      reader.readAsText(e.target.files[0], "utf8");
    } else {
      console.warn(`target.files.length should be 1. actually ${e.target.files.length}`);
    }
  }, false);

  $button.addEventListener("click", () => {
    const lineNo = $lineNo.value || "0";
    const columnNo = $columnNo.value || "0";

    if (parseInt(lineNo, 10) === 0) {
      console.warn("lineNo must greater than 1");
      return;
    }
    if (parseInt(columnNo, 10) === 0) {
      console.warn("columnNo must greater than 1");
      return;
    }
    if (!file) {
      console.warn("You must select a file");
      return;
    }

    sourceMap.SourceMapConsumer.with(file, null, (consumer) => {
      const position = consumer.originalPositionFor({
        line: parseInt(lineNo, 10),
        column: parseInt(columnNo, 10),
      });
      $result.textContent = JSON.stringify(position, null, 2);
    });
  });
}


document.addEventListener("DOMContentLoaded", initialize);
