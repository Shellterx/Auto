"use strict"; // new

// Dependency check (removed illegal return statement)
if (!window.jQuery || !window.alertify || !window.axios) {
  console.error("Required dependencies (jQuery, alertify, axios) are not loaded.");
} else {
  console.log("All dependencies are loaded");
}

function initializeMAFIAMAR() {
  console.log("Initializing MAFIAMAR core...");

  // Access global variables
  const applicants = unsafeWindow.applicants;
  const visaConfigs = unsafeWindow.visaConfigs;
  const captcha = unsafeWindow.captcha;
  const autoSubmitForms = unsafeWindow.autoSubmitForms;

  if (!applicants || !visaConfigs || !captcha || !autoSubmitForms) {
    console.error("Required global variables (applicants, visaConfigs, captcha, autoSubmitForms) are not defined.");
    return;
  }

  // Expose sendTelegramMessage to global scope
  unsafeWindow.sendTelegramMessage = sendTelegramMessage;

  // Core variables
  var locationName = visaConfigs[applicants[0].config].locationName;
  var visaTypeName = visaConfigs[applicants[0].config].visaTypeName;
  var visaSubName = visaConfigs[applicants[0].config].visaSubName;
  var membersName = applicants[0].membersName;
  var categoryName = localStorage.getItem("categoryName") || "Normal";

  // Category change logic
  if (
    window.location.href.startsWith(
      "https://www.blsspainmorocco.net/mar/Appointment/NewAppointment?msg="
    ) ||
    window.location.href.startsWith(
      "https://www.blsspainmorocco.net/MAR/Appointment/NewAppointment?msg="
    )
  ) {
    function changeCategory(newCategory) {
      localStorage.setItem("categoryName", newCategory);
      window.location.href = "/mar/appointment/newappointment";
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
    } else {
      console.error("#div-main not found for category buttons");
    }

    const tryAgainLink = Array.from(
      document.querySelectorAll("a.btn.btn-primary")
    ).find(
      (link) =>
        link.textContent.trim() === "Try Again" &&
        link.getAttribute("href") === "/mar/appointment/newappointment"
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
    } else {
      console.log("Try Again link not found");
    }
  }

  // Modal handling
  setTimeout(() => {
    $(".modal").modal("hide");
    console.log("Hiding modals");
  }, 500);

  setTimeout(() => {
    const button1 = document.querySelector(
      '.btn.btn-success.btn-block[type="button"][data-bs-dismiss="modal"][onclick="onBioDisclaimerAccept();"]'
    );
    if (button1) {
      button1.click();
      console.log("Clicked onBioDisclaimerAccept button");
      setTimeout(() => {
        const button2 = document.querySelector(
          '.btn.btn-success.btn-block[type="button"][data-bs-dismiss="modal"][onclick="onDpAccept();"]'
        );
        if (button2) {
          button2.click();
          console.log("Clicked onDpAccept button");
        } else {
          console.log("onDpAccept button not found");
        }
      }, 300);
    } else {
      console.log("onBioDisclaimerAccept button not found");
    }
  }, 400);

  // Redirect logic
  if (
    window.location.href ===
    "https://www.blsspainmorocco.net/mar/account/changepassword?alert=True" ||
    window.location.href ===
    "https://www.blsspainmorocco.net/MAR/account/changepassword?alert=True"
  ) {
    window.location.href =
      "https://www.blsspainmorocco.net/mar/appointment/appointmentcaptcha";
    console.log("Redirecting to appointmentcaptcha");
  }

  if (
    window.location.href ===
    "https://www.blsspainmorocco.net/mar/Appointment/NewAppointment?msg=lfJQVX2NULaGjPKL6fTAx8BtSHJVTsEgaj1lwdqOSsc%3D" ||
    window.location.href ===
    "https://www.blsspainmorocco.net/MAR/Appointment/NewAppointment?msg=lfJQVX2NULaGjPKL6fTAx8BtSHJVTsEgaj1lwdqOSsc%3D"
  ) {
    window.location.href =
      "https://www.blsspainmorocco.net/mar/appointment/newappointment";
    console.log("Redirecting to newappointment");
  }

  // Utility functions
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
      console.log("Reloading page due to error:", pageTitle);
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
    button.onmouseover = () => (button.style.backgroundColor = darkenColor(color));
    button.onmouseout = () => (button.style.backgroundColor = color);
    button.onclick = onClick;

    const target = document.querySelector(targetSelector);
    if (target) {
      target.appendChild(button);
      console.log(`Button '${text}' added to ${targetSelector}`);
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
    console.log(`Redirecting to ${url}`);
  }

  // Classes
  class CAT {
    start() {
      console.log(`${this.constructor.name} started`);

      $("#visaTypeMessage").remove();
      $("#PremiumTypeModel").remove();
      $("VisaTypeModel").remove();
      console.log("Removed visa type messages and models");

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
          typeof visaTypeFilterData !== "undefined " &&
          typeof visasubIdFilterData !== "undefined" &&
          typeof categoryData !== "undefined" &&
          (membersName === "I" || typeof applicantsNoData !== "undefined");

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
            const applicantConfig = visaConfigs[applicants[0].config];
            locationName = applicantConfig.locationName;
            visaTypeName = applicantConfig.visaTypeName;
            visaSubName = applicantConfig.visaSubName;

            var selectedLocation = locationData.find(
              (location) => location.Name === locationName
            );
            if (!selectedLocation) {
              console.error(`Location ${locationName} not found in locationData.`);
              return;
            }
            var dropdownlistLocation = $("#" + locationId).data(
              "kendoDropDownList"
            );
            dropdownlistLocation.value(selectedLocation.Id);
            dropdownlistLocation.trigger("change");
            console.log(`Selected location: ${locationName}`);

            var selectedVisaType = visaTypeFilterData.find(
              (visaType) => visaType.Name === visaTypeName
            );
            if (!selectedVisaType) {
              console.error(`Visa Type ${visaTypeName} not found in visaTypeFilterData.`);
              return;
            }
            var dropdownlistVisaType = $("#" + visaTypeId).data(
              "kendoDropDownList"
            );
            dropdownlistVisaType.value(selectedVisaType.Id);
            dropdownlistVisaType.trigger("change");
            console.log(`Selected visa type: ${visaTypeName}`);

            var selectedVisaSub = visasubIdFilterData.find(
              (visaSub) => visaSub.Name === visaSubName
            );
            if (!selectedVisaSub) {
              console.error(`Visa Sub Type ${visaSubName} not found in visasubIdFilterData.`);
              return;
            }
            var dropdownlistVisaSub = $("#" + visaSubTypeId).data(
              "kendoDropDownList"
            );
            dropdownlistVisaSub.value(selectedVisaSub.Id);
            dropdownlistVisaSub.trigger("change");
            console.log(`Selected visa sub type: ${visaSubName}`);

            var selectedCategory = categoryData.find(
              (category) => category.Name === categoryName
            );
            if (!selectedCategory) {
              console.error(`Category ${categoryName} not found in categoryData.`);
              return;
            }
            var dropdownlistCategory = $("#" + categoryId).data(
              "kendoDropDownList"
            );
            dropdownlistCategory.value(selectedCategory.Id);
            dropdownlistCategory.trigger("change");
            console.log(`Selected category: ${categoryName}`);

            if (membersName !== "I") {
              $("#familyDisclaimer").remove();
              var familyElement = $("#" + familyId);
              familyElement.click();
              OnFamilyAccept();
              console.log("Family option selected");

              var selectedMembers = applicantsNoData.find(
                (members) => members.Name === membersName
              );
              if (!selectedMembers) {
                console.error(`Members ${membersName} not found in applicantsNoData.`);
                return;
              }
              var dropdownlistMembers = $("#" + familyMemberId).data(
                "kendoDropDownList"
              );
              dropdownlistMembers.value(selectedMembers.Id);
              dropdownlistMembers.trigger("change");
              console.log(`Selected members: ${membersName}`);
            }

            if (/on|true/.test(autoSubmitForms?.visaType)) {
              var submitButton = document.querySelector("#btnSubmit");
              if (submitButton) {
                submitButton.click();
                console.log("Auto-submitted visa type form");
              } else {
                console.error("#btnSubmit not found for auto-submit");
              }
            } else {
              console.log(
                "Auto-submit for Visa Type is disabled (autoSubmitForms.visaType is off)."
              );
            }
          } catch (error) {
            console.error("CAT class error:", error);
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error(
            "CAT class timed out: Required elements or data not found after 30 seconds."
          );
        }
      }, 300);
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
      console.log("Hid preloader");
    }

    #makeLoaderDismissable() {
      $(`
        <button class="btn btn-secondary position-absolute top-50 start-50 translate-middle-x mt-5"
                onclick="window.HideLoader();">
          Hide Loader</button>
      `).appendTo(".global-overlay-loader");
      console.log("Added dismissable loader button");
    }

    #removeRandomnessFromUi() {
      // Update selector based on current page structure
      const mainContainer = $(".container:has(form)");
      if (mainContainer.length) {
        mainContainer.find("> .row > [class^=col-]").hide();
        mainContainer.find("> .row > :has(form)").addClass("mx-auto");
        $(":has(> form)").removeAttr("class");
        console.log("Removed randomness from UI");
      } else {
        console.error("Main container with form not found for UI cleanup");
      }
    }

    #enableCopyPasteInInputs() {
      $("input[type='text']:visible").off("copy paste").on("copy paste", (evt) => {
        evt.stopImmediatePropagation();
      });
      console.log("Enabled copy-paste in inputs");
    }

    #setReturnUrl() {
      const newAppLink = $(".new-app-active");
      if (newAppLink.length) {
        $("#ReturnUrl").val(newAppLink.attr("href"));
        console.log("Set ReturnUrl to:", newAppLink.attr("href"));
      } else {
        console.log(".new-app-active link not found for ReturnUrl");
      }
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

        // Update selector based on screenshot: target the container above the email input
        const $target = $("form .form-group:has(input[type='text'])");
        if ($target.length) {
          $select.insertAfter($target).on("change", () => this.#fillForm());
          console.log(
            "User dropdown successfully injected with",
            applicants.length,
            "users."
          );
        } else {
          console.error(
            "Could not find form-group with email input for user dropdown insertion."
          );
        }
      };

      const maxAttempts = 20;
      let attempts = 0;
      const interval = setInterval(() => {
        if ($("form .form-group:has(input[type='text'])").length) {
          clearInterval(interval);
          injectDropdown();
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error(
            "Timed out waiting for form-group to inject user dropdown."
          );
        }
        attempts++;
      }, 500);
    }

    #fillForm() {
      const selectedMail = $("#_applicants").val();
      const applicant = applicants.find(({ mail }) => mail === selectedMail);

      if (applicant) {
        $("input[type='text']:visible").val(applicant.mail);
        console.log(`Filled email input with: ${applicant.mail}`);
        if (applicant.profilePhotoId) {
          $("#_profilePhoto").attr(
            "src",
            `/mar/query/getfile?fileid=${applicant.profilePhotoId}`
          );
          console.log("Updated profile photo source");
        }
        if (/on|true/.test(autoSubmitForms?.login)) {
          const verifyButton = $("button:contains('Verify')");
          if (verifyButton.length) {
            verifyButton.trigger("click");
            console.log("Auto-submitted login form");
          } else {
            console.error("Verify button not found for auto-submit");
          }
        }
      } else {
        console.error("Applicant not found for email:", selectedMail);
      }
    }

    #injectProfilePhotoUploadFeature() {
      const photoSection = $(`
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
      `);

      // Update selector: insert after the logo image
      const $logo = $("img[alt*='logo']");
      if ($logo.length) {
        photoSection.insertAfter($logo.parent());
        photoSection
          .on("change", "#_profilePhotoFile", () => this.#uploadProfilePhoto())
          .on("click", "#_copyProfilePhotoId", () => this.#copyProfilePhotoId());
        console.log("Injected profile photo upload feature");
      } else {
        console.error("Logo image not found for profile photo insertion");
      }
    }

    #uploadProfilePhoto() {
      const target = $("#_profilePhotoFile");

      const [file] = target.prop("files");
      if (file) {
        $.post({
          url: "/mar/query/UploadProfileImage",
          contentType: false,
          processData: false,
          timeout: 30_000,
          beforeSend() {
            this.data = new FormData();
            this.data.append("file", file);
            $("#_uploadProfilePhotobtn").addClass("disabled");
            console.log("Uploading profile photo...");
          },
          success(result) {
            if (result.success) {
              $("#_profilePhotoId").val(result.fileId);
              $("#_profilePhoto").attr(
                "src",
                `/mar/query/getfile?fileid=${result.fileId}`
              );
              console.log("Profile photo uploaded successfully, fileId:", result.fileId);
            } else {
              global.ShowError(result.err);
              console.error("Profile photo upload failed:", result.err);
            }
          },
          error(xhr, type) {
            global.ShowError(
              `Failed to upload profile photo. ${type} (${xhr.status}).`
            );
            console.error(`Profile photo upload error: ${type} (${xhr.status})`);
          },
          complete() {
            $("#_uploadProfilePhotobtn").removeClass("disabled");
            target.val(undefined);
            console.log("Profile photo upload process completed");
          },
        });
      } else {
        console.log("No file selected for profile photo upload");
      }
    }

    #copyProfilePhotoId() {
      alertify.set("notifier", "position", "top-center");
      const profilePhotoId = $("#_profilePhotoId").val();
      if (profilePhotoId) {
        navigator.clipboard
          .writeText(profilePhotoId)
          .then(() => {
            alertify.success("Copié avec Succès !");
            console.log("Profile photo ID copied:", profilePhotoId);
          })
          .catch((err) => {
            alertify.error("Erreur lors de la copie !");
            console.error("Failed to copy profile photo ID:", err);
          });
      } else {
        console.log("No profile photo ID to copy");
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
      console.log("Made loader dismissable and translucent");
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
      console.log("Removed randomness from UI for captcha page");
    }

    #enableCopyPasteInInputs() {
      $(".entry-disabled:visible").off("copy paste");
      console.log("Enabled copy-paste in inputs for captcha page");
    }

    #getActiveApplicant() {
      const activemail = $(":contains(Email:) > b").text();
      const applicant = applicants.find(({ mail }) => mail === activemail);
      if (applicant) {
        console.log("Active applicant:", applicant.name);
      } else {
        console.log("No active applicant found for email:", activemail);
      }
      return applicant;
    }

    #markTabWithCurrentUser(applicant) {
      if (applicant?.name) {
        document.title = applicant.name;
        console.log("Set page title to:", applicant.name);
      }
      if (applicant?.profilePhotoId) {
        $("img[alt=logo]")
          .addClass("img-thumbnail")
          .css({ width: "128px", height: "128px", objectFit: "cover" })
          .attr("src", `/mar/query/getfile?fileid=${applicant.profilePhotoId}`);
        console.log("Updated logo with profile photo");
      }
    }

    #setPassword(applicant) {
      const passwordInput = $(":password:visible");
      if (passwordInput.length && applicant?.password) {
        passwordInput.val(applicant.password);
        console.log("Set password input");
      } else {
        console.log("Password input not found or no password available");
      }
    }

    #solveCaptcha() {
      if (!(/on|true/.test(captcha.enabled) && captcha.apiKey)) {
        console.log("Captcha solving disabled or API key missing");
        return;
      }

      const target = this.#getCaptchaTarget();
      const grid = this.#getCaptchaGrid();

      const extractCaptchaGridData = (grid) =>
        Object.fromEntries(grid.map((img) => img.src).entries());

      const onSuccess = (result) => {
        if (result.status === "solved") {
          Object.entries(result.solution).forEach(
            ([index, value]) => value === target && grid[index].click()
          );
          if (/on|true/.test(autoSubmitForms?.loginCaptcha)) {
            $("#btnVerify").trigger("click");
            console.log("Auto-submitted login captcha form");
          }
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
        headers: { apiKey: captcha.apiKey },
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
          console.log("Solving captcha...");
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
      const target = $(".box-label")
        .sort((a, b) => getComputedStyle(b).zIndex - getComputedStyle(a).zIndex)
        .first()
        .text()
        .replace(/\D+/, "");
      console.log("Captcha target:", target);
      return target;
    }

    #getCaptchaGrid() {
      const grid = $(":has(> .captcha-img):visible")
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
      console.log("Captcha grid elements:", grid.length);
      return grid;
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
      console.log("Hid preloader");
    }

    #makeLoaderDismissable() {
      $(`
        <button class="btn btn-secondary position-absolute top-50 start-50 translate-middle-x mt-5"
                onclick="window.HideLoader();">
          Hide Loader</button>
      `).appendTo(".global-overlay-loader");
      console.log("Added dismissable loader button");
    }

    #removeRandomnessFromUi() {
      $(".row:has(> .captcha-div) > [class^=col-]").hide();
      $(".captcha-div").addClass("mx-auto");
      console.log("Removed randomness from UI for appointment captcha");
    }

    #solveCaptcha() {
      if (!(/on|true/.test(captcha.enabled) && captcha.apiKey)) {
        console.log("Captcha solving disabled or API key missing");
        return;
      }

      const target = this.#getCaptchaTarget();
      const grid = this.#getCaptchaGrid();

      const extractCaptchaGridData = (grid) =>
        Object.fromEntries(grid.map((img) => img.src).entries());

      const onSuccess = (result) => {
        if (result.status === "solved") {
          Object.entries(result.solution).forEach(
            ([index, value]) => value === target && grid[index].click()
          );
          if (/on|true/.test(autoSubmitForms?.appointmentCaptcha)) {
            $("#btnVerify").trigger("click");
            console.log("Auto-submitted appointment captcha form");
          }
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
        headers: { apiKey: captcha.apiKey },
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
          console.log("Solving captcha...");
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
      const target = $(".box-label")
        .sort((a, b) => getComputedStyle(b).zIndex - getComputedStyle(a).zIndex)
        .first()
        .text()
        .replace(/\D+/, "");
      console.log("Captcha target:", target);
      return target;
    }

    #getCaptchaGrid() {
      const grid = $(":has(> .captcha-img):visible")
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
      console.log("Captcha grid elements:", grid.length);
      return grid;
    }
  }

  class SlotSelectionBot {
    #slotCache = new Map();
    #slotSelected = false;

    start() {
      console.log(`${this.constructor.name} started`);

      this.#hidePreloader();
      this.#makeLoaderDismissable();
      this.#removeRandomnessFromUi();
      Object.assign(global, {
        OnAppointmentdateChange: (date) => {
          if (!this.#slotSelected) {
            return this.#selectCachedSlot(date);
          }
          console.log("Slot already selected, ignoring date change.");
          return false;
        },
      });
      this.#prefetchSlots();
    }

    #hidePreloader() {
      $(".preloader").hide();
      console.log("Hid preloader");
    }

    #makeLoaderDismissable() {
      $(`
        <button class="btn btn-secondary position-absolute top-50 start-50 translate-middle-x mt-5"
                onclick="window.HideLoader();">
          Hide Loader</button>
      `).appendTo(".global-overlay-loader");
      console.log("Added dismissable loader button");
    }

    #removeRandomnessFromUi() {
      $("#div-main > :is(:first-child, :last-child)").removeClass().hide();
      $("#div-main > :has(form)").addClass("mx-auto");
      $("form > div:nth-child(2)")
        .addClass("gap-4")
        .children("div")
        .removeClass((_, className) => className.match(/m[tb]-\d/g));
      $("div:has(> #btnSubmit)").addClass("mt-5");
      console.log("Removed randomness from UI for slot selection");
    }

    async #fetchSlotsWithDelay(url) {
      return new Promise((resolve) => {
        $.ajax({
          type: "POST",
          url: url,
          dataType: "json",
          timeout: 10000,
        }).then(
          (response) => {
            console.log(`Fetched slots for ${url}`);
            resolve({ success: true, data: response });
          },
          (xhr, status, error) => {
            console.error(`Failed to fetch slots: ${status}, ${error}`);
            resolve({ success: false, error: `${status}: ${error}` });
          }
        );
      });
    }

    async #prefetchSlots() {
      $(async () => {
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

        global.ShowLoader();
        let earliestValidDate = null;
        let earliestAvailableSlots = null;

        for (const date of allowedDates) {
          if (this.#slotSelected) {
            console.log("Slot already selected, stopping further fetches.");
            break;
          }

          const url = `/mar/appointment/GetAvailableSlotsByDate?data=${dataParam}&appointmentDate=${date.DateText}`;
          console.log(`Fetching slots for ${date.DateText}...`);
          const result = await this.#fetchSlotsWithDelay(url);

          if (result.success && result.data.success) {
            const availableSlots = result.data.data.filter((s) => s.Count > 0);
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
            console.error(`Error fetching slots for ${date.DateText}: ${result.error || result.data.err}`);
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        global.HideLoader();

        if (earliestValidDate && earliestAvailableSlots) {
          const datePicker = $(".k-datepicker:visible .k-input").data(
            "kendoDatePicker"
          );
          datePicker.value(earliestValidDate);
          datePicker.trigger("change");

          this.#sendSlotAvailabilityNotification();
          this.#selectAndSubmitNearestSlot(earliestValidDate);
        } else {
          console.error("No available slots found for any date.");
        }
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

      const message = `**Slot Selection**\n\n${location}\n\n${categoryType}\n\n${category}\n\n${slotsByDateMessage}By: @zaemch 🚀`;
      sendTelegramMessage(message);
      console.log("Sent slot availability notification");
    }

    #selectAndSubmitNearestSlot(apptDate) {
      if (this.#slotSelected) {
        console.log("Slot already selected, skipping submission.");
        return;
      }

      const dataParam = encodeURIComponent(
        new URLSearchParams(location.search).get("data")
      );
      $.ajax({
        type: "POST",
        url: `/mar/appointment/GetAvailableSlotsByDate?data=${dataParam}&appointmentDate=${apptDate}`,
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

              this.#slotSelected = true;

              if (/on|true/.test(autoSubmitForms?.slotSelection)) {
                $("#btnSubmit").trigger("click");
                console.log("Auto-submitted slot selection form");
              }
            } else {
              console.error(`No available slots for date: ${apptDate}`);
            }
          } else {
            global.ShowError(data.err);
            console.error("Slot selection error:", data.err);
            if (data.ru) {
              const confirmed = global.confirm(`You will be redirected to: ${data.ru}`);
              if (confirmed) {
                global.location.replace(data.ru);
              }
            }
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
      if (this.#slotSelected) {
        console.log("Slot already selected, ignoring date change.");
        return false;
      }

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
        url: `/mar/appointment/GetAvailableSlotsByDate?data=${dataParam}&appointmentDate=${apptDate}`,
        dataType: "json",
        success: (data) => {
          if (data.success) {
            const availableSlots = data.data.filter((s) => s.Count > 0);
            this.#slotCache.set(apptDate, availableSlots);
            this.#selectSlotTime(data.data, availableSlots, apptDate);
          } else {
            global.ShowError(data.err);
            console.error("Slot selection error:", data.err);
            if (data.ru) {
              const confirmed = global.confirm(`You will be redirected to: ${data.ru}`);
              if (confirmed) {
                global.location.replace(data.ru);
              }
            }
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
      if (this.#slotSelected) {
        console.log("Slot already selected, skipping slot time selection.");
        return;
      }

      if (!availableSlots.length) {
        console.error(`No available slots for date: ${apptDate}`);
        return;
      }

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

        this.#slotSelected = true;

        if (/on|true/.test(autoSubmitForms?.slotSelection)) {
          $(() => $("#btnSubmit").trigger("click"));
          console.log("Auto-submitted slot selection form");
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

      if (applicant?.profilePhotoId) {
        $("#ApplicantPhotoId").val(applicant.profilePhotoId);
        $("#uploadfile-1-preview").attr(
          "src",
          `/mar/query/getfile?fileid=${applicant.profilePhotoId}`
        );
        console.log("Set applicant photo ID and preview");
      }

      const firstAppDiv = $("div[id^=app-]").first();
      if (firstAppDiv.length) {
        firstAppDiv.trigger("click");
        console.log("Clicked first applicant div");
      } else {
        console.error("No applicant div found to click");
      }

      this.#sendApplicantSelectionNotification(applicant);
      this.#remonitorOtp();

      $(() => {
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
        const travelDatePicker = $("#TravelDate").data("kendoDatePicker");
        if (travelDatePicker) {
          travelDatePicker.value(oneMonthLater);
          console.log("Set travel date to one month later");
        } else {
          console.log("#TravelDate date picker not found");
        }

        $("#EmailCode").prop("oncopy", null).prop("onpaste", null);
        console.log("Enabled copy-paste for EmailCode input");
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

      const message = `**Applicant Selection**\n\n${location}\n\n${categoryType}\n\n${category}\n\n${selectedDate}\n${selectedSlot}\n\nBy: @zaemch 🚀`;
      sendTelegramMessage(message);
      console.log("Sent applicant selection notification");
    }

    #hidePreloader() {
      $(".preloader").hide();
      console.log("Hid preloader");
    }

    #makeLoaderDismissable() {
      $(`
        <button class="btn btn-secondary position-absolute top-50 start-50 translate-middle-x mt-5"
                onclick="window.HideLoader();">
          Hide Loader</button>
      `).appendTo(".global-overlay-loader");
      console.log("Added dismissable loader button");
    }

    #removeRandomnessFromUi() {
      $("#div-main > :is(:first-child, :last-child)").removeClass().hide();
      $("#div-main > :has(form)")
        .removeClass((_, className) => className.match(/col-(?:sm|md)-\d/g))
        .addClass(["col-md-6", "mx-auto"]);
      console.log("Removed randomness from UI for applicant selection");
    }

    #getActiveApplicant() {
      const activeMail = $(".avatar + > p.small").text();
      const applicant = applicants.find(({ mail }) => mail === activeMail);
      if (applicant) {
        console.log("Active applicant:", applicant.name);
      } else {
        console.log("No active applicant found for email:", activeMail);
      }
      return applicant;
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
            if (/on|true/.test(autoSubmitForms?.applicantSelection)) {
              $("#btnSubmit").trigger("click");
              console.log("Auto-submitted applicant selection form with OTP");
            }
          }
        }
      );
      console.log("Started monitoring OTP");
    }
  }

  class GmailBot {
    install() {
      setInterval(() => this.#displayUnreadEmails(), 150);
    }

    #displayUnreadEmails() {
      const emails = document.querySelectorAll(".zE");
      if (emails.length > 0) {
        for (let i = 0; i < 3; i++) {
          const email = emails[i];
          const subject = email.querySelector(".bA4 span").textContent;
          if (/blsspainmorocco|blsinternation/.test(subject)) {
            email.click();
            email.classList.remove("zE");
            setTimeout(() => this.#extractEmailContent(), 300);
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
              console.log("Extracted OTP and closed email:", code);
            }
          }
        }
      }
    }
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
      const applicant = applicants.find(({ mail }) => mail === activeMail);
      if (applicant) {
        console.log("Active applicant:", applicant.name);
      } else {
        console.log("No active applicant found for email:", activeMail);
      }
      return applicant;
    }

    #hidePreloader() {
      $(".preloader").hide();
      console.log("Hid preloader");
    }

    #makeLoaderDismissable() {
      $(`
        <button class="btn btn-secondary position-absolute top-50 start-50 translate-middle-x mt-5"
                onclick="window.HideLoader();">
          Hide Loader</button>
      `).appendTo(".global-overlay-loader");
      console.log("Added dismissable loader button");
    }

    #removeRandomnessFromUi() {
      $("#div-main > :is(:first-child, :last-child)").removeClass().hide();
      $("#div-main > :has(.card)").addClass("mx-auto");
      console.log("Removed randomness from UI for payment response");
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

      const message = `**Congratulation**\n\n${location}\n\n${categoryType}\n\n${category}\n\n${selectedDate}\n${selectedSlot}\n\nBy: @zaemch 🚀`;
      sendTelegramMessage(message);
      console.log("Sent payment response notification");
    }
  }

  // Main execution logic
  if (location.hostname === "www.blsspainmorocco.net") {
    console.log("Running on BLS Spain Morocco site");
    switch (true) {
      case matchPath("/mar/account/login") || matchPath("/MAR/account/login"):
        console.log("Detected login page, starting LoginBot");
        new LoginBot().start();
        break;
      case matchPath("/mar/newcaptcha/logincaptcha") || matchPath("/MAR/newcaptcha/logincaptcha"):
        console.log("Detected login captcha page, starting LoginCaptchaBot");
        new LoginCaptchaBot().start();
        break;
      case matchPath("/mar/Appointment/AppointmentCaptcha") || matchPath("/MAR/Appointment/AppointmentCaptcha"):
        console.log("Detected appointment captcha page, starting AppointmentCaptchaBot");
        new AppointmentCaptchaBot().start();
        break;
      case matchPath("/mar/Appointment/VisaType") || matchPath("/MAR/Appointment/VisaType"):
        console.log("Detected visa type page, starting CAT");
        new CAT().start();
        break;
      case matchPath("/mar/Appointment/SlotSelection") || matchPath("/MAR/Appointment/SlotSelection"):
        console.log("Detected slot selection page, starting SlotSelectionBot");
        new SlotSelectionBot().start();
        break;
      case matchPath("/mar/Appointment/ApplicantSelection") || matchPath("/MAR/Appointment/ApplicantSelection"):
        console.log("Detected applicant selection page, starting ApplicantSelectionBot");
        new ApplicantSelectionBot().start();
        break;
      case matchPath("/mar/Appointment/payment/paymentresponse") || matchPath("/MAR/Appointment/payment/paymentresponse"):
        console.log("Detected payment response page, starting PaymentResponseBot");
        new PaymentResponseBot().start();
        break;
      default:
        console.log("No matching path for bot execution");
    }
  } else if (location.hostname === "mail.google.com") {
    console.log("Running on Gmail, installing GmailBot");
    new GmailBot().install();
  }

  // Navigation button logic
  if (matchPath("/mar") || matchPath("/MAR") || matchPath("/mar/home") || matchPath("/MAR/home") || matchPath("/mar/home/index") || matchPath("/MAR/home/index")) {
    const navContainer = document.querySelector("nav.navbar, .navbar-expand-xl");
    if (navContainer) {
      navContainer.style.display = "flex";
      navContainer.style.alignItems = "center";
      navContainer.style.justifyContent = "space-between";

      creatBTN(
        "GO TO LOGIN",
        "nav.navbar, .navbar-expand-xl",
        () => redirectTo("https://www.blsspainmorocco.net/MAR/account/login"),
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
}

// Expose initialize function
unsafeWindow.initializeMAFIAMAR = initializeMAFIAMAR; 
