import multer from 'multer';

export const uploadAvatar = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 2 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        const allowed = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ];

        if (!allowed.includes(file.mimetype)) {
            return cb(new Error('Invalid image type'));
        }

        cb(null, true);
    },
});