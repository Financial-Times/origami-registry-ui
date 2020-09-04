
import 'o-header-services';
import 'o-message';
import 'o-syntax-highlight';
import 'o-tabs';
import 'o-table';
import 'o-layout';
import './js/demo';
import './js/main';
import 'o-autoinit';
import oTracking from 'o-tracking';
import CookieMessage from 'o-cookie-message';

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
