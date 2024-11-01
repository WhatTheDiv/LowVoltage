import { v4 as uuidv4 } from 'uuid'

export default class Contact {
  constructor({ _id = uuidv4(), fname, lname = undefined, phone = undefined, email = undefined, title = undefined, dummy = false }) {
    this._id = _id
    this.fname = fname
    this.lname = dummy ? 'lname' : lname
    this.phone = dummy ? 'phone' : phone
    this.email = dummy ? 'email' : email
    this.title = dummy ? 'title' : title
  }
  formatForDb() {
    const contactForDb = { _id: this._id, fname: this.fname }

    if (this.lname) contactForDb.lname = this.lname
    if (this.phone) contactForDb.phone = this.phone
    if (this.email) contactForDb.email = this.email
    if (this.title) contactForDb.title = this.title

    return contactForDb
  }
}
