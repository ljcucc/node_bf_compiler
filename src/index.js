const $ = require("jquery");
const cookie = require("./localStorage/cookie");

var
  welcomeDialog,
  appbarToggle = false,
  lastShortcutKey = "";

const shortcuts = {
  Ctrl: {
    KeyA: {
      name: "select all",
      icon: "select_all"
    },
    KeyC: {
      name: "copy",
      icon: "filter_none"
    },
    KeyV: {
      name: "paste",
      icon: "assignment"
    },
    KeyS: {
      name: "save",
      icon: "save",
      disableOriginShortcut: true
    },
    KeyR: {
      name: "Compile",
      icon: "play_arrow",
      disableOriginShortcut: true,
      then: e => {
        document.querySelector("#compile").click();
      }
    },
    KeyF: {
      name: "Find",
      icon: "find_in_page",
      disableOriginShortcut: true
    },
    KeyB: {
      name: "Format code",
      icon: "format_shapes"
    },
    KeyZ: {
      name: "Undo",
      icon: "undo"
    }
  }
};
$(document).ready(e => {
  mdc.autoInit();
  // var toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
  // toolbar.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');

  showCodeDialog = new mdc.dialog.MDCDialog(
    document.querySelector("#showCodeDialog")
  );
  
  if(cookie.getCookie("first_time") != 192201){
    cookie.setCookie("first_time",192201);
    new mdc.dialog.MDCDialog(document.querySelector("#welcomeDialog")).open();
  }
  drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector(".mdc-drawer"));

  codeCompiledToast = new mdc.snackbar.MDCSnackbar(
    document.querySelector(".mdc-snackbar")
  );
  compileErrorToast = new mdc.snackbar.MDCSnackbar(
    document.querySelector("#compileErrorToast")
  );

  editor = CodeMirror.fromTextArea(document.querySelector("#sourceCode"), {
    lineNumbers: true,
    theme: "monokai",
    mode: "text/x-c",
    tabSize: 2
  });

  closeAppbar();

  $("#about").click(e => {
    alert("Node.bf compiler\nbuild number: 011319_01");
  });

  $("#appbarToggler").click(e => {
    appbarToggle = !appbarToggle;
    if (appbarToggle) {
      openAppbar();
    } else {
      closeAppbar();
    }
  });

  window.addEventListener("keydown", e => {
    if (e.key == "Control") {
      openAppbar();
    }

    if (e.ctrlKey) {
      if (typeof shortcuts.Ctrl[e.code] != "undefined") {
        showShortcut(shortcuts.Ctrl[e.code].name, shortcuts.Ctrl[e.code].icon);
        if (shortcuts.Ctrl[e.code].disableOriginShortcut) e.preventDefault();
        lastShortcutKey = e.code;
      }
    }
  });

  window.addEventListener("keyup", e => {
    if (e.key == "Control") {
      closeAppbar();
    }

    if (e.code == lastShortcutKey) {
      $("#shortcutHint").fadeOut(100);

      if (shortcuts.Ctrl[lastShortcutKey].then) {
        shortcuts.Ctrl[lastShortcutKey].then();
      }
      lastShortcutKey = "";
    }
  });

  function openAppbar() {
    $(".mdc-top-app-bar--short").removeClass(
      "mdc-top-app-bar--short-collapsed"
    );
    $(".appbarItem").show();
    $("#shortcutHint").hide();
    $("#appbarToggler").html("chevron_left");
  }

  function closeAppbar() {
    if (!appbarToggle) {
      $(".mdc-top-app-bar--short").addClass("mdc-top-app-bar--short-collapsed");
      $(".appbarItem").hide();
      $("#appbarToggler").html("last_page");
    }
  }

  function showShortcut(name, icon) {
    $("#shortcutHint>#name").text(name);
    $("#shortcutHint>#icon").html(icon);
    $("#shortcutHint").fadeIn(100);
  }

  //Disabel Ctrl+S

  const topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(
    document.getElementById("app-bar")
  );
  topAppBar.setScrollTarget(document.getElementById("main-content"));
  
});
