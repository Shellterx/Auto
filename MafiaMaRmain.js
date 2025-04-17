"use strict";

//############## Visa Configurations ########################################
const visaConfigs = {
  T1: {
    locationName: "Tetouan",
    visaTypeName: "Schengen Visa",
    visaSubName: "Schengen Visa",
  },
  A1: {
    locationName: "Agadir",
    visaTypeName: "Schengen Visa",
    visaSubName: "Schengen Visa",
  },
  A2: {
    locationName: "Agadir",
    visaTypeName: "National Visa",
    visaSubName: "Non-university students",
  },
  R1: {
    locationName: "Rabat",
    visaTypeName: "Schengen Visa",
    visaSubName: "Schengen Visa",
  },
  R2: {
    locationName: "Rabat",
    visaTypeName: "National Visa",
    visaSubName: "Students - Language/selectivity",
  },
  R3: {
    locationName: "Rabat",
    visaTypeName: "National Visa",
    visaSubName: "Students - Non-tertiary studies",
  },
  R4: {
    locationName: "Rabat",
    visaTypeName: "National Visa",
    visaSubName: "Students - Graduate studies",
  },
  R5: {
    locationName: "Rabat",
    visaTypeName: "National Visa",
    visaSubName: "Student - Others",
  },
  TG1: {
    locationName: "Tangier",
    visaTypeName: "Schengen Visa",
    visaSubName: "Schengen Visa",
  },
  TG2: {
    locationName: "Tangier",
    visaTypeName: "National Visa",
    visaSubName: "Students Less than 6 Months (SSU).",
  },
  C1: {
    locationName: "Casablanca",
    visaTypeName: "Schengen Visa",
    visaSubName: "Casa 1",
  },
  C2: {
    locationName: "Casablanca",
    visaTypeName: "Schengen Visa",
    visaSubName: "Casa 2",
  },
  C3: {
    locationName: "Casablanca",
    visaTypeName: "Schengen Visa",
    visaSubName: "Casa 3",
  },
  C4: {
    locationName: "Casablanca",
    visaTypeName: "National Visa",
    visaSubName: "Student Visa",
  },
  C5: {
    locationName: "Casablanca",
    visaTypeName: "National Visa",
    visaSubName: "Family Reunification Visa",
  },
  C6: {
    locationName: "Casablanca",
    visaTypeName: "National Visa",
    visaSubName: "National Visa",
  },
  C7: {
    locationName: "Casablanca",
    visaTypeName: "National Visa",
    visaSubName: "Work Visa",
  },
  N1: {
    locationName: "Nador",
    visaTypeName: "Schengen Visa",
    visaSubName: "Schengen Visa",
  },
  N2: {
    locationName: "Nador",
    visaTypeName: "National Visa",
    visaSubName: "Student Visa",
  },
  N3: {
    locationName: "Nador",
    visaTypeName: "National Visa",
    visaSubName: "Family Reunification Visa",
  },
  N4: {
    locationName: "Nador",
    visaTypeName: "National Visa",
    visaSubName: "National Visa",
  },
  N5: {
    locationName: "Nador",
    visaTypeName: "National Visa",
    visaSubName: "Work Visa",
  },
};

// Initialize variables
function initializeVariables() {
  if (!window.applicants || !window.applicants.length) {
    console.error("Applicants not defined.");
    return false;
  }
  window.locationName = visaConfigs[window.applicants[0].config].locationName;
  window.visaTypeName = visaConfigs[window.applicants[0].config].visaTypeName;
  window.visaSubName = visaConfigs[window.applicants[0].config].visaSubName;
  window.membersName = window.applicants[0].membersName;
  window.categoryName = localStorage.getItem("categoryName") || "Casa 1";
  return true;
}

// Expose variables to global scope
window.visaConfigs = visaConfigs;
window.applicants = window.applicants || [];
window.sendTelegramMessage = sendTelegramMessage;

// Telegram notification function
function sendTelegramMessage(message) {
  const botToken = "7593996389:AAFcj0hVd8jYBV4XeHZ3HuXwEVV0PpR_y4o";
  const chatId = "-4632849048";
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  $.ajax({
    type: "POST",
    url: url,
    data: {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    },
    success: (response) => {
      console.log("Telegram message sent:", response);
    },
    error: (xhr, status, error) => {
      console.error("Failed to send Telegram message:", status, error);
    },
  });
}

// Category selection for Casablanca
if (
  window.location.href.startsWith(
    "https://www.blsspainmorocco.net/MAR/Appointment/NewAppointment?msg="
  )
) {
  function changeCategory(newCategory) {
    localStorage.setItem("categoryName", newCategory);
    window.location.href = "/MAR/appointment/newappointment";
  }

  const categories = [
    { name: "Casa 1", className: "btn btn-success" },
    { name: "Casa 2", className: "btn btn-danger" },
    { name: "Casa 3", className: "btn btn-info" },
  ];

  const buttonContainer = document.createElement("div");
  buttonContainer.style.textAlign = "center";
  buttonContainer.style.margin = "20px auto";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = `Change To : ${category.name}`;
    button.className = category.className;
    button.style.margin = "5px";
    button.onclick = () => changeCategory(category.name);
    buttonContainer.appendChild(button);
  });

  const targetDiv = document.querySelector("#div-main");
  if (targetDiv) {
    targetDiv.parentNode.insertBefore(buttonContainer, targetDiv);
  }

  const tryAgainLink = Array.from(
    document.querySelectorAll("a.btn.btn-primary")
  ).find(
    (link) =>
      link.textContent.trim() === "Try Again" &&
      link.getAttribute("href") === "/MAR/appointment/newappointment"
  );

  if (tryAgainLink) {
    let countdown = 10;
    let isPaused = false;

    tryAgainLink.textContent = `Keep trying in the Actual Category: ${localStorage.getItem(
      "categoryName"
    )} in : (${countdown}s)`;
    tryAgainLink.style.width = "auto";

    const pauseButton = document.createElement("button");
    pauseButton.textContent = "Pause";
    pauseButton.style.marginLeft = "10px";
    pauseButton.className = "btn btn-secondary ms-2";
    pauseButton.innerHTML = '<i class="bi bi-pause-fill"></i>';
    tryAgainLink.parentNode.insertBefore(pauseButton, tryAgainLink.nextSibling);

    pauseButton.addEventListener("click", () => {
      isPaused = !isPaused;
      pauseButton.innerHTML = isPaused
        ? '<i class="bi bi-play-fill"></i>'
        : '<i class="bi bi-pause-fill"></i>';
    });

    const countdownInterval = setInterval(() => {
      if (!isPaused) {
        countdown -= 1;
        tryAgainLink.textContent = `Keep trying in the Actual Category: ${localStorage.getItem(
          "categoryName"
        )} (${countdown}s)`;

        if (countdown <= 0) {
          clearInterval(countdownInterval);
          tryAgainLink.click();
        }
      }
    }, 1000);
  }
}

// Modal handling
setTimeout(() => {
  $(".modal").modal("hide");
}, 500);

setTimeout(() => {
  const button1 = document.querySelector(
    '.btn.btn-success.btn-block[type="button"][data-bs-dismiss="modal"][onclick="onBioDisclaimerAccept();"]'
  );
  if (button1) {
    button1.click();
    setTimeout(() => {
      const button2 = document.querySelector(
        '.btn.btn-success.btn-block[type="button"][data-bs-dismiss="modal"][onclick="onDpAccept();"]'
      );
      if (button2) {
        button2.click();
      }
    }, 300);
  }
}, 400);

// Redirects
if (
  window.location.href ===
  "https://www.blsspainmorocco.net/MAR/account/changepassword?alert=True"
) {
  window.location.href =
    "https://www.blsspainmorocco.net/MAR/appointment/appointmentcaptcha";
}

if (
  window.location.href ===
  "https://www.blsspainmorocco.net/MAR/Appointment/NewAppointment?msg=lfJQVX2NULaGjPKL6fTAx8BtSHJVTsEgaj1lwdqOSsc%3D"
) {
  window.location.href =
    "https://www.blsspainmorocco.net/MAR/appointment/newappointment";
}

// Load CSS
function loadCSS(url) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

loadCSS(
  "https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/alertify.min.css"
);
loadCSS(
  "https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/themes/default.min.css"
);

// Alertify setup
alertify.minimalDialog ||
  alertify.dialog("Confirmation", function () {
    return {
      main: function (content) {
        this.setContent(content);
      },
    };
  });

// Utility functions
const global = unsafeWindow;

function matchPath(pattern, pathname = location.pathname) {
  return compileMatcher(pattern).test(pathname);

  function compileMatcher(pattern) {
    const source =
      "^" +
      pattern
        .replace(/\/*$/, "")
        .replace(/^\/*/, "/")
        .replaceAll(/[\\.*+^${}|()[\]]/g, "\\$&") +
      "/*$";
    return new RegExp(source, "i");
  }
}

function shuffleArray(array) {
  let index = -1;
  const length = array.length;
  const lastIndex = length - 1;
  while (++index < length) {
    const rand = random(index, lastIndex);
    [array[index], array[rand]] = [array[rand], array[index]];
  }
  return array;
}

function reloadPageIfError() {
  const errorTitles = [
    "504 Gateway Time-out",
    "Too Many Requests",
    "Application Temporarily Unavailable",
    "502 Bad Gateway",
    "503 Service Temporarily Unavailable",
    "Service Unavailable",
    "500 Internal Server Error",
    "Database error",
    "FastCGI Error",
    "The connection has timed out",
    "Problemas al cargar la página",
    "Error 502 (Server Error)!!1",
    "403 Forbidden",
    "Service Unavailable','403 ERROR",
    "502 Bad Gateway",
    "We're sorry, something went wrong",
    "We are expreiencing an error while processing your request. Kindly try after sometime.",
  ];

  const pageTitle = document.title;

  if (errorTitles.includes(pageTitle)) {
    setTimeout(function () {
      window.location.reload();
    }, 1000);
  }
}

reloadPageIfError();

function random(lower, upper) {
  return lower + Math.floor(Math.random() * (upper - lower + 1));
}

function creatBTN(text, targetSelector, onClick, color = "#007bff") {
  const button = document.createElement("button");
  button.textContent = text;
  button.style.backgroundColor = color;
  button.style.color = "white";
  button.style.padding = "10px 20px";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  button.style.margin = "10px";
  button.style.fontSize = "16px";
  button.style.fontWeight = "bold";
  button.style.transition = "background-color 0.3s";
  button.onmouseover = () =>
    (button.style.backgroundColor = darkenColor(color));
  button.onmouseout = () => (button.style.backgroundColor = color);
  button.onclick = onClick;

  const target = document.querySelector(targetSelector);
  if (target) {
    target.appendChild(button);
  } else {
    console.error(`Target selector ${targetSelector} not found.`);
  }
}

function darkenColor(color) {
  const num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(255 * 0.1),
    R = (num >> 16) - amt,
    G = ((num >> 8) & 0x00ff) - amt,
    B = (num & 0x0000ff) - amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 0 ? 0 : R) * 0x10000 +
      (G < 0 ? 0 : G) * 0x100 +
      (B < 0 ? 0 : B)
    )
      .toString(16)
      .slice(1)
  );
}

function redirectTo(url) {
  window.location.href = url;
}

// Bot classes
class CAT {
  start() {
    console.log(`${this.constructor.name} started`);
    if (!initializeVariables()) return;

    $("#visaTypeMessage").remove();
    $("#PremiumTypeModel").remove();
    $("VisaTypeModel").remove();

    const waitForElements = () => {
      let categoryId,
        locationId,
        visaTypeId,
        visaSubTypeId,
        familyId,
        selfId,
        familyMemberId;

      $('input[data-role="dropdownlist"]').each(function () {
        var labelId = $(this).attr("id") + "_label";
        if ($("#" + labelId).is(":visible")) {
          var dropdownlistId = $(this).attr("id");
          var labelText = $("#" + labelId).text();
          switch (labelText) {
            case "Category*":
              categoryId = dropdownlistId;
              break;
            case "Location*":
              locationId = dropdownlistId;
              break;
            case "Visa Type*":
              visaTypeId = dropdownlistId;
              break;
            case "Visa Sub Type*":
              visaSubTypeId = dropdownlistId;
              break;
          }
        }
      });

      $('input[type="radio"]').each(function () {
        if ($(this).is(":visible")) {
          if ($(this).attr("id").includes("family")) {
            familyId = $(this).attr("id");
          } else {
            selfId = $(this).attr("id");
          }
        }
      });

      familyMemberId = familyId ? "an" + familyId.slice(6) : null;

      const isReady =
        categoryId &&
        locationId &&
        visaTypeId &&
        visaSubTypeId &&
        (familyId || selfId) &&
        $("#" + locationId).data("kendoDropDownList") &&
        typeof locationData !== "undefined" &&
        typeof visaTypeFilterData !== "undefined" &&
        typeof visasubIdFilterData !== "undefined" &&
        typeof categoryData !== "undefined" &&
        (window.membersName === "I" || typeof applicantsNoData !== "undefined");

      return {
        isReady,
        categoryId,
        locationId,
        visaTypeId,
        visaSubTypeId,
        familyId,
        selfId,
        familyMemberId,
      };
    };

    const maxAttempts = 60;
    let attempts = 0;
    const interval = setInterval(() => {
      const {
        isReady,
        categoryId,
        locationId,
        visaTypeId,
        visaSubTypeId,
        familyId,
        selfId,
        familyMemberId,
      } = waitForElements();
      attempts++;

      if (isReady) {
        clearInterval(interval);
        try {
          const applicantConfig = visaConfigs[window.applicants[0].config];
          window.locationName = applicantConfig.locationName;
          window.visaTypeName = applicantConfig.visaTypeName;
          window.visaSubName = applicantConfig.visaSubName;

          var selectedLocation = locationData.find(
            (location) => location.Name === window.locationName
          );
          if (!selectedLocation) {
            console.error(`Location ${window.locationName} not found.`);
            return;
          }
          var dropdownlistLocation = $("#" + locationId).data(
            "kendoDropDownList"
          );
          dropdownlistLocation.value(selectedLocation.Id);
          dropdownlistLocation.trigger("change");

          var selectedVisaType = visaTypeFilterData.find(
            (visaType) => visaType.Name === window.visaTypeName
          );
          if (!selectedVisaType) {
            console.error(`Visa Type ${window.visaTypeName} not found.`);
            return;
          }
          var dropdownlistVisaType = $("#" + visaTypeId).data(
            "kendoDropDownList"
          );
          dropdownlistVisaType.value(selectedVisaType.Id);
          dropdownlistVisaType.trigger("change");

          var selectedVisaSub = visasubIdFilterData.find(
            (visaSub) => visaSub.Name === window.visaSubName
          );
          if (!selectedVisaSub) {
            console.error(`Visa Sub Type ${window.visaSubName} not found.`);
            return;
          }
          var dropdownlistVisaSub = $("#" + visaSubTypeId).data(
            "kendoDropDownList"
          );
          dropdownlistVisaSub.value(selectedVisaSub.Id);
          dropdownlistVisaSub.trigger("change");

          var selectedCategory = categoryData.find(
            (category) => category.Name === window.categoryName
          );
          if (!selectedCategory) {
            console.error(`Category ${window.categoryName} not found.`);
            return;
          }
          var dropdownlistCategory = $("#" + categoryId).data(
            "kendoDropDownList"
          );
          dropdownlistCategory.value(selectedCategory.Id);
          dropdownlistCategory.trigger("change");

          if (window.membersName !== "I") {
            $("#familyDisclaimer").remove();
            var familyElement = $("#" + familyId);
            familyElement.click();
            OnFamilyAccept();

            var selectedMembers = applicantsNoData.find(
              (members) => members.Name === window.membersName
            );
            if (!selectedMembers) {
              console.error(`Members ${window.membersName} not found.`);
              return;
            }
            var dropdownlistMembers = $("#" + familyMemberId).data(
              "kendoDropDownList"
            );
            dropdownlistMembers.value(selectedMembers.Id);
            dropdownlistMembers.trigger("change");
          }

          if (/on|true/.test(window.autoSubmitForms?.visaType)) {
            var submitButton = document.querySelector("#btnSubmit");
            submitButton.click();
          } else {
            console.log("Auto-submit for Visa Type is disabled.");
          }
        } catch (error) {
          console.error("CAT class error:", error);
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.error("CAT timed out: Required elements not found.");
      }
    }, 300);
  }
}

class LoginBot {
  start() {
    console.log(`${this.constructor.name} started`);
    if (!initializeVariables()) return;

    this.#hidePreloader();
    this.#makeLoaderDismissable();
    this.#removeRandomnessFromUi();
    this.#enableCopyPasteInInputs();
    this.#setReturnUrl();
    this.#injectProfilePhotoUploadFeature();
    this.#injectLoginFeature();
  }

  #hidePreloader() {
    $(".preloader").hide();
  }

  #makeLoaderDismissable() {
    $(`
      <button class="btn btn-secondary position-absolute top-50 start-50 translate-middle-x mt-5"
              onclick="window.HideLoader();">
        Hide Loader</button>
    `).appendTo(".global-overlay-loader");
  }

  #removeRandomnessFromUi() {
    $("#div-main > .container > .row > [class^=col-]").hide();
    $("#div-main > .container > .row > :has(form)").addClass("mx-auto");
    $(":has(> form)").removeAttr("class");
  }

  #enableCopyPasteInInputs() {
    $(".entry-disabled:visible").on("copy paste", (evt) =>
      evt.stopImmediatePropagation()
    );
  }

  #setReturnUrl() {
    $("#ReturnUrl").val($(".new-app-active").attr("href"));
  }

  #injectLoginFeature() {
    if (!window.applicants.length) {
      console.error("No applicants defined.");
      return;
    }

    const injectDropdown = () => {
      const $select = $(`
        <select id="_applicants" class="form-select form-select-lg mt-2" style="display: block; width: 100%; max-width: 300px; margin: 10px auto;">
          <option selected disabled>Select a User</option>
          ${window.applicants.map(
            ({ name, mail }) =>
              `<option value="${mail}">${name || mail}</option>`
          )}
        </select>
      `);

      const $target = $(".vstack.align-items-center.gap-2");
      if ($target.length) {
        $select.insertAfter($target).on("change", () => this.#fillForm());
        console.log("User dropdown injected.");
      } else {
        console.error("Profile photo section not found.");
      }
    };

    const maxAttempts = 10;
    let attempts = 0;
    const interval = setInterval(() => {
      if ($(".vstack.align-items-center.gap-2").length) {
        clearInterval(interval);
        injectDropdown();
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.error("Timed out waiting for profile photo section.");
      }
      attempts++;
    }, 300);
  }

  #fillForm() {
    const selectedMail = $("#_applicants").val();
    const applicant = window.applicants.find(
      ({ mail }) => mail === selectedMail
    );

    $(":text[name]:visible").val(applicant?.mail);
    applicant?.profilePhotoId &&
      $("#_profilePhoto").attr(
        "src",
        `/MAR/query/getfile?fileid=${applicant.profilePhotoId}`
      );
    /on|true/.test(window.autoSubmitForms?.login) &&
      $("#btnVerify").trigger("click");
  }

  #injectProfilePhotoUploadFeature() {
    $(`
      <div class="vstack align-items-center gap-2">
        <img id="_profilePhoto" class="img-thumbnail object-fit-cover" src="/assets/images/avatar/01.jpg"
             style="width: 128px; height: 128px;">
        <div class="input-group input-group-sm flex-nowrap">
          <input id="_profilePhotoId" class="form-control" placeholder="No photo uploaded yet" readonly>
          <button id="_copyProfilePhotoId" class="btn btn-secondary"><i class="bi bi-clipboard"></i></button>
        </div>
        <label id="_uploadProfilePhotobtn" class="btn btn-sm btn-secondary">
          <span>Upload Profile Photo</span>
          <span class="text-warning-emphasis" hidden>
            <span class="spinner-grow spinner-grow-sm align-text-top"></span> Chargement de la Photo ...
          </span>
          <input id="_profilePhotoFile" type="file" hidden>
        </label>
        <style>
          #_uploadProfilePhotobtn.disabled {
            > :first-child { display: none; }
            > :nth-child(2) { display: unset !important; }
          }
        </style>
      </div>
    `)
      .insertAfter(".text-center:has(img[alt=logo])")
      .on("change", "#_profilePhotoFile", () => this.#uploadProfilePhoto())
      .on("click", "#_copyProfilePhotoId", () => this.#copyProfilePhotoId());
  }

  #uploadProfilePhoto() {
    const target = $("#_profilePhotoFile");

    const [file] = target.prop("files");
    file &&
      $.post({
        url: "/MAR/query/UploadProfileImage",
        contentType: false,
        processData: false,
        timeout: 30_000,
        beforeSend() {
          this.data = new FormData();
          this.data.append("file", file);
          $("#_uploadProfilePhotobtn").addClass("disabled");
        },
        success(result) {
          if (result.success) {
            $("#_profilePhotoId").val(result.fileId);
            $("#_profilePhoto").attr(
              "src",
              `/MAR/query/getfile?fileid=${result.fileId}`
            );
          } else {
            global.ShowError(result.err);
          }
        },
        error(xhr, type) {
          global.ShowError(
            `Failed to upload profile photo. ${type} (${xhr.status}).`
          );
        },
        complete() {
          $("#_uploadProfilePhotobtn").removeClass("disabled");
          target.val(undefined);
        },
      });
  }

  #copyProfilePhotoId() {
    alertify.set("notifier", "position", "top-center");
    const profilePhotoId = $("#_profilePhotoId").val();
    if (profilePhotoId) {
      navigator.clipboard
        .writeText(profilePhotoId)
        .then(() => alertify.success("Copié avec Succès !"))
        .catch((err) => alertify.error("Erreur lors de la copie !"));
    }
  }
}

class LoginCaptchaBot {
  start() {
    console.log(`${this.constructor.name} started`);
    if (!initializeVariables()) return;

    this.#makeLoaderDismissableAndTranslucent();
    this.#removeRandomnessFromUi();
    this.#enableCopyPasteInInputs();
    const applicant = this.#getActiveApplicant();
    this.#markTabWithCurrentUser(applicant);
    this.#setPassword(applicant);
    this.#solveCaptcha();
  }

  #makeLoaderDismissableAndTranslucent() {
    $(`
      <button class="btn btn-secondary position-absolute" onclick="window.HideLoader();"
              style="top: 50%; margin-inline-start: 50%; transform: translate(-50%, calc(100% + 1rem));">
        Hide Loader</button>
    `).appendTo(".global-overlay-loader");
    $(".global-overlay").css("background-color", "rgba(0 0 0 / 30%)");
  }

  #removeRandomnessFromUi() {
    $("body > .row > [class^=col-]").hide();
    $("body > .row > :has(form)").addClass("mx-auto");

    $("#captcha-main-div").addClass("d-flex flex-column");
    $("#captcha-main-div > .pwd-div:has(form)")
      .addClass("order-0")
      .css({ height: "auto" });
    $("#captcha-main-div > .main-div-container").addClass("order-1");
    $("#captcha-main-div > .pwd-div:not(:has(*))").hide();
  }

  #enableCopyPasteInInputs() {
    $(".entry-disabled:visible").off("copy paste");
  }

  #getActiveApplicant() {
    const activemail = $(":contains(Email:) > b").text();
    return window.applicants.find(({ mail }) => mail === activemail);
  }

  #markTabWithCurrentUser(applicant) {
    applicant?.name && (document.title = applicant.name);
    applicant?.profilePhotoId &&
      $("img[alt=logo]")
        .addClass("img-thumbnail")
        .css({ width: "128px", height: "128px", objectFit: "cover" })
        .attr("src", `/MAR/query/getfile?fileid=${applicant.profilePhotoId}`);
  }

  #setPassword(applicant) {
    $(":password:visible").val(applicant?.password);
  }

  #solveCaptcha() {
    if (!(/on|true/.test(window.captcha.enabled) && window.captcha.apiKey))
      return;

    const target = this.#getCaptchaTarget();
    const grid = this.#getCaptchaGrid();

    const extractCaptchaGridData = (grid) =>
      Object.fromEntries(grid.map((img) => img.src).entries());

    const onSuccess = (result) => {
      if (result.status === "solved") {
        Object.entries(result.solution).forEach(
          ([index, value]) => value === target && grid[index].click()
        );
        /on|true/.test(window.autoSubmitForms?.loginCaptcha) &&
          $("#btnVerify").trigger("click");
      } else {
        onError("captchaerror", result);
      }
    };
    const onError = (type, data) => {
      console.error(type, data);
      $(".validation-summary-valid").html("<b>Failed to solve captcha.</b>");
    };

    $.post({
      url: "https://pro.nocaptchaai.com/solve",
      headers: { apiKey: window.captcha.apiKey },
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        method: "ocr",
        id: "morocco",
        images: extractCaptchaGridData(grid),
      }),
      timeout: 30_000,
      beforeSend() {
        this._loading = $(`
          <div class="d-flex align-items-center justify-content-center lead text-warning">
            <span class="spinner-grow"></span>
             Solving captcha ...
          </div>
        `).prependTo(".main-div-container");
      },
      complete(xhr, state) {
        this._loading?.remove();

        switch (state) {
          case "success":
            onSuccess(xhr.responseJSON);
            break;
          case "error":
          case "parsererror":
            onError(state, xhr);
            break;
        }
      },
    });
  }

  #getCaptchaTarget() {
    return $(".box-label")
      .sort((a, b) => getComputedStyle(b).zIndex - getComputedStyle(a).zIndex)
      .first()
      .text()
      .replace(/\D+/, "");
  }

  #getCaptchaGrid() {
    return $(":has(> .captcha-img):visible")
      .get()
      .reduce((acc, cur) => {
        (acc[Math.floor(cur.offsetTop)] ??= []).push(cur);
        return acc;
      }, [])
      .flatMap((sortedByTop) => {
        const sortedByZIndex = sortedByTop.sort(
          (a, b) => getComputedStyle(b).zIndex - getComputedStyle(a).zIndex
        );
        const top3 = sortedByZIndex.slice(0, 3);
        const sortedByLeft = top3.sort((a, b) => a.offsetLeft - b.offsetLeft);
        return sortedByLeft;
      })
      .map((element) => element.firstElementChild);
  }
}

class AppointmentCaptchaBot {
  start() {
    console.log(`${this.constructor.name} started`);
    if (!initializeVariables()) return;

    this.#hidePreloader();
    this.#makeLoaderDismissable();
    this.#removeRandomnessFromUi();
    this.#solveCaptcha();
  }

  #hidePreloader() {
    $(".preloader").hide();
  }

  #makeLoaderDismissable() {
    $(`
      <button class="btn btn-secondary position-absolute top-50 start-50 translate-middle-x mt-5"
              onclick="window.HideLoader();">
        Hide Loader</button>
    `).appendTo(".global-overlay-loader");
  }

  #removeRandomnessFromUi() {
    $(".row:has(> .captcha-div) > [class^=col-]").hide();
    $(".captcha-div").addClass("mx-auto");
  }

  #solveCaptcha() {
    if (!(/on|true/.test(window.captcha.enabled) && window.captcha.apiKey))
      return;

    const target = this.#getCaptchaTarget();
    const grid = this.#getCaptchaGrid();

    const extractCaptchaGridData = (grid) =>
      Object.fromEntries(grid.map((img) => img.src).entries());

    const onSuccess = (result) => {
      if (result.status === "solved") {
        Object.entries(result.solution).forEach(
          ([index, value]) => value === target && grid[index].click()
        );
        /on|true/.test(window.autoSubmitForms?.appointmentCaptcha) &&
          $("#btnVerify").trigger("click");
      } else {
        onError("captchaerror", result);
      }
    };
    const onError = (type, data) => {
      console.error(type, data);
      $(".validation-summary-valid").html("<b>Failed to solve captcha.</b>");
    };

    $.post({
      url: "https://pro.nocaptchaai.com/solve",
      headers: { apiKey: window.captcha.apiKey },
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        method: "ocr",
        id: "morocco",
        images: extractCaptchaGridData(grid),
      }),
      timeout: 30_000,
      beforeSend() {
        this._loading = $(`
          <div class="d-flex align-items-center justify-content-center lead text-warning">
            <span class="spinner-grow"></span>
             Solving captcha ...
          </div>
        `).prependTo(".main-div-container");
      },
      complete(xhr, state) {
        this._loading?.remove();

        switch (state) {
          case "success":
            onSuccess(xhr.responseJSON);
            break;
          case "error":
          case "parsererror":
            onError(state, xhr);
            break;
        }
      },
    });
  }

  #getCaptchaTarget() {
    return $(".box-label")
      .sort((a, b) => getComputedStyle(b).zIndex - getComputedStyle(a).zIndex)
      .first()
      .text()
      .replace(/\D+/, "");
  }

  #getCaptchaGrid() {
    return $(":has(> .captcha-img):visible")
      .get()
      .reduce((acc, cur) => {
        (acc[Math.floor(cur.offsetTop)] ??= []).push(cur);
        return acc;
      }, [])
      .flatMap((sortedByTop) => {
        const sortedByZIndex = sortedByTop.sort(
          (a, b) => getComputedStyle(b).zIndex - getComputedStyle(a).zIndex
        );
        const top3 = sortedByZIndex.slice(0, 3);
        const sortedByLeft = top3.sort((a, b) => a.offsetLeft - b.offsetLeft);
        return sortedByLeft;
      })
      .map((element) => element.firstElementChild);
  }
}

class SlotSelectionBot {
  #slotCache = new Map();

  start() {
    console.log(`${this.constructor.name} started`);
    if (!initializeVariables()) return;

    this.#hidePreloader();
    this.#makeLoaderDismissable();
    this.#removeRandomnessFromUi();
    Object.assign(global, {
      OnAppointmentdateChange: (date) => this.#selectCachedSlot(date),
    });
    this.#prefetchSlots();
  }

  #hidePreloader() {
    $(".preloader").hide();
  }

  #makeLoaderDismissable() {
    $(`
      <button class="btn btn-secondary position-absolute top-50 start-50 translate-middle-x mt-5"
              onclick="window.HideLoader();">
        Hide Loader</button>
    `).appendTo(".global-overlay-loader");
  }

  #removeRandomnessFromUi() {
    $("#div-main > :is(:first-child, :last-child)").removeClass().hide();
    $("#div-main > :has(form)").addClass("mx-auto");
    $("form > div:nth-child(2)")
      .addClass("gap-4")
      .children("div")
      .removeClass((_, className) => className.match(/m[tb]-\d/g));
    $("div:has(> #btnSubmit)").addClass("mt-5");
  }

  #prefetchSlots() {
    $(() => {
      const allowedDates = global.availDates.ad
        .filter((it) => it.AppointmentDateType === 0)
        .sort((a, b) => new Date(a.DateText) - new Date(b.DateText));
      if (!allowedDates.length) {
        console.error("No allowed dates available.");
        return;
      }

      const dataParam = encodeURIComponent(
        new URLSearchParams(location.search).get("data")
      );

      const fetchPromises = allowedDates.map((date) => {
        const url = `/MAR/appointment/GetAvailableSlotsByDate?data=${dataParam}&appointmentDate=${date.DateText}`;
        return $.ajax({
          type: "POST",
          url: url,
          dataType: "json",
          timeout: 10000,
        }).then(
          (response) => {
            if (response.success) {
              const availableSlots = response.data.filter((s) => s.Count > 0);
              this.#slotCache.set(date.DateText, availableSlots);
            }
            return {
              date: date.DateText,
              success: response.success,
              data: response.data,
            };
          },
          (xhr, status, error) => {
            console.error(
              `Failed to fetch slots for ${date.DateText}: ${status}, ${error}`
            );
            return { date: date.DateText, success: false };
          }
        );
      });

      global.ShowLoader();
      Promise.all(fetchPromises).then((results) => {
        global.HideLoader();
        const validResult = results
          .filter((r) => r.success && r.data.some((s) => s.Count > 0))
          .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

        if (validResult) {
          const datePicker = $(".k-datepicker:visible .k-input").data(
            "kendoDatePicker"
          );
          datePicker.value(validResult.date);
          datePicker.trigger("change");

          this.#sendSlotAvailabilityNotification();
          this.#selectAndSubmitNearestSlot(validResult.date);
        } else {
          console.error("No available slots found.");
        }
      });
    });
  }

  #sendSlotAvailabilityNotification() {
    const category = visaConfigs[window.applicants[0].config].visaSubName;
    const categoryType = localStorage.getItem("categoryName") || "Casa 1";
    const location = visaConfigs[window.applicants[0].config].locationName;
    const validCategories = ["Casa 1", "Casa 2", "Casa 3"];

    if (!categoryType || !validCategories.includes(categoryType)) {
      console.error(
        `Invalid category. Expected ${validCategories.join(
          ", "
        )}, got: ${categoryType}`
      );
      return;
    }

    let slotsByDateMessage = "";
    const sortedDates = Array.from(this.#slotCache.keys()).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    for (const date of sortedDates) {
      const slots = this.#slotCache.get(date);
      if (slots && slots.length > 0) {
        const slotTimes = slots.map((s) => s.Name).join(", ");
        slotsByDateMessage += `${date}\n${slotTimes}\n\n`;
      }
    }

    if (!slotsByDateMessage) {
      console.error("No slots available to report.");
      return;
    }

    const message = `**📅 Slot Selection**\n\n${location}\n\n${categoryType}\n\n${category}\n\n${slotsByDateMessage}By: @zaemch 🚀`;
    window.sendTelegramMessage(message);
  }

  #selectAndSubmitNearestSlot(apptDate) {
    const dataParam = encodeURIComponent(
      new URLSearchParams(location.search).get("data")
    );
    $.ajax({
      type: "POST",
      url: `/MAR/appointment/GetAvailableSlotsByDate?data=${dataParam}&appointmentDate=${apptDate}`,
      dataType: "json",
      async: false,
      success: (data) => {
        if (data.success) {
          const availableSlots = data.data.filter((s) => s.Count > 0);
          if (availableSlots.length > 0) {
            const selectedSlot = availableSlots.reduce((best, current) => {
              const bestTime = best.Name;
              const currentTime = current.Name;
              return currentTime < bestTime ? current : best;
            });
            $("#slot").val(selectedSlot.Id).trigger("change");
            if (/on|true/.test(window.autoSubmitForms?.slotSelection)) {
              $("#btnSubmit").click();
            }
          } else {
            console.error("No available slots for date:", apptDate);
          }
        }
      },
      error: (xhr, status, error) => {
        console.error(`Failed to select slot: ${status}, ${error}`);
      },
    });
  }

  #selectCachedSlot(date) {
    const slots = this.#slotCache.get(date);
    if (slots && slots.length > 0) {
      const selectedSlot = slots.reduce((best, current) => {
        const bestTime = best.Name;
        const currentTime = current.Name;
        return currentTime < bestTime ? current : best;
      });
      $("#slot").val(selectedSlot.Id).trigger("change");
    }
  }
}

class ApplicantSelectionBot {
  start() {
    console.log(`${this.constructor.name} started`);
    if (!initializeVariables()) return;

    this.#hidePreloader();
    this.#makeLoaderDismissable();
    this.#removeRandomnessFromUi();
    this.#selectApplicant();
  }

  #hidePreloader() {
    $(".preloader").hide();
  }

  #makeLoaderDismissable() {
    $(`
      <button class="btn btn-secondary position-absolute top-50 start-50 translate-middle-x mt-5"
              onclick="window.HideLoader();">
        Hide Loader</button>
    `).appendTo(".global-overlay-loader");
  }

  #removeRandomnessFromUi() {
    $("#div-main > :is(:first-child, :last-child)").removeClass().hide();
    $("#div-main > :has(form)").addClass("mx-auto");
  }

  #selectApplicant() {
    const applicant = window.applicants[0];
    const $form = $("form:visible");
    $form.find("input[name='Name']").val(applicant.name);
    $form.find("input[name='Email']").val(applicant.mail);
    $form
      .find("input[name='PassportNumber']")
      .val(applicant.passport || "UNKNOWN");

    if (/on|true/.test(window.autoSubmitForms?.applicantSelection)) {
      $("#btnSubmit").click();
      window.sendTelegramMessage(
        `**👤 Applicant Selection**\n\nSelected: ${applicant.name}\n\nLocation: ${window.locationName}\n\nBy: @zaemch 🚀`
      );
    }
  }
}

class PaymentResponseBot {
  start() {
    console.log(`${this.constructor.name} started`);
    if (!initializeVariables()) return;

    const paymentStatus = $("body").text().toLowerCase().includes("success")
      ? "Success"
      : "Failed";
    const message = `**🎉 Congratulation**\n\nPayment Status: ${paymentStatus}\n\nApplicant: ${window.applicants[0].name}\n\nLocation: ${window.locationName}\n\nBy: @zaemch 🚀`;
    window.sendTelegramMessage(message);

    setTimeout(() => {
      window.location.href =
        "https://www.blsspainmorocco.net/MAR/account/logout";
    }, 5000);
  }
}

class GmailBot {
  start() {
    console.log(`${this.constructor.name} started`);

    const checkEmails = () => {
      const emails = Array.from(document.querySelectorAll(".zA")).filter((el) =>
        el.textContent.includes("BLS Spain Visa")
      );
      if (emails.length > 0) {
        emails[0].click();
        setTimeout(() => {
          const confirmationLink = Array.from(
            document.querySelectorAll("a")
          ).find((a) => a.href.includes("confirmappointment"));
          if (confirmationLink) {
            window.sendTelegramMessage(
              `**🎉 Email Confirmation**\n\nConfirmation link found for ${window.applicants[0].name}\n\nBy: @zaemch 🚀`
            );
            window.location.href = confirmationLink.href;
          }
        }, 2000);
      } else {
        setTimeout(checkEmails, 5000);
      }
    };

    checkEmails();
  }
}

// Page routing
$(() => {
  if (!window.applicants || !window.applicants.length) {
    console.error("No applicants defined.");
    return;
  }

  if (location.hostname === "www.blsspainmorocco.net") {
    switch (true) {
      case matchPath("/mar") ||
        matchPath("/MAR") ||
        matchPath("/mar/home") ||
        matchPath("/MAR/home") ||
        matchPath("/mar/home/index") ||
        matchPath("/MAR/home/index"):
        const navContainer = document.querySelector(
          "nav.navbar, .navbar-expand-xl"
        );
        if (navContainer) {
          navContainer.style.display = "flex";
          navContainer.style.alignItems = "center";
          navContainer.style.justifyContent = "space-between";

          creatBTN(
            "GO TO LOGIN",
            "nav.navbar, .navbar-expand-xl",
            () =>
              redirectTo("https://www.blsspainmorocco.net/MAR/account/login"),
            "#D4A017"
          );

          const button = navContainer.querySelector("button:last-of-type");
          if (button) {
            button.style.margin = "0 auto";
            button.style.order = "1";
          }

          const logo = navContainer.querySelector(".navbar-brand");
          const search = navContainer.querySelector(
            ".search, [class*='search'], [class*='icon']"
          );
          if (logo) logo.style.order = "0";
          if (search) search.style.order = "2";
        } else {
          console.error("Navbar container not found. Button not injected.");
        }
        break;
      case matchPath("/MAR/account/login"):
        new LoginBot().start();
        break;
      case matchPath("/MAR/account/logincaptcha"):
        new LoginCaptchaBot().start();
        break;
      case matchPath("/MAR/appointment/appointmentcaptcha"):
        new AppointmentCaptchaBot().start();
        break;
      case matchPath("/MAR/appointment/newappointment"):
        new CAT().start();
        break;
      case matchPath("/MAR/appointment/slotselection"):
        new SlotSelectionBot().start();
        break;
      case matchPath("/MAR/appointment/applicantselection"):
        new ApplicantSelectionBot().start();
        break;
      case matchPath("/MAR/appointment/paymentresponse"):
        new PaymentResponseBot().start();
        break;
    }
  } else if (location.hostname === "mail.google.com") {
    new GmailBot().start();
  }
});
