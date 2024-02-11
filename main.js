const { app, BrowserWindow, Menu, dialog, ipcRenderer } = require("electron");
const { ipcMain } = require("electron");
const path = require("path");
const { exec, execSync } = require("child_process");
fs = require("fs");
MainTemplate  = [
  {
    label: "导航",
    submenu: [
      {
        label: "主页",
        accelerator: "CmdOrCtrl+H",
        click() {
          win.loadURL(ServerURL);
        },
      },
      {
        type: "separator",
      },
      {
        label: "后退",
        accelerator: "Alt+Left",
        click() {
          win.webContents.goBack();
        },
      },
      {
        label: "前进",
        accelerator: "Alt+Right",
        click() {
          win.webContents.goForward();
        },
      },
      {
        label: "退出",
        accelerator: "CmdOrCtrl+Q",
        role: "quit",
      },
    ],
  },
  {
    label: "编辑",
    submenu: [
      {
        label: "撤销",
        accelerator: "CmdOrCtrl+Z",
        role: "undo",
      },
      {
        label: "重做",
        accelerator: "Shift+CmdOrCtrl+Z",
        role: "redo",
      },
      {
        type: "separator",
      },
      {
        label: "剪切",
        accelerator: "CmdOrCtrl+X",
        role: "cut",
      },
      {
        label: "复制",
        accelerator: "CmdOrCtrl+C",
        role: "copy",
      },
      {
        label: "粘贴",
        accelerator: "CmdOrCtrl+V",
        role: "paste",
      },
      {
        label: "全选",
        accelerator: "CmdOrCtrl+A",
        role: "selectall",
      },
    ],
  },
  {
    label: "提交",
    submenu: [
      {
        label: "提交文件",
        accelerator: "CmdOrCtrl+Shift+S",
        click: function () {
          win.loadFile("pages/submit.html");
        },
      },
      {
        label: "提交代码",
        accelerator: "CmdOrCtrl+S",
        click: function () {
          win.loadFile("pages/submit.html");
        },
      },
    ],
  },
  {
    label: "查看",
    submenu: [
      {
        label: "重载",
        accelerator: "CmdOrCtrl+R",
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            // 重载之后, 刷新并关闭所有的次要窗体
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach(function (win) {
                if (win.id > 1) {
                  win.close();
                }
              });
            }
            focusedWindow.reload();
          }
        },
      },
      {
        label: "切换全屏",
        accelerator: (function () {
          if (process.platform === "darwin") {
            return "Ctrl+Command+F";
          } else {
            return "F11";
          }
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
      },
      {
        type: "separator",
      },
    ],
  },
  {
    label: "窗口",
    role: "window",
    submenu: [
      {
        label: "最小化",
        accelerator: "CmdOrCtrl+M",
        role: "minimize",
      },
      {
        label: "关闭",
        accelerator: "CmdOrCtrl+W",
        role: "close",
      },
      {
        type: "separator",
      },
      {
        label: "重新打开窗口",
        accelerator: "CmdOrCtrl+Shift+T",
        enabled: false,
        key: "reopenMenuItem",
        click: function () {
          app.emit("activate");
        },
      },
    ],
  },
  {
    label: "帮助",
    role: "help",
    submenu: [
      {
        label: "关于",
        click: function () {
          const options = {
            type: "info",
            title: "关于",
            buttons: ["好的"],
            message:
              "Hirkari OJ 1.0.0\n\nBy UnderStarlight & ClearWave\n\n2021-2024",
          };
          dialog.showMessageBox(options, function () {});
        },
      },
    ],
  },
];

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.loadFile("pages/index.html");
};

ServerURL = new String();
app.whenReady().then(() => {
  createWindow();
});

ipcMain.on("load-url", (event, arg) => {
  //检查Compiler是否存在
  win.loadFile("pages/check.html");
  ServerURL = arg;
});

ipcMain.on("check-gcc", (event, arg) => {
  console.log("Check gcc...");
  exec(`Compilers\\Mingw64\\bin\\gcc --version`, (error, stdout, stderr) => {
    //console.log(error, stdout, stderr);
    if (error) {
      event.returnValue = "error";
      return;
    }
    if (stderr) {
      event.returnValue = "error";
      return;
    }
    console.log("success");
    event.returnValue = "success";
  });
});
ipcMain.on("check-gpp", (event, arg) => {
  console.log("Check g++...");
  exec(`Compilers\\Mingw64\\bin\\g++ --version`, (error, stdout, stderr) => {
    //console.log(error, stdout, stderr);
    if (error) {
      event.returnValue = "error";
      return;
    }
    if (stderr) {
      event.returnValue = "error";
      return;
    }
    console.log("success");
    event.returnValue = "success";
  });
});
ipcMain.on("check-python", (event, arg) => {
  console.log("Check python...");
  exec(`python --version`, (error, stdout, stderr) => {
    //console.log(error, stdout, stderr);
    if (error) {
      event.returnValue = "error";
      return;
    }
    if (stderr) {
      event.returnValue = "error";
      return;
    }
    console.log("success");
    event.returnValue = "success";
  });
});
ipcMain.on("load-server", (event, arg) => {
  const appMenu = Menu.buildFromTemplate(MainTemplate);
  Menu.setApplicationMenu(appMenu);
  win.loadURL(ServerURL);
});
ipcMain.on("back", (event, arg) => {
  win.loadFile("pages/index.html");
  event.returnValue = 0;
});
ipcMain.on("back-main", (event, arg) => {
  win.loadURL(ServerURL);
  event.returnValue = 0;
});
ipcMain.on("submit", (event, arg) => {
  data = arg;
  uid = String(data.uid);
  passwd = String(data.password);
  pid = String(data.pid);
  lang = String(data.lang);
  code = String(data.code);
  //将code写入文件
  path_f = "temp/" + uid + "_" + pid + ".cpp";
  fs.writeFileSync(path_f, code, (err) => {
    if (err) {
      console.log(err);
      event.returnValue = 1;
    }
  });
  upload_url = ServerURL;
  upload_url = upload_url.replace("1243", "1919");
  try {
    const stdout = execSync(
      `python hikari-cli.py "${upload_url}" ${uid} ${passwd} ${pid} ${path_f}`
    );
    // stdout = {
    //   status: "AC",
    //   log: "",
    //   1: { status: "AC", out: "2\r\n", ans: "2" },
    //   2: { status: "AC", out: "5\r\n", ans: "5" },
    //   score: 100,
    //   pts: 2,
    // };
    jsonD = JSON.parse(stdout.toString().replace(/'/g, '"'));
    console.log(jsonD);
    jsonD.pid = pid;
    win.loadFile("pages/results.html");
    win.webContents.on("did-finish-load", () => {
      win.webContents.send("results", jsonD);
    });
    console.log("Submit Success");
    event.returnValue = jsonD;
  } catch (error) {
    console.log("Submit Error");
    console.log(error);
    dialog.showErrorBox("提交失败", "请检查网络连接或者服务器是否正常运行");

    event.returnValue = 1;
  }
  event.returnValue = 0;
});
