function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function pauseExecution(ms) {
  await delay(ms); // 暂停3秒
}
async function showCheckItem(id) {
  console.log(id);
  const item = document.getElementById(id);
  console.log(item);
  item.style.display = "flex";
  item.innerHTML = item.textContent + ' <div class="spinner"></div>'; // 添加旋转圈圈
  await pauseExecution(500);
  res = window.electronAPI.sendMessage(id);
  if (res == "success") {
    item.innerHTML =
      item.textContent + ' <span class="check-mark">&#10003;</span>';
    return 0;
  } else {
    item.innerHTML =
      item.textContent + ' <span class="check-failed-mark">X</span>';
    return 1;
  }
}

// 初始化检查流程
async function initCheck() {
  flag = 0;
  document.getElementById("complete").style.display = "none";
  flag += await showCheckItem("check-gcc");
  flag += await showCheckItem("check-gpp");
  flag += await showCheckItem("check-python");
  if (flag != 0) {
    document.getElementById("button").style.display = "block";
    return;
  }
  document.getElementById("complete").style.display = "flex";
  await delay(1000);
  window.electronAPI.sendMessage("load-server");
}
function Back() {
  console.log("Hello");
  t = window.electronAPI.sendMessage("back");
  console.log("Hello");
}
initCheck();
