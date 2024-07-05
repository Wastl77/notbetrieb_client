export const capitalizeAndReplaceY = (string: string): string => {
  let result = string.charAt(0).toUpperCase() + string.slice(1)

  result = result.replace(/y/g, 'Y')

  return result
}
