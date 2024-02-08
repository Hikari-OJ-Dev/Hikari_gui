const { app, BrowserWindow, Menu, dialog } = require("electron");
const { ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");

MainTemplate = [
  {
    label: "文件",
    submenu: [
      {
        label: "打开",
        accelerator: "Ctrl+O",
        click() {
          console.log("open");
        },
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
        label: "提交代码",
        accelerator: "Ctrl+S",
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
  exec(`Compilers\\bin\\gcc --version`, (error, stdout, stderr) => {
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
  exec(`Compilers\\bin\\g++ --version`, (error, stdout, stderr) => {
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
