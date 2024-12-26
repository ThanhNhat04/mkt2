'use server'
import fetchApi from "@/utils/API_suport/fetchData";

var dataTask = []
export async function Task_Read_all() {
  try {
    dataTask = await fetchApi('/task', { method: 'POST', body: { source: 1 } });
  } catch (error) {
    dataTask = null
  }
  return dataTask
}

export async function Project_Read_all() {
  let data
  try {
    data = await fetchApi('/project', { method: 'POST', body: { source: 1 } });
  } catch (error) {
    data = null
  }
  return data
}

export async function User_Read_all() {
  let data
  try {
    data = await fetchApi('/user', { method: 'POST', body: { source: 1 } });
  } catch (error) {
    data = null
  }
  return data
}

export async function Task_Read_Type() {
  let data
  try {
    data = await fetchApi('/task_type', { method: 'POST', body: { source: 1 } });
  } catch (error) {
    data = null
  }
  return data
}

export async function Tool_Read_all() {
  let data
  try {
    data = await fetchApi('/apptool', { method: 'POST', body: { source: 1 } });
  } catch (error) {
    data = null
  }
  return data
}

export async function Found_Read_all() {
  let data
  try {
    data = await fetchApi('/foundation', { method: 'POST', body: { source: 1 } });
  } catch (error) {
    data = null
  }
  return data
}

export async function Department_Read_all(ab) {
  let data
  try {
    data = await fetchApi('/departments', { method: 'POST', body: { source: ab ? ab : 1 } });
  } catch (error) {
    data = null
  }
  return data
}

export async function Project_Read_Status() {
  return ["In Progress", "In Review", "Rejected", "In Review", "Done"]
}


export async function Project_Read_One(id) {
  let data
  try {
    data = await fetchApi('/project/one', { method: 'POST', body: { source: 1, project: id } });
  } catch (error) {
    data = null
  }
  return data
}
