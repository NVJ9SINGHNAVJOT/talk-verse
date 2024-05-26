import { logger } from '@/logger/logger';
import fs from 'fs';

function deleteFile(file: Express.Multer.File) {
    if (fs.existsSync(file.path)) {
        fs.unlink(file.path, (unlinkError) => {
            if (unlinkError) {
                logger.error('error deleting file from uploadStorage', { error: unlinkError });
            }
        });
    }
}

export default deleteFile;