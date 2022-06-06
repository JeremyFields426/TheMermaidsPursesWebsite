emailjs.init("user_oyhQJSABQUf0gPErlSB6J");

window.onload = () => {
	document
		.getElementById("contact-form")
		.addEventListener("submit", function (event) {
			event.preventDefault();
			// generate a five digit number for the contact_number variable
			this.contact_number.value = (Math.random() * 100000) | 0;
			// these IDs from the previous steps
			emailjs.sendForm("service_wmh4peq", "template_bfbish3", this).then(
				function () {
					console.log("SUCCESS!");
				},
				function (error) {
					console.log("FAILED...", error);
				}
			);
			//Clears Values after submission and lets user know message is sent
			window.alert("Your Message has be Sent.");
			document.getElementById("contact-form").reset();
		});
};
