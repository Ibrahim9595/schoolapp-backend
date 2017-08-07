export function flatData(obj, key) {
  let inside = obj.dataValues[key].dataValues;

  for (let i in inside) {
    if (!obj.dataValues.hasOwnProperty(i))
      obj[i] = inside[i]

  }

  return obj;
}
