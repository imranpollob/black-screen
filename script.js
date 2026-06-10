// 1. Feature Detection and Polyfill Loading for Popover API
if (!('popover' in HTMLElement.prototype)) {
  const polyfillScript = document.createElement('script');
  polyfillScript.src = 'https://cdn.jsdelivr.net/npm/@oddbird/popover-polyfill@latest/dist/popover-fn.js';
  polyfillScript.type = 'module';
  polyfillScript.onload = () => {
    console.log('Popover polyfill loaded successfully.');
  };
  document.head.appendChild(polyfillScript);
}

// 2. DOM Elements Selection
const body = document.body;
const clock = document.getElementById('clock');
const customTextDisplay = document.getElementById('custom-text');
const pencilBtn = document.getElementById('pencil-btn');
const customTextInput = document.getElementById('custom-text-input');
const fullscreenToggleBtn = document.getElementById('fullscreen-toggle');
const presetsGrid = document.getElementById('presets-grid');
const customColorPicker = document.getElementById('custom-color-picker');

// 3. State Management (Background & Custom Text)
const STORAGE_KEYS = {
  BG_COLOR: 'black_screen_bg_color',
  CUSTOM_TEXT: 'black_screen_custom_text'
};

// Initialize Background Color
function setBackgroundColor(color) {
  // Set custom CSS variable on document root for standard theme control
  document.documentElement.style.setProperty('--bg-color', color);
  localStorage.setItem(STORAGE_KEYS.BG_COLOR, color);

  // Sync custom color picker input value
  if (customColorPicker.value !== color) {
    customColorPicker.value = color;
  }

  // Update active class in presets grid
  const dots = presetsGrid.querySelectorAll('.color-dot');
  let matched = false;
  dots.forEach(dot => {
    if (dot.getAttribute('data-color') === color) {
      dot.classList.add('active');
      matched = true;
    } else {
      dot.classList.remove('active');
    }
  });

  // If color doesn't match predefined presets, remove active state from all presets
  if (!matched) {
    dots.forEach(dot => dot.classList.remove('active'));
  }
}

// Initialize Custom Text
function setCustomText(text) {
  const trimmedText = text.trim();
  customTextDisplay.setAttribute('data-text-value', trimmedText);
  
  if (trimmedText) {
    customTextDisplay.textContent = trimmedText;
    customTextDisplay.style.display = 'flex';
    pencilBtn.style.display = 'none';
    localStorage.setItem(STORAGE_KEYS.CUSTOM_TEXT, trimmedText);
  } else {
    customTextDisplay.style.display = 'none';
    pencilBtn.style.display = 'flex';
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_TEXT);
  }
  customTextInput.style.display = 'none';
}

// Load configurations from LocalStorage
function loadSettings() {
  const savedBg = localStorage.getItem(STORAGE_KEYS.BG_COLOR) || '#000000';
  setBackgroundColor(savedBg);

  const savedText = localStorage.getItem(STORAGE_KEYS.CUSTOM_TEXT) || '';
  setCustomText(savedText);
}

// 4. Clock Functionality
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  
  hours = hours % 12 || 12; // 12-hour format
  clock.textContent = `${hours}:${minutes}:${seconds} ${period}`;
}

// Update the clock immediately and set interval
setInterval(updateClock, 1000);
updateClock();

// 5. Preset Color Selectors
presetsGrid.addEventListener('click', (event) => {
  const targetDot = event.target.closest('.color-dot');
  if (!targetDot) return;
  const color = targetDot.getAttribute('data-color');
  if (color) {
    setBackgroundColor(color);
  }
});

// Custom Color Picker Change Handler
customColorPicker.addEventListener('input', (event) => {
  setBackgroundColor(event.target.value);
});

// 6. Custom Text Inline Editor Handlers
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
    const savedText = localStorage.getItem(STORAGE_KEYS.CUSTOM_TEXT) || '';
    setCustomText(savedText);
  }
}

customTextDisplay.addEventListener('click', startEditing);
pencilBtn.addEventListener('click', startEditing);

customTextInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    finishEditing(true);
  } else if (event.key === 'Escape') {
    finishEditing(false);
  }
});

customTextInput.addEventListener('blur', () => {
  finishEditing(true);
});

// Cross-browser helper to check active fullscreen element
function getFullscreenElement() {
  return document.fullscreenElement || 
         document.webkitFullscreenElement || 
         document.mozFullScreenElement || 
         document.msFullscreenElement;
}

// 7. Fullscreen Control logic
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
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
          });
        }
      } catch (err) {
        console.error(`Error requesting fullscreen: ${err}`);
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
            console.error(`Error attempting to exit fullscreen: ${err.message}`);
          });
        }
      } catch (err) {
        console.error(`Error exiting fullscreen: ${err}`);
      }
    }
  }
}

fullscreenToggleBtn.addEventListener("click", toggleFullscreen);

// Synchronize fullscreen icon across all browsers
function updateFullscreenIcon() {
  const icon = document.querySelector("#fullscreen-toggle i");
  if (!icon) return;
  
  if (getFullscreenElement()) {
    icon.classList.replace('fa-expand', 'fa-compress');
  } else {
    icon.classList.replace('fa-compress', 'fa-expand');
  }
}

// Register all potential vendor-prefixed fullscreenchange events
const fsChangeEvents = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'mozfullscreenchange',
  'MSFullscreenChange'
];

fsChangeEvents.forEach(eventType => {
  document.addEventListener(eventType, updateFullscreenIcon);
});

// Keyboard shortcut (press 'f' or 'F' to toggle fullscreen)
document.addEventListener("keydown", (event) => {
  // Prevent triggering when the user is typing in the inline text input
  if (document.activeElement === customTextInput) {
    return;
  }
  
  if (event.key === "f" || event.key === "F") {
    toggleFullscreen();
  }
});

// 8. Load settings on page load
document.addEventListener('DOMContentLoaded', loadSettings);
loadSettings(); // Run immediately in case DOMContentLoaded has already fired
