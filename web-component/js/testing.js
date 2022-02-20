/*
	This file contains a few functions that
	are to be used just for testing purposes.
*/

function showAllDroplets() {
	var droplets = getDroplets();
	for (let i = 0; i < droplets.length; i++) {
		showDroplet(droplets[i]);
	}
}

function hideAllDroplets() {
	var droplets = getDroplets();
	for (let i = 0; i < droplets.length; i++) {
		hideDroplet(droplets[i]);
	}
}

console.warn("testing.js utility was loaded.");