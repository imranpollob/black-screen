'use strict';

// 1. Feature Detection and Polyfill Loading for Popover API
if (!('popover' in HTMLElement.prototype)) {
  const polyfillScript = document.createElement('script');
  polyfillScript.src = 'https://cdn.jsdelivr.net/npm/@oddbird/popover-polyfill@latest/dist/popover-fn.js';
  polyfillScript.type = 'module';
  polyfillScript.onload = () => {
    console.log('Popover polyfill loaded.');
  };
  document.head.appendChild(polyfillScript);
}

// 2. DOM Elements Selection
const clock = document.getElementById('clock');
const customTextDisplay = document.getElementById('custom-text');
const pencilBtn = document.getElementById('pencil-btn');
const customTextInput = document.getElementById('custom-text-input');
const menuBtn = document.getElementById('menu-btn');
const menuPopover = document.getElementById('menu-popover');
const fullscreenToggleBtn = document.getElementById('fullscreen-toggle');
const presetsGrid = document.getElementById('presets-grid');
const customColorPicker = document.getElementById('custom-color-picker');

// 3. Safe Storage Helper
const STORAGE_KEYS = {
  BG_COLOR: 'black_screen_bg_color',
  CUSTOM_TEXT: 'black_screen_custom_text'
};

const SafeStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('Storage unavailable:', e);
      return null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('Unable to write to storage:', e);
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Unable to delete from storage:', e);
    }
  }
};

// 4. Color Luminance Helper for Dynamic Contrast
function getLuminance(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  if (isNaN(r) || isNaN(g) || isNaN(b)) return 0;

  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

// 5. Background Color Logic
function setBackgroundColor(color) {
  if (!color) return;
  document.documentElement.style.setProperty('--bg-color', color);
  SafeStorage.setItem(STORAGE_KEYS.BG_COLOR, color);

  // Adapt UI brightness for readability on light or dark screens
  const lum = getLuminance(color);
  if (lum > 0.45) {
    document.documentElement.setAttribute('data-bg-brightness', 'light');
  } else {
    document.documentElement.setAttribute('data-bg-brightness', 'dark');
  }

  if (customColorPicker && customColorPicker.value !== color) {
    customColorPicker.value = color;
  }

  // Update active state on preset grid dots
  if (presetsGrid) {
    const dots = presetsGrid.querySelectorAll('.color-dot');
    let matched = false;
    dots.forEach(dot => {
      const dotColor = dot.getAttribute('data-color');
      if (dotColor && dotColor.toLowerCase() === color.toLowerCase()) {
        dot.classList.add('active');
        matched = true;
      } else {
        dot.classList.remove('active');
      }
    });

    if (!matched) {
      dots.forEach(dot => dot.classList.remove('active'));
    }
  }
}

// 6. Custom Focus Text Logic
function setCustomText(text) {
  const trimmed = (text || '').trim();
  customTextDisplay.setAttribute('data-text-value', trimmed);

  if (trimmed) {
    customTextDisplay.textContent = trimmed;
    customTextDisplay.style.display = 'flex';
    pencilBtn.style.display = 'none';
    SafeStorage.setItem(STORAGE_KEYS.CUSTOM_TEXT, trimmed);
  } else {
    customTextDisplay.style.display = 'none';
    pencilBtn.style.display = 'flex';
    SafeStorage.removeItem(STORAGE_KEYS.CUSTOM_TEXT);
  }
  customTextInput.style.display = 'none';
}

function loadSettings() {
  const savedBg = SafeStorage.getItem(STORAGE_KEYS.BG_COLOR) || '#000000';
  setBackgroundColor(savedBg);

  const savedText = SafeStorage.getItem(STORAGE_KEYS.CUSTOM_TEXT) || '';
  setCustomText(savedText);
}

// 7. Ambient Clock Functionality
function updateClock() {
  if (!clock) return;
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // 12-hour format
  clock.textContent = `${hours}:${minutes}:${seconds} ${period}`;
}

setInterval(updateClock, 1000);
updateClock();

// 8. Presets & Custom Color Events
if (presetsGrid) {
  presetsGrid.addEventListener('click', (event) => {
    const targetDot = event.target.closest('.color-dot');
    if (!targetDot) return;
    const color = targetDot.getAttribute('data-color');
    if (color) {
      setBackgroundColor(color);
    }
  });
}

if (customColorPicker) {
  customColorPicker.addEventListener('input', (event) => {
    setBackgroundColor(event.target.value);
  });
}

// 9. Custom Text Inline Editor Handlers
function startEditing() {
  customTextDisplay.style.display = 'none';
  pencilBtn.style.display = 'none';
  customTextInput.style.display = 'block';
  customTextInput.value = customTextDisplay.getAttribute('data-text-value') || '';
  customTextInput.focus();
  customTextInput.select();
}

function finishEditing(save) {
  if (save) {
    setCustomText(customTextInput.value);
  } else {
    const savedText = SafeStorage.getItem(STORAGE_KEYS.CUSTOM_TEXT) || '';
    setCustomText(savedText);
  }
}

customTextDisplay.addEventListener('click', startEditing);
pencilBtn.addEventListener('click', startEditing);

customTextInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    finishEditing(true);
  } else if (event.key === 'Escape') {
    event.stopPropagation();
    finishEditing(false);
  }
});

customTextInput.addEventListener('blur', () => {
  finishEditing(true);
});

// 10. Fullscreen Logic
function getFullscreenElement() {
  return document.fullscreenElement ||
         document.webkitFullscreenElement ||
         document.mozFullScreenElement ||
         document.msFullscreenElement;
}

function toggleFullscreen() {
  const fsElement = getFullscreenElement();

  if (!fsElement) {
    const docEl = document.documentElement;
    const requestFS = docEl.requestFullscreen ||
                      docEl.webkitRequestFullscreen ||
                      docEl.mozRequestFullScreen ||
                      docEl.msRequestFullscreen;
    if (requestFS) {
      try {
        const promise = requestFS.call(docEl);
        if (promise && typeof promise.catch === 'function') {
          promise.catch(err => {
            console.error('Fullscreen request error:', err.message);
          });
        }
      } catch (err) {
        console.error('Fullscreen error:', err);
      }
    }
  } else {
    const exitFS = document.exitFullscreen ||
                   document.webkitExitFullscreen ||
                   document.mozCancelFullScreen ||
                   document.msExitFullscreen;
    if (exitFS) {
      try {
        const promise = exitFS.call(document);
        if (promise && typeof promise.catch === 'function') {
          promise.catch(err => {
            console.error('Fullscreen exit error:', err.message);
          });
        }
      } catch (err) {
        console.error('Fullscreen error:', err);
      }
    }
  }
}

if (fullscreenToggleBtn) {
  fullscreenToggleBtn.addEventListener('click', toggleFullscreen);
}

function updateFullscreenIcon() {
  const icon = document.querySelector('#fullscreen-toggle i');
  if (!icon) return;

  if (getFullscreenElement()) {
    icon.classList.replace('fa-expand', 'fa-compress');
    fullscreenToggleBtn.setAttribute('title', 'Exit Fullscreen (F)');
    fullscreenToggleBtn.setAttribute('aria-label', 'Exit Fullscreen Mode');
  } else {
    icon.classList.replace('fa-compress', 'fa-expand');
    fullscreenToggleBtn.setAttribute('title', 'Toggle Fullscreen (F)');
    fullscreenToggleBtn.setAttribute('aria-label', 'Toggle Fullscreen Mode');
  }
}

const fsChangeEvents = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'mozfullscreenchange',
  'MSFullscreenChange'
];

fsChangeEvents.forEach(eventType => {
  document.addEventListener(eventType, updateFullscreenIcon);
});

// 11. Global Keyboard Shortcuts
document.addEventListener('keydown', (event) => {
  if (document.activeElement === customTextInput) {
    return;
  }

  const key = event.key.toLowerCase();

  // 'F' toggles fullscreen
  if (key === 'f') {
    event.preventDefault();
    toggleFullscreen();
  }

  // 'C' toggles color menu popover
  if (key === 'c') {
    event.preventDefault();
    if (menuPopover && typeof menuPopover.togglePopover === 'function') {
      menuPopover.togglePopover();
    } else if (menuBtn) {
      menuBtn.click();
    }
  }
});

// 12. Initialization
document.addEventListener('DOMContentLoaded', loadSettings);
loadSettings();
