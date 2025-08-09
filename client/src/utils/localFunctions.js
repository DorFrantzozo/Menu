import { ItemText } from "@radix-ui/react-select"


const countItems = (array) => {

 let itemSum = 0

 for (let i = 0; i < array.length; i++) {
   if (array[i].menuDishes) {
    itemSum += array[i].menuDishes.length
}
}
return itemSum

}
const countActiveItems = (array) => {

 let itemSum = 0
 for (let i = 0; i < array.length; i++) {
   
    for (let j = 0; j < array[i].menuDishes.length; j++) {

      if (array[i].menuDishes[j].hide === false) {
        itemSum += 1
      }
    }

}
console.log(itemSum)
return itemSum

}

export  {countItems,countActiveItems};