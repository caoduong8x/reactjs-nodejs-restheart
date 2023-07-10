import moment from 'moment';

function timestamp2DateString(timestamp, format = "DD/MM/YYYY") {
  return moment(timestamp).format(format);
};

export { timestamp2DateString };