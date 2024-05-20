function setBackgroundColor(tailwindClass) {
  const body = document.body;
  // Remove any previously added background color classes
  body.classList.remove(
    "bg-black",
    "bg-gray-900",
    "bg-gray-800",
    "bg-gray-700",
    "bg-gray-600",
    "bg-gray-500",
    "bg-gray-400",
    "bg-gray-300"
  );
  // Add the new background color class
  body.classList.add(tailwindClass);
}

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert hours to 12-hour format
  const clock = document.getElementById("clock");
  clock.textContent = `${hours}:${minutes}:${seconds} ${period}`;
}

// Update the clock every second
setInterval(updateClock, 1000);
updateClock();

document
  .getElementById("fullscreen-toggle")
  .addEventListener("click", fullscreenToggle);

document.addEventListener("keydown", (event) => {
  if (event.key === "f") {
    fullscreenToggle();
  }
});

function fullscreenToggle() {
  const icon = document.querySelector("#fullscreen-toggle i");
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    icon.classList.remove("fa-expand");
    icon.classList.add("fa-compress");
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
    icon.classList.remove("fa-compress");
    icon.classList.add("fa-expand");
  }
}
