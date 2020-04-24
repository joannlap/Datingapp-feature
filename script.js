const person = {
  name: 'Johan Lieuw-A-Peuw',
  job: 'Designer'
}

// console.log(person)

function listObject(object) {
  return `Hello ${object.name}`
}

console.log(listObject(person))