export default function superlog(status, logMessage){
    const timeNow = new Date().toTimeString().slice(0, 8);
    return console.log(`${timeNow}: [${status}] ${logMessage}`)
}