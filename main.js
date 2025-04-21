// Ensure configurations are available
if (!window.applicants || !window.captcha || !window.autoSubmitForms || !window.visaConfigs) {
  console.error("Required configurations (applicants, captcha, autoSubmitForms, visaConfigs) are missing.");
  return;
}

// Access configurations
const applicants = window.applicants;
const captcha = window.captcha;
const autoSubmitForms = window.autoSubmitForms;
const visaConfigs = window.visaConfigs;

// Define shared variables
var locationName = visaConfigs[applicants[0].config].locationName;
var visaTypeName = visaConfigs[applicants[0].config].visaTypeName;
var visaSubName = visaConfigs[applicants[0].config].visaSubName;
var membersName = applicants[0].membersName;

var categoryName = localStorage.getItem("categoryName") || "Normal";

// Handle category selection and auto-retry on NewAppointment page
if (
  window.location.href.startsWith(
    "https://algeria.blsspainglobal.com/DZA/Appointment/NewAppointment?msg="
  ) ||
  window.location.href.startsWith(
    "https://al REQ
    geria.blsspainglobal.com/dza/Appointment/NewAppointment?msg="
  )
) {
  function changeCategory(newCategory) {
    localStorage.setItem("categoryName", newCategory);
    window.location.href = "/DZA/appointment/newappointment";
  }

  const categories = [
    { name: "Normal", className: "btn btn-success" },
    { name: "Premium", className: "btn btn-danger" },
    { name: "Prime Time", className: "btn btn-info" },
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
      link.getAttribute("href") === "/DZA/appointment/newappointment"
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

// Dismiss modals automatically
setTimeout(() => {
  $(".modal").modal("hide");
}, 500);

// Accept disclaimers
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
    }, 100);
  }
}, 200);

// Redirect on specific pages
if (
  window.location.href ===
  "https://algeria.blsspainglobal.com/DZA/account/changepassword?alert=True" ||
  window.location.href ===
  "https://algeria.blsspainglobal.com/dza/account/changepassword?alert=True"
) {
  window.location.href =
    "https://algeria.blsspainglobal.com/DZA/appointment/appointmentcaptcha";
}

if (
  window.location.href ===
  "https://algeria.blsspainglobal.com/DZA/Appointment/NewAppointment?msg=lfJQVX2NULaGjPKL6fTAx8BtSHJVTsEgaj1lwdqOSsc%3D" ||
  window.location.href ===
  "https://algeria.blsspainglobal.com/dza/Appointment/NewAppointment?msg=lfJQVX2NULaGjPKL6fTAx8BtSHJVTsEgaj1lwdqOSsc%3D"
) {
  window.location.href =
    "https://algeria.blsspainglobal.com/DZA/appointment/newappointment";
}

// Load CSS for Alertify
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
  "https://cdn.jsdelivr.net/npm/alertifyjs/build/css/themes/default.min.css"
);

// Initialize Alertify dialog
alertify.minimalDialog ||
  alertify.dialog("Confirmation", function () {
    return {
      main: function (content) {
        this.setContent(content);
      },
    };
  });

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
    }, 500);
  }
}

function redirectOnErrorMessage() {
  const errorDiv = document.querySelector('div.alert.alert-warning.text-center');
  if (errorDiv) {
    const errorHeading = errorDiv.querySelector('h5')?.textContent.trim();
    const errorMessage = errorDiv.querySelector('p')?.textContent.trim();

    if (
      errorHeading === "We're sorry, something went wrong" &&
      errorMessage === "We are experiencing an error while processing your request. Kindly try after sometime."
    ) {
      setTimeout(function () {
        window.location.href = "https://algeria.blsspainglobal.com/DZA/appointment/newappointment";
      }, 500);
    }
  }
}

reloadPageIfError();
redirectOnErrorMessage();

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
  button.onmouseover = () => (button.style.backgroundColor = darkenColor(color));
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

// Classes
class CAT {
  start() {
    console.log(`${this.constructor.name} started`);

    $("#visaTypeMessage").remove();
    $("#PremiumTypeModel").remove();
    $("VisaTypeModel").remove();

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const isElementVisible = (element) => {
      if (!element || !element.length) return false;
      const style = window.getComputedStyle(element[0]);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        element[0].offsetHeight > 0 &&
        element[0].offsetWidth > 0
      );
    };

    const detectDropdown = (labelText) => {
      let dropdownId = null;
      $('input[data-role="dropdownlist"]').each(function () {
        const $this = $(this);
        const labelId = $this.attr("id") + "_label";
        const $label = $("#" + labelId);
        if ($label.length && $label.text().trim() === labelText && isElementVisible($label)) {
          dropdownId = $this.attr("id");
          console.log(`Found visible dropdown: ${labelText} (ID: ${dropdownId})`);
          return false;
        }
      });

      if (!dropdownId) {
        $('label.form-label').each(function () {
          const $label = $(this);
          if ($label.text().trim() === labelText) {
            const input = $label.next('div').find('input[data-role="dropdownlist"]');
            if (input.length && isElementVisible($label)) {
              dropdownId = input.attr("id");
              console.log(`Found visible dropdown via fallback: ${labelText} (ID: ${dropdownId})`);
              return false;
            }
          }
        });
      }

      return dropdownId;
    };

    const extractDropdownOptionsFromDOM = async (dropdownId, label) => {
      console.log(`Extracting options for ${label} from DOM...`);
      const dropdown = $(`#${dropdownId}`).closest(".k-dropdown");
      if (!dropdown.length) {
        console.error(`${label} dropdown not found for DOM extraction`);
        return null;
      }

      // Close any other open dropdowns
      $(".k-list-container.k-popup").each(function () {
        const $this = $(this);
        if ($this.is(":visible")) {
          const relatedInputId = $this.find(".k-list").attr("id")?.replace("_listbox", "");
          if (relatedInputId && relatedInputId !== dropdownId) {
            $(`#${relatedInputId}`).closest(".k-dropdown").focus();
            $(`#${relatedInputId}`).closest(".k-dropdown")[0].click();
            console.log(`Closed dropdown with ID: ${relatedInputId}`);
          }
        }
      });

      dropdown.focus();
      dropdown[0].click();
      console.log(`Opened ${label} dropdown for DOM extraction`);

      const maxWait = 3000;
      const start = Date.now();
      let listbox = null;
      const listboxId = `${dropdownId}_listbox`;
      while (Date.now() - start < maxWait) {
        listbox = $(`#${listboxId}`);
        if (listbox.length && listbox.is(":visible")) break;
        await delay(50);
      }

      if (!listbox || !listbox.length) {
        console.error(`Listbox for ${label} (ID: ${listboxId}) not found after waiting`);
        return null;
      }

      const options = listbox.find('li');
      const optionData = [];
      options.each(function () {
        const $option = $(this);
        const optionText = $option.text().trim();
        const optionValue = $option.attr("data-value") || optionText;
        if (optionText && optionText !== "--Select--") {
          optionData.push({ Value: optionValue, Name: optionText });
        }
      });

      if (optionData.length > 0) {
        console.log(`Extracted ${label} options from DOM:`, optionData);
        return optionData;
      } else {
        console.error(`No ${label} options found in DOM`);
        return null;
      }
    };

    const selectDropdownOption = async (dropdownId, optionsData, targetName, label) => {
      console.log(`Attempting to select ${label}: ${targetName}`);
      const dropdown = $(`#${dropdownId}`).closest(".k-dropdown");
      if (!dropdown.length) {
        console.error(`${label} dropdown not found for ID: ${dropdownId}`);
        return false;
      }

      // Close any other open dropdowns
      $(".k-list-container.k-popup").each(function () {
        const $this = $(this);
        if ($this.is(":visible")) {
          const relatedInputId = $this.find(".k-list").attr("id")?.replace("_listbox", "");
          if (relatedInputId && relatedInputId !== dropdownId) {
            $(`#${relatedInputId}`).closest(".k-dropdown").focus();
            $(`#${relatedInputId}`).closest(".k-dropdown")[0].click();
            console.log(`Closed dropdown with ID: ${relatedInputId}`);
          }
        }
      });

      dropdown.focus();
      dropdown[0].click();
      console.log(`Opened ${label} dropdown`);

      const listboxId = `${dropdownId}_listbox`;
      const listbox = $(`#${listboxId}`);
      if (!listbox.length || !listbox.is(":visible")) {
        console.error(`Listbox for ${label} (ID: ${listboxId}) not found after opening dropdown`);
        return false;
      }

      const options = listbox.find('li');
      let selected = false;
      options.each(function () {
        const optionText = $(this).text().trim();
        if (optionText === targetName) {
          $(this).click();
          console.log(`Selected ${label} via DOM: ${targetName}`);
          selected = true;
          return false;
        }
      });

      if (!selected) {
        console.error(`${label} option ${targetName} not found in listbox`, optionsData);
        return false;
      }
      return true;
    };

    const waitForElements = async () => {
      let categoryId, locationId, visaTypeId, visaSubTypeId, familyId, selfId;

      const maxWait = 3000;
      const start = Date.now();
      while (Date.now() - start < maxWait) {
        categoryId = detectDropdown("Category*");
        locationId = detectDropdown("Location*");
        visaTypeId = detectDropdown("Visa Type*");
        visaSubTypeId = detectDropdown("Visa Sub Type*");

        if (categoryId && locationId && visaTypeId && visaSubTypeId) break;
        await delay(50);
      }

      $('input[type="radio"]').each(function () {
        const $this = $(this);
        if (isElementVisible($this)) {
          const id = $this.attr("id");
          if (id.includes("family")) familyId = id;
          else if (id.includes("self")) selfId = id;
        }
      });

      let localLocationData = typeof locationData !== "undefined" ? locationData : null;
      if (!localLocationData && locationId) {
        localLocationData = await extractDropdownOptionsFromDOM(locationId, "Location");
      }

      const missingData = [];
      if (!localLocationData) missingData.push("locationData");
      if (typeof visaTypeFilterData === "undefined") missingData.push("visaTypeFilterData");
      if (typeof visasubIdFilterData === "undefined") missingData.push("visasubIdFilterData");
      if (typeof categoryData === "undefined") missingData.push("categoryData");
      if (typeof membersName === "undefined") {
        console.warn("membersName is undefined, defaulting to 'I'");
        membersName = "I";
      }
      if (membersName !== "I" && membersName !== "1" && typeof applicantsNoData === "undefined") {
        missingData.push("applicantsNoData");
      }
      if (missingData.length > 0) {
        console.log(`Missing global data: ${missingData.join(", ")}`);
      }

      const isReady =
        categoryId &&
        locationId &&
        visaTypeId &&
        visaSubTypeId &&
        (familyId || selfId) &&
        localLocationData &&
        typeof visaTypeFilterData !== "undefined" &&
        typeof visasubIdFilterData !== "undefined" &&
        typeof categoryData !== "undefined" &&
        (membersName === "I" || membersName === "1" || typeof applicantsNoData !== "undefined");

      return {
        isReady,
        categoryId,
        locationId,
        visaTypeId,
        visaSubTypeId,
        familyId,
        selfId,
        localLocationData,
      };
    };

    const maxAttempts = 200;
    let attempts = 0;
    const interval = setInterval(async () => {
      const result = await waitForElements();
      const { isReady, categoryId, locationId, visaTypeId, visaSubTypeId, familyId, selfId, localLocationData } = result;
      attempts++;

      if (isReady) {
        clearInterval(interval);

        // Step 1: Select Location
        if (!await selectDropdownOption(locationId, localLocationData, locationName, "Location")) {
          console.error("Location selection failed, aborting.");
          return;
        }
        await delay(200);

        // Step 2: Extract and select Visa Type
        let visaTypeOptions = visaTypeFilterData;
        if (!visaTypeOptions || visaTypeOptions.length === 0) {
          visaTypeOptions = await extractDropdownOptionsFromDOM(visaTypeId, "Visa Type");
        }
        if (!visaTypeOptions) {
          console.error("Failed to extract Visa Type options, aborting.");
          return;
        }

        if (!await selectDropdownOption(visaTypeId, visaTypeOptions, visaTypeName, "Visa Type")) {
          console.error("Visa Type selection failed, aborting.");
          return;
        }
        await delay(1000);

        // Step 3: Extract and select Visa Sub Type
        let visaSubTypeOptions = visasubIdFilterData;
        if (!visaSubTypeOptions || visaSubTypeOptions.length === 0 || !visaSubTypeOptions.some(opt => opt.Name === visaSubName)) {
          visaSubTypeOptions = await extractDropdownOptionsFromDOM(visaSubTypeId, "Visa Sub Type");
        }
        if (!visaSubTypeOptions) {
          console.error("Failed to extract Visa Sub Type options, aborting.");
          return;
        }

        if (!await selectDropdownOption(visaSubTypeId, visaSubTypeOptions, visaSubName, "Visa Sub Type")) {
          console.error("Visa Sub Type selection failed, aborting.");
          return;
        }
        await delay(200);

        // Step 4: Select Category
        if (!await selectDropdownOption(categoryId, categoryData, categoryName, "Category")) {
          console.error("Category selection failed, aborting.");
          return;
        }
        await delay(200);

        // Step 5: Handle Individual or Family selection
        const submitForm = () => {
          if (/on|true/.test(autoSubmitForms?.visaType)) {
            const submitButton = document.querySelector("#btnSubmit");
            if (submitButton) {
              console.log("Submitting form...");
              submitButton.click();
            } else {
              console.error("Submit button not found.");
            }
          } else {
            console.log("Auto-submit for Visa Type is disabled.");
          }
        };

        if (membersName === "I" || membersName === "1") {
          console.log("Individual appointment, skipping Family selection.");
          const selfElement = $("#" + selfId);
          if (selfElement.length) {
            selfElement.click();
            submitForm();
          } else {
            console.error("Individual radio button not found.");
          }
        } else {
          $("#familyDisclaimer").remove();
          const familyElement = $("#" + familyId);
          if (!familyElement.length) {
            console.error("Family radio button not found.");
            return;
          }
          console.log("Selecting Family option...");
          familyElement.click();
          console.log("Calling OnFamilyAccept...");
          OnFamilyAccept();

          // Step 6: Select Number Of Members after Family is selected
          let memberAttempts = 0;
          const maxMemberAttempts = 30;
          const memberInterval = setInterval(async () => {
            const familyMemberId = detectDropdown("Number Of Members*");
            if (familyMemberId) {
              let memberOptions = applicantsNoData;
              if (!memberOptions || memberOptions.length === 0) {
                memberOptions = await extractDropdownOptionsFromDOM(familyMemberId, "Number Of Members");
              }
              if (!memberOptions) {
                console.error("Failed to extract Number Of Members options, aborting.");
                clearInterval(memberInterval);
                return;
              }

              const targetMembers = `${membersName} Members`;
              if (await selectDropdownOption(familyMemberId, memberOptions, targetMembers, "Number Of Members")) {
                clearInterval(memberInterval);
                setTimeout(submitForm, 200);
              } else {
                console.error("Number Of Members selection failed, aborting.");
                clearInterval(memberInterval);
              }
            }

            memberAttempts++;
            if (memberAttempts >= maxMemberAttempts) {
              clearInterval(memberInterval);
              console.error("Timed out waiting for Number of Members dropdown.");
            }
          }, 100);
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.error("CAT class timed out: Required elements or data not found.");
      }
    }, 50);
  }
}

class LoginBot {
  start() {
    console.log(`${this.constructor.name} started`);

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
    if (!applicants.length) {
      console.error("No applicants defined. Cannot create user dropdown.");
      return;
    }

    const injectDropdown = () => {
      const $select = $(`
        <select id="_applicants" class="form-select form-select-lg mt-2" style="display: block; width: 100%; max-width: 300px; margin: 10px auto;">
          <option selected disabled>Select a User</option>
          ${applicants.map(
            ({ name, mail }) =>
              `<option value="${mail}">${name || mail}</option>`
          )}
        </select>
      `);

      const $target = $(".vstack.align-items-center.gap-2");
      if ($target.length) {
        $select.insertAfter($target).on("change", () => this.#fillForm());
        console.log(
          "User dropdown successfully injected with",
          applicants.length,
          "users."
        );
      } else {
        console.error(
          "Could not find profile photo section for user dropdown insertion."
        );
      }
    };

    const maxAttempts = 5;
    let attempts = 0;
    const interval = setInterval(() => {
      if ($(".vstack.align-items-center.gap-2").length) {
        clearInterval(interval);
        injectDropdown();
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.error(
          "Timed out waiting for profile photo section to inject user dropdown."
        );
      }
      attempts++;
    }, 100);
  }

  #fillForm() {
    const selectedMail = $("#_applicants").val();
    const applicant = applicants.find(({ mail }) => mail === selectedMail);

    $(":text[name]:visible").val(applicant?.mail);
    applicant?.profilePhotoId &&
      $("#_profilePhoto").attr(
        "src",
        `/DZA/query/getfile?fileid=${applicant.profilePhotoId}`
      );
    /on|true/.test(autoSubmitForms?.login) && $("#btnVerify").trigger("click");
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
      $.ajax({
        url: "/DZA/query/UploadProfileImage",
        type: "POST",
        contentType: false,
        processData: false,
        timeout: 15_000,
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
              `/DZA/query/getfile?fileid=${result.fileId}`
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
        .catch(() => alertify.error("Erreur lors de la copie !"));
    }
  }
}

class LoginCaptchaBot {
  start() {
    console.log(`${this.constructor.name} started`);

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
    return applicants.find(({ mail }) => mail === activemail);
  }

  #markTabWithCurrentUser(applicant) {
    applicant?.name && (document.title = applicant.name);
    applicant?.profilePhotoId &&
      $("img[alt=logo]")
        .addClass("img-thumbnail")
        .css({ width: "128px", height: "128px", objectFit: "cover" })
        .attr("src", `/DZA/query/getfile?fileid=${applicant.profilePhotoId}`);
  }

  #setPassword(applicant) {
    $(":password:visible").val(applicant?.password);
  }

  #solveCaptcha() {
    if (!(/on|true/.test(captcha.enabled) && captcha.apiKey)) return;

    const target = this.#getCaptchaTarget();
    const grid = this.#getCaptchaGrid();

    const extractCaptchaGridData = (grid) =>
      Object.fromEntries(grid.map((img) => img.src).entries());

    const onSuccess = (result) => {
      if (result.status === "solved") {
        Object.entries(result.solution).forEach(
          ([index, value]) => value === target && grid[index].click()
        );
        /on|true/.test(autoSubmitForms?.loginCaptcha) &&
          $("#btnVerify").trigger("click");
      } else {
        onError("captchaerror", result);
      }
    };
    const onError = (type, data) => {
      console.error(type, data);
      $(".validation-summary-valid").html("<b>Failed to solve captcha.</b>");
    };

    $.ajax({
      url: "https://pro.nocaptchaai.com/solve",
      type: "POST",
      headers: { apiKey: captcha.apiKey },
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        method: "ocr",
        id: "algeria",
        images: extractCaptchaGridData(grid),
      }),
      timeout: 15_000,
      beforeSend() {
        this._loading = $(`
          <div class="d-flex align-items-center justify-content-center lead text-warning">
            <span class="spinner-grow"></span>
             Solving captcha ...
          </div>
        `).prependTo(".main-div-container");
      },
      success: onSuccess,
      error(xhr, state) {
        onError(state, xhr);
      },
      complete(xhr, state) {
        this._loading?.remove();
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
    if (!(/on|true/.test(captcha.enabled) && captcha.apiKey)) return;

    const target = this.#getCaptchaTarget();
    const grid = this.#getCaptchaGrid();

    const extractCaptchaGridData = (grid) =>
      Object.fromEntries(grid.map((img) => img.src).entries());

    const onSuccess = (result) => {
      if (result.status === "solved") {
        Object.entries(result.solution).forEach(
          ([index, value]) => value === target && grid[index].click()
        );
        /on|true/.test(autoSubmitForms?.appointmentCaptcha) &&
          $("#btnVerify").trigger("click");
      } else {
        onError("captchaerror", result);
      }
    };
    const onError = (type, data) => {
      console.error(type, data);
      $(".validation-summary-valid").html("<b>Failed to solve captcha.</b>");
    };

    $.ajax({
      url: "https://pro.nocaptchaai.com/solve",
      type: "POST",
      headers: { apiKey: captcha.apiKey },
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        method: "ocr",
        id: "algeria",
        images: extractCaptchaGridData(grid),
      }),
      timeout: 15_000,
      beforeSend() {
        this._loading = $(`
          <div class="d-flex align-items-center justify-content-center lead text-warning">
            <span class="spinner-grow"></span>
             Solving captcha ...
          </div>
        `).prependTo(".main-div-container");
      },
      success: onSuccess,
      error(xhr, state) {
        onError(state, xhr);
      },
      complete(xhr, state) {
        this._loading?.remove();
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

      if (!allowedDates.length) return;

      const dataParam = encodeURIComponent(
        new URLSearchParams(location.search).get("data")
      );

      global.ShowLoader();
      let earliestValidDate = null;
      let earliestAvailableSlots = null;

      allowedDates.forEach((date, index) => {
        setTimeout(() => {
          const url = `/DZA/appointment/GetAvailableSlotsByDate?data=${dataParam}&appointmentDate=${date.DateText}`;
          $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            success: (data) => {
              if (data.success) {
                const availableSlots = data.data.filter((s) => s.Count > 0);
                this.#slotCache.set(date.DateText, availableSlots);

                if (availableSlots.length > 0) {
                  if (
                    !earliestValidDate ||
                    new Date(date.DateText) < new Date(earliestValidDate)
                  ) {
                    earliestValidDate = date.DateText;
                    earliestAvailableSlots = availableSlots;
                  }
                }
              } else {
                global.ShowError(data.err);
              }
            },
            error: (xhr, status) => {
              global.ShowError(`Failed to fetch available slots: ${status}`);
            },
            complete: () => {
              if (index === allowedDates.length - 1) {
                global.HideLoader();

                if (earliestValidDate) {
                  const datePicker = $(".k-datepicker:visible .k-input").data(
                    "kendoDatePicker"
                  );
                  datePicker.value(earliestValidDate);
                  datePicker.trigger("change");

                  this.#sendSlotAvailabilityNotification();
                  this.#selectAndSubmitNearestSlot(earliestValidDate);
                }
              }
            },
          });
        }, 500 * index);
      });
    });
  }

  #sendSlotAvailabilityNotification() {
    const category = visaConfigs[applicants[0].config].visaSubName;
    const categoryType = localStorage.getItem("categoryName") || "Normal";
    const location = visaConfigs[applicants[0].config].locationName;
    const validCategories = ["Normal", "Premium", "Prime Time"];

    if (!categoryType || !validCategories.includes(categoryType)) {
      console.error(
        `Invalid or missing category in localStorage. Expected one of ${validCategories.join(
          ", "
        )}, but got: ${categoryType}`
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
      console.error("No slots available to report in notification.");
      return;
    }

    const message = `**Slot Selection - Algeria**\n\n${location}\n\n${categoryType}\n\n${category}\n\n${slotsByDateMessage}By: @zaemch 🚀`;
    sendTelegramMessage(message);
  }

  #selectAndSubmitNearestSlot(apptDate) {
    const dataParam = encodeURIComponent(
      new URLSearchParams(location.search).get("data")
    );
    $.ajax({
      type: "POST",
      url: `/DZA/appointment/GetAvailableSlotsByDate?data=${dataParam}&appointmentDate=${apptDate}`,
      dataType: "json",
      async: false,
      success: (data) => {
        if (data.success) {
          const availableSlots = data.data.filter((s) => s.Count > 0);
          if (availableSlots.length > 0) {
            const selectedSlot = availableSlots.reduce((best, current) => {
              const bestTime = best.Name;
              const currentTime = current.Name;
              return current.Count > best.Count ||
                (current.Count === best.Count && currentTime < bestTime)
                ? current
                : best;
            }, availableSlots[0]);

            const slotDropDown = $(".k-dropdown:visible > .form-control").data(
              "kendoDropDownList"
            );
            slotDropDown.setDataSource(data.data);
            slotDropDown.value(selectedSlot.Id);

            speechSynthesis.speak(
              new SpeechSynthesisUtterance("Rendez-vous disponible !!!")
            );
            GM_setValue("selected_slot", selectedSlot.Name);
            GM_setValue("selected_date", apptDate);

            if (/on|true/.test(autoSubmitForms?.slotSelection)) {
              $("#btnSubmit").trigger("click");
            }
          } else {
            console.error(`No available slots for date: ${apptDate}`);
          }
        } else {
          global.ShowError(data.err);
          data.ru &&
            global.confirm(`You will be redirected to: ${data.ru}`) &&
            global.location.replace(data.ru);
        }
      },
      error: (xhr, status, error) => {
        console.error(`Failed to fetch available slots: ${status}, ${error}`);
        global.ShowError(`Failed to fetch available slots: ${status}`);
      },
      complete: () => {
        global.HideLoader();
      },
    });
  }

  #selectCachedSlot(apptDate) {
    const slotDropDown = $(".k-dropdown:visible > .form-control").data(
      "kendoDropDownList"
    );
    if (!apptDate) {
      slotDropDown.value(undefined);
      slotDropDown.setDataSource([]);
      return false;
    }

    const dataParam = encodeURIComponent(
      new URLSearchParams(location.search).get("data")
    );
    $.ajax({
      type: "POST",
      url: `/DZA/appointment/GetAvailableSlotsByDate?data=${dataParam}&appointmentDate=${apptDate}`,
      dataType: "json",
      success: (data) => {
        if (data.success) {
          const availableSlots = data.data.filter((s) => s.Count > 0);
          this.#slotCache.set(apptDate, availableSlots);
          this.#selectSlotTime(data.data, availableSlots, apptDate);
        } else {
          global.ShowError(data.err);
          data.ru &&
            global.confirm(`You will be redirected to: ${data.ru}`) &&
            global.location.replace(data.ru);
        }
      },
      error: (xhr, status, error) => {
        console.error(`Failed to fetch available slots: ${status}, ${error}`);
        global.ShowError(`Failed to fetch available slots: ${status}`);
      },
      complete: () => {
        global.HideLoader();
      },
    });
  }

  #selectSlotTime(slots, availableSlots, apptDate) {
    if (!availableSlots.length) return;

    const selectedSlot = availableSlots.reduce((best, current) => {
      const bestTime = best.Name;
      const currentTime = current.Name;
      return current.Count > best.Count ||
        (current.Count === best.Count && currentTime < bestTime)
        ? current
        : best;
    }, availableSlots[0]);

    if (selectedSlot) {
      speechSynthesis.speak(
        new SpeechSynthesisUtterance("Rendez-vous disponible !!!")
      );

      const slotDropDown = $(".k-dropdown:visible > .form-control").data(
        "kendoDropDownList"
      );
      slotDropDown.setDataSource(slots);
      slotDropDown.value(selectedSlot.Id);

      GM_setValue("selected_slot", selectedSlot.Name);
      GM_setValue("selected_date", apptDate);

      window.print();

      if (/on|true/.test(autoSubmitForms?.slotSelection)) {
        $(() => $("#btnSubmit").trigger("click"));
      }
    }
  }
}

class ApplicantSelectionBot {
  start() {
    console.log(`${this.constructor.name} started`);

    $(".modal:not(#logoutModal)").on("show.bs.modal", (evt) =>
      evt.preventDefault()
    );

    this.#hidePreloader();
    this.#makeLoaderDismissable();
    this.#removeRandomnessFromUi();

    const applicant = this.#getActiveApplicant();

    applicant?.profilePhotoId &&
      $("#ApplicantPhotoId").val(applicant.profilePhotoId),
      $("#uploadfile-1-preview").attr(
        "src",
        `/DZA/query/getfile?fileid=${applicant.profilePhotoId}`
      );

    $("div[id^=app-]").first().trigger("click");

    this.#sendApplicantSelectionNotification(applicant);

    this.#remonitorOtp();

    $(() => {
      const oneMonthLater = new Date();
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
      $("#TravelDate").data("kendoDatePicker").value(oneMonthLater);

      $("#EmailCode").prop("oncopy", null).prop("onpaste", null);
    });
  }

  #sendApplicantSelectionNotification(applicant) {
    const category = visaConfigs[applicant.config].visaSubName;
    const categoryType = localStorage.getItem("categoryName");
    const location = visaConfigs[applicant.config].locationName;
    const validCategories = ["Normal", "Premium", "Prime Time"];

    if (!categoryType || !validCategories.includes(categoryType)) {
      console.error(
        `Invalid or missing category in localStorage. Expected one of ${validCategories.join(
          ", "
        )}, but got: ${categoryType}`
      );
      return;
    }

    const selectedDate = GM_getValue("selected_date", "Unknown");
    const selectedSlot = GM_getValue("selected_slot", "Unknown");

    const message = `**Applicant Selection - Algeria**\n\n${location}\n\n${categoryType}\n\n${category}\n\n${selectedDate}\n${selectedSlot}\n\nBy: @zaemch 🚀`;
    sendTelegramMessage(message);
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
    $("#div-main > :has(form)")
      .removeClass((_, className) => className.match(/col-(?:sm|md)-\d/g))
      .addClass(["col-md-6", "mx-auto"]);
  }

  #getActiveApplicant() {
    const activeMail = $(".avatar + > p.small").text();
    return applicants.find(({ mail }) => mail === activeMail);
  }

  #remonitorOtp() {
    const stop = () => {
      $(":is(.spinner-grow, .bi-check-lg):has(+ #EmailCode)").remove();
      GM_removeValueChangeListener(this._fetchOtpListenerId);
      GM_setValue("code_otp");
    };

    stop();
    $(`
      <span class="spinner-grow spinner-grow-sm text-primary ms-2"></span>
    `).insertBefore("#EmailCode");
    this._fetchOtpListenerId = GM_addValueChangeListener(
      "code_otp",
      (_name, _prev, otp, remote) => {
        if (remote && otp) {
          stop();
          $("#EmailCode").val(otp);
          $(`<i class="bi bi-check-lg text-success"></i>`).insertBefore(
            "#EmailCode"
          );
          /on|true/.test(autoSubmitForms?.applicantSelection) &&
            $("#btnSubmit").trigger("click");
        }
      }
    );
  }
}

class GmailBot {
  install() {
    setInterval(() => this.#displayUnreadEmails(), 100);
  }

  #displayUnreadEmails() {
    const emails = document.querySelectorAll(".zE");
    if (emails.length > 0) {
      for (let i = 0; i < 3; i++) {
        const email = emails[i];
        if (!email) continue;
        const subject = email.querySelector(".bA4 span")?.textContent;
        if (subject && /blsspainglobal|blsinternation/.test(subject)) {
          email.click();
          email.classList.remove("zE");
          setTimeout(() => this.#extractEmailContent(), 150);
          break;
        }
      }
    }
  }

  #extractEmailContent() {
    const emailBody = document.querySelector(".a3s");
    if (emailBody) {
      const content = emailBody.innerHTML;
      if (content) {
        const codeMatch = content.match(/\b(\d{6})\b/);
        if (codeMatch) {
          const code = codeMatch[1];
          GM_setValue("code_otp", code);
          const closeButton = document.querySelector(".nU.n1");
          if (closeButton) {
            closeButton.click();
          }
        }
      }
    }
  }
}

class PaymentResponseBot {
  start() {
    console.log(`${this.constructor.name} started`);

    const applicant = this.#getActiveApplicant();
    this.#hidePreloader();
    this.#makeLoaderDismissable();
    this.#removeRandomnessFromUi();
    this.#sendPaymentResponseNotification(applicant);
  }

  #getActiveApplicant() {
    const activeMail = $(".avatar + > p.small").text();
    return applicants.find(({ mail }) => mail === activeMail);
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
    $("#div-main > :has(.card)").addClass("mx-auto");
  }

  #sendPaymentResponseNotification(applicant) {
    const category = visaConfigs[applicant.config].visaSubName;
    const categoryType = localStorage.getItem("categoryName");
    const location = visaConfigs[applicant.config].locationName;
    const validCategories = ["Normal", "Premium", "Prime Time"];

    if (!categoryType || !validCategories.includes(categoryType)) {
      console.error(
        `Invalid or missing category in localStorage. Expected one of ${validCategories.join(
          ", "
        )}, but got: ${categoryType}`
      );
      return;
    }

    const selectedDate = GM_getValue("selected_date", "Unknown");
    const selectedSlot = GM_getValue("selected_slot", "Unknown");

    const message = `**Congratulation - Algeria**\n\n${location}\n\n${categoryType}\n\n${category}\n\n${selectedDate}\n${selectedSlot}\n\nBy: @zaemch 🚀`;
    sendTelegramMessage(message);
  }
}

// Main execution logic
if (location.hostname === "algeria.blsspainglobal.com") {
  switch (true) {
    case matchPath("/DZA/account/login") || matchPath("/dza/account/login"):
      new LoginBot().start();
      break;
    case matchPath("/DZA/newcaptcha/logincaptcha") || matchPath("/dza/newcaptcha/logincaptcha"):
      new LoginCaptchaBot().start();
      break;
    case matchPath("/DZA/Appointment/AppointmentCaptcha") || matchPath("/dza/Appointment/AppointmentCaptcha"):
      new AppointmentCaptchaBot().start();
      break;
    case matchPath("/DZA/Appointment/VisaType") || matchPath("/dza/Appointment/VisaType"):
      new CAT().start();
      break;
    case matchPath("/DZA/Appointment/SlotSelection") || matchPath("/dza/Appointment/SlotSelection"):
      new SlotSelectionBot().start();
      break;
    case matchPath("/DZA/Appointment/ApplicantSelection") || matchPath("/dza/Appointment/ApplicantSelection"):
      new ApplicantSelectionBot().start();
      break;
    case matchPath("/DZA/Appointment/payment/paymentresponse") || matchPath("/dza/Appointment/payment/paymentresponse"):
      new PaymentResponseBot().start();
      break;
  }
} else if (location.hostname === "mail.google.com") {
  new GmailBot().install();
}

// Navbar modifications
if (matchPath("/DZA") || matchPath("/dza") || matchPath("/DZA/home") || matchPath("/dza/home") || matchPath("/DZA/home/index") || matchPath("/dza/home/index")) {
  const navContainer = document.querySelector("nav.navbar, .navbar-expand-xl");
  if (navContainer) {
    navContainer.style.display = "flex";
    navContainer.style.alignItems = "center";
    navContainer.style.justifyContent = "space-between";

    creatBTN(
      "GO TO LOGIN",
      "nav.navbar, .navbar-expand-xl",
      () => redirectTo("https://algeria.blsspainglobal.com/DZA/account/login"),
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
}