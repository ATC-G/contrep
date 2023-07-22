const elementExist = (array, mes, year) => {
    let i = 0;
    while (i < array.length) {
      if (array[i].mes === mes && array[i].year === year) return i;
      i++;
    }
    return false;
}

const groupByMonth = (refs) =>  {
    const result = [];
    refs.forEach((e) => {
        let i = elementExist(result, e.mes, e.year);
        if (i === false) {
          // Si no existe, creo agrego un nuevo objeto.
          result.push({
            "mes": e.mes,
            "year":e.year,
            "data": e
          });
        } else {
          // Si el ya existe agrego el nuevo elemento a el array valor.
          //result[i].data.push(e);
        }
    });
    return result
}

export default groupByMonth