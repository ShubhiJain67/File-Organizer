//--------------------------------------------- Basic Setup -------------------------------------------
organiserSettings = [
	{
		name: 'Folders',
		settings: {
			files: [],
			basePath: '',
			extensions: [],
		},
	},
	{
		name: 'Images',
		settings: {
			files: [],
			basePath: '/Media',
			extensions: [
				'jpeg',
				'jpg',
				'png',
				'gif',
				'svg',
				'webp',
				'tiff',
				'tif',
				'psd',
				'raw',
			],
		},
	},
	{
		name: 'Videos',
		settings: {
			files: [],
			basePath: '/Media',
			extensions: ['mp4', 'webm', 'mov', 'wmv', 'avi', 'm4p', 'm4v'],
		},
	},
	{
		name: 'Text Files',
		settings: {
			files: [],
			basePath: '/Documents',
			extensions: ['txt'],
		},
	},
	{
		name: 'PDFs',
		settings: {
			files: [],
			basePath: '/Documents',
			extensions: ['pdf'],
		},
	},
	{
		name: 'Word Files',
		settings: {
			files: [],
			basePath: '/Documents',
			extensions: ['doc', 'docx'],
		},
	},
	{
		name: 'Excel Sheets',
		settings: {
			files: [],
			basePath: '/Documents',
			extensions: ['xlsx', 'xls'],
		},
	},
	{
		name: 'PowerPoint Presentations',
		settings: {
			files: [],
			basePath: '/Documents',
			extensions: ['ppt', 'pptx'],
		},
	},
	{
		name: 'Programs',
		settings: {
			files: [],
			basePath: '/Codes',
			extensions: ['java', 'html', 'cpp', 'cs', 'cshtml', 'config'],
		},
	},
	{
		name: 'Scripts',
		settings: {
			files: [],
			basePath: '/Codes',
			extensions: ['js', 'ps1'],
		},
	},
	{
		name: 'Others',
		settings: {
			files: [],
			basePath: '',
			extensions: [],
		},
	},
];
//--------------------------------------------- Functions -------------------------------------------
function print(message) {
	console.log(message);
}

function printError(message) {
	console.log(`ERROR!!-----------------> ${message}`);
}

function segregateAllFiles(files = []) {
	files.forEach((file) => {
		let fileArgs = file.split('.');
		let yetToSegregate = true;
		if (fileArgs.length == 1) {
			organiserSettings.forEach((os) => {
				if (yetToSegregate) {
					if (os.name === 'Folders') {
						os.settings.files.push(file);
						yetToSegregate = false;
						if (!extensionsFound.includes(os.name)) {
							extensionsFound.push(os.name);
						}
					}
				}
			});
		} else {
			organiserSettings.forEach((os) => {
				if (yetToSegregate) {
					if (os.settings.extensions.includes(fileArgs[1])) {
						os.settings.files.push(file);
						yetToSegregate = false;
						if (!extensionsFound.includes(os.name)) {
							extensionsFound.push(os.name);
						}
					} else if (os.name === 'Others') {
						os.settings.files.push(file);
						yetToSegregate = false;
						if (!extensionsFound.includes(os.name)) {
							extensionsFound.push(os.name);
						}
					}
				}
			});
		}
	});
}

function folderExists(name = '') {
	return fileSystem.existsSync(name);
}

function createANewFolder(name = 'temp', ifNotExists = true) {
	let folderSuffix = 0;
	let folderName = `${name}`;
    let isCreated = false;
    if(ifNotExists){
        if (!folderExists(folderName)) {
            fileSystem.mkdirSync(folderName);
        } else {
            printError('Folder Already Exists!!');
        }
    }
    else{
        while (!isCreated) {
            if (folderSuffix > 0) {
                folderName = `${name}-${folderSuffix}`;
            }
            if (!folderExists(folderName)) {
                fileSystem.mkdirSync(folderName);
                isCreated = true;
            } else {
                folderSuffix++;
            }
        }
    }
}

//--------------------------------------------- Organizer -------------------------------------------
const arguments = process.argv.slice(2);
const fileSystem = require('fs');
let extensionsFound = [];

if (arguments.length === 0) {
	printError('No folder Path present! Please mention the folder path.');
} 
else {
	folderPath = arguments[0];
	let files = []
    if(fileSystem.existsSync(folderPath)){
        files = fileSystem.readdirSync(folderPath);
        segregateAllFiles(files);
    }
    else{
        printError("Invalid Path");
    }
}
organiserSettings.forEach((setting) => {
	print(`${setting.name} : ${setting.settings.files}`);
});
