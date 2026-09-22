// JavaScript file with common code patterns
// These patterns contain regex special characters that should be matched literally

// Function calls with parentheses
toast.error("test");
console.log("hello world");
alert("message");

// Array access with brackets
array[0]
data[index]
items[key]

// Object method calls with dots
obj.method()
user.getName()
config.getValue()

// Template literals with backticks
const msg = `Hello ${name}`;
const query = `SELECT * FROM users WHERE id = ${id}`;

// Regex special characters
const pattern = ".*";
const wildcard = "test*";
const question = "value?";
const plus = "count++";
const caret = "^start";
const dollar = "end$";
const pipe = "a|b";
const backslash = "path\\to\\file";

// Complex patterns
if (condition && obj.method()) {
  toast.error("Error occurred");
}

function validateEmail(email) {
  return email.includes("@") && email.includes(".");
}
