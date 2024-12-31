declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    MTable: typeof import('m-eleplus-crud')['MTable']
    MConfigProvider: typeof import('m-eleplus-crud')['MConfigProvider']
    MSearch: typeof import('m-eleplus-crud')['MSearch']
  }
}

export {}
