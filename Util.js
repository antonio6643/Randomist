/**
 * Generates a random integer in the range [min, max].
 * @param {Integer} min - the lowest possible random number
 * @param {Integer} max - The highest possible random number
 */
module.exports.RandomInteger = function(min, max){
	return Math.floor( Math.random() * (max - min + 1) ) + min
}

/**
 * Returns a random element from the array
 * @param {Array} array 
 */
module.exports.RandomChoice = function(array){
	return array[Math.floor(Math.random() * array.length)]
}

/**
 * Converts RGB to a hex code
 * @param {Number} red 
 * @param {Number} green 
 * @param {Number} blue 
 */
module.exports.RGBToHex = function(red, green, blue){
	let hexRed = red.toString(16).padStart(2, '0')
	let hexGreen = green.toString(16).padStart(2, '0')
	let hexBlue = blue.toString(16).padStart(2, '0')
	
	return (hexRed+hexGreen+hexBlue).toUpperCase()
}

/**
 * Determines whether or not the given input is a positive integer.
 * @param {String} input 
 */
module.exports.isInteger = function(input){
	return /^\d+$/.test(input)
}

/**
 * Restricts the given number to be inside the interval [min, max].
 * @param {Number} num 
 * @param {Number} min 
 * @param {Number} max 
 */
module.exports.Clamp = function(num, min, max){
	return Math.max(Math.min(num, max), min)
}

/**
 * Capitalizes the first letter of the word.
 * @param {String} word 
 */
module.exports.Capitalize = function(word){
	return word.charAt(0).toUpperCase()+word.slice(1)
}