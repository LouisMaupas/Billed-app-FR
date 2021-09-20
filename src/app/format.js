export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  // TODO BUG#3 [Bug Hunt] - Dashboard ??
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' })
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' })
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' })
  const month = mo.toString().charAt(0).toUpperCase() + mo.toString().slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`

  // Before "fix"
  /*
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
  */
}
 
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

