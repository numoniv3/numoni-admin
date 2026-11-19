
export const kindGroup = (kind: string) =>
  kind.startsWith('Customer') ? 'Customer' : kind.startsWith('Merchant') ? 'Merchant' : 'Business'
