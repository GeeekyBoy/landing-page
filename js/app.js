// Append navigation links according to the present sections.
function appendNavLinks() {
	const navContents = document.createDocumentFragment();
	const sectionTitles = document.querySelectorAll("article > strong");
	for (const sectionTitle of sectionTitles) {
		const navItem = document.createElement("a");
		navItem.href = `#${sectionTitle.parentElement.id}`
		navItem.textContent = sectionTitle.textContent;
		navContents.appendChild(navItem);
	}
	navContents.querySelector("a").classList.add("active");
	document.getElementsByTagName("nav")[0].appendChild(navContents);
}

// Preserve the previous scroll position along Y-axis to be able to calcualte the scroll delta
let oldScroll = 0;
// A flag indicates if the webpage is being scrolled smoothly or not
let isSmoothScrolled = false;
// The listener function invoked after scrolling
let scrollListener = null;
window.addEventListener("scroll", function(e) {
  // clear any pending scroll listeners to avoid listeners overlapping
	clearTimeout(scrollListener);
	// Add the scroll listener to the queue till finishing scrolling (after 100ms if scrolled manually and 1s if scrolled smoothly)
	scrollListener = setTimeout(function() {
		const sections = document.querySelectorAll("article");
		// Iterate over all sections till find the visible one
		for (const section of sections) {
			if (window.pageYOffset >= section.offsetTop - 250 && window.pageYOffset < section.offsetTop + section.offsetHeight - 250) {
				if (!section.classList.contains("active")) {
				  // Remove class called active from current active link
					document.querySelector("nav a.active").classList.remove("active");
					// Add class called active to the link of the section to be activated
					document.querySelector(`nav a[href$="#${section.id}"]`).classList.add("active");
					// A reference to the current active section
					const currSection = document.querySelector("article.active");
					// Deactivate the current active section
					currSection.classList.remove("active");
					// Apply Exit animation only if scrolling is upwards and not smooth
					if (window.pageYOffset - oldScroll <= 0 && !isSmoothScrolled) {
						const currSectionTitle = currSection.querySelector("strong");
						const currSectionContent = currSection.querySelector("p");
						currSectionTitle.classList.add("titleExit");
						currSectionContent.classList.add("contentExit");
						currSectionTitle.addEventListener("animationend", removeTitleAnim);
						currSectionContent.addEventListener("animationend", removeContentAnim);
					}
					// Add class called active to the next active section
					section.classList.add("active");
					// Apply enter animation if scrolling is downwards or if it was smooth
					if (window.pageYOffset - oldScroll >= 0 || isSmoothScrolled) {
						const sectionTitle = section.querySelector("strong");
						const sectionContent = section.querySelector("p");
						sectionTitle.classList.add("titleEnter");
						sectionContent.classList.add("contentEnter");
						sectionTitle.addEventListener("animationend", removeTitleAnim);
						sectionContent.addEventListener("animationend", removeContentAnim);
					}
				}
				break;
			}
		}
		oldScroll = window.pageYOffset;
		if (isSmoothScrolled) {
			isSmoothScrolled = false;
		}
	}, isSmoothScrolled ? 1000 : 100);
})

// Remove animation class after it has been finished
const removeTitleAnim = function(e) {
	e.target.classList.remove("titleEnter");
	e.target.classList.remove("titleExit");
	e.target.removeEventListener("animationend", removeTitleAnim)
}
const removeContentAnim = function(e) {
	e.target.classList.remove("contentEnter");
	e.target.classList.remove("contentExit");
	e.target.removeEventListener("animationend", removeContentAnim)
}

document.addEventListener("DOMContentLoaded", function() {
	document.getElementsByTagName("nav")[0].addEventListener("click", function(e) {
	  // Check if the clicked element was the actual anchor link
		if (e.target.tagName === "A") {
		  // Prevent the default behaviour of the anchor link
			e.preventDefault();
			// Get section ID from the anchor href attribute using Regex
			const targetSectionID = /^.*(#[\w-]*)$/m.exec(e.target.href)[1];
			// A reference to the section to be activated
			const targetSection = document.querySelector(targetSectionID);
			// Scroll smoothly
			window.scroll({
				top: targetSection.offsetTop - 250,
				left: 0,
				behavior: "smooth"
			})
			isSmoothScrolled = true;
		}
	})
	appendNavLinks();
})