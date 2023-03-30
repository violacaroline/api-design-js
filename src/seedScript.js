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
    { name: 'Member1', location: 'tulum', phone: '12345678', email: 'Member1@email.com', password: 'member1password' },
    { name: 'Member2', location: 'tulum', phone: '12345678', email: 'Member2@email.com', password: 'member2password' },
    { name: 'Member3', location: 'holbox', phone: '12345678', email: 'Member3@email.com', password: 'member3password' },
    { name: 'Member4', location: 'bacalar', phone: '12345678', email: 'Member4@email.com', password: 'member4password' }
  ]

  // const farms = [
  //   { name: '' },
  //   { name: '' },
  //   { name: '' },
  //   { name: '' }
  // ]

  // const products = [
  //   { name: 'Product1', price: '12', soldout: false },
  //   { name: 'Product2', price: '18', soldout: false },
  //   { name: 'Product3', price: '20', soldout: false },
  //   { name: 'Product4', price: '10', soldout: false }
  // ]

  for (const location of locations) {
    try {
      const response = await axios.post('http://localhost:3000/froot-boot/api/v1/locations', location)
      console.log(`Created location ${JSON.stringify(response.data)}`)
    } catch (error) {
      console.error('Error when seeding database...')
      console.error(error.message)
    }
  }

  for (const member of members) {
    try {
      const response = await axios.post('http://localhost:3000/froot-boot/api/v1/members', member)
      console.log(`Created member ${JSON.stringify(response.data)}`)
    } catch (error) {
      console.error('Error when seeding database...')
      console.error(error.message)
    }
  }

  /* THESE ARE NESTED ROUTES IN NEED OF MEMBER/FARM ID TO CONSTRUCT URL? */

  //   for (const farm of farms) {
  //     try {
  //       const response = await axios.post('URL', farm)
  //       console.log(`Created farm ${JSON.stringify(response.data)}`)
  //     } catch (error) {
  //       console.error('Error when seeding database...')
  //       console.error(error.message)
  //     }
  //   }

  //   for (const product of products) {
  //     try {
  //       const response = await axios.post('URL', product)
  //       console.log(`Created product ${JSON.stringify(response.data)}`)
  //     } catch (error) {
  //       console.error('Error when seeding database...')
  //       console.error(error.message)
  //     }
  //   }
}

seedDatabase()
