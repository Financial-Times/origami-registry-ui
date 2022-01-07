
import '@financial-times/o-header-services';
import '@financial-times/o-message';
import '@financial-times/o-syntax-highlight';
import '@financial-times/o-tabs';
import '@financial-times/o-table';
import '@financial-times/o-layout';
import './js/demo.js';
import './js/main.js';
import '@financial-times/o-autoinit';
import oTracking from '@financial-times/o-tracking';
import CookieMessage from '@financial-times/o-cookie-message';


document.addEventListener('o.DOMContentLoaded', () => {
	const cookieMessage = new CookieMessage();
	const hasConsentedToCookies = cookieMessage.shouldShowCookieMessage() === false;
	if (hasConsentedToCookies) {
		turnOnTracking();
	} else {
		document.body.addEventListener('oCookieMessage.act', () => {
			turnOnTracking();
		});
	}
});

function turnOnTracking() {
	oTracking.init({
		context: {
			product: 'origami-registry-ui',
		}
	});
	// Send a page view tracking event.
	oTracking.page();
	// Track click events on the page.
	oTracking.click.init();
	// Track when elements with the attribute `data-o-tracking-view` are visible to the user.
	oTracking.view.init();
	// Tell o-tracking to listen for custom events named `oTracking.event`.
	oTracking.event.init();
}
