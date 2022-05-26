document.addEventListener("DOMContentLoaded", init);

let clientHeight = 0;
let navEle = undefined;
let sectionEle = undefined;

// 屏幕高度
function getClientHeight() {
  let height = 0;
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    height =
      document.body.clientHeight < document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight;
  } else {
    height =
      document.body.clientHeight > document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight;
  }
  return height;
}

// hash修改
function changeHash(id) {
  const url = location.pathname + "#" + id;
  history.replaceState(null, null, url);
}

// header子菜单点击
function handleHeaderSubMenuClick(e, href) {
  e.stopPropagation();
  e.preventDefault();
  location.href = href;
}

// 初始化
function init() {
  console.log("document ready!");
  initData();
  initNav();
  initScroll();
  initSubmit();
}

// 数据初始化
function initData() {
  clientHeight = getClientHeight();
  navEle = document.querySelector(".header-bar");
  sectionEle = document.querySelectorAll("section.section");
  const theme = localStorage.getItem("theme");
  if (theme) {
    const html = document.querySelector("html");
    html.setAttribute("class", theme);
  }
}

// 导航栏初始化
function initNav() {
  const headerEle = document.querySelector(".header-bar");
  const navItems = document.querySelectorAll(".nav .item");
  const langEle = document.querySelector(".header-bar .lang");
  const menuEle = document.querySelector(".header-bar .menu");

  // 菜单点击
  if (navItems) {
    for (let item of navItems) {
      item.onclick = function (e) {
        e.preventDefault();
        const target = e.target;
        const parentTarget = e.target.parentElement;
        const id = target.getAttribute("data-id") || parentTarget.getAttribute("data-id");

        const nextDom = document.querySelector("#" + id);
        // 如果有目标元素才进行跳转
        if (nextDom) {
          const top = nextDom.offsetTop;
          document.scrollingElement.scrollTo({
            top: top,
            left: 0,
            behavior: "smooth",
          });

          setTimeout(() => {
            changeHash(id);
          }, 1000);
        } else if (location.pathname !== "/" || location.pathname !== "/zh/") {
          if (location.pathname.indexOf("/zh") > -1) {
            location.href = "/zh/#" + id;
          } else {
            location.href = "/#" + id;
          }
        }
      };
    }
  }

  // 语言切换点击
  if (langEle) {
    langEle.onclick = function () {
      switch (langEle.innerText) {
        case "en":
          location.href = "/zh";
          break;
        case "zh":
          location.href = "/";
          break;
      }
    };
  }

  // 手机版的展开菜单点击
  if (menuEle) {
    menuEle.onclick = function () {
      const className = headerEle.getAttribute("class");
      headerEle.setAttribute("class", className === "header-bar open-menu" ? "header-bar" : "header-bar open-menu");
    };
  }
}

// 滚动初始化
function initScroll() {
  let timer;
  window.onscroll = function (e) {
    if (document.scrollingElement.scrollTop > 0) {
      if (timer) {
        return;
      } else {
        timer = setTimeout(() => {
          clearTimeout(timer);
          timer = undefined;
        }, 500);
      }
    }
    if (document.scrollingElement.scrollTop >= clientHeight) {
      navEle.setAttribute("class", "header-bar scroll");
    } else {
      navEle.setAttribute("class", "header-bar");
    }
    let target;
    for (let ele of sectionEle) {
      const r = ele.getBoundingClientRect();
      if (r.top <= 0) {
        target = ele;
      }
    }
    if (target) {
      const id = target.getAttribute("id");
      changeHash(id);
    }
  };
}

// 初始化可点击提交
function initSubmit() {
  const submit = document.querySelector("#concat-submit");

  if (submit) {
    submit.onclick = function () {
      const name = document.querySelector("#concat-name");
      const email = document.querySelector("#concat-email");
      const phone = document.querySelector("#concat-phone");
      const content = document.querySelector("#concat-content");
      fetch("http://www.kimix.com.cn/send.asp", {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "zh-CN,zh;q=0.9,ar;q=0.8,en-US;q=0.7,en;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded",
          pragma: "no-cache",
          "upgrade-insecure-requests": "1",
        },
        referrer: "http://www.kimix.com.cn/contact.htm",
        referrerPolicy: "strict-origin-when-cross-origin",
        body:
          ("yourname=" + name && name.value) ||
          ("" + "&email=" + email && email.value) ||
          ("" + "&tel=" + phone && phone.value) ||
          ("" + "&content=" + content && content.value) ||
          "" + "&Fjm1=6494&Fjm=6494&imageField.x=58&imageField.y=12",
        method: "POST",
        mode: "cors",
        credentials: "include",
      });
    };
  }
}
