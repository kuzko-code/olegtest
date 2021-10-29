//"2021-06-30T10:10:50.000Z" => "13:10 30.06.2021"
export const dateTimeFormattingByString = (stringDate) => {
    const date = stringDate ? new Date(stringDate) : null;
    return dateTimeFormattingByDate(date);
}

//new Date("2021-06-30T10:10:50.000Z") => "13:10 30.06.2021"
export const dateTimeFormattingByDate = (date) => {
    return date
        ? `${timeFormattingByDate(date)} ${dateFormattingByDate(date)}`
        : null
}

//"2021-06-30T10:10:50.000Z" => "30.06.2021"
export const dateFormattingByString = (stringDate, showDay) => {
    const date = stringDate ? new Date(stringDate) : null;
    return dateFormattingByDate(date, showDay);
}

//"2021-06-30T10:10:50.000Z" => "13:10"
export const timeFormattingByString = (stringDate) => {
    const date = stringDate ? new Date(stringDate) : null;
    return timeFormattingByDate(date);
}

//new Date("2021-06-30T10:10:50.000Z") => "13:10"
export const timeFormattingByDate = (date) => {
    return date
        ? date.toLocaleString('uk-UA', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        }).toString()
        : null
}

//new Date("2021-06-30T10:10:50.000Z") => "30.06.2021"
export const dateFormattingByDate = (date, showDay = true) => {
    return date
      ? date
          .toLocaleString('uk-UA', {
            ...(showDay && { day: 'numeric' }),
            month: 'numeric',
            year: 'numeric',
          })
          .toString()
      : null;
}