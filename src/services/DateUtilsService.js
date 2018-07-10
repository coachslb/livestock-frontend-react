
const DateUtilsService = {
  formatDate: function(date) {
    return new Date(date).toJSON().slice(0, 10);
  },
};

export default DateUtilsService;