//--------------------------------------------- Basic Setup -------------------------------------------
organiserSettings = [
	{
		name: 'Images',
		settings: {
			files: [],
			basePath: 'Media',
			extensions: ['jpeg', 'jpg', 'png'],
		},
	},
	{
		name: 'Gifs',
		settings: {
			files: [],
			basePath: 'Media',
			extensions: ['gif'],
		},
	},
	{
		name: 'SVGs',
		settings: {
			files: [],
			basePath: 'Media',
			extensions: ['svg'],
		},
	},
	{
		name: 'Others',
		settings: {
			files: [],
			basePath: 'Media',
			extensions: ['webp', 'tiff', 'tif', 'psd', 'raw'],
		},
	},
	{
		name: 'Videos',
		settings: {
			files: [],
			basePath: 'Media',
			extensions: ['mp4', 'webm', 'mov', 'wmv', 'avi', 'm4p', 'm4v'],
		},
	},
	{
		name: 'Text Files',
		settings: {
			files: [],
			basePath: 'Documents',
			extensions: ['txt'],
		},
	},
	{
		name: 'PDFs',
		settings: {
			files: [],
			basePath: 'Documents',
			extensions: ['pdf'],
		},
	},
	{
		name: 'Word Files',
		settings: {
			files: [],
			basePath: 'Documents',
			extensions: ['doc', 'docx'],
		},
	},
	{
		name: 'Excel Sheets',
		settings: {
			files: [],
			basePath: 'Documents',
			extensions: ['xlsx', 'xls'],
		},
	},
	{
		name: 'PowerPoint Presentations',
		settings: {
			files: [],
			basePath: 'Documents',
			extensions: ['ppt', 'pptx'],
		},
	},
	{
		name: 'Programs',
		settings: {
			files: [],
			basePath: 'Codes',
			extensions: ['java', 'html', 'cpp', 'cs', 'cshtml', 'config'],
		},
	},
	{
		name: 'Scripts',
		settings: {
			files: [],
			basePath: 'Codes',
			extensions: ['js', 'ps1'],
		},
	},
	{
		name: 'Others',
		settings: {
			files: [],
			basePath: 'Codes',
			extensions: ['class'],
		},
	},
	{
		name: 'Other Files',
		settings: {
			files: [],
			basePath: '',
			extensions: [],
		},
	},
];

let prompt_attributes = [
	{
		name: 'folderPath',
		description: 'Enter the Folder Path',
		required: true,
		hidden: false,
	},
];

function print(message) {
	console.log(message);
}

function printError(message) {
	console.log(`ERROR!!-----------------> ${message}`);
}

//--------------------------------------------- Functions -------------------------------------------

function segregateAllFiles(files = []) {
	files.forEach((file) => {
		let fileArgs = file.split('.');
		let yetToSegregate = true;
		organiserSettings.forEach((os) => {
			if (fileArgs.length > 1 && yetToSegregate) {
				if (os.settings.extensions.includes(fileArgs[1])) {
					os.settings.files.push(file);
					yetToSegregate = false;
				} else if (os.settings.basePath == '') {
					os.settings.files.push(file);
					yetToSegregate = false;
				}
			}
		});
	});
}

function getFiles(dirPath) {
	try {
		if (fs.existsSync(dirPath)) {
			const files = fs.readdirSync(dirPath);
			print(files);
			segregateAllFiles(files);
		}
	} catch (err) {
		printError('Error Occurred : ' + err);
	}
}

//--------------------------------------------- Start -------------------------------------------

const prompt = require('prompt');
const path = require('path');
const fs = require('fs');

print(
	'------------------------------Welcome to File Organizer----------------------------\n'
);
print('Please enter the folder path you want to organize');
prompt.start();

prompt.get(prompt_attributes, function (err, result) {
	if (err) {
		printError(err);
		return 1;
	} else {
		getFiles(result.folderPath);
		organiserSettings.forEach((setting) => {
			print(setting.name + " : " + setting.settings.files)
		});
		organiserSettings.forEach((setting) => {
			setting.settings.files.forEach((file) => {
				oldPath = result.folderPath + path.sep + file;
				newPath = result.folderPath;
				if (setting.settings.basePath != ""){
					setting.settings.basePath.split('\\').forEach((folder)=>{
						newPath += path.sep + folder
						if(!fs.existsSync(newPath)){
							print(`Creating new folder : ${folder}`);
							fs.mkdirSync(newPath)
						}
					});
				}
				if (setting.name != ""){
					newPath += path.sep + setting.name
					if(!fs.existsSync(newPath)){
						print(`Creating new folder : ${setting.settings.basePath + path.sep + setting.name}`);
						fs.mkdirSync(newPath)
					}
				}
				newPath += path.sep + file;
				fs.copyFileSync(oldPath, newPath);
				if (fs.existsSync(newPath)) {
					fs.unlinkSync(oldPath);
					print("File Moved successfully." + file);
				  } 
				else{
					print(`Copied file doesn't exists. please check manually`);
				}
			});
		});
	}
});

