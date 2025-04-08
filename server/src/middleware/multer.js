import multer from "multer";
import path from "path"
import fs from "fs"

const __dirname = import.meta.dirname

const Upload = () => {
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                const uploadPath = path.resolve(__dirname, "../../public/images/avatar");
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true })
                }

                cb(null, uploadPath)
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname.replace(' ', ''))
            }
        }),
        limits: { fileSize: 2000000 }, // 2mb
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true)
            }
            else {
                cb(new Error('Invalid file type, only images are allowed'), false)
            }
        }
    })
}

export default Upload 