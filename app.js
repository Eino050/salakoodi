(function () {
  "use strict";

  var ALPHABET = "ÖÄZYXWVUTSRQPONMLKJIHGFEDCBA";

  var LETTER_TO_NUMBER = {};
  var NUMBER_TO_LETTER = {};
  for (var i = 0; i < ALPHABET.length; i++) {
    LETTER_TO_NUMBER[ALPHABET[i]] = i + 1;
    NUMBER_TO_LETTER[i + 1] = ALPHABET[i];
  }

  function randomDigit() {
    return Math.floor(Math.random() * 10);
  }

  function numberToExpression(number) {
    if (number === 3 || number === 5 || number === 7 || number === 9) {
      return (number - 1) + "+1";
    }
    return String(number);
  }

  function encryptCharacter(char) {
    char = char.toUpperCase();

    if (char === " ") {
      return "000" + randomDigit() + randomDigit() + randomDigit();
    }

    if (!(char in LETTER_TO_NUMBER)) {
      return null;
    }

    var letterNumber = LETTER_TO_NUMBER[char];
    var beginning = "0" + String(letterNumber).padStart(2, "0");
    var middle = 1 + Math.floor(Math.random() * 9);
    var middleText = numberToExpression(middle);

    return beginning + middleText + randomDigit() + randomDigit() + randomDigit();
  }

  function encrypt(text) {
    var result = [];
    for (var i = 0; i < text.length; i++) {
      var code = encryptCharacter(text[i]);
      result.push(code === null ? "[" + text[i] + "]" : code);
    }
    return result.join(" ");
  }

  function decryptCharacter(code) {
    if (code.indexOf("000") === 0) {
      return " ";
    }

    if (code.charAt(0) !== "0" || code.length < 3) {
      return "?";
    }

    var letterNumber = parseInt(code.slice(1, 3), 10);
    if (isNaN(letterNumber)) {
      return "?";
    }

    var letter = NUMBER_TO_LETTER[letterNumber];
    return letter === undefined ? "?" : letter;
  }

  function decrypt(encodedText) {
    var codes = encodedText.trim().split(/\s+/);
    if (codes.length === 1 && codes[0] === "") {
      return "";
    }

    var result = [];
    for (var i = 0; i < codes.length; i++) {
      var code = codes[i];
      if (code.charAt(0) === "[" && code.charAt(code.length - 1) === "]") {
        result.push(code.slice(1, -1));
        continue;
      }
      result.push(decryptCharacter(code));
    }
    return result.join("");
  }

  var tabEncrypt = document.getElementById("tab-encrypt");
  var tabDecrypt = document.getElementById("tab-decrypt");
  var panelEncrypt = document.getElementById("panel-encrypt");
  var panelDecrypt = document.getElementById("panel-decrypt");

  function showTab(which) {
    var isEncrypt = which === "encrypt";
    tabEncrypt.classList.toggle("active", isEncrypt);
    tabDecrypt.classList.toggle("active", !isEncrypt);
    tabEncrypt.setAttribute("aria-selected", String(isEncrypt));
    tabDecrypt.setAttribute("aria-selected", String(!isEncrypt));
    panelEncrypt.classList.toggle("hidden", !isEncrypt);
    panelDecrypt.classList.toggle("hidden", isEncrypt);
  }

  tabEncrypt.addEventListener("click", function () { showTab("encrypt"); });
  tabDecrypt.addEventListener("click", function () { showTab("decrypt"); });

  function runEncrypt() {
    var input = document.getElementById("input-encrypt");
    var output = document.getElementById("output-encrypt");
    var box = document.querySelector(".output[data-owner='encrypt']");
    output.textContent = encrypt(input.value);
    box.classList.remove("hidden");
  }

  function runDecrypt() {
    var input = document.getElementById("input-decrypt");
    var output = document.getElementById("output-decrypt");
    var box = document.querySelector(".output[data-owner='decrypt']");
    output.textContent = decrypt(input.value);
    box.classList.remove("hidden");
  }

  document.getElementById("btn-encrypt").addEventListener("click", runEncrypt);
  document.getElementById("btn-decrypt").addEventListener("click", runDecrypt);

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  function bindCopy(btnId, outputId) {
    document.getElementById(btnId).addEventListener("click", function () {
      var text = document.getElementById(outputId).textContent;
      if (!text) return;
      copyText(text).then(function () {
        var btn = document.getElementById(btnId);
        var original = btn.textContent;
        btn.textContent = "Kopioitu!";
        setTimeout(function () { btn.textContent = original; }, 1500);
      });
    });
  }

  bindCopy("btn-copy-encrypt", "output-encrypt");
  bindCopy("btn-copy-decrypt", "output-decrypt");

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    });
  }

  var btnApk = document.getElementById("btn-apk");
  var dlSheet = document.getElementById("dl-sheet");
  var btnSheetClose = document.getElementById("btn-sheet-close");

  function openSheet() {
    dlSheet.classList.remove("hidden");
    btnApk.setAttribute("aria-expanded", "true");
  }

  function closeSheet() {
    dlSheet.classList.add("hidden");
    btnApk.setAttribute("aria-expanded", "false");
  }

  btnApk.addEventListener("click", openSheet);
  btnSheetClose.addEventListener("click", closeSheet);
  dlSheet.addEventListener("click", function (event) {
    if (event.target === dlSheet) {
      closeSheet();
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeSheet();
    }
  });

  var dlIos = document.getElementById("dl-ios");
  var iosHint = document.getElementById("ios-hint");
  dlIos.addEventListener("click", function () {
    iosHint.classList.toggle("hidden");
  });

  document.getElementById("btn-share").addEventListener("click", function () {
    var output = document.getElementById("output-encrypt");
    var text = output.textContent;
    if (!text) return;

    if (navigator.share) {
      navigator.share({ text: text }).catch(function () {});
    } else {
      copyText(text).then(function () {
        var btn = document.getElementById("btn-share");
        btn.textContent = "Kopioitu!";
        setTimeout(function () { btn.textContent = "Jaa salakoodi"; }, 1500);
      });
    }
  });
})();
