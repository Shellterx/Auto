(function () {
  "use strict";

  // Utility Functions
  function matchPath(pattern, pathname = location.pathname) {
    const source = "^" + pattern.replace(/\/*$/, "").replace(/^\/*/, "/").replaceAll(/[\\.*+^${}|()[\]]/g, "\\$&") + "/*$";
    return new RegExp(source, "i").test(pathname);
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

  function random(lower, upper) {
    return lower + Math.floor(Math.random() * (upper - lower + 1));
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
      setTimeout(() => window.location.reload(), 1000);
    }
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

  function selectDropdown(id, value, maxAttempts = 20, interval = 500) {
    let attempts = 0;
    const trySelect = () => {
      const dropdown = $(`#${id}`).data("kendoDropDownList");
      if (dropdown && dropdown.dataSource.data().length) {
        dropdown.value(value);
        dropdown.trigger("change");
        console.log(`Selected ${id}: ${value}`);
      } else if (attempts < maxAttempts) {
        attempts++;
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
          var labelId = $(this).attr("id") + "_label";
          if ($("#" + labelId).is(":visible")) {
            var dropdownlistId = $(this).attr("id");
            var labelText = $("#" + labelId).text().trim();
            switch (labelText) {
              case "Category*": case "Catégorie*": categoryId = dropdownlistId; break;
              case "Location*": case "Lieu*": locationId = dropdownlistId; break;
              case "Visa Type*": case "Type de visa*": visaTypeId = dropdownlistId; break;
              case "Visa Sub Type*": case "Sous-type de visa*": visaSubTypeId = dropdownlistId; break;
            }
          }
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

        if (isReady) {
          clearInterval(interval);
          try {
            const applicantConfig = window.visaConfigs[window.applicants[0].config];
            const locationName = applicantConfig.locationName;
            const visaTypeName = applicantConfig.visaTypeName;
            const visaSubName = applicantConfig.visaSubName;
            let categoryName = localStorage.getItem("categoryName") || "Normal";

            // Validate category with case-insensitive comparison
            const validCategories = categoryData.map(c => c.Name.toLowerCase());
            if (!validCategories.includes(categoryName.toLowerCase())) {
              categoryName = "Normal";
              localStorage.setItem("categoryName", categoryName);
            }

            console.log("Category:", categoryName, "Available:", categoryData);

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
                return;
              }
              selectDropdown(familyMemberId, selectedMembers.Id);
            }

            if (/on|true/.test(window.autoSubmitForms?.visaType)) {
              setTimeout(() => $("#btnSubmit").click(), 1000);
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
      this.#injectProfilePhotoUploadFeature();
      this.#injectLoginFeature();
    }

    #hidePreloader() {
      $(".preloader").hide();
    }

    #makeLoaderDismissable() {
      $(`<button class="btn btn-secondary position-absolute top-50 start-50 translate-middle-x mt-5" onclick="window.HideLoader();">Hide Loader</button>`).appendTo(".global-overlay-loader");
    }

    #removeRandomnessFromUi() {
      $("#div-main > .container > .row > [class^=col-]").hide();
      $("#div-main > .container > .row > :has(form)").addClass("mx-auto");
      $(":has(> form)").removeAttr("class");
    }

    #enableCopyPasteInInputs() {
      $(".entry-disabled:visible").on("copy paste", (evt) => evt.stopImmediatePropagation());
    }

    #setReturnUrl() {
      $("#ReturnUrl").val($(".new-app-active").attr("href"));
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

        const $target = $(".vstack.align-items-center.gap-2");
        if ($target.length) {
          $select.insertAfter($target).on("change", () => this.#fillForm());
          console.log("User dropdown injected with", window.applicants.length, "users");
        } else {
          console.error("Profile photo section not found for dropdown insertion");
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
          console.error("Timed out waiting for profile photo section");
        }
        attempts++;
      }, 300);
    }

    #fillForm() {
      const selectedMail = $("#_applicants").val();
      const applicant = window.applicants.find(({ mail }) => mail === selectedMail);

      $(":text[name]:visible").val(applicant?.mail);
      applicant?.profilePhotoId &&
        $("#_profilePhoto").attr("src", `/mar/query/getfile?fileid=${applicant.profilePhotoId}`);
      /on|true/.test(window.autoSubmitForms?.login) && $("#btnVerify").trigger("click");
    }

    #injectProfilePhotoUploadFeature() {
      $(`
        <div class="vstack align-items-center gap-2">
          <img id="_profilePhoto" class="img-thumbnail object-fit-cover" src="/assets/images/avatar/01.jpg" style="width: 128px; height: 128px;">
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
          url: "/mar/query/UploadProfileImage",
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
              $("#_profilePhoto").attr("src", `/mar/query/getfile?fileid=${result.fileId}`);
            } else {
              window.ShowError && window.ShowError(result.err);
            }
          },
          error(xhr, type) {
            window.ShowError && window.ShowError(`Failed to upload photo: ${type} (${xhr.status})`);
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
      $(`<button class="btn btn-secondary position-absolute" onclick="window.HideLoader();" style="top: 50%; margin-inline-start: 50%; transform: translate(-50%, calc(100% + 1rem));">Hide Loader</button>`).appendTo(".global-overlay-loader");
      $(".global-overlay").css("background-color", "rgba(0 0 0 / 30%)");
    }

    #removeRandomnessFromUi() {
      $("body > .row > [class^=col-]").hide();
      $("body > .row > :has(form)").addClass("mx-auto");
      $("#captcha-main-div").addClass("d-flex flex-column");
      $("#captcha-main-div > .pwd-div:has(form)").addClass("order-0").css({ height: "auto" });
      $("#captcha-main-div > .main-div-container").addClass("order-1");
      $("#captcha-main-div > .pwd-div:not(:has(*))").hide();
    }

    #enableCopyPasteInInputs() {
      $(".entry-disabled:visible").off("copy paste");
    }

    #getActiveApplicant() {
      const activemail = $(":contains(Email:) > b, :contains(E-mail:) > b").text().trim();
      return window.applicants.find(({ mail }) => mail === activemail);
    }

    #markTabWithCurrentUser(applicant) {
      applicant?.name && (document.title = applicant.name);
      applicant?.profilePhotoId &&
        $("img[alt=logo]")
          .addClass("img-thumbnail")
          .css({ width: "128px", height: "128px", objectFit: "cover" })
          .attr("src", `/mar/query/getfile?fileid=${applicant.profilePhotoId}`);
    }

    #setPassword(applicant) {
      const maxAttempts = 10;
      let attempts = 0;
      const trySetPassword = () => {
        const passwordField = $(":password:visible, input[type='password']:visible");
        if (passwordField.length && applicant?.password) {
          passwordField.val(applicant.password);
          console.log("Password set for", applicant.mail);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(trySetPassword, 500);
        } else {
          console.error("Failed to set password: Field not found or no password");
        }
      };
      trySetPassword();
    }

    #solveCaptcha() {
      if (!(/on|true/.test(window.captcha.enabled) && window.captcha.apiKey)) return;

      const target = this.#getCaptchaTarget();
      const grid = this.#getCaptchaGrid();

      const extractCaptchaGridData = (grid) => Object.fromEntries(grid.map((img) => img.src).entries());

      const onSuccess = (result) => {
        if (result.status === "solved") {
          Object.entries(result.solution).forEach(([index, value]) => value === target && grid[index].click());
          /on|true/.test(window.autoSubmitForms?.loginCaptcha) && $("#btnVerify").trigger("click");
        } else {
          console.error("Captcha error:", result);
          $(".validation-summary-valid").html("<b>Failed to solve captcha.</b>");
        }
      };

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
          const sortedByZIndex = sortedByTop.sort((a, b) => getComputedStyle(b).zIndex - getComputedStyle(a).zIndex);
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
      $(`<button class="btn btn-secondary position-absolute top-50 start-50 translate-middle-x mt-5" onclick="window.HideLoader();">Hide Loader</button>`).appendTo(".global-overlay-loader");
    }

    #removeRandomnessFromUi() {
      $(".row:has(> .captcha-div) > [class^=col-]").hide();
      $(".captcha-div").addClass("mx-auto");
    }

    #solveCaptcha() {
      if (!(/on|true/.test(window.captcha.enabled) && window.captcha.apiKey)) return;

      const target = this.#getCaptchaTarget();
      const grid = this.#getCaptchaGrid();

      const extractCaptchaGridData = (grid) => Object.fromEntries(grid.map((img) => img.src).entries());

      const onSuccess = (result) => {
        if (result.status === "solved") {
          Object.entries(result.solution).forEach(([index, value]) => value === target && grid[index].click());
          /on|true/.test(window.autoSubmitForms?.appointmentCaptcha) && $("#btnVerify").trigger("click");
        } else {
          console.error("Captcha error:", result);
          $(".validation-summary-valid").html("<b>Failed to solve captcha.</b>");
        }
      };

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
          const sortedByZIndex = sortedByTop.sort((a, b) => getComputedStyle(b).zIndex - getComputedStyle(a).zIndex);
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
      Object.assign(window, { OnAppointmentdateChange: (date) => this.#selectCachedSlot(date) });
      this.#prefetchSlots();
    }

    #hidePreloader() {
      $(".preloader").hide();
    }

    #makeLoaderDismissable() {
      $(`<button class="btn btn-secondary position-absolute top-50 start-50 translate-middle-x mt-5" onclick="window.HideLoader();">Hide Loader</button>`).appendTo(".global-overlay-loader");
    }

    #removeRandomnessFromUi() {
      $("#div-main > :is(:first-child, :last-child)").removeClass().hide();
      $("#div-main > :has(form)").addClass("mx-auto");
      $("form > div:nth-child(2)").addClass("gap-4").children("div").removeClass((_, className) => className.match(/m[tb]-\d/g));
      $("div:has(> #btnSubmit)").addClass("mt-5");
    }

    #prefetchSlots() {
      $(() => {
        const allowedDates = window.availDates?.ad
          .filter((it) => it.AppointmentDateType === 0)
          .sort((a, b) => new Date(a.DateText) - new Date(b.DateText)) || [];
        if (!allowedDates.length) {
          console.error("No allowed dates available");
          return;
        }

        const dataParam = encodeURIComponent(new URLSearchParams(location.search).get("data") || "");

        const fetchSlotsWithRetry = (url, maxRetries = 3, delay = 2000) => {
          let retries = 0;
          const tryFetch = () => {
            return $.ajax({
              type: "POST",
              url: url,
              dataType: "json",
              timeout: 10000,
              headers: {
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": navigator.userAgent,
              },
              beforeSend: (xhr) => {
                const token = $("input[name='__RequestVerificationToken']").val();
                if (token) xhr.setRequestHeader("RequestVerificationToken", token);
                const wafToken = $("input[name='aws-waf-token']").val();
                if (wafToken) xhr.setRequestHeader("aws-waf-token", wafToken);
              },
            }).then(
              (response) => response,
              (xhr) => {
                if ((xhr.status === 429 || xhr.status === 403) && retries < maxRetries) {
                  retries++;
                  return new Promise((resolve) => setTimeout(() => tryFetch().then(resolve), delay));
                }
                throw xhr;
              }
            );
          };
          return tryFetch();
        };

        window.ShowLoader && window.ShowLoader();
        const fetchPromises = allowedDates.map((date) =>
          fetchSlotsWithRetry(`/mar/appointment/GetAvailableSlotsByDate?data=${dataParam}&appointmentDate=${date.DateText}`)
            .then((response) => {
              if (response.success) {
                const availableSlots = response.data.filter((s) => s.Count > 0);
                this.#slotCache.set(date.DateText, availableSlots);
              }
              return { date: date.DateText, success: response.success, data: response.data };
            })
            .catch((xhr) => {
              console.error(`Failed to fetch slots for ${date.DateText}: ${xhr.status}`);
              return { date: date.DateText, success: false };
            })
        );

        Promise.all(fetchPromises).then((results) => {
          window.HideLoader && window.HideLoader();
          const validResult = results
            .filter((r) => r.success && r.data.some((s) => s.Count > 0))
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

          if (validResult) {
            const datePicker = $(".k-datepicker:visible .k-input").data("kendoDatePicker");
            datePicker.value(validResult.date);
            datePicker.trigger("change");
            this.#sendSlotAvailabilityNotification();
            this.#selectAndSubmitNearestSlot(validResult.date);
          } else {
            console.error("No available slots found");
          }
        });
    }

    #sendSlotAvailabilityNotification() {
      const category = window.visaConfigs[window.applicants[0].config].visaSubName;
      const categoryType = localStorage.getItem("categoryName") || "Normal";
      const location = window.visaConfigs[window.applicants[0].config].locationName;
      const validCategories = ["Normal", "Premium", "Prime Time"];

      if (!validCategories.includes(categoryType)) {
        console.error(`Invalid category: ${categoryType}`);
        return;
      }

      let slotsByDateMessage = "";
      const sortedDates = Array.from(this.#slotCache.keys()).sort((a, b) => new Date(a) - new Date(b));
      for (const date of sortedDates) {
        const slots = this.#slotCache.get(date);
        if (slots && slots.length > 0) {
          const slotTimes = slots.map((s) => s.Name).join(", ");
          slotsByDateMessage += `${date}\n${slotTimes}\n\n`;
        }
      }

      if (slotsByDateMessage) {
        const message = `**Slot Selection**\n\n${location}\n\n${categoryType}\n\n${category}\n\n${slotsByDateMessage}By: @zaemch 🚀`;
        window.sendTelegramMessage && window.sendTelegramMessage(message);
      }
    }

    #selectAndSubmitNearestSlot(apptDate) {
      const dataParam = encodeURIComponent(new URLSearchParams(location.search).get("data") || "");
      $.ajax({
        type: "POST",
        url: `/mar/appointment/GetAvailableSlotsByDate?data=${dataParam}&appointmentDate=${apptDate}`,
        dataType: "json",
        async: false,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent": navigator.userAgent,
        },
        beforeSend: (xhr) => {
          const token = $("input[name='__RequestVerificationToken']").val();
          if (token) xhr.setRequestHeader("RequestVerificationToken", token);
          const wafToken = $("input[name='aws-waf-token']").val();
          if (wafToken) xhr.setRequestHeader("aws-waf-token", wafToken);
        },
        success: (data) => {
          if (data.success) {
            const availableSlots = data.data.filter((s) => s.Count > 0);
            if (availableSlots.length > 0) {
              const selectedSlot = availableSlots.reduce((best, current) => {
                return current.Count > best.Count || (current.Count === best.Count && current.Name < best.Name) ? current : best;
              }, availableSlots[0]);

              const slotDropDown = $(".k-dropdown:visible > .form-control").data("kendoDropDownList");
              slotDropDown.setDataSource(data.data);
              slotDropDown.value(selectedSlot.Id);

              speechSynthesis.speak(new SpeechSynthesisUtterance("Rendez-vous disponible !!!"));
              GM_setValue("selected_slot", selectedSlot.Name);
              GM_setValue("selected_date", apptDate);

              /on|true/.test(window.autoSubmitForms?.slotSelection) && $("#btnSubmit").trigger("click");
            } else {
              console.error(`No available slots for date: ${apptDate}`);
            }
          } else {
            window.ShowError && window.ShowError(data.err);
            data.ru && window.confirm(`Redirect to: ${data.ru}`) && window.location.replace(data.ru);
          }
        },
        error: (xhr) => {
          console.error(`Failed to fetch slots: ${xhr.status}`);
          window.ShowError && window.ShowError(`Failed to fetch slots: ${xhr.status}`);
        },
        complete: () => window.HideLoader && window.HideLoader(),
      });
    }

    #selectCachedSlot(apptDate) {
      const slotDropDown = $(".k-dropdown:visible > .form-control").data("kendoDropDownList");
      if (!apptDate) {
        slotDropDown.value(undefined);
        slotDropDown.setDataSource([]);
        return false;
      }

      const dataParam = encodeURIComponent(new URLSearchParams(location.search).get("data") || "");
      $.ajax({
        type: "POST",
        url: `/mar/appointment/GetAvailableSlotsByDate?data=${dataParam}&appointmentDate=${apptDate}`,
        dataType: "json",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent": navigator.userAgent,
        },
        beforeSend: (xhr) => {
          const token = $("input[name='__RequestVerificationToken']").val();
          if (token) xhr.setRequestHeader("RequestVerificationToken", token);
          const wafToken = $("input[name='aws-waf-token']").val();
          if (wafToken) xhr.setRequestHeader("aws-waf-token", wafToken);
        },
        success: (data) => {
          if (data.success) {
            const availableSlots = data.data.filter((s) => s.Count > 0);
            this.#slotCache.set(apptDate, availableSlots);
            this.#selectSlotTime(data.data, availableSlots, apptDate);
          } else {
            window.ShowError && window.ShowError(data.err);
            data.ru && window.confirm(`Redirect to: ${data.ru}`) && window.location.replace(data.ru);
          }
        },
        error: (xhr) => {
          console.error(`Failed to fetch slots: ${xhr.status}`);
          window.ShowError && window.ShowError(`Failed to fetch slots: ${xhr.status}`);
        },
        complete: () => window.HideLoader && window.HideLoader(),
      });
    }

    #selectSlotTime(slots, availableSlots, apptDate) {
      if (!availableSlots.length) {
        console.error(`No available slots for date: ${apptDate}`);
        return;
      }

      const selectedSlot = availableSlots.reduce((best, current) => {
        return current.Count > best.Count || (current.Count === best.Count && current.Name < best.Name) ? current : best;
      }, availableSlots[0]);

      if (selectedSlot) {
        speechSynthesis.speak(new SpeechSynthesisUtterance("Rendez-vous disponible !!!"));
        const slotDropDown = $(".k-dropdown:visible > .form-control").data("kendoDropDownList");
        slotDropDown.setDataSource(slots);
        slotDropDown.value(selectedSlot.Id);

        GM_setValue("selected_slot", selectedSlot.Name);
        GM_setValue("selected_date", apptDate);
        window.print();

        /on|true/.test(window.autoSubmitForms?.slotSelection) && $(() => $("#btnSubmit").trigger("click"));
      }
    }
  }

  class ApplicantSelectionBot {
    start() {
      console.log(`${this.constructor.name} started`);
      $(".modal:not(#logoutModal)").on("show.bs.modal", (evt) => evt.preventDefault());
      this.#hidePreloader();
      this.#makeLoaderDismissable();
      this.#removeRandomnessFromUi();
      const applicant = this.#getActiveApplicant();

      applicant?.profilePhotoId &&
        $("#ApplicantPhotoId").val(applicant.profilePhotoId) &&
        $("#uploadfile-1-preview").attr("src", `/mar/query/getfile?fileid=${applicant.profilePhotoId}`);

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
      const category = window.visaConfigs[applicant.config].visaSubName;
      const categoryType = localStorage.getItem("categoryName");
      const location = window.visaConfigs[applicant.config].locationName;
      const validCategories = ["Normal", "Premium", "Prime Time"];

      if (!categoryType || !validCategories.includes(categoryType)) {
        console.error(`Invalid category: ${categoryType}`);
        return;
      }

      const selectedDate = GM_getValue("selected_date", "Unknown");
      const selectedSlot = GM_getValue("selected_slot", "Unknown");

      const message = `**Applicant Selection**\n\n${location}\n\n${categoryType}\n\n${category}\n\n${selectedDate}\n${selectedSlot}\n\nBy: @zaemch 🚀`;
      window.sendTelegramMessage && window.sendTelegramMessage(message);
    }

    #hidePreloader() {
      $(".preloader").hide();
    }

    #makeLoaderDismissable() {
      $(`<button class="btn btn-secondary position-absolute top-50 start-50 translate-middle-x mt-5" onclick="window.HideLoader();">Hide Loader</button>`).appendTo(".global-overlay-loader");
    }

    #removeRandomnessFromUi() {
      $("#div-main > :is(:first-child, :last-child)").removeClass().hide();
      $("#div-main > :has(form)")
        .removeClass((_, className) => className.match(/col-(?:sm|md)-\d/g))
        .addClass(["col-md-6", "mx-auto"]);
    }

    #getActiveApplicant() {
      const activeMail = $(".avatar + > p.small").text();
      return window.applicants.find(({ mail }) => mail === activeMail);
    }

    #remonitorOtp() {
      const stop = () => {
        $(":is(.spinner-grow, .bi-check-lg):has(+ #EmailCode)").remove();
        GM_removeValueChangeListener(this._fetchOtpListenerId);
        GM_setValue("code_otp");
      };

      stop();
      $(`<span class="spinner-grow spinner-grow-sm text-primary ms-2"></span>`).insertBefore("#EmailCode");
      this._fetchOtpListenerId = GM_addValueChangeListener(
        "code_otp",
        (_name, _prev, otp, remote) => {
          if (remote && otp) {
            stop();
            $("#EmailCode").val(otp);
            $(`<i class="bi bi-check-lg text-success"></i>`).insertBefore("#EmailCode");
            /on|true/.test(window.autoSubmitForms?.applicantSelection) && $("#btnSubmit").trigger("click");
          }
        }
      );
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
            if (closeButton) closeButton.click();
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
      return window.applicants.find(({ mail }) => mail === activeMail);
    }

    #hidePreloader() {
      $(".preloader").hide();
    }

    #makeLoaderDismissable() {
      $(`<button class="btn btn-secondary position-absolute top-50 start-50 translate-middle-x mt-5" onclick="window.HideLoader();">Hide Loader</button>`).appendTo(".global-overlay-loader");
    }

    #removeRandomnessFromUi() {
      $("#div-main > :is(:first-child, :last-child)").removeClass().hide();
      $("#div-main > :has(.card)").addClass("mx-auto");
    }

    #sendPaymentResponseNotification(applicant) {
      const category = window.visaConfigs[applicant.config].visaSubName;
      const categoryType = localStorage.getItem("categoryName");
      const location = window.visaConfigs[applicant.config].locationName;
      const validCategories = ["Normal", "Premium", "Prime Time"];

      if (!categoryType || !validCategories.includes(categoryType)) {
        console.error(`Invalid category: ${categoryType}`);
        return;
      }

      const selectedDate = GM_getValue("selected_date", "Unknown");
      const selectedSlot = GM_getValue("selected_slot", "Unknown");

      const message = `**Congratulation**\n\n${location}\n\n${categoryType}\n\n${category}\n\n${selectedDate}\n${selectedSlot}\n\nBy: @zaemch 🚀`;
      window.sendTelegramMessage && window.sendTelegramMessage(message);
    }
  }

  // Page-specific logic
  function handleNewAppointmentPage() {
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
    }

    const tryAgainLink = Array.from(document.querySelectorAll("a.btn.btn-primary")).find(
      (link) => link.textContent.trim() === "Try Again" && link.getAttribute("href") === "/mar/appointment/newappointment"
    );

    if (tryAgainLink) {
      let countdown = 10;
      let isPaused = false;

      tryAgainLink.textContent = `Keep trying in the Actual Category: ${localStorage.getItem("categoryName")} in : (${countdown}s)`;
      tryAgainLink.style.width = "auto";

      const pauseButton = document.createElement("button");
      pauseButton.textContent = "Pause";
      pauseButton.style.marginLeft = "10px";
      pauseButton.className = "btn btn-secondary ms-2";
      pauseButton.innerHTML = '<i class="bi bi-pause-fill"></i>';
      tryAgainLink.parentNode.insertBefore(pauseButton, tryAgainLink.nextSibling);

      pauseButton.addEventListener("click", () => {
        isPaused = !isPaused;
        pauseButton.innerHTML = isPaused ? '<i class="bi bi-play-fill"></i>' : '<i class="bi bi-pause-fill"></i>';
      });

      const countdownInterval = setInterval(() => {
        if (!isPaused) {
          countdown -= 1;
          tryAgainLink.textContent = `Keep trying in the Actual Category: ${localStorage.getItem("categoryName")} (${countdown}s)`;
          if (countdown <= 0) {
            clearInterval(countdownInterval);
            tryAgainLink.click();
          }
        }
      }, 1000);
    }
  }

  function handleModalsAndRedirects() {
    setTimeout(() => $(".modal").modal("hide"), 500);

    setTimeout(() => {
      const button1 = document.querySelector('.btn.btn-success.btn-block[type="button"][data-bs-dismiss="modal"][onclick="onBioDisclaimerAccept();"]');
      if (button1) {
        button1.click();
        setTimeout(() => {
          const button2 = document.querySelector('.btn.btn-success.btn-block[type="button"][data-bs-dismiss="modal"][onclick="onDpAccept();"]');
          if (button2) button2.click();
        }, 300);
      }
    }, 400);

    if (window.location.href.includes("/mar/account/changepassword?alert=True")) {
      window.location.href = "https://www.blsspainmorocco.net/mar/appointment/appointmentcaptcha";
    }

    if (window.location.href.includes("/mar/Appointment/NewAppointment?msg=lfJQVX2NULaGjPKL6fTAx8BtSHJVTsEgaj1lwdqOSsc%3D")) {
      window.location.href = "https://www.blsspainmorocco.net/mar/appointment/newappointment";
    }
  }

  function loadCSS(url) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
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
  window.handleNewAppointmentPage = handleNewAppointmentPage;
  window.handleModalsAndRedirects = handleModalsAndRedirects;

  // Load CSS
  loadCSS("https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/alertify.min.css");
  loadCSS("https://cdn.jsdelivr.net/npm/alertifyjs/build/css/themes/default.min.css");

  // Initialize Alertify dialog
  alertify.minimalDialog || alertify.dialog("Confirmation", function () {
    return { main: function (content) { this.setContent(content); } };
  });
})();
