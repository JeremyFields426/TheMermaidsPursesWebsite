import { FetchAuthorization } from "./client.js";

// When "Sign up!" is clicked, brings you to the register page
$("#sign-up").on("click", SwitchToRegister);

// Login using your account credentials
$("#login-button").on("click", Login);

function SwitchToRegister() {
	window.location.href = "../html/register.html";
}

async function Login() {
	const institution = $("#logInst").val();
	const password = $("#logPass").val();

	const auth = await FetchAuthorization(institution, password);

	if (!auth) {
		alert("The institution or the password is not correct.");

		return;
	}

	localStorage.setItem("institution", auth.institution);

	if (auth.isAdmin) {
		localStorage.setItem("isAdmin", "true");
	} else {
		localStorage.setItem("isAdmin", "");
	}

	alert("The login was successful.");

	if (auth.isAdmin) {
		window.location.href = "../html/adminApplication.html";

		return;
	}

	window.location.href = "../html/application.html";
}

export function Logout() {
	localStorage.removeItem("institution");
	localStorage.removeItem("isAdmin");

	window.location.href = "../html/login.html";
}

export function GetInstitution() {
	return localStorage.getItem("institution");
}

export function IsAdmin() {
	return localStorage.getItem("isAdmin");
}
