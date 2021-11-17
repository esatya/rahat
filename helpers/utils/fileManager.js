const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');

const UPLOAD_PATH = `${__dirname}/../../uploads`;

exports.uploadFile = file => {
	const { _data, hapi } = file;
	const timestamp = Date.now();
	const ext = hapi.filename.split('.').pop();
	const fileName = `${timestamp}.${ext}`;
	return new Promise((resolve, reject) => {
		fs.writeFile(`${UPLOAD_PATH}/${fileName}`, _data, err => {
			if (err) reject(err);
			resolve({ message: 'File uploaded successfully!', file: fileName });
		});
	});
};

exports.readExcelFile = fileName => {
	if (!fileName) throw Error('Filename is required');
	const file_path = `${UPLOAD_PATH}/${fileName}`;

	return new Promise((resolve, reject) => {
		readXlsxFile(file_path)
			.then(rows => resolve(rows))
			.catch(err => reject(err));
	});
};

exports.removeFile = fileName => {
	if (fileName) {
		const file_path = `${UPLOAD_PATH}/${fileName}`;
		return new Promise((resolve, reject) => {
			fs.unlink(file_path, err => {
				if (err) reject(err);
				console.log('Removed==>', fileName);
				resolve({ success: true, message: `${fileName} deleted` });
			});
		});
	}
};

exports.decodeBase64Url = dataString => {
	if (!dataString) return { type: null, data: null };
	const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
	const response = {};
	if (matches.length !== 3) {
		return new Error('Invalid input string');
	}
	response.type = matches[1];
	response.data = Buffer.from(matches[2], 'base64');
	return response;
};
