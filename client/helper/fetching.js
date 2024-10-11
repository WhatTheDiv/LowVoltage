
import { f_err } from "../assets/globalStyles"
import Status from "./Status.mjs"

export async function fillFetchRequest({ route, method, _body, _status }) {
  const status = _status === undefined ? new Status() : _status

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


    const response = await await fetch(url, options)

    if (response.status === 404)
      status.error(`Could not hit server (404)`)

    const result = await response.json()

    if (response.status !== 200)
      status.error(`Server error (${response.status}) => ${result.errorMessage}`)


    status.succeed()

    return { status, result }

  } catch (e) {
    console.log(`%cFetch fail: ${e.message}`, f_err)
    return { status, result: {} }
  }

}



