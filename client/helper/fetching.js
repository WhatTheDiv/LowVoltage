
import { f_err, f_hlt } from "../assets/globalStyles"
import Status from "./Status.mjs"

export async function fillFetchRequest({ route, method, _body, _status = undefined, timeout_sec = 5 }) {
  return await new Promise(async (resolve, reject) => {
    const status = _status === undefined ? new Status() : _status
    const timeoutRef = setTimeout(() => {
      alert(`Request timed out`)
      status.unexpectedError(`Timeout`)
      resolve({ status, result: {} })
    }, timeout_sec * 1000)
    try {

      const url = `http://192.168.2.115:5000${route}`
      const options = {
        method,
        headers: {
          "Content-Type": "application/json"
        },
      }

      if (_body !== undefined) {
        options.body = JSON.stringify(_body)
      }


      const response = await fetch(url, options)
        .catch(e => {
          status.error(`Failed to reach server`)
        })

      if (!response) throw new Error('No response from server')

      console.log('fetch complete: ', response)
      clearTimeout(timeoutRef)

      if (response.status === 404)
        status.error(`Could not hit server (404)`)

      const result = await response.json()

      if (response.status !== 200)
        status.error(`${result.errorMessage} (${response.status})`)


      status.succeed()
      console.log(`%c(Status) Good fetch`, f_hlt)

      resolve({ status, result })

    } catch (e) {
      clearTimeout(timeoutRef)
      const message = e.message ? e.message : 'Generic'
      console.log(`%cFetch fail: ${message}`, f_err)
      resolve({ status, result: {} })
    }
  })
}



