(function () {
  "use strict";

  // Utility Functions
  function matchPath(pattern, pathname = location.pathname) {
    const source = "^" + pattern.replace(/\/*$/, "").replace(/^\/*/, "/").replaceAll(/[\\.*+^${}|()[\]]/g, "\\$&") + "/*$";
    return new RegExp(source, "i").test(pathname);
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
      console.log("Error page detected, reloading...");
      setTimeout(() => window.location.reload(), 1000);
    }
  }

  function selectDropdown(id, value, maxAttempts = 30, interval = 500) {
    let attempts = 0;
    const trySelect = () => {
      const dropdown = $(`#${id}`).data("kendoDropDownList");
      if (dropdown && dropdown.dataSource.data().length) {
        dropdown.value(value);
        dropdown.trigger("change");
        console.log(`Selected ${id}: ${value}`);
      } else if (attempts < maxAttempts) {
        attempts++;
        console.log(`Retrying ${id} selection, attempt ${attempts}`);
        setTimeout(trySelect, interval);
      } else {
        console.error(`Failed to select ${id} after ${maxAttempts} attempts`);
      }
    };
    trySelect();
  }

  // Classes
  class CAT {
    start() {
      console.log(`${this.constructor.name} started`);

      $("#visaTypeMessage, #PremiumTypeModel, #VisaTypeModel").remove();

      const waitForElements = () => {
        let categoryId, locationId, visaTypeId, visaSubTypeId, familyId, selfId, familyMemberId;

        $('input[data-role="dropdownlist"]').each(function () {
          const label = $(this).closest(".form-group").find("label").text().trim();
          const dropdownlistId = $(this).attr("id");
          if (label.match(/Category|Catégorie/i)) categoryId = dropdownlistId;
          if (label.match(/Location|Lieu/i)) locationId = dropdownlistId;
          if (label.match(/Visa Type|Type de visa/i)) visaTypeId = dropdownlistId;
          if (label.match(/Visa Sub Type|Sous-type de visa/i)) visaSubTypeId = dropdownlistId;
        });

        $('input[type="radio"]').each(function () {
          if ($(this).is(":visible")) {
            if ($(this).attr("id").includes("family")) familyId = $(this).attr("id");
            else selfId = $(this).attr("id");
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
          (window.applicants[0].membersName === "I" || typeof applicantsNoData !== "undefined");

        return { isReady, categoryId, locationId, visaTypeId, visaSubTypeId, familyId, selfId, familyMemberId };
      };

      const maxAttempts = 60;
      let attempts = 0;
      const interval = setInterval(() => {
        const { isReady, categoryId, locationId, visaTypeId, visaSubTypeId, familyId, selfId, familyMemberId } = waitForElements();
        attempts++;
        console.log(`CAT attempt ${attempts}, isReady: ${isReady}`);

        if (isReady) {
          clearInterval(interval);
          try {
            const applicantConfig = window.visaConfigs[window.applicants[0].config];
            const locationName = applicantConfig.locationName;
            const visaTypeName = applicantConfig.visaTypeName;
            const visaSubName = applicantConfig.visaSubName;
            let categoryName = localStorage.getItem("categoryName") || "Normal";

            const validCategories = categoryData.map(c => c.Name.toLowerCase());
            if (!validCategories.includes(categoryName.toLowerCase())) {
              categoryName = "Normal";
              localStorage.setItem("categoryName", categoryName);
            }
            console.log("Category selected:", categoryName, "Available:", validCategories);

            const selectedLocation = locationData.find(l => l.Name === locationName);
            if (!selectedLocation) {
              console.error(`Location ${locationName} not found in locationData`);
              return;
            }
            selectDropdown(locationId, selectedLocation.Id);

            const selectedVisaType = visaTypeFilterData.find(v => v.Name === visaTypeName);
            if (!selectedVisaType) {
              console.error(`Visa Type ${visaTypeName} not found in visaTypeFilterData`);
              return;
            }
            selectDropdown(visaTypeId, selectedVisaType.Id);

            const selectedVisaSub = visasubIdFilterData.find(v => v.Name === visaSubName);
            if (!selectedVisaSub) {
              console.error(`Visa Sub Type ${visaSubName} not found in visasubIdFilterData`);
              return;
            }
            selectDropdown(visaSubTypeId, selectedVisaSub.Id);

            const selectedCategory = categoryData.find(c => c.Name.toLowerCase() === categoryName.toLowerCase());
            if (!selectedCategory) {
              console.error(`Category ${categoryName} not found in categoryData`);
              return;
            }
            selectDropdown(categoryId, selectedCategory.Id);

            if (window.applicants[0].membersName !== "I") {
              $("#familyDisclaimer").remove();
              const familyElement = $("#" + familyId);
              familyElement.click();
              window.OnFamilyAccept && window.OnFamilyAccept();

              const selectedMembers = applicantsNoData.find(m => m.Name === window.applicants[0].membersName);
              if (!selectedMembers) {
                console.error(`Members ${window.applicants[0].membersName} not found in applicantsNoData`);
              } else {
                selectDropdown(familyMemberId, selectedMembers.Id);
              }
            }

            if (/on|true/.test(window.autoSubmitForms?.visaType)) {
              console.log("Auto-submitting visa type form");
              setTimeout(() => $("#btnSubmit").click(), 1500);
            } else {
              console.log("Auto-submit for Visa Type is disabled");
            }
          } catch (error) {
            console.error("CAT error:", error);
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error("CAT timed out: Required elements not found after 30s");
        }
      }, 500);
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
      this.#injectLoginFeature();
    }

    #hidePreloader() {
      $(".preloader").hide();
      console.log("Preloader hidden");
    }

    #makeLoaderDismissable() {
      $(`<button class="btn btn-secondary position-absolute top-50 start-50 translate-middle-x mt-5" onclick="window.HideLoader();">Hide Loader</button>`).appendTo(".global-overlay-loader");
      console.log("Loader dismiss button added");
    }

    #removeRandomnessFromUi() {
      $("#div-main > .container > .row > [class^=col-]").hide();
      $("#div-main > .container > .row > :has(form)").addClass("mx-auto");
      $(":has(> form)").removeAttr("class");
      console.log("UI randomness removed");
    }

    #enableCopyPasteInInputs() {
      $(".entry-disabled:visible").on("copy paste", (evt) => evt.stopImmediatePropagation());
      console.log("Copy-paste enabled for inputs");
    }

    #setReturnUrl() {
      $("#ReturnUrl").val($(".new-app-active").attr("href") || "/mar/appointment/newappointment");
      console.log("Return URL set");
    }

    #injectLoginFeature() {
      if (!window.applicants.length) {
        console.error("No applicants defined");
        return;
      }

      const injectDropdown = () => {
        const $select = $(`
          <select id="_applicants" class="form-select form-select-lg mt-2" style="display: block; width: 100%; max-width: 300px; margin: 10px auto;">
            <option selected disabled>Select a User</option>
            ${window.applicants.map(({ name, mail }) => `<option value="${mail}">${name || mail}</option>`)}
          </select>
        `);

        const $target = $(".vstack.align-items-center.gap-2, .text-center:has(img[alt=logo])");
        if ($target.length) {
          $select.insertAfter($target).on("change", () => this.#fillForm());
          console.log("User dropdown injected with", window.applicants.length, "users");
        } else {
          console.error("Target for dropdown insertion not found");
        }
      };

      const maxAttempts = 10;
      let attempts = 0;
      const interval = setInterval(() => {
        if ($(".vstack.align-items-center.gap-2, .text-center:has(img[alt=logo])").length) {
          clearInterval(interval);
          injectDropdown();
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error("Timed out waiting for dropdown target");
        }
        attempts++;
      }, 300);
    }

    #fillForm() {
      const selectedMail = $("#_applicants").val();
      const applicant = window.applicants.find(({ mail }) => mail === selectedMail);

      $(":text[name]:visible").val(applicant?.mail);
      console.log("Filled email:", applicant?.mail);
      /on|true/.test(window.autoSubmitForms?.login) && $("#btnVerify").trigger("click");
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
      $(`<button class="btn btn-secondary position-absolute" onclick="window.HideLoader();" style="top: 50%; margin-inline-start: 50%; transform: translate(-50%, calc(100% + 1rem));">Hide Loader</button>`).appendTo(".global-overlay-loader");
      $(".global-overlay").css("background-color", "rgba(0 0 0 / 30%)");
      console.log("Loader made dismissable and translucent");
    }

    #removeRandomnessFromUi() {
      $("body > .row > [class^=col-]").hide();
      $("body > .row > :has(form)").addClass("mx-auto");
      $("#captcha-main-div").addClass("d-flex flex-column");
      $("#captcha-main-div > .pwd-div:has(form)").addClass("order-0").css({ height: "auto" });
      $("#captcha-main-div > .main-div-container").addClass("order-1");
      $("#captcha-main-div > .pwd-div:not(:has(*))").hide();
      console.log("Captcha UI randomness removed");
    }

    #enableCopyPasteInInputs() {
      $(".entry-disabled:visible").off("copy paste");
      console.log("Copy-paste enabled for captcha inputs");
    }

    #getActiveApplicant() {
      const activemail = $(":contains(Email:), :contains(E-mail:), :contains(Courriel:)")
        .find("b")
        .text()
        .trim();
      const applicant = window.applicants.find(({ mail }) => mail === activemail);
      console.log("Active applicant:", activemail, "Found:", !!applicant);
      return applicant;
    }

    #markTabWithCurrentUser(applicant) {
      applicant?.name && (document.title = applicant.name);
      console.log("Tab title set to:", applicant?.name);
    }

    #setPassword(applicant) {
      const maxAttempts = 15;
      let attempts = 0;
      const trySetPassword = () => {
        const passwordField = $(":password:visible, input[type='password']:visible, #Password");
        if (passwordField.length && applicant?.password) {
          passwordField.val(applicant.password);
          console.log("Password set for", applicant.mail);
        } else if (attempts < maxAttempts) {
          attempts++;
          console.log(`Retrying password set, attempt ${attempts}`);
          setTimeout(trySetPassword, 500);
        } else {
          console.error("Failed to set password: Field not found or no password");
        }
      };
      trySetPassword();
    }

    #solveCaptcha() {
      if (!(/on|true/.test(window.captcha.enabled) && window.captcha.apiKey)) {
        console.log("Captcha solving disabled or no API key");
        return;
      }

      const target = this.#getCaptchaTarget();
      const grid = this.#getCaptchaGrid();

      const extractCaptchaGridData = (grid) => Object.fromEntries(grid.map((img) => img.src).entries());

      const onSuccess = (result) => {
        if (result.status === "solved") {
          Object.entries(result.solution).forEach(([index, value]) => value === target && grid[index].click());
          console.log("Captcha solved, submitting...");
          /on|true/.test(window.autoSubmitForms?.loginCaptcha) && $("#btnVerify").trigger("click");
        } else {
          console.error("Captcha error:", result);
          $(".validation-summary-valid").html("<b>Failed to solve captcha.</b>");
        }
      };

      console.log("Sending captcha solve request...");
      $.post({
        url: "https://pro.nocaptchaai.com/solve",
        headers: { apiKey: window.captcha.apiKey },
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ method: "ocr", id: "morocco", images: extractCaptchaGridData(grid) }),
        timeout: 30_000,
        beforeSend() {
          this._loading = $(`<div class="d-flex align-items-center justify-content-center lead text-warning"><span class="spinner-grow"></span> Solving captcha ...</div>`).prependTo(".main-div-container");
        },
        complete(xhr, state) {
          this._loading?.remove();
          if (state === "success") onSuccess(xhr.responseJSON);
          else console.error("Captcha request failed:", state, xhr);
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
          const sortedByZIndex = sortedByTop.sort((a, b) => getComputedStyle(b).zIndex - getComputedStyle(a).zIndex);
          const top3 = sortedByZIndex.slice(0, 3);
          const sortedByLeft = top3.sort((a, b) => a.offsetLeft - b.offsetLeft);
          return sortedByLeft;
        })
        .map((element) => element.firstElementChild);
      console.log("Captcha grid length:", grid.length);
      return grid;
    }
  }

  // Expose classes and functions
  window.LoginBot = LoginBot;
  window.LoginCaptchaBot = LoginCaptchaBot;
  window.CAT = CAT;
  window.handleModalsAndRedirects = function () {
    console.log("Handling modals and redirects");
    setTimeout(() => $(".modal").modal("hide"), 500);
  };

  // Initialize Alertify
  alertify.minimalDialog || alertify.dialog("Confirmation", function () {
    return { main: function (content) { this.setContent(content); } };
  });

  // Log script load
  console.log("blsShared.js loaded successfully");
})();
