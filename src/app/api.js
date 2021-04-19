import baseLink from './base'

// User APIs
export async function fetchAllUsers() {
    const response = await baseLink.get("users/")
    return response.data
}
export async function addUser(payload, config) {
    const response = await baseLink.post("users/", payload, config)
    return response.data
}
