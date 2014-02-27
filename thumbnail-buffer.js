/* 
 * thumbnail-buffer.js
 * 
 * Image thumbnail buffer.
 * 
 * version: 0.0.1
 * create date: 2014-2-14
 * update date: 2014-2-14
 */

var util	= require('util'), 
		gm		= require('gm');

/* 
 * Pre-process.
 * 
 * Parameters: 
 *  image - (String/Readable Stream/Buffer) image file path, image stream or
 *          buffer
 *  options - (Object) thumbnail options 
 *    width - (Number) thumbnail width
 *    height - (Number) thumbnail height
 *    crop - (String) crop method, 'Center' or 'North'
 * 
 * Callback: 
 *  callback - (Function) function(err) {} 
 *    err - (Object) error object, set to null if succeed
 */
function preProcess(image, options, callback) {
	callback(null);
	return;

	if (!options.format) {
		gm(image)
		.format(function(err, value) {
			if (err) {
				options.format = 'JPEG';
			} else {
				if (value == 'PNG') {
					options.format = 'PNG';
				} else {
					options.format = 'JPEG';
				}
			}
			callback(null);
		});		// format
	}
}

/*
 * Create image thumbnail buffer.
 *
 * Parameters: 
 *	image - (String/Readable Stream/Buffer) image file path, image stream or
 *					buffer
 *	options - (Object) thumbnail options 
 *		width - (Number) thumbnail width
 *		height - (Number) thumbnail height
 *		crop - (String) crop method, 'Center' or 'North'
 * 
 * Callback: 
 *	callback - (Function) function(err, buf) {} 
 *		err - (Object) error object, set to null if succeed
 *		buf - (Buffer) thumbnail buffer
 */
function process(image, options, callback) {
	if (options.crop) {
		gm(image)
		.resize(options.width, options.height, '^')
		.gravity(options.crop)
		.extent(options.width, options.height)
		.toBuffer(callback);
	} else { 
		gm(image)
		.resize(options.width, options.height)
		.toBuffer(callback);
	}
}

/* 
 * Post process.
 *
 * Parameters:
 *	buf - (Buffer) thumbnail buffer
 * 
 * Callback:
 *	callback - (Function) function(err, buf, info) {}
 *		err - (Object) error object, set to null if succeed.
 *		info - (Object) thumbnail info
 *			format - (String) thumbnail format
 */
function postProcess(buf, callback) {
	var info = {};
	gm(buf)
	.format(function(err, value) {
		if (err) {
			callback(err, null);
			return;
		}

		info.format = value;
		callback(null, info);
	});		// format
}

/*
 * Create image thumbnail.
 *
 * Parameters: 
 *  image - (String/Readable Stream/Buffer) image file path, image stream or
 *          buffer
 *  options - (Object) thumbnail options 
 *    width - (Number) thumbnail width
 *    height - (Number) thumbnail height
 *    crop - (String) crop method, 'Center' or 'North'
 * 
 * Callback:
 *  callback - (Function) function(e, buf, info) {}
 *    err - (Object) error object, set to null if succeed.
 *    buf - (Buffer) thumbnail buffer
 *    info - (Object) thumbnail object
 *      format - (String) thumbnail format
 */
function create(image, options, callback) {
	preProcess(image, options, function(err) {
		if (err) {
			callback(err, null, null);
			return;
		}

		process(image, options, function(err, buf) {
			if (err) {
				callback(err, null, null);
				return;
			} 

			postProcess(buf, function(err, info) {
				if (err) {
					callback(err, null, null);
					return;
				} 

				callback(null, buf, info);
			});		// postProcess
		});		// process
	});		// preProcess
}

exports.create = create;

