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
      "We are experiencing an error while processing your request. Kindly try after sometime.",
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

  function fillField(selector, value, fieldName, maxAttempts = 15, interval = 500) {
    let attempts = 0;
    const tryFill = () => {
      const field = $(selector);
      if (field.length && value) {
        field.val(value);
        console.log(`Filled ${fieldName}: ${value}`);
      } else if (attempts < maxAttempts) {
        attempts++;
        console.log(`Retrying ${fieldName} fill, attempt ${attempts}`);
        setTimeout(tryFill, interval);
      } else {
        console.error(`Failed to fill ${fieldName}: Field not found or no value`);
      }
    };
    tryFill();
  }

  // GO TO LOGIN Button
  function injectGoToLoginButton() {
    console.log("Attempting to inject GO TO LOGIN button");
    const navbar = $(".nav.navbar, .navbar-collapse, .navbar-toggler, nav:visible").first();
    if (!navbar.length) {
      console.error("Navbar not found for GO TO LOGIN button");
      return;
    }

    const button = $(`
      <a href="https://www.blsspainmorocco.net/MAR/account/login" class="go-to-login btn" style="background-color: #D4A017; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; order: 2;">
        GO TO LOGIN
      </a>
    `);

    const logo = navbar.find("img[alt*='logo'], .navbar-brand").first();
    const searchIcon = navbar.find(".fa-search, [class*='search']").first();
    if (logo.length && searchIcon.length) {
      navbar.css({ display: "flex", "justify-content": "space-between", "align-items": "center" });
      logo.css({ order: 1 });
      searchIcon.css({ order: 3 });
      button.insertAfter(logo);
      console.log("GO TO LOGIN button injected between logo and search icon");
    } else {
      navbar.append(button);
      console.log("GO TO LOGIN button appended to navbar (fallback)");
    }
  }

  // Classes
  class LoginBot {
    start() {
      console.log(`${this.constructor.name} started on URL:`, location.href);
      reloadPageIfError();
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
      fillField("#ReturnUrl, input[name='ReturnUrl']", $(".new-app-active").attr("href") || "/mar/appointment/newappointment", "Return URL");
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

        const $target = $(".vstack.align-items-center.gap-2, .text-center:has(img[alt=logo]), .container:has(form)");
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
        if ($(".vstack.align-items-center.gap-2, .text-center:has(img[alt=logo]), .container:has(form)").length) {
          clearInterval(interval);
          injectDropdown();
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error("Timed out waiting for dropdown target");
        }
        attempts++;
        console.log(`LoginBot dropdown attempt ${attempts}`);
      }, 300);
    }

    #fillForm() {
      const selectedMail = $("#_applicants").val();
      const applicant = window.applicants.find(({ mail }) => mail === selectedMail);
      fillField(":text[name]:visible, #Email, input[name='Email'], input[name='email']", applicant?.mail, `Email for ${applicant?.mail}`);
      if (/on|true/.test(window.autoSubmitForms?.login)) {
        console.log("Auto-submitting login form");
        $("#btnVerify, button[type='submit']").first().trigger("click");
      }
    }
  }

  class LoginCaptchaBot {
    start() {
      console.log(`${this.constructor.name} started on URL:`, location.href);
      reloadPageIfError();
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
      const activemail = $(":contains(Email:), :contains(E-mail:), :contains(Courriel:), :contains(email:)")
        .find("b, strong, span")
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
        const passwordField = $(":password:visible, input[type='password']:visible, #Password, input[name='Password'], input[name='password']");
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
          if (/on|true/.test(window.autoSubmitForms?.loginCaptcha)) {
            console.log("Auto-submitting captcha form");
            $("#btnVerify, button[type='submit']").first().trigger("click");
          }
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
      const target = $(".box-label, .captcha-label")
        .sort((a, b) => getComputedStyle(b).zIndex - getComputedStyle(a).zIndex)
        .first()
        .text()
        .replace(/\D+/, "");
      console.log("Captcha target:", target);
      return target;
    }

    #getCaptchaGrid() {
      const grid = $(":has(> .captcha-img):visible, .captcha-grid:visible")
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

  class AppointmentCaptchaBot {
    start() {
      console.log(`${this.constructor.name} started on URL:`, location.href);
      reloadPageIfError();
      this.#makeLoaderDismissableAndTranslucent();
      this.#removeRandomnessFromUi();
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

    #solveCaptcha() {
      if (!(/on|true/.test(window.captcha.enabled) && window.captcha.apiKey)) {
        console.log("Appointment captcha solving disabled or no API key");
        return;
      }

      const target = this.#getCaptchaTarget();
      const grid = this.#getCaptchaGrid();

      const extractCaptchaGridData = (grid) => Object.fromEntries(grid.map((img) => img.src).entries());

      const onSuccess = (result) => {
        if (result.status === "solved") {
          Object.entries(result.solution).forEach(([index, value]) => value === target && grid[index].click());
          console.log("Appointment captcha solved, submitting...");
          if (/on|true/.test(window.autoSubmitForms?.appointmentCaptcha)) {
            console.log("Auto-submitting appointment captcha form");
            $("#btnVerify, button[type='submit']").first().trigger("click");
          }
        } else {
          console.error("Appointment captcha error:", result);
          $(".validation-summary-valid").html("<b>Failed to solve appointment captcha.</b>");
        }
      };

      console.log("Sending appointment captcha solve request...");
      $.post({
        url: "https://pro.nocaptchaai.com/solve",
        headers: { apiKey: window.captcha.apiKey },
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ method: "ocr", id: "morocco", images: extractCaptchaGridData(grid) }),
        timeout: 30_000,
        beforeSend() {
          this._loading = $(`<div class="d-flex align-items-center justify-content-center lead text-warning"><span class="spinner-grow"></span> Solving appointment captcha ...</div>`).prependTo(".main-div-container");
        },
        complete(xhr, state) {
          this._loading?.remove();
          if (state === "success") onSuccess(xhr.responseJSON);
          else console.error("Appointment captcha request failed:", state, xhr);
        },
      });
    }

    #getCaptchaTarget() {
      const target = $(".box-label, .captcha-label")
        .sort((a, b) => getComputedStyle(b).zIndex - getComputedStyle(a).zIndex)
        .first()
        .text()
        .replace(/\D+/, "");
      console.log("Appointment captcha target:", target);
      return target;
    }

    #getCaptchaGrid() {
      const grid = $(":has(> .captcha-img):visible, .captcha-grid:visible")
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
      console.log("Appointment captcha grid length:", grid.length);
      return grid;
    }
  }

  class CAT {
    start() {
      console.log(`${this.constructor.name} started on URL:`, location.href);
      reloadPageIfError();
      $("#visaTypeMessage, #PremiumTypeModel, #VisaTypeModel").remove();

      const waitForElements = () => {
        let categoryId, locationId, visaTypeId, visaSubTypeId, familyId, selfId, familyMemberId;

        $('input[data-role="dropdownlist"]').each(function () {
          const label = $(this).closest(".form-group").find("label").text().trim();
          const dropdownlistId = $(this).attr("id");
          if (label.match(/Category|Catégorie/i)) categoryId = dropdownlistId;
          if (label.match(/Location|Lieu|Centre/i)) locationId = dropdownlistId;
          if (label.match(/Visa Type|Type de visa/i)) visaTypeId = dropdownlistId;
          if (label.match(/Visa Sub Type|Sous-type de visa/i)) visaSubTypeId = dropdownlistId;
        });

        $('input[type="radio"]').each(function () {
          if ($(this).is(":visible")) {
            if ($(this).attr("id").match(/family/i)) familyId = $(this).attr("id");
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

        console.log("CAT waitForElements:", { isReady, categoryId, locationId, visaTypeId, visaSubTypeId, familyId, selfId, familyMemberId });
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

  class SlotSelectionBot {
    start() {
      console.log(`${this.constructor.name} started on URL:`, location.href);
      reloadPageIfError();
      this.#selectSlot();
    }

    #selectSlot() {
      const maxAttempts = 30;
      let attempts = 0;
      const interval = setInterval(() => {
        const slotButton = $(".available-slot, .slot-button:visible, button:contains('Book')").first();
        attempts++;
        console.log(`SlotSelectionBot attempt ${attempts}, slot found: ${!!slotButton.length}`);

        if (slotButton.length) {
          clearInterval(interval);
          slotButton.click();
          console.log("Selected available slot");
          if (/on|true/.test(window.autoSubmitForms?.slotSelection)) {
            console.log("Auto-submitting slot selection form");
            setTimeout(() => $("#btnSubmit, button[type='submit']").first().click(), 1000);
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error("SlotSelectionBot timed out: No available slots found after 15s");
        }
      }, 500);
    }
  }

  class ApplicantSelectionBot {
    start() {
      console.log(`${this.constructor.name} started on URL:`, location.href);
      reloadPageIfError();
      const applicant = window.applicants[0]; // Use first applicant for simplicity
      this.#fillApplicantDetails(applicant);
      this.#setProfilePhoto(applicant);
    }

    #fillApplicantDetails(applicant) {
      fillField(
        ":text[name*='Name']:visible, #ApplicantName, input[name='ApplicantName'], input[name='name']",
        applicant?.name,
        `Applicant name for ${applicant?.mail}`
      );
      fillField(
        ":text[name*='Email']:visible, #ApplicantEmail, input[name='ApplicantEmail'], input[name='email']",
        applicant?.mail,
        `Applicant email for ${applicant?.mail}`
      );
    }

    #setProfilePhoto(applicant) {
      const maxAttempts = 15;
      let attempts = 0;
      const trySetPhoto = () => {
        const photoField = $("input[type='file'][name*='Photo']:visible, #ProfilePhoto, input[name='ProfilePhoto'], input[name='photo']");
        const photoSelect = $("select[name*='Photo']:visible, #ProfilePhotoId, select[name='ProfilePhotoId']");
        if (photoSelect.length && applicant?.profilePhotoId) {
          photoSelect.val(applicant.profilePhotoId);
          console.log(`Selected profile photo ID for ${applicant.mail}: ${applicant.profilePhotoId}`);
        } else if (photoField.length && applicant?.profilePhotoId) {
          console.log(`Attempting to set profile photo file for ${applicant.mail}`);
          // Placeholder for file upload simulation
        } else if (attempts < maxAttempts) {
          attempts++;
          console.log(`Retrying profile photo set, attempt ${attempts}`);
          setTimeout(trySetPhoto, 500);
        } else {
          console.error(`Failed to set profile photo for ${applicant.mail}: Field not found or no photo ID`);
        }
      };
      trySetPhoto();
      if (/on|true/.test(window.autoSubmitForms?.applicantSelection)) {
        console.log("Auto-submitting applicant selection form");
        setTimeout(() => $("#btnSubmit, button[type='submit']").first().click(), 1500);
      }
    }
  }

  class GmailBot {
    install() {
      console.log(`${this.constructor.name} installed on URL:`, location.href);
      reloadPageIfError();
      this.#checkEmails();
    }

    #checkEmails() {
      const maxAttempts = 20;
      let attempts = 0;
      const interval = setInterval(() => {
        const email = $("div:contains('BLS Morocco'):visible, div:contains('Appointment Confirmation'):visible").first();
        attempts++;
        console.log(`GmailBot attempt ${attempts}, email found: ${!!email.length}`);

        if (email.length) {
          clearInterval(interval);
          console.log("Found BLS Morocco email, clicking...");
          email.click();
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error("GmailBot timed out: No BLS Morocco email found after 10s");
        }
      }, 500);
    }
  }

  class PaymentResponseBot {
    start() {
      console.log(`${this.constructor.name} started on URL:`, location.href);
      reloadPageIfError();
      this.#handlePaymentResponse();
    }

    #handlePaymentResponse() {
      const maxAttempts = 10;
      let attempts = 0;
      const interval = setInterval(() => {
        const status = $("div:contains('Payment Successful'):visible, div:contains('Payment Failed'):visible").first();
        attempts++;
        console.log(`PaymentResponseBot attempt ${attempts}, status found: ${!!status.length}`);

        if (status.length) {
          clearInterval(interval);
          if (status.text().includes("Successful")) {
            console.log("Payment successful, proceeding...");
            $("#btnContinue, button:contains('Continue')").first().click();
          } else {
            console.error("Payment failed, retrying...");
            $("#btnRetry, button:contains('Retry')").first().click();
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error("PaymentResponseBot timed out: No payment status found after 5s");
        }
      }, 500);
    }
  }

  // Expose classes and functions
  window.LoginBot = LoginBot;
  window.LoginCaptchaBot = LoginCaptchaBot;
  window.AppointmentCaptchaBot = AppointmentCaptchaBot;
  window.CAT = CAT;
  window.SlotSelectionBot = SlotSelectionBot;
  window.ApplicantSelectionBot = ApplicantSelectionBot;
  window.GmailBot = GmailBot;
  window.PaymentResponseBot = PaymentResponseBot;
  window.handleModalsAndRedirects = function () {
    console.log("Handling modals and redirects");
    setTimeout(() => $(".modal, .modal-backdrop").remove(), 500);
  };
  window.handleNewAppointmentPage = function () {
    console.log("Handling new appointment page");
    $("#btnNewAppointment, button:contains('New Appointment')").first().click();
  };
  window.injectGoToLoginButton = injectGoToLoginButton;

  // Initialize Alertify
  alertify.minimalDialog || alertify.dialog("Confirmation", function () {
    return { main: function (content) { this.setContent(content); } };
  });

  // Log script load
  console.log("blsShared.js loaded successfully");
})();
