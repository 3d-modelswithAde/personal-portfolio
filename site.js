/* ==========================================================================
   Adediwura Afolabi Portfolio — Shared Interactive Behaviour & Motion Design
   Zero external dependencies. Accessible, reduced-motion aware.
   ========================================================================== */
(function () {
  'use strict';

  var EMAIL = 'adediwura.ainaafolabi@gmail.com';
  var LINKEDIN_URL = 'https://www.linkedin.com/in/adediwura-afolabi';
  var DEFAULT_SUBJECT = 'Portfolio Enquiry';
  var DEFAULT_MESSAGE = 'Hi Adediwura, I came across your portfolio and would like to discuss an opportunity or project with you.';
  var DEFAULT_MAILTO =
    'mailto:' +
    EMAIL +
    '?subject=' +
    encodeURIComponent(DEFAULT_SUBJECT) +
    '&body=' +
    encodeURIComponent(DEFAULT_MESSAGE);

  var REDUCED_MOTION =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     1. Theme Management (Preserves system preference + manual toggle)
     -------------------------------------------------------------------------- */
  var STORAGE_KEY = 'adediwura-theme';

  function getActiveTheme() {
    var explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'dark' || explicit === 'light') return explicit;
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {}
    }
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      var isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute(
        'aria-label',
        isDark ? 'Switch to light theme' : 'Switch to dark theme'
      );
      btn.setAttribute('data-tip', isDark ? 'Light mode' : 'Dark mode');
      btn.innerHTML = isDark
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1zm0 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm7.5-3.5a1 1 0 0 1-1 1H17a1 1 0 1 1 0-2h1.5a1 1 0 0 1 1 1zM7 12a1 1 0 0 1-1 1H4.5a1 1 0 1 1 0-2H6a1 1 0 0 1 1 1zm9.95-4.95a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0zM8.47 15.53a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 0 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0zm8.48 1.41a1 1 0 0 1-1.41 0l-1.06-1.06a1 1 0 1 1 1.41-1.41l1.06 1.06a1 1 0 0 1 0 1.41zM8.47 8.47a1 1 0 0 1-1.41 0L6 7.41A1 1 0 0 1 7.41 6l1.06 1.06a1 1 0 0 1 0 1.41zM12 16a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V17a1 1 0 0 1 1-1z"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  try {
    var savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  } catch (e) {}

  /* --------------------------------------------------------------------------
     2. Header & Footer Direct Social/Email Icons Enhancement
     -------------------------------------------------------------------------- */
  var LINKEDIN_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>';
  var EMAIL_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>';

  function enhanceHeaderAndFooter() {
    var nav = document.querySelector('.site nav');
    if (nav && !nav.querySelector('.nav-actions')) {
      var actions = document.createElement('div');
      actions.className = 'nav-actions';
      actions.innerHTML =
        '<a class="icon-btn" href="' +
        DEFAULT_MAILTO +
        '" aria-label="Send an email to ' +
        EMAIL +
        '" data-tip="Email Adediwura">' +
        EMAIL_SVG +
        '</a>' +
        '<a class="icon-btn" href="' +
        LINKEDIN_URL +
        '" target="_blank" rel="noopener noreferrer" aria-label="Adediwura Afolabi on LinkedIn (opens in new tab)" data-tip="LinkedIn Profile">' +
        LINKEDIN_SVG +
        '</a>' +
        '<button type="button" id="theme-toggle" class="icon-btn" aria-label="Toggle color theme" data-tip="Toggle theme"></button>';
      nav.appendChild(actions);
    }

    var toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      applyTheme(getActiveTheme(), false);
      toggleBtn.addEventListener('click', function () {
        var next = getActiveTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
      });
    }

    if (!document.querySelector('.site-footer')) {
      var footer = document.createElement('footer');
      footer.className = 'site-footer';
      footer.innerHTML =
        '<div class="site-footer-inner">' +
        '<div class="footer-brand">' +
        '<strong>Adediwura Afolabi</strong>' +
        '<span>Technical Community Manager · Hardware, AI &amp; Automation</span>' +
        '</div>' +
        '<div class="footer-links">' +
        '<a class="icon-btn" href="' +
        DEFAULT_MAILTO +
        '" aria-label="Email Adediwura Afolabi at ' +
        EMAIL +
        '" data-tip="Email: ' +
        EMAIL +
        '">' +
        EMAIL_SVG +
        '</a>' +
        '<a class="icon-btn" href="' +
        LINKEDIN_URL +
        '" target="_blank" rel="noopener noreferrer" aria-label="Adediwura Afolabi on LinkedIn (opens in new tab)" data-tip="LinkedIn Profile">' +
        LINKEDIN_SVG +
        '</a>' +
        '</div>' +
        '</div>';
      document.body.appendChild(footer);
    }
  }

  /* --------------------------------------------------------------------------
     3. Viewport-Triggered Number Count-Up Motion Design
     -------------------------------------------------------------------------- */
  function formatNumber(val, decimals, hasComma) {
    var fixed = decimals > 0 ? val.toFixed(decimals) : String(Math.round(val));
    if (!hasComma) return fixed;
    var parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function parseMetricElement(el) {
    var orig = el.getAttribute('data-orig') || el.textContent.trim();
    el.setAttribute('data-orig', orig);

    // Explicit data attributes on home page .tile b
    if (el.hasAttribute('data-n')) {
      var targetN = parseFloat(el.getAttribute('data-n'));
      var pref = el.getAttribute('data-p') || '';
      var suf = el.getAttribute('data-s') || '';
      if (!isNaN(targetN)) {
        return {
          el: el,
          orig: pref + targetN + suf,
          render: function (progress) {
            if (progress >= 1) return pref + targetN + suf;
            return pref + Math.round(targetN * progress) + suf;
          }
        };
      }
    }

    if (orig === '0' || orig === 'From ₦0') {
      return null;
    }

    // Arrow metrics like "0 → 520+" or "99 → 2,756"
    if (orig.indexOf('→') !== -1) {
      var arrowParts = orig.split('→');
      if (arrowParts.length === 2) {
        var leftSide = arrowParts[0].trim();
        var rightSide = arrowParts[1].trim();
        var mRight = rightSide.match(/^([+₦$]?)([\d,]+(?:\.\d+)?)([+%]*)$/);
        if (mRight) {
          var rPrefix = mRight[1];
          var rNumStr = mRight[2];
          var rSuffix = mRight[3];
          var rTarget = parseFloat(rNumStr.replace(/,/g, ''));
          var rComma = rNumStr.indexOf(',') !== -1;
          var rDec = (rNumStr.split('.')[1] || '').length;
          if (!isNaN(rTarget) && rTarget > 0) {
            return {
              el: el,
              orig: orig,
              render: function (progress) {
                if (progress >= 1) return orig;
                var cur = formatNumber(rTarget * progress, rDec, rComma);
                return leftSide + ' → ' + rPrefix + cur + rSuffix;
              }
            };
          }
        }
      }
    }

    // Standard or compound metric like "520+", "+30%", "4,585", "250+ · roughly 48% of inquiries"
    var match = orig.match(/^([+₦$]?)([\d,]+(?:\.\d+)?)([+%]*)(.*)$/);
    if (!match) return null;

    var prefix = match[1];
    var numStr = match[2];
    var suffix = match[3];
    var trailing = match[4] || '';

    var target = parseFloat(numStr.replace(/,/g, ''));
    if (isNaN(target) || target === 0) return null;

    var hasComma = numStr.indexOf(',') !== -1;
    var decimals = (numStr.split('.')[1] || '').length;

    // Check if trailing also has a secondary percentage (e.g. " · roughly 48% of inquiries")
    var trailingMatch = trailing.match(/^(.*?\s)(\d+)(%.*)$/);

    return {
      el: el,
      orig: orig,
      render: function (progress) {
        if (progress >= 1) return orig;
        var currentMain = formatNumber(target * progress, decimals, hasComma);
        var currentTrailing = trailing;
        if (trailingMatch) {
          var secTarget = parseFloat(trailingMatch[2]);
          currentTrailing =
            trailingMatch[1] + Math.round(secTarget * progress) + trailingMatch[3];
        }
        return prefix + currentMain + suffix + currentTrailing;
      }
    };
  }

  function animateGroup(items, duration) {
    if (!items || !items.length) return;
    if (REDUCED_MOTION) {
      items.forEach(function (item) {
        item.el.textContent = item.orig;
      });
      return;
    }

    var startTime = null;
    function frame(ts) {
      if (!startTime) startTime = ts;
      var elapsed = ts - startTime;
      var p = Math.min(1, elapsed / duration);
      // Cubic ease-out for natural deceleration
      var eased = 1 - Math.pow(1 - p, 3);

      for (var i = 0; i < items.length; i++) {
        items[i].el.textContent = items[i].render(p < 1 ? eased : 1);
      }

      if (p < 1) {
        requestAnimationFrame(frame);
      } else {
        for (var j = 0; j < items.length; j++) {
          items[j].el.textContent = items[j].orig;
        }
      }
    }
    requestAnimationFrame(frame);
  }

  function initNumberMotion() {
    var containers = document.querySelectorAll('.tiles, .grid, .funnel');
    if (!containers.length) return;

    if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.tile b, .kpi b, .funnel .lab b').forEach(function (el) {
        var parsed = parseMetricElement(el);
        if (parsed) el.textContent = parsed.orig;
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var container = entry.target;
          observer.unobserve(container);

          var rawEls = container.querySelectorAll('.tile b, .kpi b, .funnel .lab b');
          var parsedItems = [];
          rawEls.forEach(function (el) {
            if (el.getAttribute('data-animated') === 'true') return;
            el.setAttribute('data-animated', 'true');
            var parsed = parseMetricElement(el);
            if (parsed) parsedItems.push(parsed);
          });

          if (parsedItems.length) {
            animateGroup(parsedItems, 920);
          }

          // Also animate funnel bars smoothly if inside .funnel
          var fills = container.querySelectorAll('.fill[data-target-width]');
          fills.forEach(function (fill) {
            fill.style.width = fill.getAttribute('data-target-width');
          });
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -30px 0px' }
    );

    containers.forEach(function (c) {
      var hasMetrics = c.querySelector('.tile b, .kpi b, .funnel .lab b');
      if (!hasMetrics) return;

      // Prepare funnel bars for smooth entrance
      if (c.classList.contains('funnel') && !REDUCED_MOTION) {
        c.querySelectorAll('.fill').forEach(function (fill) {
          var w = fill.style.width;
          if (w && !fill.hasAttribute('data-target-width')) {
            fill.setAttribute('data-target-width', w);
            fill.style.width = '0%';
          }
        });
      }

      observer.observe(c);
    });
  }

  /* --------------------------------------------------------------------------
     4. Contact Form Validation, Submission & Truthful Fallback
     -------------------------------------------------------------------------- */
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function initContactSection() {
    var copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(EMAIL).then(function () {
            var origText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(function () {
              copyBtn.textContent = origText;
            }, 2400);
          });
        }
      });
    }

    var form = document.getElementById('contact-form');
    if (!form) return;

    var nameInput = document.getElementById('contact-name');
    var emailInput = document.getElementById('contact-email');
    var reasonInput = document.getElementById('contact-reason');
    var msgInput = document.getElementById('contact-message');
    var resetBtn = document.getElementById('reset-template-btn');
    var submitBtn = document.getElementById('contact-submit');
    var statusBox = document.getElementById('contact-status');

    if (resetBtn && msgInput) {
      resetBtn.addEventListener('click', function () {
        msgInput.value = DEFAULT_MESSAGE;
        clearFieldError(msgInput, 'err-message');
        msgInput.focus();
      });
    }

    function setFieldError(input, errId, message) {
      if (!input) return;
      input.setAttribute('aria-invalid', 'true');
      var errEl = document.getElementById(errId);
      if (errEl) {
        errEl.textContent = message;
        errEl.hidden = false;
      }
    }

    function clearFieldError(input, errId) {
      if (!input) return;
      input.removeAttribute('aria-invalid');
      var errEl = document.getElementById(errId);
      if (errEl) {
        errEl.textContent = '';
        errEl.hidden = true;
      }
    }

    [
      [nameInput, 'err-name'],
      [emailInput, 'err-email'],
      [reasonInput, 'err-reason'],
      [msgInput, 'err-message']
    ].forEach(function (pair) {
      if (!pair[0]) return;
      pair[0].addEventListener('input', function () {
        clearFieldError(pair[0], pair[1]);
      });
      pair[0].addEventListener('change', function () {
        clearFieldError(pair[0], pair[1]);
      });
    });

    var isSubmitting = false;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (isSubmitting) return;

      var nameVal = nameInput ? nameInput.value.trim() : '';
      var emailVal = emailInput ? emailInput.value.trim() : '';
      var reasonVal = reasonInput ? reasonInput.value.trim() : '';
      var msgVal = msgInput ? msgInput.value.trim() : '';

      var firstInvalid = null;

      if (!nameVal) {
        setFieldError(nameInput, 'err-name', 'Please enter your name.');
        firstInvalid = firstInvalid || nameInput;
      } else {
        clearFieldError(nameInput, 'err-name');
      }

      if (!emailVal) {
        setFieldError(emailInput, 'err-email', 'Please enter your email address.');
        firstInvalid = firstInvalid || emailInput;
      } else if (!validateEmail(emailVal)) {
        setFieldError(
          emailInput,
          'err-email',
          'Please enter a valid email address (for example, name@company.com).'
        );
        firstInvalid = firstInvalid || emailInput;
      } else {
        clearFieldError(emailInput, 'err-email');
      }

      if (!reasonVal) {
        setFieldError(reasonInput, 'err-reason', 'Please select a reason for contact.');
        firstInvalid = firstInvalid || reasonInput;
      } else {
        clearFieldError(reasonInput, 'err-reason');
      }

      if (!msgVal) {
        setFieldError(msgInput, 'err-message', 'Please enter a message before sending.');
        firstInvalid = firstInvalid || msgInput;
      } else {
        clearFieldError(msgInput, 'err-message');
      }

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      isSubmitting = true;
      var origBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      submitBtn.textContent = 'Preparing enquiry…';
      if (statusBox) {
        statusBox.hidden = true;
        statusBox.className = 'form-status';
      }

      var subjectLine = 'Portfolio Enquiry: ' + reasonVal + ' — from ' + nameVal;
      var formattedBody =
        msgVal +
        '\n\n---\nName: ' +
        nameVal +
        '\nEmail: ' +
        emailVal +
        '\nReason for contact: ' +
        reasonVal;
      var mailtoHref =
        'mailto:' +
        EMAIL +
        '?subject=' +
        encodeURIComponent(subjectLine) +
        '&body=' +
        encodeURIComponent(formattedBody);

      var payloadObj = {
        name: nameVal,
        email: emailVal,
        reason: reasonVal,
        message: msgVal,
        objective: reasonVal,
        process: msgVal,
        company: ''
      };

      function showSuccessBanner() {
        statusBox.className = 'form-status ok';
        statusBox.innerHTML =
          '<strong>Enquiry sent.</strong> Thank you, ' +
          escapeHtml(nameVal) +
          '. Your message has been recorded and delivered to Adediwura Afolabi.';
        statusBox.hidden = false;
      }

      function tryServerApi() {
        return fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadObj)
        })
          .then(function (res) {
            return res
              .json()
              .then(function (data) {
                return { status: res.status, data: data };
              })
              .catch(function () {
                return { status: res.status, data: null };
              });
          })
          .then(function (result) {
            if (
              result.status >= 200 &&
              result.status < 300 &&
              result.data &&
              (result.data.ok || result.data.success)
            ) {
              showSuccessBanner();
              return;
            }
            triggerEmailFallback(mailtoHref, subjectLine, formattedBody);
          })
          .catch(function () {
            triggerEmailFallback(mailtoHref, subjectLine, formattedBody);
          });
      }

      // 1. Try direct n8n webhook (CORS enabled for https://adediwura-afolabi.vercel.app and localhost), then Vercel /api/contact
      var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timeoutId = controller
        ? setTimeout(function () {
            controller.abort();
          }, 4000)
        : null;

      fetch('http://localhost:5678/webhook/portfolio-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadObj),
        signal: controller ? controller.signal : undefined
      })
        .then(function (res) {
          if (timeoutId) clearTimeout(timeoutId);
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (n8nRes) {
          if (n8nRes.ok && n8nRes.data && n8nRes.data.success === true) {
            showSuccessBanner();
            return;
          }
          return tryServerApi();
        })
        .catch(function () {
          if (timeoutId) clearTimeout(timeoutId);
          return tryServerApi();
        })
        .finally(function () {
          isSubmitting = false;
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          submitBtn.innerHTML = origBtnHtml;
        });
    });

    function triggerEmailFallback(mailtoHref, subjectLine, formattedBody) {
      // Open user's configured mail client with prefilled fields
      window.location.href = mailtoHref;

      if (!statusBox) return;
      statusBox.className = 'form-status';
      statusBox.innerHTML =
        '<strong>Ready in your email app:</strong> Because this static portfolio does not store messages on an external database without webhook credentials, your formatted enquiry has been opened in your mail client addressed to <b>' +
        EMAIL +
        '</b>. Your entered information is preserved above.' +
        '<div class="status-actions">' +
        '<a class="btn main" style="padding:8px 14px;font-size:13px" href="' +
        mailtoHref +
        '">Open Email App Again →</a>' +
        '<button type="button" class="btn" id="copy-enquiry-btn" style="padding:8px 14px;font-size:13px">Copy Formatted Enquiry</button>' +
        '</div>';
      statusBox.hidden = false;

      var copyEnqBtn = document.getElementById('copy-enquiry-btn');
      if (copyEnqBtn && navigator.clipboard && navigator.clipboard.writeText) {
        copyEnqBtn.addEventListener('click', function () {
          var fullClip =
            'To: ' + EMAIL + '\nSubject: ' + subjectLine + '\n\n' + formattedBody;
          navigator.clipboard.writeText(fullClip).then(function () {
            copyEnqBtn.textContent = 'Copied to Clipboard!';
          });
        });
      }
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function init() {
    enhanceHeaderAndFooter();
    initNumberMotion();
    initContactSection();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
