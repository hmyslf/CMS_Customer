import axios from 'axios'

const server = axios.create({
  baseURL: 'https://gentle-reaches-91469.herokuapp.com'
})

export default server
