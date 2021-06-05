//--------------------------------------------- Basic Setup -------------------------------------------
organiserSettings = [
	{
		name: 'Images',
		settings: {
			files: [],
			basePath: 'Media',
			extensions: ['jpeg', 'jpg', 'png'],
		},
	}, // C:\Shubhi\Media\Gifs\
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
		name: 'CSVs',
		settings: {
			files: [],
			basePath: 'Documents',
			extensions: ['csv'],
		},
	},
	{
		name: 'Zips',
		settings: {
			files: [],
			basePath: 'Documents',
			extensions: ['zip', 'rar', '7zip'],
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

let promptAttributes = [
	{
		name: 'folderPath',
		description: 'Enter the Folder Path which needs to be Organized',
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

function organise(result){
	organiserSettings.forEach((setting) => {
		setting.settings.files.forEach((file) => {
			oldPath = result.folderPath + path.sep + file;
			newPath = result.folderPath;
			if (setting.settings.basePath != ""){ //  "Documents" "Files" "Folders"
				setting.settings.basePath.split('\\').forEach((folder)=>{
					newPath += path.sep + folder // C:\Documents\Files\Folders
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

function segregateAllFiles(files = []) {
	files.forEach((file) => {
		let fileArgs = file.split('.'); //Folder -> ["Folder"]  file.csv ["file", "csv"]
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
			segregateAllFiles(files);
		}
	} catch (err) {
		printError(err);
	}
}

//--------------------------------------------- Start -------------------------------------------

const prompt = require('prompt');
const path = require('path');
const fs = require('fs');

print('\n------------------------------Welcome to File Organizer----------------------------\n');

prompt.start();
prompt.get(promptAttributes, function (err, result) {
	if (err) {
		printError(err);
		return 1;
	} else {
		getFiles(result.folderPath);
		print('\n----------------------------- Operation Started -------------------------------\n');
		organise(result);
		print('\n------------------------------ Operation Completed -----------------------------\n');
	}
});