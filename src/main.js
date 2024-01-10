
import 'o-header-services';
import 'o-message';
import 'o-syntax-highlight';
import 'o-tabs';
import 'o-table';
import 'o-layout';
import './js/demo.js';
import './js/main.js';
import 'o-autoinit';
import oTracking from 'o-tracking';
import CookieMessage from 'o-cookie-message';



function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const cookieMessage = new CookieMessage();

const hasConsentedToCookies = cookieMessage.shouldShowCookieMessage() === false;
if (hasConsentedToCookies) {
	turnOnTracking();
} else {
	document.body.addEventListener('oCookieMessage.act', () => {
		turnOnTracking();
	});
}

function turnOnTracking() {
	if (window.location.href.startsWith('https://registry.origami.ft.com/')) {
		const oktaId = getCookie('oktaId');
		oTracking.init({
			context: {
				product: 'engineering-enablement',
				app: 'origami-registry-ui',
			},
			user: {
				okta_id: oktaId,
				is_staff: !!oktaId,
			},
		});
		// Send a page view tracking event.
		oTracking.page();
		// Track click events on the page.
		oTracking.click.init();
		// Track when elements with the attribute `data-o-tracking-view` are visible to the user.
		oTracking.view.init();
		// Tell o-tracking to listen for custom events named `oTracking.event`.
		oTracking.event.init();
	} else {
		console.log('Skipping analytics - not a production site');
	}
}






