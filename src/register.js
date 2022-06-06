import { PostAuthorization } from "./client.js";

// Register for an account
$("#register-button").on("click", Register);

async function Register() {
	const institution = $("#regInst").val();
	const password = $("#regPass1").val();
	const confirmPassword = $("#regPass2").val();
	const { isAdmin, adminError } = IsAdmin($("#regAdmin").val());

	if (institution === "") {
		alert("Please enter an institution.");

		return;
	}

	if (password === "") {
		alert("Please enter a password.");

		return;
	}

	if (password !== confirmPassword) {
		alert("The passwords do not match!");

		return;
	}

	if (adminError) {
		alert("The admin credentials are not correct.");

		return;
	}

	const isAuthorized = await PostAuthorization(
		institution,
		password,
		isAdmin
	);

	if (!isAuthorized) {
		alert("This institution is already registered.");

		return;
	}

	alert("The registration was successful.");

	window.location.href = "../html/login.html";
}

function IsAdmin(adminCredentials) {
	const key = "Hello World";

	if (adminCredentials === "") {
		return {
			isAdmin: false,
			adminError: false,
		};
	}

	if (adminCredentials === key) {
		return {
			isAdmin: true,
			adminError: false,
		};
	}

	return {
		isAdmin: false,
		adminError: true,
	};
}
