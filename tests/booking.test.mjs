import test from "node:test";
import assert from "node:assert/strict";
import { validateBooking } from "../src/lib/booking.ts";
const now = new Date("2026-10-31T20:00:00Z");
const valid = {
	id: "911457ed-5cc3-4cf3-9edf-09efcc9f973f",
	name: " Cliente de prueba ",
	email: "CLIENTE@example.com",
	phone: "+57 300 123 4567",
	service: "Editorial",
	date: "2026-11-10",
	location: "Bogotá",
	people: 2,
	message: "Sesión editorial de prueba para validar el formulario.",
	consent: true,
	website: "",
};
test("normalizes contact details and accepts an unspecified date", () => {
	const result = validateBooking({ ...valid, date: "" }, now);
	assert.equal(result.data.name, "Cliente de prueba");
	assert.equal(result.data.email, "cliente@example.com");
	assert.equal(result.data.date, "");
});
test("rejects malformed input, missing consent, and the honeypot", () => {
	for (const value of [
		null,
		[],
		"text",
		{ ...valid, consent: false },
		{ ...valid, website: "spam" },
		{ ...valid, id: "bad" },
	])
		assert.ok(validateBooking(value, now).error);
});
test("rejects unsupported services, invalid email, and oversized fields", () => {
	for (const patch of [
		{ service: "unsupported" },
		{ email: "invalid" },
		{ name: "a" },
		{ name: "a".repeat(101) },
		{ message: "a".repeat(3001) },
		{ phone: "not-a-phone" },
		{ location: "" },
		{ people: 0 },
		{ people: 1.5 },
		{ people: "2" },
	])
		assert.ok(validateBooking({ ...valid, ...patch }, now).error);
});
test("validates calendar dates and today's date in Bogotá", () => {
	for (const date of ["2026-10-30", "2027-02-30", "tomorrow"])
		assert.ok(validateBooking({ ...valid, date }, now).error);
	assert.ok(
		validateBooking(
			{ ...valid, date: "2026-10-31" },
			new Date("2026-11-01T02:00:00Z"),
		).data,
	);
});
