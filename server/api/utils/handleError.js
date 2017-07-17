export default function handleError(res, err, statusCode = 400, message = '') {
    res.status(statusCode)
    res.json({ error: err, message: message })
}