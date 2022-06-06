$("#application").on("click", goApplication);
$("#logout").on("click", Logout);

function goApplication() {
	if (localStorage.getItem("isAdmin")) {
		window.location.href = "../html/adminApplication.html";
	} else {
		window.location.href = "../html/application.html";
	}
}

function Logout() {
	localStorage.setItem("institution", "");
	localStorage.setItem("isAdmin", "");

	window.location.href = "../html/login.html";
}
