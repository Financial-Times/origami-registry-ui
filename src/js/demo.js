

export default (function(){
	window.addEventListener('message', (event) => {
		try {
			const data = JSON.parse(event.data);
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
