const regex = /^[a-z1-5\.]{3,12}$/;
// NOTE: Or Base58 - /^[1-9A-HJ-NP-Za-km-z]{3,12}$/

const validate = (address: string) => regex.test(address);

export default validate;
