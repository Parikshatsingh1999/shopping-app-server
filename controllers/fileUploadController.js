
import multer from "multer";
import fs from "fs";



const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]
        let error = new Error(`Invalid mime type`)
        if (isValid) error = null
        cb(error, './files/assets')
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`
        const exists = fs.existsSync(`./files/assets/${fileName}`);
        if (exists) {
            fileName = `2&&${fileName}`;
        }
        cb(null, fileName)
    }
});

const limitOptions = {
    fileSize: 4 * 1024 * 1024,
}

export const uploadFile = multer({ storage: storage, limits: limitOptions }).single('image');