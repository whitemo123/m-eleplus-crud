declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    MTable: typeof import('m-eleplus-crud')['MTable']
    MConfigProvider: typeof import('m-eleplus-crud')['MConfigProvider']
    MSearch: typeof import('m-eleplus-crud')['MSearch']
    MPicture: typeof import('m-eleplus-crud')['MPicture']
    MDialog: typeof import('m-eleplus-crud')['MDialog']
    MQrcode: typeof import('m-eleplus-crud')['MQrcode']
    MBarcode: typeof import('m-eleplus-crud')['MBarcode']
    MForm: typeof import('m-eleplus-crud')['MForm']
    MCrud: typeof import('m-eleplus-crud')['MCrud']
  }
}

export {}
