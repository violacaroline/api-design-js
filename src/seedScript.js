import axios from 'axios'

/**
 * Seeds database with dummy data.
 */
async function seedDatabase () {
  const locations = [
    { city: 'Tulum' },
    { city: 'Veracruz' },
    { city: 'Holbox' },
    { city: 'Bacalar' }
  ]

  const members = [
    { name: 'Member1', phone: '12345678', email: 'Member1@email.com', password: 'member1password' },
    { name: 'Member2', phone: '12345678', email: 'Member2@email.com', password: 'member2password' },
    { name: 'Member3', phone: '12345678', email: 'Member3@email.com', password: 'member3password' },
    { name: 'Member4', phone: '12345678', email: 'Member4@email.com', password: 'member4password' }
  ]

  const farms = [
    { name: 'CancunMemberFarmTest', member: '641f71d9f5ff29561d1e20aa' },
    { name: 'CancunMemberFarmTest', member: '641f71d9f5ff29561d1e20aa' },
    { name: 'CancunMemberTwoFarmTest', member: '641f71edf5ff29561d1e20ad' },
    { name: 'MexicoCityMemberFarmTest', member: '641f723ef5ff29561d1e20b0' }
  ]

  const products = [
    { name: 'Product1', price: '12', soldout: false },
    { name: 'Product2', price: '18', soldout: false },
    { name: 'Product3', price: '20', soldout: false },
    { name: 'Product4', price: '10', soldout: false }
  ]

  for (const location of locations) {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/froot-boot/locations', location)
      console.log(`Created location ${JSON.stringify(response.data)}`)
    } catch (error) {
      console.error('Error when seeding database...')
      console.error(error.message)
    }
  }

  for (const member of members) {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/froot-boot/members', member)
      console.log(`Created member ${JSON.stringify(response.data)}`)
    } catch (error) {
      console.error('Error when seeding database...')
      console.error(error.message)
    }
  }

  for (const farm of farms) {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/froot-boot/farms', farm)
      console.log(`Created farm ${JSON.stringify(response.data)}`)
    } catch (error) {
      console.error('Error when seeding database...')
      console.error(error.message)
    }
  }

  for (const product of products) {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/froot-boot/products', product)
      console.log(`Created product ${JSON.stringify(response.data)}`)
    } catch (error) {
      console.error('Error when seeding database...')
      console.error(error.message)
    }
  }
}

seedDatabase()
