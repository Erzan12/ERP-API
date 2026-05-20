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

// multer config for document uploads
export const uploadDocuments = multer({
    storage: multer.memoryStorage(), // ← must be memoryStorage, not diskStorage
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
    },
    fileFilter: (req, file, cb) => {
        const allowed = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'image/jpeg',
            'image/png',
        ];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error('Invalid file type'));
        }
        cb(null, true);
    },
});