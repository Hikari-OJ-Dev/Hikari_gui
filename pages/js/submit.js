// 语言发生改变后，重新设置CodeMirror的语言模式
document.getElementById("lang").addEventListener("change", function (e) {
  document.getElementById("editor").value = "";
  var lang = e.target.value;
  console.log(lang);
  var mode = "";
  if (lang === "C++") {
    mode = "text/x-c++src";
  } else if (lang === "C") {
    mode = "text/x-csrc";
  } else if (lang === "Python") {
    mode = "text/x-python";
  }
  myCodeMirror.setOption("mode", mode);
});
var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("editor"), {
  lineNumbers: true,
  mode: "text/x-c++src", // 设置语言模式
  theme: "default",
  matchBrackets: true,
  smartIndent: true,
  indentUnit: 4,
});
myCodeMirror.setSize("100%", "100%");
function submitForm() {
  console.log("submitting");
  document.getElementById("status").style.display = "block";

  setTimeout(async () => {
    res = await pywebview.api.sendMsg("submit", {
      uid: document.getElementById("input1").value,
      password: document.getElementById("input2").value,
      pid: document.getElementById("input3").value,
      lang: document.getElementById("lang").value,
      code: myCodeMirror.getValue(),
    });

    console.log("res", res);

    document.getElementById("status").style.display = "none";
  }, 500);
}
function back_main() {
  window.history.back();
}
window.addEventListener("beforeunload", (event) => {
  // 阻止默认行为和弹出确认对话框（如果需要）
  // event.preventDefault();
  // event.returnValue = '';

  // 保存状态到localStorage（或其他存储机制）
  const state = {
    uid: document.getElementById("input1").value,
    password: document.getElementById("input2").value,
    pid: document.getElementById("input3").value,
    lang: document.getElementById("lang").value,
    code: myCodeMirror.getValue(),
  };
  localStorage.setItem("pageState", JSON.stringify(state));
});
window.addEventListener("load", (event) => {
  // 从localStorage获取状态
  const savedState = localStorage.getItem("pageState");
  if (savedState) {
    const state = JSON.parse(savedState);

    // 恢复状态到页面
    document.getElementById("input1").value = state.uid;
    document.getElementById("input2").value = state.password;
    document.getElementById("input3").value = state.pid;
    document.getElementById("lang").value = state.lang;
    myCodeMirror.setValue(state.code);
  }
});
