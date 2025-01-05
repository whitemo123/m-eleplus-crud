
const httpGet = (url: string, query: any, headers: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({"data":[{label:'一班',value:1}]})
    }, 2000)
  })
}

export {
  httpGet
}
