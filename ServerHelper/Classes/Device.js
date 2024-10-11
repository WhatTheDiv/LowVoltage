
export class Device {
  constructor({ _id, name, description, color, model, powerInput, category, subcategory, manufacturer, url }) {
    this.id = _id
    this.name = name
    this.description = description
    this.color = color
    this.model = model
    this.powerInput = powerInput
    this.category = category
    this.subcategory = subcategory
    this.manufacturer = manufacturer
    this.url = url
  }
}