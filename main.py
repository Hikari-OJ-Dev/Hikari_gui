import webview
import webview.menu as wm
import subprocess



def load_css(Path: str,) -> str:
    with open(file=Path, mode='r') as f:
        css: str = f.read()
        print(css)
        win.load_css(css)
        return css


class Hikari:
    def __init__(self) -> None:
        self.ServerUrl = ""
        self.res = ""

    def __del__(self) -> None:
        pass

    def getRes(self) -> str:
        return self.res

    def sendMsg(self, channel, msg) -> str:
        print(channel, msg)
        if (channel == "check-gcc"):
            command = "cd Compilers/Mingw64/bin && gcc.exe --version"
            try:
                res = str(subprocess.check_output(command, shell=True))
                if (res.find("gcc") != -1):
                    return "success"
                else:
                    return "error"
            except:
                return "error"

        elif (channel == "check-gpp"):
            command = "cd Compilers/Mingw64/bin && g++.exe --version"
            try:
                res = str(subprocess.check_output(command, shell=True))
                if (res.find("g++") != -1):
                    return "success"
                else:
                    return "error"
            except:
                return "error"

        elif (channel == "check-python"):
            command = "python --version"
            try:
                res = str(subprocess.check_output(command, shell=True))
                if (res.find("Python") != -1):
                    return "success"
                else:
                    return "error"
            except:
                return "error"
        elif (channel == "submit"):
            print(type(msg))
            data = msg
            uid = str(data['uid'])
            pid = str(data['pid'])
            passwd = str(data['password'])
            code = str(data['code'])
            path_f = "temp/"+uid+"_"+pid+".cpp"
            with open(file=path_f, mode='w') as f:
                f.write(code)
            upload_url = self.ServerUrl
            # 替换链接中的1243为1919
            upload_url = upload_url.replace("1243", "1919")
            try:
                command = "python hikari-cli.py \"%s\" %s %s %s %s" % (
                    upload_url, uid, passwd, pid, path_f)
                self.res = subprocess.check_output(
                    command, shell=True).decode()
                print("1.", self.res)
                # 将res中的单引号替换为双引号
                self.res = self.res.replace("'", "\"")
                print("2.", self.res)
                self.loadFile("pages/results.html")
                return "success"
            except:
                return "error"

    def test(self) -> bool:
        return True

    def loadFile(self, htmlfile) -> None:
        webview.windows[0].load_url(url=htmlfile)

    def loadServer(self, url) -> None:
        self.ServerUrl = url
        self.loadFile("pages/check.html")

    def loadUrl(self, url) -> None:
        webview.windows[0].load_url(url=url)

    def loadCss(self, Path_c) -> None:
        with open(file=Path_c, mode='r') as f:
            css: str = f.read()
            webview.windows[0].load_css(css)

    def loadOJ(self) -> None:
        self.loadUrl(self.ServerUrl)

    def backIndex(self) -> None:
        self.loadFile("pages/index.html")

    def back(self) -> None:
        webview.windows[0].evaluate_js("window.history.back()")

    def forward(self) -> None:
        webview.windows[0].evaluate_js("window.history.forward()")

    def submitCode(self) -> None:
        self.loadFile("pages/submit.html")

    def submitFile(self) -> None:
        self.submitCode()


def do_nothing():
    pass


def about():
    webview.windows[0].create_confirmation_dialog(
        "关于", "HIKARI OJ\n\nVersion: 1.0.0\n\nAuthor: Clearwave & UnderStarlight\n\nPowered by HIKARI OJ")


if __name__ == '__main__':
    api = Hikari()
    win = webview.create_window(
        title='HIKARI OJ', url='pages/index.html', js_api=api, text_select = True)
    menu_items = [
        wm.Menu(
            '导航',
            [
                wm.MenuAction('主页',
                              api.loadOJ),
                wm.MenuSeparator(),
                wm.MenuAction('后退',
                              api.back),
                wm.MenuAction('前进',
                              api.forward),
                wm.MenuAction('退出', webview.windows[0].destroy)
            ],
        ),
        wm.Menu(
            '提交',
            [
                wm.MenuAction('提交代码',
                              api.submitCode),
                wm.MenuAction('提交文件',
                              api.submitFile)
            ],
        ),
        wm.Menu(
            '关于',
            [
                wm.MenuAction('关于',
                              about)
            ],
        )
    ]
    # window.load_css(load_css(Path='./css/index.css'))
    webview.start(menu=menu_items)
