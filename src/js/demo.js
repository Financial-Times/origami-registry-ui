

module.exports = (function(){
	window.addEventListener('message', (e) => {
		try {
			const data = JSON.parse(e.data);
			if (data.type === 'resize' && data.url && data.height) {
				const iframesToResize = document.querySelectorAll(`iframe[src="${data.url}"]`);
				iframesToResize.forEach((iframe) => {
					iframe.height = data.height;
				});
			}
		} catch(e) {

		}
	}, false);
}());
