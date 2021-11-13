export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  console.log(date)
  // FIXED BUG#1 [Bug report] - Bills fixed by date formated to display + date unformated for manipulations
  return {
    date : date.toLocaleDateString('fr-FR'),
    dateObj : date
  }
}
 
// main display employee 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}

