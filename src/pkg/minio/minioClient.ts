import Logger from '$pkg/logger'
import {Client} from 'minio'

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT as string
const MINIO_ACCESS_KEY = process.env.MINIO_ROOT_USER as string
const MINIO_SECRET_KEY = process.env.MINIO_ROOT_PASSWORD as string
const MINIO_PORT = process.env.MINIO_PORT as string
const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME as string

const minioClient = new Client({
    endPoint: MINIO_ENDPOINT,
    port: parseInt(MINIO_PORT),
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY,
    useSSL: false
})

export const uploadFileHandler = async (file: Express.Multer.File, secure=false) => {
    try {
        const [fileName, extension] = file.originalname.split('.')

        const newFileName = `${fileName}_${new Date().getTime()}.${extension}`

        await minioClient.fPutObject(MINIO_BUCKET_NAME, newFileName, file.path)
        const input = `${MINIO_ENDPOINT}:${MINIO_PORT}/${MINIO_BUCKET_NAME}/${newFileName}`
        
        const protocol = secure ? 'https://' : 'http://' 

        const url = `${protocol}${encodeURI(input)}`

        return url

    } catch (e) {
        Logger.error(e)
        throw new Error('Failed File Upload')
    }
}